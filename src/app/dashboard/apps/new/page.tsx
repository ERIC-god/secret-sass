'use client';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createApp } from "./action";

export default function Page() {
  const router = useRouter();
  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const result = await createApp(name, description);
    // router.replace(`/dashboard/apps/${result.appId}`)
  }

  return (
    <div className="relative min-h-[calc(100vh-48px)] flex items-center justify-center bg-gradient-to-br from-[#23235b] via-[#1a1a2e] to-[#2e2e4e] overflow-hidden">
      {/* 背景光斑装饰，可选 */}
      <div className="absolute left-1/4 top-1/4 w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-[300px] h-[300px] bg-blue-500 opacity-20 rounded-full blur-2xl pointer-events-none" />
      {/* 主卡片 */}
      <div className="relative w-full max-w-xl bg-gradient-to-br from-[#23235b]/95 via-[#2e2e4e]/95 to-[#1a1a2e]/95 rounded-3xl shadow-2xl border border-[#3a3a6a]/60 p-12 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 drop-shadow-lg tracking-wide text-center">
          创建新应用
        </h1>
        <form className="w-full flex flex-col gap-7" onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="应用名称"
            minLength={3}
            required
            className="bg-[#18182f] text-white border-none shadow-inner rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
          />
          <Textarea
            name="description"
            placeholder="应用描述"
            className="bg-[#18182f] text-white border-none shadow-inner rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition resize-none"
            rows={4}
          />
          <Button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 border-none"
            style={{
              boxShadow:
                "0 4px 32px 0 rgba(255, 192, 203, 0.15), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
            }}
          >
            创建应用
          </Button>
        </form>
      </div>
    </div>
  );
}