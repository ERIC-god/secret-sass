import { fileRoutes } from "../routes/file";
import { appRoutes } from "../routes/app";
import { router } from "./trpc";
import { storageRoutes } from "../routes/storage";
import { apiKeyRoutes } from "../routes/apiKeys";
import { userRoute } from "../routes/user";

/** 此文件聚合路由 */
export const appRouter = router({
  file: fileRoutes,
  app: appRoutes,
  storage: storageRoutes,
  apiKey: apiKeyRoutes,
  user: userRoute,
  // 其他路由器...
});

export type AppRouter=typeof appRouter