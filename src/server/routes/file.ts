import { router } from "../trpc-middlewares/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { protectedProcedure } from "../trpc-middlewares/trpc";
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import z from "zod";
import { db } from "../db/schema";
import { files } from "../db/schema";
import { and, desc, gt, lt, asc, sql, eq, isNull } from "drizzle-orm";
import { filesCanOrderByColumns, fileSchema } from "../db/validate-schema";

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
      /** 使用Zod定义输入参数验证规则 */
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();
      const dateString = isoString.split("T")[0];

      /** 上传文件的必要参数 */
      /**
       * 设置上传文件的参数对象
       * PutObjectCommandInput是AWS S3 SDK中的类型
       */
      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(" ", "-")}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };
      /**
       * 创建S3客户端实例
       * 尽管使用AWS S3 SDK，但通过自定义endpoint指向腾讯云COS
       */
      const s3Client = new S3Client({
        endpoint: apiEndpoint,
        region: region,
        credentials: {
          accessKeyId: COS_APP_ID!,
          secretAccessKey: COS_APP_SECRET!,
        },
        forcePathStyle: false, // 对于某些 S3 兼容服务可能需要
      });

      /** 创建Command , 通过getSignedUrl API, 来生成signed url*/
      const command = new PutObjectCommand(params);

      /** getSignedUrl 生成一个临时、有权限限制的 URL，允许未经 AWS 身份验证的用户直接访问或操作 S3 中的对象，而无需拥有 AWS 凭证。 */
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      console.log("input.filePath:", input.filePath);

      const url = new URL(input.filePath);

      /** 执行插入数据库 */
      const photo = await db
        .insert(files)
        .values({
          name: input.name,
          type: input.type,
          /** 存储的文件夹路径 */
          path: url.pathname,
          /** 存储的完整路径 */
          url: url.toString(),
          /** 每个文件都有一个对应的userId */
          userId: session.user.id,
          contentType: input.type,
        })
        /** returing就是把插入的数据返回 */
        .returning();

      return photo[0];
    }),

  /**
   *  列出文件列表
   */
  listFiles: protectedProcedure.query(async () => {
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
      })
    )
    .query(async ({ input }) => {
      const {
        limit,
        cursor,
        orderBy = { field: "createAt", order: "desc" },
      } = input;

      const deletedFilter = isNull(files.deleteAt);

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
                deletedFilter
              )
            : deletedFilter
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