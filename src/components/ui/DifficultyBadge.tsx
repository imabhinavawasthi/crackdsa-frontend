"use client";

import React from "react";
import { cn } from "@/utils/cn";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const CONFIG: Record<Difficulty, { classes: string; dot: string }> = {
  Easy: {
    classes:
      "bg-success-50 text-success-700 border-success-200/80 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20 shadow-xs",
    dot: "bg-success-500",
  },
  Medium: {
    classes:
      "bg-warning-50 text-warning-700 border-warning-200/80 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20 shadow-xs",
    dot: "bg-warning-500",
  },
  Hard: {
    classes:
      "bg-error-50 text-error-700 border-error-200/80 dark:bg-error-500/10 dark:text-error-400 dark:border-error-500/20 shadow-xs",
    dot: "bg-error-500",
  },
};

const sizeClasses: Record<string, string> = {
  xs: "text-[9px] px-2 py-0.5",
  sm: "text-[10px] px-2.5 py-0.5",
  md: "text-xs px-3 py-1",
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = "sm",
  className,
}) => {
  const { classes, dot } = CONFIG[difficulty] ?? CONFIG.Easy;
  return (
    <span
      className={cn(
        "inline-flex items-center font-extrabold border rounded-full tracking-wider uppercase select-none",
        sizeClasses[size],
        classes,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 animate-pulse", dot)} />
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
