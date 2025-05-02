import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "../auth";

/** createContext */
/** 作用：为每个tRPC请求创建上下文对象 */
export async function createTRPCContext() {
  return {
    a: 1,
  };
}

/** 初始化tRPC */
/** initTRPC.context<...>()：指定上下文类型，确保类型安全 */
/** .create()：创建tRPC实例 */
const t = initTRPC.context().create();
/** 
    解构赋值：获取三个核心组件：
    router：用于创建API路由器
    procedure：创建API端点
    middleware：创建中间件 
*/
const { router, procedure, middleware } = t;

/** trpc的中间件功能 */
const withSessionMiddleware = middleware(async ({ ctx, next }) => {
  const session = await getServerSession();
  return next({
    ctx: {
      session: session,
    },
  });
});

const checkSessionMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return next({
    ctx: {
      session: ctx.session!,
    },
  });
});

/** 使用中间件创建受影响的procedure  */
/** 使用这个procedure的所有端点都会有ctx.b=2可用 */
export const withLoggerProcedure = procedure.use(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  console.log("---> Api time:", Date.now() - start);
  return result;
});

export const protectedProcedure = withLoggerProcedure
  .use(withSessionMiddleware)
  .use(checkSessionMiddleware);

export { router };
