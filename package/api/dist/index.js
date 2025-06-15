import { httpBatchLink, createTRPCClient } from "@trpc/client";
export const apiClient = createTRPCClient({
    links: [
        httpBatchLink({
            url: "http://localhost:3000/api/open",
        }),
    ],
});
export const createApiClient = ({ apiKey }) => {
    return createTRPCClient({
        links: [
            httpBatchLink({
                url: "http://localhost:3000/api/open",
                headers: {
                    "api-key": apiKey
                }
            }),
        ],
    });
};
