"use client";
import React from "react";
import { cn } from "@/lib/utils"; // 如果你有 cn 工具函数，否则可删
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  position?: "center" | "top" | "bottom" | "custom";
  className?: string; // 允许自定义额外样式
  spinnerClassName?: string; // 允许自定义spinner样式
  textClassName?: string; // 允许自定义文字样式
  style?: React.CSSProperties;
}

export function LoadingSpinner({
  text = "Loading...",
  position = "center",
  className = "",
  spinnerClassName = "",
  textClassName = "",
  style,
}: LoadingSpinnerProps) {
  // 位置样式
  let positionClass = "";
  if (position === "center") {
    positionClass = "fixed inset-0 flex items-center justify-center z-50";
  } else if (position === "top") {
    positionClass = "w-full flex justify-center mt-12";
  } else if (position === "bottom") {
    positionClass = "w-full flex justify-center mb-12";
  } else {
    positionClass = ""; // 允许自定义className
  }

  return (
    <div className={cn(positionClass, className)} style={style}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={cn("animate-spin text-blue-400 w-10 h-10", spinnerClassName)} />
        <span className={cn("text-white text-lg font-bold", textClassName)}>{text}</span>
      </div>
    </div>
  );
}