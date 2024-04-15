import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    
  interface User {
    id?: string;
  }

    interface Session {
      accessToken: string;
      error: string;
      user: User;
    }
}