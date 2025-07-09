export declare const apiClient: import("@trpc/client").TRPCClient<import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
    transformer: false;
}, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    fileOpen: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
        transformer: false;
    }, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
        createPresignedUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                size: number;
                contentType: string;
                filename: string;
            };
            output: {
                url: string;
                method: "PUT";
            };
        }>;
        saveFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                type: string;
                size: number;
                route: string;
                filePath: string;
            };
            output: {
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                size: number;
                path: string;
                url: string;
                contentType: string;
                appId: string;
                route: string;
            };
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                size: number;
                path: string;
                url: string;
                contentType: string;
                appId: string;
                route: string;
            }[];
        }>;
        infinityQueryFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
                orderBy: {
                    field: "createAt" | "deleteAt";
                    order?: "asc" | "desc" | undefined;
                };
                limit?: number | undefined;
                cursor?: {
                    id: string;
                    createAt: string;
                } | undefined;
            };
            output: {
                items: {
                    id: string;
                    name: string;
                    type: string;
                    size: number;
                    createAt: Date | null;
                    deleteAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                    route: string;
                }[];
                nextCursor: {
                    createAt: Date;
                    id: string;
                } | null;
            };
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("drizzle-orm/neon-http").NeonHttpQueryResult<never> | import("postgres").RowList<never[]>;
        }>;
    }>>;
}>>>;
export declare const createApiClient: ({ apiKey, signedToken, }: {
    apiKey?: string;
    signedToken?: string;
}) => import("@trpc/client").TRPCClient<import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
    transformer: false;
}, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    fileOpen: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server/unstable-core-do-not-import").DefaultErrorShape;
        transformer: false;
    }, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
        createPresignedUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                size: number;
                contentType: string;
                filename: string;
            };
            output: {
                url: string;
                method: "PUT";
            };
        }>;
        saveFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                type: string;
                size: number;
                route: string;
                filePath: string;
            };
            output: {
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                size: number;
                path: string;
                url: string;
                contentType: string;
                appId: string;
                route: string;
            };
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                size: number;
                path: string;
                url: string;
                contentType: string;
                appId: string;
                route: string;
            }[];
        }>;
        infinityQueryFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
                orderBy: {
                    field: "createAt" | "deleteAt";
                    order?: "asc" | "desc" | undefined;
                };
                limit?: number | undefined;
                cursor?: {
                    id: string;
                    createAt: string;
                } | undefined;
            };
            output: {
                items: {
                    id: string;
                    name: string;
                    type: string;
                    size: number;
                    createAt: Date | null;
                    deleteAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                    route: string;
                }[];
                nextCursor: {
                    createAt: Date;
                    id: string;
                } | null;
            };
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("drizzle-orm/neon-http").NeonHttpQueryResult<never> | import("postgres").RowList<never[]>;
        }>;
    }>>;
}>>>;
