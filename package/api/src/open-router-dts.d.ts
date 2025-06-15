import * as postgres from 'postgres';
import * as _trpc_server from '@trpc/server';
import * as _trpc_server_unstable_core_do_not_import from '@trpc/server/unstable-core-do-not-import';

/** 此文件聚合路由 */
declare const openRouter: _trpc_server_unstable_core_do_not_import.BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: _trpc_server_unstable_core_do_not_import.DefaultErrorShape;
    transformer: false;
}, _trpc_server_unstable_core_do_not_import.DecorateCreateRouterOptions<{
    fileOpen: _trpc_server_unstable_core_do_not_import.BuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: _trpc_server_unstable_core_do_not_import.DefaultErrorShape;
        transformer: false;
    }, _trpc_server_unstable_core_do_not_import.DecorateCreateRouterOptions<{
        createPresignedUrl: _trpc_server.TRPCMutationProcedure<{
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
        saveFile: _trpc_server.TRPCMutationProcedure<{
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
        listFiles: _trpc_server.TRPCQueryProcedure<{
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
        infinityQueryFiles: _trpc_server.TRPCQueryProcedure<{
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
        deleteFile: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: postgres.RowList<never[]>;
        }>;
    }>>;
}>>;
type OpenRouter = typeof openRouter;

export type { OpenRouter };
