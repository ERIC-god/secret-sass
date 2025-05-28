'use client'
import { trpcClient,trpcClientReact } from "@/utils/client"
import { ReactNode,useState } from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function TrpcProvider({ children }: { children: ReactNode }){
    
    const [queryClient]=useState(() => new QueryClient());

   return (
        <trpcClientReact.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpcClientReact.Provider>
   )
}