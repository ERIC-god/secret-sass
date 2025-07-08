'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { trpcClientReact } from "@/utils/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDangerModal } from "@/components/packaging/ConfirmDangerModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppSettingPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [isShowSuccess, setIsShowSucces] = useState(false);
  const [open, setOpen] = useState(false);

  const { mutate: resetApp, isSuccess } =
    trpcClientReact.app.resetApp.useMutation({
      onSuccess: () => {
        toast.success("Save Change Success!", {
          position: "top-center",
          style: { top: "50px" },
        });

        setTimeout(() => {
          router.push("/dashboard/apps");
        }, 800);
      },
    });

  const { mutate: deleteApp } = trpcClientReact.app.deleteApp.useMutation({
    onSuccess: () => {
      toast.success("Delete App Success!", {
        position: "top-center",
        style: { top: "50px" },
      });

      setTimeout(() => {
        router.push("/dashboard/apps");
      }, 800);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetApp({
      id,
      name: appName,
      description: appDescription,
    });
  };

  const handleDeleteApp = () => {
    setOpen(true);
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-xl border border-[#35356a] p-10">
        {/* Alert 弹窗 */}
        {isShowSuccess && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%]">
            <Alert variant="success">
              <svg
                className="w-6 h-6 text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <AlertTitle>App updated successfully!</AlertTitle>
                <AlertDescription>
                  Your app information has been saved.
                </AlertDescription>
              </div>
            </Alert>
          </div>
        )}
        <h2 className="text-2xl font-extrabold text-white mb-2">Settings</h2>
        <div className="text-gray-400 mb-8">
          Configure your app's basic information.
        </div>
        {/* Basic Info */}
        <div className="mb-8">
          <div className="text-lg font-bold text-white mb-4">General</div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm text-gray-300 mb-1"
                htmlFor="appName"
              >
                App Name
              </label>
              <input
                id="appName"
                type="text"
                placeholder="Reset your app name"
                onChange={(e) => {
                  setAppName(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a2e] text-white border border-[#3a3a6a] focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
            <div>
              <label
                className="block text-sm text-gray-300 mb-1"
                htmlFor="appUrl"
              >
                App Description
              </label>
              <input
                id="appUrl"
                type="text"
                placeholder="Reset your App Description"
                onChange={(e) => {
                  setAppDescription(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a2e] text-white border border-[#3a3a6a] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-lg hover:scale-105 transition"
            >
              Save Changes
            </Button>
          </form>
        </div>
        {/* Danger Zone */}
        <div className="mt-10">
          <div className="text-lg font-bold text-pink-400 mb-2">
            Danger Zone
          </div>
          <div className="text-gray-400 text-sm mb-3">
            This action is destructive and cannot be undone.
          </div>
          <Button
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
            onClick={handleDeleteApp}
          >
            Delete App
          </Button>
        </div>
        <ConfirmDangerModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            // 这里写你的删除逻辑
            deleteApp({ id });
          }}
          title="Are you sure you want to delete your account?"
          description="This action cannot be undone. All your data will be permanently deleted. Please type DELETE to confirm."
          confirmKeyword="DELETE"
          confirmButtonText="Delete Account"
          cancelButtonText="Cancel"
        />
      </div>
    </div>
  );
}