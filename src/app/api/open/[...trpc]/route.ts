import { openRouter } from "@/server/trpc-middlewares/open-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

const handler = async (request: NextRequest) => {
  const res = await fetchRequestHandler({
    endpoint: "/api/open",
    req: request,
    router: openRouter,
    createContext: () => ({}),
  });

  res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append("Access-Control-Allow-Methods", "*");
  res.headers.append("Access-Contorl-Allow-Headers", "*");

  return res;
};

/** OPTIONS函数处理预检请求，这是一个完全独立的HTTP请求 */
/**
 *  在跨域请求中，浏览器会在发送实际请求前，先发送一个 OPTIONS 请求来检查服务器是否允许该跨域请求，特别是当请求满足以下条件时：
使用非简单方法（GET、POST、HEAD 之外的方法如 PUT、DELETE 等）
包含自定义请求头（如 Authorization、api-key 等）
使用特定 Content-Type（如 application/json）
 */
export function OPTIONS() {
  const res = new Response("", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  });

  return res;
}

export {handler as GET, handler as POST}