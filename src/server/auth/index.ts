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
        "ff47a27bacc3a494276914776bdc8fcff719a7a9ee834fa8ef6bbb9413367066",
      clientSecret:
        "gloas-433a1b247faf61b11467f502b7bedee1348447ee56c3ac4498879437566c4582",
    }),
  ],
};

/** 可以让服务端获取 Session的一个工具 */
export function getServerSession(){
    return nextAuthGetServerSession(authOptions)
}

