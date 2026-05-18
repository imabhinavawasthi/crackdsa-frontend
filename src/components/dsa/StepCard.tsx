"use client";

import React from "react";
import { Step } from "@/types/dsa-sheet";
import { ProblemRow } from "./ProblemRow";
import { Workflow } from "lucide-react";

interface StepCardProps {
  step: Step;
  index: number;
  isLast?: boolean;
  colorDot?: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  isLast,
  colorDot = "bg-brand-500",
}) => {
  // Format pattern name
  const patternName = step.pattern_id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className={`relative flex gap-4 ${isLast ? "" : "pb-6"}`}>
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className={`w-2.5 h-2.5 rounded-full ${colorDot} ring-4 ring-white dark:ring-gray-800 z-10`}
        />
        {!isLast && (
          <div className="w-px flex-1 bg-gray-200 dark:bg-white/10 mt-1" />
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0 -mt-0.5">
        {/* Step header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">
              Step {index + 1}
            </span>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
              {step.title}
            </h3>
          </div>
          {step.pattern_id && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 shrink-0 w-fit">
              <Workflow size={10} />
              {patternName}
            </span>
          )}
        </div>

        {/* Problems grid */}
        <div className="flex flex-col gap-1">
          {step.problems.map((problem, i) => (
            <ProblemRow key={problem.problem_id} problem={problem} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
