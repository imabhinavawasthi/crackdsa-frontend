"use client";

import React from "react";
import Image from "next/image";
import { Trophy, Code2 } from "lucide-react";

interface PlatformLogoProps {
  platform: string;
  size?: number;
  className?: string;
}

export function PlatformLogo({ platform, size = 32, className = "" }: PlatformLogoProps) {
  const p = (platform || "").toLowerCase();

  // 1. Codeforces (Official SVG logo)
  if (p.includes("codeforces") || p === "cf") {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 p-2 shadow-2xs ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <Image
          src="/logos/codeforces.svg"
          alt="Codeforces"
          width={size}
          height={size}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // 2. LeetCode (Official PNG logo)
  if (p.includes("leetcode") || p === "lc") {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 shadow-2xs ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <Image
          src="/logos/leetcode.png"
          alt="LeetCode"
          width={size}
          height={size}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // 3. CodeChef (Official PNG logo)
  if (p.includes("codechef") || p === "cc") {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl bg-[#5B4636]/10 dark:bg-[#5B4636]/20 border border-[#5B4636]/20 p-2 shadow-2xs ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <Image
          src="/logos/codechef.png"
          alt="CodeChef"
          width={size}
          height={size}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // 4. AtCoder
  if (p.includes("atcoder")) {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 font-black text-slate-800 dark:text-white shadow-2xs ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <span className="text-xl font-serif">A</span>
      </div>
    );
  }

  // 5. Google Kick Start
  if (p.includes("google") || p.includes("kick")) {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-2xs ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      </div>
    );
  }

  // 6. ICPC
  if (p.includes("icpc")) {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 p-2 text-blue-600 dark:text-blue-400 shadow-2xs ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <Trophy size={size - 4} />
      </div>
    );
  }

  // Default fallback
  return (
    <div 
      className={`flex items-center justify-center shrink-0 rounded-xl bg-violet-500/10 border border-violet-500/20 p-2 text-violet-600 dark:text-violet-400 shadow-2xs ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      <Code2 size={size - 4} />
    </div>
  );
}
