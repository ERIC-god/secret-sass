import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import type { AppRouter } from "@/server/trpc-middlewares/router";



export const trpcClientReact = createTRPCReact<AppRouter>({});
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      // 这是后端tRPC服务的地址,所有API请求都会发送到这个URL
      url: "/api/trpc",
    }),
  ],
});

 