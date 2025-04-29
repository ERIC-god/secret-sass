import { AuthOptions } from "next-auth";
import GitlabProvider from "next-auth/providers/gitlab";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db/db";
import { getServerSession as nextAuthGetServerSession } from "next-auth";

/** NextAuth.js 的配置代码*/
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers

  /** 这是数据库适配器配置  */
  adapter: DrizzleAdapter(db),

  /** 配置认证提供商 */
  providers: [
    // ...add more providers here
    // GitlabProvider({
    //     clientId: process.env.GITLAB_CLIENT_ID,
    //     clientSecret: process.env.GITLAB_CLIENT_SECRET
    // })

    /** GitLab 提供商配置  */
    GitlabProvider({
      clientId:
        "70e6b4efb31aa2fe7aaac5adfbb3bbf0590fc8791458a695a7f0433b085913ba",
      clientSecret:
        "gloas-e0ae1b4e4103781d6bd42cff6b5344bcd104f409589db817b734bf2b0d1ddcba",
    }),
  ],
};

/** 可以让服务端获取 Session的一个工具 */
export function getServerSession(){
    return nextAuthGetServerSession(authOptions)
}

