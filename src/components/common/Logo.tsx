"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";

export interface LogoProps {
  variant?: "full" | "icon";
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  priority?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Logo({
  variant = "full",
  width,
  height,
  className,
  href,
  priority = false,
  onClick,
}: LogoProps) {
  const iconSize = variant === "icon" ? (width ?? 32) : 36;

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <Image
        src="/new-logos/crackdsa-logo-new-no-background.png"
        alt="CrackDSA Logo"
        width={iconSize}
        height={iconSize}
        priority={priority}
        className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0"
      />
      {variant === "full" && (
        <span className="font-extrabold text-[1.25rem] sm:text-[1.35rem] tracking-tight leading-none text-gray-900 dark:text-white flex items-center">
          crack<span className="text-blue-600 dark:text-blue-400">DSA</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
