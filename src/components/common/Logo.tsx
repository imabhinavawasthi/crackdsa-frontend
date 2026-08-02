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
}

export default function Logo({
  variant = "full",
  width,
  height,
  className,
  href,
  priority = false,
}: LogoProps) {
  const defaultWidth = variant === "icon" ? 32 : 130;
  const defaultHeight = variant === "icon" ? 32 : 34;

  const w = width ?? defaultWidth;
  const h = height ?? defaultHeight;

  const content = (
    <span className={cn("inline-flex items-center select-none", className)}>
      {variant === "icon" ? (
        <Image
          src="/images/logo/logo-icon.svg"
          alt="CrackDSA"
          width={w}
          height={h}
          priority={priority}
          className="h-auto w-auto"
        />
      ) : (
        <>
          <Image
            src="/images/logo/logo.svg"
            alt="CrackDSA"
            width={w}
            height={h}
            priority={priority}
            className="h-auto w-auto dark:hidden"
          />
          <Image
            src="/images/logo/logo-dark.svg"
            alt="CrackDSA"
            width={w}
            height={h}
            priority={priority}
            className="h-auto w-auto hidden dark:block"
          />
        </>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
