"use client";
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileFlowUploadModal({
  open,
  onClose,
  uppy,
  uploadingFiles,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  uppy: any;
  uploadingFiles: any[];
  onUpload: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // 关闭弹窗（点击四周）
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.target === overlayRef.current) onClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#23235b] via-[#29295e] to-[#23235b] rounded-2xl shadow-2xl border border-[#35356a] p-8 animate-fade-in-up">
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-extrabold text-white mb-4">Upload files</h2>
        {/* 拖拽区 */}
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed border-blue-400/40 rounded-xl bg-[#1a1a2e]/60 py-12 mb-6 transition-all",
            "hover:border-pink-400/60"
          )}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
              uppy.addFile({
                data: file,
                name: file.name,
                type: file.type,
                source: "drag-drop",
              });
            });
          }}
        >
          <Upload className="w-10 h-10 text-blue-400 mb-2" />
          <div className="text-lg font-bold text-white mb-1">
            Choose files or drag and drop
          </div>
          <div className="text-gray-400 text-sm">All file types</div>
          <input
            type="file"
            multiple
            className="hidden"
            id="fileflow-upload-input"
            onChange={e => {
              if (e.target.files) {
                Array.from(e.target.files).forEach(file => {
                  uppy.addFile({
                    data: file,
                    name: file.name,
                    type: file.type,
                    source: "file input",
                  });
                });
              }
            }}
          />
          <Button
            variant="ghost"
            className="mt-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition"
            onClick={() => document.getElementById("fileflow-upload-input")?.click()}
          >
            Select Files
          </Button>
        </div>
        {/* 文件列表 */}
        <div className="mb-6 max-h-40 overflow-y-auto">
          {uploadingFiles.length === 0 ? (
            <div className="text-gray-400 text-center">No files selected.</div>
          ) : (
            <ul className="space-y-2">
              {uploadingFiles.map(file => (
                <li key={file.id} className="flex items-center justify-between bg-[#29295e]/60 rounded px-3 py-2">
                  <span className="text-white">{file.name}</span>
                  <span className="text-gray-400 text-xs">{(file.size / 1024).toFixed(2)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 上传按钮 */}
        <Button
          className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white shadow-lg hover:scale-105 transition"
          onClick={onUpload}
          disabled={uploadingFiles.length === 0}
        >
          Upload
        </Button>
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