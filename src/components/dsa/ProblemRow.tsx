"use client";

import React from "react";
import { motion } from "framer-motion";
import { Problem } from "@/types/dsa-sheet";
import { ExternalLink } from "lucide-react";

interface ProblemRowProps {
  problem: Problem;
  index: number;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({ problem, index }) => {
  // Format the problem_id into a readable title if title is absent
  const formattedTitle =
    problem.title ||
    problem.problem_id
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const difficultyConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    Easy: {
      bg: "bg-success-50 dark:bg-success-500/10",
      text: "text-success-600 dark:text-success-400",
      label: "Easy",
    },
    Medium: {
      bg: "bg-warning-50 dark:bg-warning-500/10",
      text: "text-warning-600 dark:text-warning-400",
      label: "Medium",
    },
    Hard: {
      bg: "bg-error-50 dark:bg-error-500/10",
      text: "text-error-600 dark:text-error-400",
      label: "Hard",
    },
  };

  const diff = difficultyConfig[problem.difficulty || "Medium"] ||
    difficultyConfig.Medium;

  return (
    <motion.a
      href={`/practice/${problem.problem_id}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="group flex items-center justify-between py-2.5 px-3 -mx-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all duration-150 cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Problem number */}
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-5 text-center shrink-0 tabular-nums">
          {index + 1}
        </span>
        {/* Problem title */}
        <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
          {formattedTitle}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {/* Difficulty badge */}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${diff.bg} ${diff.text}`}
        >
          {diff.label}
        </span>
        {/* Arrow */}
        <ExternalLink
          size={13}
          className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100"
        />
      </div>
    </motion.a>
  );
};
