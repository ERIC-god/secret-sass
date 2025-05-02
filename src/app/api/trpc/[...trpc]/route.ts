import {fetchRequestHandler} from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server';
import { fileRoutes } from "@/server/routes/file";
import { appRouter } from "@/server/trpc-middlewares/router";
/** 基础的Route Handlers就声明好了 */
/** tRPC本身不直接处理HTTP请求，它只负责API的类型安全和过程分发。 */
/** 在Next.js 13+的App Router中，推荐用fetchRequestHandler，它是为基于fetch的API路由设计的adapter。 */
function handler(request:NextRequest){
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: () => ({}),
    });
}

export {handler as GET,handler as POST};