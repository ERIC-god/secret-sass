"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDangerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmKeyword?: string; // 默认 "DELETE"
  confirmButtonText?: string; // 默认 "Delete"
  cancelButtonText?: string; // 默认 "Cancel"
}

export function ConfirmDangerModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone. Please type the keyword to confirm.",
  confirmKeyword = "DELETE",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}: ConfirmDangerModalProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[3px] animate-fade-in-up">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-3xl shadow-2xl border border-[#35356a] p-10 animate-fade-in-up">
        {/* 关闭按钮 */}
        <button
          className="absolute top-6 right-6 text-white/70 hover:text-white transition"
          onClick={onClose}
        >
          <X className="w-7 h-7" />
        </button>
        <h2 className="text-2xl font-extrabold text-white mb-3">{title}</h2>
        <div className="text-gray-300 mb-6 text-base">{description}</div>
        <div className="mb-8">
          <span className="text-sm text-gray-400">
            Type <span className="font-bold text-pink-400">{confirmKeyword}</span> to confirm.
          </span>
          <input
            ref={inputRef}
            type="text"
            className="mt-3 w-full px-4 py-3 rounded-xl bg-[#1a1a2e]/60 text-white border border-[#35356a] focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={confirmKeyword}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="ghost"
            className="bg-[#29295e] text-gray-300 rounded-lg px-6 py-3 text-base"
            onClick={onClose}
          >
            {cancelButtonText}
          </Button>
          <Button
            className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold rounded-lg shadow px-8 py-3 text-base hover:scale-105 transition"
            disabled={input !== confirmKeyword}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
      {/* 动画样式 */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
}