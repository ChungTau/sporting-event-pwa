"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Fragment, ReactNode, useEffect } from "react";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (session && session.error === "RefreshAccessTokenError") {
      if(status === "authenticated"){
        signOut();
        redirect('/');
      }
    }
  }, [session]);

  return <Fragment>{children}</Fragment>;
}