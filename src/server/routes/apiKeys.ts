import { eq,and, isNull } from "drizzle-orm";
import { apiKeys } from "../db/schema";
import { db } from "@/server/db/db";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { v4 as uuidv4 } from "uuid";
import z from 'zod'

export const apiKeyRoutes=router({
    listapiKeys:protectedProcedure.input(z.object({appId:z.string()})).query(async ({input})=>{
        const result=await db.query.apiKeys.findMany({
            where:(apiKeys)=>and(eq(apiKeys.appId,input.appId),isNull(apiKeys.deletedAt))
        })
        return result
    }),

    createapiKey:protectedProcedure.input(z.object({name:z.string(),appId:z.string()})).mutation(async ({input})=>{
        const result=await db.insert(apiKeys).values({
            name:input.name,
            appId:input.appId,
            key:uuidv4(),
        }).returning()

        // console.log(result);
        return result[0]
    })
})