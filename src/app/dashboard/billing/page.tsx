"use client";
import { trpcClientReact } from "@/utils/client";
import Link from "next/link";
import { useEffect } from "react";

export default function BillingPage() {
  // TODO: 替换为实际的账单判断逻辑
  const hasBilling = false;
  // TODO: 替换为实际的 appId

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
  const appId = apps && apps.length > 0 ? apps[0].id : undefined;

  return (
    <div className="p-8">
      {!hasBilling ? (
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-300">
            Team Billing
          </h1>
          <p className="text-gray-500 mb-6">
            No billing information found. Once you upgrade an app to a paid
            tier, billing information will be displayed here.
          </p>
          <Link
            href={`/dashboard/apps/${appId}/plan`}
            className="inline-block bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            View Subscription
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-2">Team Billing</h1>
          <p className="text-gray-500">这里将展示账单信息</p>
        </div>
      )}
    </div>
  );
}
