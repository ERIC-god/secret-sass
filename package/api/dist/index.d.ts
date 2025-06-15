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
                contentType: string;
                appId: string;
                filename: string;
                size: number;
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
                appId: string;
                filePath: string;
            };
            output: {
                path: string;
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                url: string;
                contentType: string;
                appId: string;
            };
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                path: string;
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                url: string;
                contentType: string;
                appId: string;
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
                    createAt: Date | null;
                    deleteAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                nextCursor: {
                    createAt: Date;
                    id: string;
                } | null;
            };
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("postgres").RowList<never[]>;
        }>;
    }>>;
}>>>;
export declare const createApiClient: ({ apiKey }: {
    apiKey: string;
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
                contentType: string;
                appId: string;
                filename: string;
                size: number;
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
                appId: string;
                filePath: string;
            };
            output: {
                path: string;
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                url: string;
                contentType: string;
                appId: string;
            };
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                path: string;
                id: string;
                name: string;
                userId: string;
                type: string;
                createAt: Date | null;
                deleteAt: Date | null;
                url: string;
                contentType: string;
                appId: string;
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
                    createAt: Date | null;
                    deleteAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                nextCursor: {
                    createAt: Date;
                    id: string;
                } | null;
            };
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("postgres").RowList<never[]>;
        }>;
    }>>;
}>>>;
