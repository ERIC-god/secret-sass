import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { insertAppSchema } from "../db/validate-schema";
import { apps } from "../db/schema";
import { db } from "@/server/db/db";
import {v4 as uuidv4} from 'uuid'
import { and, desc, eq, isNull } from "drizzle-orm";
import z from "zod";
export const appRoutes = router({
  createApp: protectedProcedure
    .input(
      insertAppSchema.pick({
        name: true,
        description: true,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .insert(apps)
        .values({
          id: uuidv4(),
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        })
        .returning();
      return result[0];
    }),

  listApps: protectedProcedure.query(async ({ input, ctx }) => {
    const result = await db.query.apps.findMany({
      where: (apps) =>
        and(eq(apps.userId, ctx.session.user.id), isNull(apps.deleteAt)),
      orderBy: [desc(apps.createAt)],
    });
    return result;
  }),

  resetApp: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db
        .update(apps)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(apps.id, input.id));
    }),

  deleteApp: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db
        .update(apps)
        .set({ deleteAt: new Date() })
        .where(eq(apps.id, input.id));
    }),
});