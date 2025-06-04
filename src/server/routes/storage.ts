import { eq, isNull, and } from "drizzle-orm";
import { apps, db, storageConfiguration } from "../db/schema";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const storageRoutes = router({
  listStorages: protectedProcedure.query(async ({ ctx }) => {
    const configuration = await db.query.storageConfiguration.findMany({
      where: (storageConfiguration) =>
        and(
          eq(storageConfiguration.userId, ctx.session.user.id),
          isNull(storageConfiguration.deleteAt)
        ),
    });
    return configuration;
  }),
  createStorages: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bucket: z.string(),
        region: z.string(),
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
        apiEndpoint: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        bucket,
        region,
        accessKeyId,
        secretAccessKey,
        apiEndpoint,
      } = input;
      const result = await db
        .insert(storageConfiguration)
        .values({
          name,
          configuration: {
            bucket,
            region,
            accessKeyId,
            secretAccessKey,
            apiEndpoint,
          },
          userId: ctx.session.user.id,
        })
        .returning();

      return result[0];
    }),
  changeStore: protectedProcedure
    .input(
      z.object({
        appId: z.string(),
        storageId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storage=await db.query.storageConfiguration.findFirst({
        where: (storageConfiguration) =>
          eq(storageConfiguration.id,input.storageId),
      });

      if(storage?.userId!==ctx.session.user.id){
        throw new TRPCError({
            code:'FORBIDDEN'
        })
      }

      await db
        .update(apps)
        .set({
          storageId: input.storageId,
        })
        .where(
          and(eq(apps.id, input.appId), eq(apps.userId, ctx.session.user.id))
        );
    }),
});
