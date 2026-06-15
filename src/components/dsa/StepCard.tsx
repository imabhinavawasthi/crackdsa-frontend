"use client";

import React from "react";
import { Step, DetailedProblem } from "@/types/dsa-sheet";
import { ProblemTableRow } from "@/components/common/ProblemTableRow";
import { Workflow, Bookmark } from "lucide-react";

interface StepCardProps {
  step: Step;
  index: number;
  isLast?: boolean;
  colorDot?: string;
  userProblemStates?: Record<string, string>;
  sheetProblems?: DetailedProblem[];
  bookmarkedProblemIds?: string[];
  isLoggedIn?: boolean;
  onToggleSolved?: (id: string, slug: string, e: React.MouseEvent) => void;
  onToggleBookmark?: (id: string, slug: string, e: React.MouseEvent) => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  isLast,
  colorDot = "bg-brand-500",
  userProblemStates,
  sheetProblems = [],
  bookmarkedProblemIds = [],
  isLoggedIn = false,
  onToggleSolved,
  onToggleBookmark,
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

        {/* Problems table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left border-collapse text-xs">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-900 bg-transparent">
                {step.problems.map((problem) => {
                  const detailedProblem = sheetProblems.find(p => p.slug === problem.problem_id);
                  const pData = detailedProblem || problem;
                  const pid = detailedProblem?.id || problem.problem_id;
                  const status = userProblemStates?.[problem.problem_id] || "pending";
                  const isSolved = status === "done";
                  const isBookmarked = bookmarkedProblemIds.includes(pid);

                  return (
                    <ProblemTableRow 
                      key={problem.problem_id} 
                      prob={pData}
                      isSolved={isSolved}
                      isBookmarked={isBookmarked}
                      status={status}
                      isLoggedIn={isLoggedIn}
                      onToggleSolved={onToggleSolved || (() => {})}
                      onToggleBookmark={onToggleBookmark || (() => {})}
                      onOpenProblem={(slug) => {
                        window.open(`/problem/${slug}`, '_blank');
                      }}
                      hideTopics={true}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
