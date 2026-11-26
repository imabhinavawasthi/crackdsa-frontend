"use client";

import React, { useState, useEffect } from "react";

interface AspectFallbackImageProps {
  src?: string | null;
  localSrc: string;
  alt: string;
  title: string;
  subtitle?: string;
  className?: string;
  fallbackSrc?: string;
}

export default function AspectFallbackImage({
  src,
  localSrc,
  alt,
  title,
  subtitle,
  className = "",
  fallbackSrc = "/images/sheet-background-1.png",
}: AspectFallbackImageProps) {
  const [imageState, setImageState] = useState<"remote" | "local" | "fallback">("remote");

  // Reset state if primary image sources change dynamically
  useEffect(() => {
    setImageState("remote");
  }, [src, localSrc]);

  let currentSrc = "";
  let isFallback = false;

  if (imageState === "remote" && src) {
    currentSrc = src;
  } else if (imageState === "fallback") {
    currentSrc = fallbackSrc;
    isFallback = true;
  } else {
    currentSrc = localSrc;
  }

  const handleImageError = () => {
    if (imageState === "remote" && src) {
      setImageState("local");
    } else {
      setImageState("fallback");
    }
  };

  return (
    <div className={`w-full aspect-[16/9] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden shrink-0 group ${className}`}>
      {currentSrc ? (
        <>
          <img
            src={currentSrc}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={handleImageError}
          />
          {isFallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/35 backdrop-blur-[1px]">
              <span className="text-sm font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none leading-snug">
                {title}
              </span>
              {/* {subtitle && (
                <span className="text-[9px] font-bold text-violet-300 dark:text-violet-400 mt-1.5 uppercase tracking-widest drop-shadow-sm select-none">
                  {subtitle}
                </span>
              )} */}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-850" />
      )}
    </div>
  );
}
