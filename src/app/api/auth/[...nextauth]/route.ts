import { authOptions } from "@/server/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
/** 将 handler 函数作为 GET 导出   */
/** 将同一个 handler 函数作为 POST 导出 */
export { handler as GET, handler as POST };
