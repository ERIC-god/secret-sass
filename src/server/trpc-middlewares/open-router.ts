/** 开发api的api point */
import { router } from "./trpc";
import { fileOpenRoutes } from "../routes/file-open";

/** 此文件聚合路由 */
export const openRouter = router({
  fileOpen: fileOpenRoutes,
  // 其他路由器...
});

export type OpenRouter=typeof openRouter