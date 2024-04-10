"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session && session.error === "RefreshAccessTokenError") {
      signOut();
      redirect("/");
    }
  }, [session]);

  return <>{children}</>;
}