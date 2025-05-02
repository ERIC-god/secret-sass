import { fileRoutes } from "../routes/file";
import { router } from "./trpc";

/** 此文件聚合路由 */
export const appRouter = router({
  file: fileRoutes,
  // 其他路由器...
});

export type AppRouter=typeof appRouter