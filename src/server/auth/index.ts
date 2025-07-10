import { AuthOptions, DefaultUser, DefaultSession } from "next-auth";
import GitlabProvider from "next-auth/providers/gitlab";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db/db";
import { getServerSession as nextAuthGetServerSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      id: string;
    };
  }
}

/** NextAuth.js 的配置代码*/
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers

  /** 这是数据库适配器配置  */
  adapter: DrizzleAdapter(db),

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  /** 配置认证提供商 */
  providers: [
    // ...add more providers here
    // GitlabProvider({
    //     clientId: process.env.GITLAB_CLIENT_ID,
    //     clientSecret: process.env.GITLAB_CLIENT_SECRET
    // })

    /** GitLab 提供商配置  */
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENTID!,
      clientSecret: process.env.GITLAB_CLIENTSECRET!,
      httpOptions: { timeout: 10000 },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
};

/** 可以让服务端获取 Session的一个工具 */
export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
