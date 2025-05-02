'use client'
import { useSession,SessionProvider as NextAuthProvider} from 'next-auth/react'
import { trpcClient } from "@/utils/client";
import { Uppy } from "@uppy/core";
import { useState } from "react";


export function UserInfo(){
  const session = useSession();
  const [uppy] = useState(() => {});

  return <div>{session?.data?.user?.name}</div>;
}

export function SessionProvider(props:any){
    return <NextAuthProvider {...props}></NextAuthProvider>
}