import { router } from "../trpc-middlewares/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { protectedProcedure } from "../trpc-middlewares/trpc";
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import z from "zod";
import { apps } from "../db/schema";
import { files } from "../db/schema";
import {
  and,
  desc,
  gt,
  lt,
  asc,
  sql,
  eq,
  isNull,
  isNotNull,
  count,
} from "drizzle-orm";
import { filesCanOrderByColumns } from "../db/validate-schema";
import { v4 as uuidv4 } from "uuid";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db/db";

/** 存储桶名称 */
const bucket = process.env.COS_APP_BUCKET;
/** COS EndPoint */
const apiEndpoint = process.env.COS_APP_ENDPOINT;
/** 区域 */
const region = process.env.COS_APP_REGION;
/** accessKeyID */
const COS_APP_ID = process.env.COS_APP_ID;
/** secretAccessKey */
const COS_APP_SECRET = process.env.COS_APP_SECRET;

/** 文件路由 */
export const fileRoutes = router({
  /**
   * 创建预签名URL的API端点
   * 用于前端直接上传文件到对象存储
   * 需要用户登录才能使用，通过protectedProcedure确保
   */
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
        appId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();
      const dateString = isoString.split("T")[0];
      const plan = ctx.plan;

      // 查找 app 及其 storage
      const app = await db.query.apps.findFirst({
        where: (apps) => eq(apps.id, input.appId),
        with: {
          storage: true,
        },
      });

      if (!app) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "App not found",
        });
      }

      // 权限校验
      if (ctx.session.user.id !== app.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      // 限制普通用户上传数量
      if (plan !== "payed") {
        const uploadedFilesCount = await db
          .select({ count: count() })
          .from(files)
          .where(and(eq(files.appId, app.id), isNull(files.deleteAt)));
        const counts = uploadedFilesCount[0].count;
        if (counts > 10) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "超出上限",
          });
        }
      }

      // 判断 storageId=0（官方存储）还是自定义
      let bucket, region, apiEndpoint, accessKeyId, secretAccessKey;
      if (app.storageId === 0) {
        // 官方存储，读服务端环境变量
        bucket = process.env.COS_APP_BUCKET!;
        region = process.env.COS_APP_REGION!;
        apiEndpoint = process.env.COS_APP_ENDPOINT!;
        accessKeyId = process.env.COS_APP_ID!;
        secretAccessKey = process.env.COS_APP_SECRET!;
      } else {
        // 用户自定义存储
        if (!app.storage) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Storage not found",
          });
        }
        bucket = app.storage.configuration.bucket;
        region = app.storage.configuration.region;
        apiEndpoint = app.storage.configuration.apiEndpoint;
        accessKeyId = app.storage.configuration.accessKeyId;
        secretAccessKey = app.storage.configuration.secretAccessKey;
      }

      // 生成预签名 URL
      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(" ", "-")}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const s3Client = new S3Client({
        endpoint: apiEndpoint,
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: false,
      });

      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 30,
      });

      return {
        url,
        method: "PUT" as const,
      };
    }),

  /**
   *  通过drizzle语法 将图片插入数据库
   */
  saveFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        filePath: z.string(),
        type: z.string(),
        appId: z.string(),
        size: z.number(),
        route: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;

      const url = new URL(input.filePath);

      /** 执行插入数据库 */
      const photo = await db
        .insert(files)
        .values({
          name: input.name,
          id: uuidv4(),
          type: input.type,
          size: input.size,
          /** 存储的文件夹路径 */
          path: url.pathname,
          /** 存储的完整路径 */
          url: url.toString(),
          /** 每个文件都有一个对应的userId */
          userId: session.user.id,
          contentType: input.type,
          appId: input.appId,
          route: input.route,
        })
        /** returing就是把插入的数据返回 */
        .returning();

      return photo[0];
    }),

  /**
   *  列出文件列表
   */
  listFiles: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.query.files.findMany({
      orderBy: [desc(files.createAt)],
    });
    return result;
  }),

  /**
   *  无限列表
   */
  infinityQueryFiles: protectedProcedure
    .input(
      z.object({
        /**
         *  联合游标分页
         *  适合排序字段可能重复的场景（比如很多数据的 created_at 一样）。
         *  2. desc and asc
         */
        cursor: z
          .object({
            id: z.string(),
            createAt: z.string(),
          })
          .optional(),
        limit: z.number().default(10),
        orderBy: z.object({
          field: filesCanOrderByColumns.keyof(),
          order: z.enum(["asc", "desc"]).optional(),
        }),
        appId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        limit,
        cursor,
        orderBy = { field: "createAt", order: "desc" },
        appId,
      } = input;

      const deletedFilter = isNull(files.deleteAt);
      const userFilter = eq(files.userId, ctx.session.user.id);
      const appFilter = eq(files.appId, appId);

      const state = db
        .select()
        .from(files)
        .limit(limit)
        .where(
          cursor
            ? and(
                sql`("files"."created_at", "files"."id") < (${new Date(
                  cursor.createAt
                ).toISOString()}, ${cursor.id})`,
                deletedFilter,
                userFilter,
                appFilter
              )
            : and(deletedFilter, userFilter, appFilter)
        );
      // .orderBy(desc(files.createdAt));
      state.orderBy(
        orderBy.order === "desc"
          ? desc(files[orderBy.field])
          : asc(files[orderBy.field])
      );
      // .where(cursor ? lt(files.createAt, new Date(cursor)) : undefined);

      const result = await state;

      return {
        items: result,
        nextCursor:
          result.length > 0
            ? {
                createAt: result[result.length - 1].createAt!,
                id: result[result.length - 1].id,
              }
            : null,
      };
    }),

  /**
   *  删除文件
   */
  deleteFile: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return db
        .update(files)
        .set({ deleteAt: new Date() })
        .where(eq(files.id, input));
    }),

  setDeletedNull: protectedProcedure.mutation(async () => {
    return await db.update(files).set({ deleteAt: null });
  }),
});


// saveFile: protectedProcedure
//     .input(
//       z.object({
//         name: z.string(),
//         path: z.string(),
//         type: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const { session } = ctx;
//       const url = new URL(input.path);

//       /** 通过drizzle 的插入语法来插入数据库 */
//       const photo = await db
//         .insert(files)
//         .values({
//           ...input,
//           path: url.pathname,
//           url: url.toString(),
//           userId: session.user.id,
//           contentType: input.type,
//         })
//         .returning();

//       return photo[0];
//     }),



/**
 *  .where(
          cursor
            ? orderBy.order === "desc"
              ? sql`("files"."created_at","files"."id") < (${new Date(
                  cursor.createAt
                ).toISOString()},${cursor.id})`
              : sql`("files"."created_at","files"."id") > (${new Date(
                  cursor.createAt
                ).toISOString()},${cursor.id})`
            : undefined
        );

    

      if (orderBy.order === "desc") {
        state.orderBy(desc(files.createAt), desc(files.id));
      } else {
        state.orderBy(asc(files.createAt), asc(files.id));
      }
 */