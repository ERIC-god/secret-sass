"use server";
import { getServerSession } from "@/server/auth";
import { insertAppSchema } from "@/server/db/validate-schema";
import { serverCaller } from "@/utils/trpc";
import { redirect } from "next/navigation";

export async function createApp(name:string,description:string) {
    
    const input = insertAppSchema
      .pick({
        name: true,
        description: true,
      })
      .safeParse({ name, description });
 

    if (input.success) {
      const session = await getServerSession();

      /**
       *  在服务器端代码中，始终使用 serverCaller 而不是 HTTP 客户端
       */
      const newApp = await serverCaller({ session }).app.createApp(input.data);

      redirect(`/dashboard/apps/${newApp.id}/files`);
      // return {appId:newApp.id}
    }
    else{
        throw input.error
    }
  }