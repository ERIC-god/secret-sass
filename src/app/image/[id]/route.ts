import { db } from "@/server/db/schema";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { TRPCError } from "@trpc/server";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// /** 存储桶名称 */
// const bucket = process.env.COS_APP_BUCKET;
// /** COS EndPoint */
// const apiEndpoint = process.env.COS_APP_ENDPOINT;
// /** 区域 */
// const region = process.env.COS_APP_REGION;
// /** accessKeyID */
// const COS_APP_ID = process.env.COS_APP_ID;
// /** secretAccessKey */
// const COS_APP_SECRET = process.env.COS_APP_SECRET;

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
    with: {
      app: {
        with: {
          storage: true,
        },
      },
    },
  });

  console.log("file", file?.app?.storage?.configuration, "file");

  if (!file?.app.storage) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }

  if (!file) {
    return NextResponse.json({ error: "image not found" }, { status: 400 });
  }

  const storage = file.app.storage.configuration;
  const { apiEndpoint, bucket, accessKeyId, secretAccessKey, region } = storage;

  const params: GetObjectCommandInput = {
    Bucket: bucket,
    Key: file.path,
  };

  const s3Client = new S3Client({
    endpoint: apiEndpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: false, // 对于某些 S3 兼容服务可能需要
  });

  const command = new GetObjectCommand(params);
  const response = await s3Client.send(command);

  /** 尝试将响应体转换为字节数组（二进制数据） */
  const byteArray = await response.Body?.transformToByteArray();
  // const videoStream = await response.Body?.transformToWebStream();

  if (!byteArray) {
    return NextResponse.json({ error: "error" }, { status: 400 });
  }

  /** 当你传入字节数组时，sharp 能直接解析这些二进制数据并识别为图片 */
  /**
     *  sharp 构造函数可以接受多种输入：
            Buffer：Node.js 的二进制数据缓冲区
            Uint8Array：TypeScript/JavaScript 的字节数组
            文件路径字符串
            流对象
     */
  const image = sharp(byteArray);
  image.resize({
    width: 250,
    height: 250,
  });

  /** 这是 sharp 的输出方法，将处理后的图片转换为 Node.js Buffer 对象 */
  /** toBuffer() 方法是异步的，返回 Promise，所以需要使用 await */
  const buffer = await image.webp().toBuffer();

  /**
   *  buffer 是处理后的 WebP 格式图片的二进制数据
   *  它是一个 Node.js Buffer 对象，本质上就是存储在内存中的二进制数据
   */

  /**
     *  为什么可以直接传给客户端？
        HTTP 协议本身就设计为传输任何类型的数据，包括二进制数据
        NextResponse 构造函数可以接受 Buffer 作为响应体
        当设置了正确的 Content-Type 头部时，浏览器会知道如何解释这些二进制数据
     */

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

/**
 *  
    S3 存储中的图片
      ↓
    获取图片数据 (S3Client.send)
      ↓
    转换为字节数组 (transformToByteArray)
      ↓
    创建 sharp 实例处理图片 (sharp(byteArray))
      ↓
    调整图片尺寸 (resize)
      ↓
    转换为 WebP 格式 (webp())
      ↓
    输出为 Buffer (toBuffer())
      ↓
    创建 HTTP 响应 (new NextResponse)
      ↓
    设置正确的内容类型和缓存头
      ↓
    返回给客户端
 */