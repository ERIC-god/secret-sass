// src/app/dashboard/apps/page.tsx
"use client";
import Link from "next/link";
import { trpcClientReact } from "@/utils/client";

// 下面是 NoApps 和 AppsSkeleton 组件，直接放在同文件即可
function NoApps() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <svg className="w-12 h-12 mb-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 48 48">
        <path d="M24 4l4.8 13.6H43l-11.2 8.2L36.6 40 24 31.6 11.4 40l4.8-14.2L5 17.6h14.2z" stroke="currentColor" strokeLinejoin="round"/>
      </svg>
      <div className="text-xl font-bold text-white mb-1">No Apps Found</div>
      <div className="text-gray-400">Click “Create New App” in the top right to get started!</div>
    </div>
  );
}

function AppsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-lg border border-[#35356a] p-7 min-h-[140px] flex flex-col justify-between"
        >
          <div className="h-6 w-1/2 bg-white/10 rounded mb-3"></div>
          <div className="h-4 w-3/4 bg-white/10 rounded mb-6"></div>
          <div className="h-4 w-1/4 bg-white/10 rounded self-end"></div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function AppsPage() {
  const { data: apps, isPending } = trpcClientReact.app.listApps.useQuery(
    void 0,
    {
      /**
       *  refetchOnReconnect：当网络断开后重新连接时，是否自动重新请求数据。false 表示不会自动重新请求。
          refetchOnWindowFocus：当窗口重新获得焦点时，是否自动重新请求数据。false 表示不会自动重新请求。
          refetchOnMount：当组件重新挂载时，是否自动重新请求数据。false 表示不会自动重新请求。
       */
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return (
    <div className="w-full h-full px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">
          Apps
        </h1>
        <Link
          href="/dashboard/apps/new"
          className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:scale-105 transition"
        >
          Create New App
        </Link>
      </div>
      {/* 加载中骨架屏 */}
      {isPending ? (
        <AppsSkeleton />
      ) : apps?.length === 0 ? (
        <NoApps />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {apps?.map((app, idx) => (
            <Link  key={idx} href={`/dashboard/apps/${app.id}`}>
              <div
             
              className="group relative bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-lg border border-[#35356a] p-7 flex flex-col justify-between min-h-[140px] transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* 右上角品牌色小圆点 */}
              <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 opacity-70 group-hover:opacity-100 transition"></span>
              {/* name */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-white truncate group-hover:text-pink-400 transition">
                  {app.name}
                </span>
              </div>
              {/* description */}
              <div className="text-gray-300 text-sm mb-6 break-words min-h-[24px]">
                {app.description || <span className="text-gray-500">暂无描述</span>}
              </div>
              {/* createdAt */}
              <div className="flex items-center justify-end">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm
                  text-xs font-semibold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent
                  border border-white/10 shadow-sm select-none"
                >
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="4" stroke="currentColor" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" />
                  </svg>
                  {formatDate(app.createAt!)}
                </span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
