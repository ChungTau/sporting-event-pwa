import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LocaleLinkProps } from "./types";

const LocaleLink = React.forwardRef<HTMLAnchorElement, LocaleLinkProps>(
    ({ locale, href, children, className }: LocaleLinkProps, ref) => {
        const pathName = usePathname();
        const segments = pathName.split("/").filter(Boolean); // Split and remove empty segments
        const basePath = segments[0]; // First segment as base path
        const subRoute = segments.slice(1).join("/"); 

        const resolvedLocale = locale ?? basePath ?? "en";
        const resolvedHref = href ?? (subRoute ? `/${subRoute}` : "/");
        const isApiHref = resolvedHref.startsWith("/api");
        const linkClass = className ?? clsx("group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-md font-medium hover:bg-gray-100 hover:dark:bg-gray-100/[0.1]");

        return (
            <Link href={isApiHref ? resolvedHref : `/${resolvedLocale}${resolvedHref}`} passHref ref={ref} className={href ? linkClass : undefined}>
                {children}
            </Link>
        );
    }
);

LocaleLink.displayName = 'LocaleLink';

export { LocaleLink };
