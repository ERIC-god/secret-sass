'use client'
import { useSession,SessionProvider as NextAuthProvider} from 'next-auth/react'
import { trpcClient } from "@/utils/client";
import { useEffect } from 'react';

export function UserInfo(){
    const session=useSession();
    // console.log(session);
    
    useEffect(()=>{
        trpcClient.login.query({id:'001'}).then(res=>{
            console.log(res);
        }).catch(err=>{
            console.log(err);
        })
    },[])
    return (
        <div>
            {session?.data?.user?.name}
        </div>
    )
}

export function SessionProvider(props:any){
    return <NextAuthProvider {...props}></NextAuthProvider>
}