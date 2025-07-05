import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type OpenRouter } from "@/server/trpc-middlewares/open-router";


export const trpc = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export {OpenRouter};