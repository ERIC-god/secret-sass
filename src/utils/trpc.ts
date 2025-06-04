/**
 *  直接调用 tRPC 过程的实现函数 , 不创建 HTTP 请求
 *  serverCaller 提供了一种在服务器组件中直接访问 tRPC 过程的方法
 */

import { appRouter } from "@/server/trpc-middlewares/router";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

export const serverCaller=createCallerFactory()(appRouter)
