import * as postgres from 'postgres';
import * as drizzle_orm_neon_http from 'drizzle-orm/neon-http';
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
                size: number;
                contentType: string;
                filename: string;
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
        listFiles: _trpc_server.TRPCQueryProcedure<{
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
        deleteFile: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: drizzle_orm_neon_http.NeonHttpQueryResult<never> | postgres.RowList<never[]>;
        }>;
    }>>;
}>>;
type OpenRouter = typeof openRouter;

export type { OpenRouter };
