import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { db } from "@/server/db/db";
// import { Users } from '@/server/db/schema'
import { eq } from "drizzle-orm";
import { SessionProvider } from "./userInfo";
import { UserInfo } from "./userInfo";
import { getServerSession } from "@/server/auth";


export default async function page() {
  /** drizzle orm操作 */
  // const users=await db.query.Users.findMany();
  // const users =  await db.select().from(Users).where(eq(Users.name,'eric'))

  /** 获取session 信息 */
  // const session = await getServerSession();
  // console.log(session?.user);

  // if (!session?.user) {
  //   redirect("/api/auth/signin");
  // }

 

  return (
    <div className="dark">
      {/* <Button
        className=" dark:absolute dark:h-24"
        variant="outline"
        size="sm"
        asChild
      >
        <Link href="https://baidu.com">button</Link>
      </Button> */}

      <Alert className="dark:absolute dark:bottom-0">wow</Alert>
      <SessionProvider>
        <UserInfo />
      </SessionProvider>
    </div>
  );
}

/**
 * Next.js中的generateMetadata是为了生成HTML页面的元数据，
 * 以便于SEO优化和社交媒体分享。API路由不返回HTML，所以不需要元数据。
 */
export async function generateMetadata() {
  return {
    title: "wow",
  };
}
