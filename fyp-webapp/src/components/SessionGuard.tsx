"use client";
import { useUserDataStore } from "@/store/userUserDataStore";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Fragment, ReactNode, useEffect } from "react";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const {setUserData} = useUserDataStore();

  async function fetchUserData(){
    try{
      if(!session || session?.user.id === null){
          throw new Error("User ID not found");
      }

      const response = await fetch(`/api/users`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: session.user.id
        })
      });
      const fetchedUserData = await response.json();
      setUserData(fetchedUserData);
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    if (session) {
      if (status === "authenticated") {
        fetchUserData();
        if(session.error === "RefreshAccessTokenError"){
          signOut();
          setUserData(null);
          redirect('/');
        }
      }
     
    }
  }, [session]);

  return <Fragment>{children}</Fragment>;
}