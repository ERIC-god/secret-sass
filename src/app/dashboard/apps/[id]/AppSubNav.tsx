'use client'
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { FileText, KeyRound, Database, CreditCard, Settings as SettingsIcon } from "lucide-react";

const appTabs = [
  { label: "Files", value: "files", icon: FileText },
  { label: "API Keys", value: "api-key", icon: KeyRound },
  { label: "Storage", value: "storage", icon: Database },
  { label: "Plan", value: "plan", icon: CreditCard },
  { label: "Settings", value: "setting", icon: SettingsIcon },
];

export function AppSubNav({ appId }: { appId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // 假数据
  const appName = "My Awesome App";

  // 计算当前激活tab
  const activeTab =
    appTabs.find((tab) =>
      pathname?.includes(`/dashboard/apps/${appId}/${tab.value}`)
    )?.value || "files";

  return (
    <div className="w-full flex justify-center mt-2 mb-12">
      <nav className="flex gap-4 bg-white/5 rounded-2xl px-4 py-2 shadow-lg backdrop-blur-md">
        {appTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => router.push(`/dashboard/apps/${appId}/${tab.value}`)}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-base transition-all duration-150",
              activeTab === tab.value
                ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-md scale-105"
                : "text-gray-300 hover:bg-gradient-to-r hover:from-yellow-400/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white"
            )}
            style={{
              boxShadow:
                activeTab === tab.value
                  ? "0 2px 16px 0 rgba(255, 192, 203, 0.10), 0 1.5px 8px 0 rgba(0,0,0,0.10)"
                  : undefined,
            }}
          >
            <tab.icon
              className={clsx(
                "w-5 h-5",
                activeTab === tab.value ? "text-white" : "text-blue-300"
              )}
            />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}