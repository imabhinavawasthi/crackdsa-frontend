"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export type TagVariant = "topic" | "company" | "neutral";

interface TagPillProps {
  label: string;
  href: string;
  variant?: TagVariant;
  className?: string;
}

const variantClasses: Record<TagVariant, string> = {
  topic:
    "bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20 dark:hover:bg-brand-500/20",
  company:
    "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700",
  neutral:
    "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700",
};

const TagPill: React.FC<TagPillProps> = ({
  label,
  href,
  variant = "neutral",
  className,
}) => (
  <Link
    href={href}
    className={cn(
      "inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95",
      variantClasses[variant],
      className
    )}
  >
    {label}
  </Link>
);

export default TagPill;
