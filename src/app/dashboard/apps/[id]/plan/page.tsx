"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { trpcClientReact } from "@/utils/client";
import { useEffect } from "react";

const plans = [
  {
    key: "free",
    name: "Free",
    subtitle: "Everything you need to start uploading!",
    price: "Free",
    features: [
      "2GB of our storage *",
      "Unlimited storage of your own cloud",
      "Unlimited uploads and downloads",
      "(Probably) cheaper than a cup of coffee",
    ],
    note: "* Storage shared between all apps",
  },
  {
    key: "pro",
    name: "Pro",
    subtitle: "For those with teams or more than 2 gigs of files.",
    price: "$10/month",
    features: [
      "100GB of storage",
      "Private Files",
      "Unlimited uploads and downloads"
    ],
  },
];

// 假设你有当前套餐 data
// const data = "free"; // or "pro"


export default function PlanPage() {
  const { data } = trpcClientReact.user.getPlan.useQuery();
  const { mutate: upgradePro } = trpcClientReact.user.upgrade.useMutation({
    onSuccess: (res) => {
      window.location.href = res.url;
    },
  });
  const handleUpgrade = () => {
    upgradePro();
  };

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-extrabold text-white mb-1">
          Plan & Billing
        </h2>
        <div className="text-gray-400 mb-8">
          Manage your subscription for this application.
        </div>

        {/* 当前套餐 */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-lg border border-[#35356a] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-bold text-white text-lg mb-1">
                Current Plan
              </div>
              <div className="text-gray-400 mb-2">
                Manage and view your current plan
              </div>
              <div className="text-white">
                Plan:{" "}
                <span className="font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {plans.find((p) => p.key === data)?.name}
                </span>
              </div>
              <div className="text-gray-400 text-sm">No expiration.</div>
            </div>
            <div>
              <Button
                disabled
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold px-5 py-2 rounded-xl shadow"
              >
                Manage your billing settings
              </Button>
            </div>
          </div>
        </div>

        {/* 可选套餐 */}
        <div>
          <div className="font-bold text-white text-lg mb-4">
            Available Plans
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`relative bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-lg border border-[#35356a] p-8 flex flex-col gap-3
                  ${plan.key === data ? "ring-2 ring-pink-400/60" : ""}
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-extrabold text-white">
                    {plan.name}
                  </span>
                  {plan.key === data && (
                    <span className="ml-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white text-xs font-bold shadow">
                      Current plan
                    </span>
                  )}
                </div>
                <div className="text-gray-400 mb-2">{plan.subtitle}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {plan.price}
                </div>
                <ul className="mb-2 space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.note && (
                  <div className="text-xs text-gray-400 italic">
                    {plan.note}
                  </div>
                )}
                {plan.key !== data && (
                  <Button
                    className="mt-4 w-full py-2 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-lg hover:scale-105 transition"
                    onClick={handleUpgrade}
                  >
                    Switch to {plan.name}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}