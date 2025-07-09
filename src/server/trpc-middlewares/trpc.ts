import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "../auth";
import { db } from "@/server/db/db";
import { headers } from "next/headers";
import { and, eq, isNull } from "drizzle-orm";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  if (!(ctx as any).session?.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  const user = await db.query.users.findFirst({
    where: (users) => eq(users.id, (ctx as any).session.user.id),
    columns: {
      plan: true,
    },
  });
  const plan = user?.plan;

  return next({
    ctx: {
      session: (ctx as any).session,
      plan,
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

/** withAppProcedure 中间件 */
export const withAppProcedure = withLoggerProcedure.use(
  async ({ ctx, next }) => {
    const headersList = headers();
    // apiKey方案一
    const apikey = headersList.get("api-key");
    // apiKey方案二
    const signedToken = headersList.get("signed-token");

    if (!apikey && !signedToken) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    // 方案一apikey
    if (apikey) {
      const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
        where: (apiKeys) =>
          and(eq(apiKeys.key, apikey), isNull(apiKeys.deletedAt)),
        with: {
          app: {
            with: {
              storage: true,
              user: true,
            },
          },
        },
      });

      if (!apiKeyAndAppUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return next({
        ctx: {
          app: apiKeyAndAppUser.app,
          user: apiKeyAndAppUser.app.user,
          // storage: apiKeyAndAppUser.app.storage,
        },
      });
    }
    // 方案二apikey
    else if (signedToken) {
      const decoded = jwt.decode(signedToken);
      if (!(decoded as JwtPayload)?.appId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "appId not found",
        });
      }
      const appId = (decoded as JwtPayload)?.appId;
      const apikeys = await db.query.apiKeys.findMany({
        where: (apiKeys) => eq(apiKeys.appId, appId),
      });
      if (!apikeys.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No secret key found for this appId",
        });
      }

      // 3. 依次尝试 verify
      let verifiedPayload = null;
      for (const keyObj of apikeys) {
        try {
          verifiedPayload = jwt.verify(signedToken, keyObj.key);
          break; // 验证通过，跳出循环
        } catch (e) {
          // 验证失败，继续下一个
        }
      }

      if (!verifiedPayload) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Token 验证失败",
        });
      }

      const app = await db.query.apps.findFirst({
        where: (apps) => eq(apps.id, appId),
        with: {
          storage: true,
          user: true,
        },
      });
      if (!app) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // 5. 注入 context
      return next({
        ctx: {
          app,
          user: app.user,
        },
      });
    }
    // throw error
    else {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }
  }
);

export { router };
