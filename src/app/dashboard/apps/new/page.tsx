'use client';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {  useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createApp } from "./action";


export default function page() {
  const router=useRouter();
  async function handleSubmit(e:any) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const result = await createApp(name,description);    
    // console.log(result.appId);
    // router.replace(`/dashboard/apps/${result.appId}`)
  }

  return (
    <div className="h-full flex justify-center items-center">
      <form
        className="w-full max-w-md flex flex-col gap-4"
        // 接收函数而非 URL：action 接收一个函数引用
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input
          name="name"
          placeholder="App Name"
          minLength={3}
          required
        ></Input>
        <Textarea name="description" placeholder="Description"></Textarea>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
