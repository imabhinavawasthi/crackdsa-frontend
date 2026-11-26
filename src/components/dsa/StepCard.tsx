"use client";

import React from "react";
import Image from "next/image";
import { Step, DetailedProblem } from "@/types/dsa-sheet";
import { ProblemTableRow, getDifficultyConfig } from "@/components/common/ProblemTableRow";
import { Workflow, Bookmark, Check, ChevronRight, ExternalLink } from "lucide-react";

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
            {
              !step.title.includes("Step") &&
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                {step.title}
              </h3>
            }
          </div>
          {step.pattern_id && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 shrink-0 w-fit">
              <Workflow size={10} />
              {patternName}
            </span>
          )}
        </div>

        {/* Problems container */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm">
          {/* Desktop Table View (hidden on mobile, visible on sm and up) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-fixed text-left border-collapse text-xs">
              <colgroup>
                <col className="w-14" />
                <col className="w-10" />
                <col />
                <col className="w-28 sm:w-32" />
                <col className="w-44 sm:w-48" />
                <col className="w-36 sm:w-44" />
              </colgroup>
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
                      onToggleSolved={onToggleSolved || (() => { })}
                      onToggleBookmark={onToggleBookmark || (() => { })}
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

          {/* Mobile Card Layout (visible on mobile, hidden on sm and up) */}
          <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-900">
            {step.problems.map((problem) => {
              const detailedProblem = sheetProblems.find(p => p.slug === problem.problem_id);
              const pData = detailedProblem || problem;
              const pAny = pData as any;
              const pid = detailedProblem?.id || problem.problem_id;
              const slug = detailedProblem?.slug || problem.problem_id;
              const status = userProblemStates?.[problem.problem_id] || "pending";
              const isSolved = status === "done";
              const isBookmarked = bookmarkedProblemIds.includes(pid);

              const platformLower = (pAny.platform || "").toLowerCase();
              const isLeetCode = platformLower.includes("leetcode") || !pAny.platform || platformLower === "internal";
              const isCodeforces = platformLower.includes("codeforces") || platformLower === "cf";
              const isCodechef = platformLower.includes("codechef") || platformLower === "cc";
              const isGfg = platformLower.includes("geeksforgeeks") || platformLower === "gfg";

              const externalUrl = pAny.problem_url || (isLeetCode ? `https://leetcode.com/problems/${slug}/` : null);

              const formattedTitle =
                pAny.title ||
                (problem.problem_id
                  ? problem.problem_id
                      .split(/[-_]/)
                      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                  : "Unknown Problem");

              const diff = pAny.difficulty || "Medium";
              const diffConfig = getDifficultyConfig(diff);

              return (
                <div
                  key={problem.problem_id}
                  className="p-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors flex flex-col gap-2.5"
                >
                  {/* Top: Checkbox, Bookmark, Title */}
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => isLoggedIn && onToggleSolved && onToggleSolved(pid, slug, e)}
                      disabled={!isLoggedIn}
                      className={`shrink-0 mt-0.5 focus:outline-none ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                    >
                      {isSolved ? (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                          <Check size={11} strokeWidth={3.5} />
                        </div>
                      ) : status === "revision" ? (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white shadow-sm">
                          <Check size={11} strokeWidth={3.5} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 text-transparent hover:border-emerald-500">
                          <Check size={9} strokeWidth={3.5} />
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => isLoggedIn && onToggleBookmark && onToggleBookmark(pid, slug, e)}
                      disabled={!isLoggedIn}
                      className={`shrink-0 mt-0.5 focus:outline-none ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Bookmark
                        size={15}
                        className={isBookmarked ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-650"}
                      />
                    </button>

                    <a
                      href={externalUrl || `#`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[13px] font-semibold leading-snug flex-1 transition-colors ${
                        isSolved
                          ? "text-gray-400 dark:text-gray-500 font-normal italic"
                          : "text-gray-900 dark:text-gray-100 hover:text-brand-500"
                      }`}
                    >
                      {formattedTitle}
                    </a>
                  </div>

                  {/* Bottom: Difficulty badge + Solve on LeetCode button + crackDSA Notes */}
                  <div className="flex items-center justify-between gap-2 pl-[52px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border uppercase ${diffConfig.bg} ${diffConfig.color}`}
                    >
                      {diffConfig.icon}
                      {diff}
                    </span>

                    <div className="flex items-center gap-2">
                      {externalUrl && (
                        <a
                          href={externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-all shadow-2xs active:scale-95"
                        >
                          {isLeetCode ? (
                            <Image
                              src="/logos/leetcode.png"
                              alt="LeetCode"
                              width={13}
                              height={13}
                              className="w-3.5 h-3.5 object-contain shrink-0"
                            />
                          ) : isCodeforces ? (
                            <Image
                              src="/logos/codeforces.svg"
                              alt="Codeforces"
                              width={13}
                              height={13}
                              className="w-3.5 h-3.5 object-contain shrink-0"
                            />
                          ) : isCodechef ? (
                            <Image
                              src="/logos/codechef.png"
                              alt="CodeChef"
                              width={13}
                              height={13}
                              className="w-3.5 h-3.5 object-contain shrink-0"
                            />
                          ) : (
                            <ExternalLink size={11} className="shrink-0" />
                          )}
                          <span>{isLeetCode ? "Solve on LeetCode" : `Solve on ${isGfg ? "GFG" : pAny.platform || "Platform"}`}</span>
                          <ExternalLink size={10} className="opacity-70 shrink-0" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => window.open(`/problem/${slug}`, '_blank')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/60 transition-colors shrink-0"
                        title="View crackDSA Notes & Editorial"
                      >
                        <span>Notes / Editorial</span>
                        <ChevronRight size={12} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
