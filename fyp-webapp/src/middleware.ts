import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "@/lib/i18n/settings";
import {withAuth} from "next-auth/middleware";

const privatePages = ['/plans', '/add-event'];
const keycloakPaths = ['/keycloak', '/keycloak/auth', '/keycloak/auth/realms/fyp'];

acceptLanguage.languages(languages);

const authMiddleware = withAuth(
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages:{
      signIn: '/'
    }
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js).*)"],
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Check if the path is a Keycloak path and skip specific handling if so
  if (keycloakPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)!.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;
  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => pathname.startsWith(`/${loc}`)) &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${pathname}`, req.url)
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer")!);
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  if (languages.some((loc) => pathname.startsWith(`/${loc}`) && privatePages.includes(pathname.split(`/${loc}`)[1]))) {
    return (authMiddleware as any)(req);
  }

  return NextResponse.next();
}