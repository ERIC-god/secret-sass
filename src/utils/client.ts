import { createTRPCClient , httpBatchLink } from '@trpc/client';
import type { SecretRouter } from './trpc';
export const trpcClient = createTRPCClient <SecretRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc'
    }),
  ],
});