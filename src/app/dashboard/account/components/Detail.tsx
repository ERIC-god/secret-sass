"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface ISession {
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
  };
}

export default function Detail({ session }: { session: ISession }) {
  const router = useRouter();

  // Replace with your real logout logic
  async function handleLogout() {
    // await logout();
    router.replace("/login");
  }

  function handleDeleteAccount() {}

  return (
    <div className="w-full h-full px-8 py-10">
      <div className="max-w-2xl mt-16 mx-auto bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-xl border border-[#35356a] p-8 relative">
        {/* Log out button */}
        <Button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-1 rounded-lg shadow hover:scale-105 transition"
        >
          Log out
        </Button>
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-white mb-1">Account</h1>
        <div className="text-gray-400 text-sm mb-8">
          Manage your account information
        </div>
        {/* Accounts Section (inside card) */}
        <div className="mb-8">
          <div className="text-base font-bold text-white mb-2">Accounts</div>
          <hr className="border-white/10 mb-2" />
          <div className="flex items-center gap-2 text-gray-300">
            {/* Official GitLab icon */}
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path
                fill="#E24329"
                d="M31.462 12.779l-.045-.115-4.35-11.35a1.137 1.137 0 00-.447-.541 1.163 1.163 0 00-1.343.071c-.187.15-.322.356-.386.587l-2.94 9.001h-11.9l-2.941-9a1.138 1.138 0 00-1.045-.84 1.153 1.153 0 00-1.13.72L.579 12.68l-.045.113a8.09 8.09 0 002.68 9.34l.016.012.038.03 6.635 4.967 3.28 2.484 1.994 1.51a1.35 1.35 0 001.627 0l1.994-1.51 3.282-2.484 6.673-4.997.018-.013a8.088 8.088 0 002.69-9.352z"
              ></path>
            </svg>
            <span>{session?.user.name}</span>
          </div>
        </div>
        {/* Profile */}
        <div className="flex items-center gap-5 mb-8">
          <img
            src={session?.user.image}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-pink-400 shadow"
          />
          <div>
            <div className="text-lg font-bold text-white">
              {session?.user.name}
            </div>
            <div className="text-sm text-gray-400">{session?.user.name}</div>
          </div>
        </div>
        {/* Email */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-1">Email Address</div>
          <div className="flex items-center gap-2">
            <span className="text-white">{session?.user.email}</span>
            <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded font-semibold">
              Primary
            </span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold">
              GitLab
            </span>
          </div>
        </div>
        {/* Username */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-1">Account</div>
          <div className="text-white">{session?.user.name}</div>
        </div>
        {/* Danger Zone */}
        <div className="mt-10">
          <div className="text-xs text-pink-400 font-bold mb-1">
            Danger Zone
          </div>
          <div className="text-gray-400 text-xs mb-3">
            Delete your account and all its associated data.
          </div>
          <Button
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
