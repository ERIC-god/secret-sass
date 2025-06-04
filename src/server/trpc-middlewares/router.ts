import { fileRoutes } from "../routes/file";
import { appRoutes } from "../routes/app";
import { router } from "./trpc";
import { storageRoutes } from "../routes/storage";

/** 此文件聚合路由 */
export const appRouter = router({
  file: fileRoutes,
  app: appRoutes,
  storage: storageRoutes,
  // 其他路由器...
});

export type AppRouter=typeof appRouter