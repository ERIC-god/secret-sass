import { openRouter } from "@/server/trpc-middlewares/open-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

function handler(request:NextRequest){
    return fetchRequestHandler({
        endpoint:'/api/open',
        req:request,
        router:openRouter,
        createContext:()=>({})
    })
}

export {handler as GET, handler as POST}