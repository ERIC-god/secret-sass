'use client'
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserAvatar({ src, alt, fallbackText }: { src?: string; alt?: string; fallbackText?: string }) {
    const [imgError, setImgError] = useState(false);

    // 只要 imgError 为 true 或 src 为空，直接只渲染 Fallback
    if (!src || imgError) {
      return (
        <Avatar className="w-9 h-9">
          <AvatarFallback>
            {fallbackText || "U"}
          </AvatarFallback>
        </Avatar>
      );
    }
  
    // 否则渲染图片
    return (
      <Avatar className="w-9 h-9">
        <AvatarImage
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
        />
        <AvatarFallback>
          {fallbackText || "U"}
        </AvatarFallback>
      </Avatar>
    );
}