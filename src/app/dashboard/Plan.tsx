'use client'
import { trpcClientReact } from "@/utils/client";
import clsx from "clsx";

export function Plan() {
  const { data: plan } = trpcClientReact.user.getPlan.useQuery(void 0, {
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <span
      className={clsx(
        "text-xs font-semibold px-3 py-1 rounded-full mr-4",
        plan === "payed"
          ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow"
          : "bg-gray-200 text-gray-700"
      )}
    >
      {plan === "payed" ? <>pro</> : <>free</>}
    </span>
  );
}