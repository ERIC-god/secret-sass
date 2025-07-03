import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import z from 'zod';
import {v4 as uuidv4} from 'uuid'
import { db } from "@/server/db/db";
import { eq } from "drizzle-orm";

export const userRoute=router({
    getPlan:protectedProcedure.query(async ({ctx})=>{
        const result=await db.query.users.findFirst({
            where:(users)=>eq(users.id,ctx.session.user.id),
            columns:{
                plan:true
            }
        })

        return result?.plan
    })

        
    
})