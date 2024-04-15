// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

function requestRefreshOfAccessToken(token: JWT) {
  // Check if refreshToken is a string; otherwise, throw an error or handle as needed
  if (typeof token.refreshToken !== 'string') {
    throw new Error('refreshToken must be a string');
  }

  return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID || '', // Fallback to empty string if undefined
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET || '', // Fallback to empty string if undefined
      grant_type: "refresh_token",
      refresh_token: token.refreshToken, // We've already checked it's a string
    }),
    method: "POST",
    cache: "no-store"
  });
}

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks:{
    async jwt({token, account}){
      if (account) {
        token.idToken = account.id_token
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      if (Date.now() < (Number(token.expiresAt) * 1000 - 60 * 1000)) {
        return token
      } else {
        try {
          const response = await requestRefreshOfAccessToken(token)

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          const updatedToken: JWT = {
            ...token, // Keep the previous token properties
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          }
          return updatedToken
        } catch (error) {
          console.error("Error refreshing access token", error)
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }
    },
    async session({session, token}) {
      return { ...session, user:{...session.user, id: token.sub}, error: token.error }
    }
  }
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }