"use client";

import React, { useState, useEffect } from "react";
import { Topic, DetailedProblem } from "@/types/dsa-sheet";
import { StepCard } from "./StepCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, CheckCircle2 } from "lucide-react";
import { TopicIcon } from "@/components/common/TopicIcon";

interface TopicSectionProps {
  topic: Topic;
  index: number;
  forceExpand?: boolean;
  defaultExpanded?: boolean;
  expandToggleKey?: number;
  isSearching?: boolean;
  userProblemStates?: Record<string, string>;
  sheetProblems?: DetailedProblem[];
  bookmarkedProblemIds?: string[];
  isLoggedIn?: boolean;
  onToggleSolved?: (id: string, slug: string, e: React.MouseEvent) => void;
  onToggleBookmark?: (id: string, slug: string, e: React.MouseEvent) => void;
}

// Color palette for different topic indices
const topicColors = [
  {
    bg: "bg-brand-100 dark:bg-brand-500/20",
    text: "text-brand-600 dark:text-brand-400",
    border: "border-brand-200 dark:border-brand-500/30",
    dot: "bg-brand-500",
  },
  {
    bg: "bg-success-100 dark:bg-success-500/20",
    text: "text-success-600 dark:text-success-400",
    border: "border-success-200 dark:border-success-500/30",
    dot: "bg-success-500",
  },
  {
    bg: "bg-warning-100 dark:bg-warning-500/20",
    text: "text-warning-600 dark:text-warning-400",
    border: "border-warning-200 dark:border-warning-500/30",
    dot: "bg-warning-500",
  },
  {
    bg: "bg-error-100 dark:bg-error-500/20",
    text: "text-error-600 dark:text-error-400",
    border: "border-error-200 dark:border-error-500/30",
    dot: "bg-error-500",
  },
  {
    bg: "bg-blue-light-100 dark:bg-blue-light-500/20",
    text: "text-blue-light-600 dark:text-blue-light-400",
    border: "border-blue-light-200 dark:border-blue-light-500/30",
    dot: "bg-blue-light-500",
  },
];

export const TopicSection: React.FC<TopicSectionProps> = ({
  topic,
  index,
  forceExpand,
  defaultExpanded,
  expandToggleKey,
  isSearching,
  userProblemStates,
  sheetProblems,
  bookmarkedProblemIds,
  isLoggedIn,
  onToggleSolved,
  onToggleBookmark,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? index === 0);
  const color = topicColors[index % topicColors.length];

  const totalProblems = topic.steps.reduce(
    (acc, s) => acc + (s.problems?.length || 0),
    0
  );

  const solvedProblemsCount = topic.steps.reduce((acc, step) => {
    return acc + step.problems.filter(p => userProblemStates?.[p.problem_id] === "done").length;
  }, 0);

  const isFullySolved = totalProblems > 0 && solvedProblemsCount === totalProblems;

  // Respond to forceExpand/forceCollapse toggle
  useEffect(() => {
    if (expandToggleKey !== undefined && expandToggleKey > 0) {
      setIsExpanded(!!forceExpand);
    }
  }, [expandToggleKey, forceExpand]);

  // Auto expand when searching
  useEffect(() => {
    if (isSearching) setIsExpanded(true);
  }, [isSearching]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl border bg-white dark:bg-gray-800/60 shadow-sm overflow-hidden transition-all duration-200 ${
        isExpanded
          ? `${color.border} shadow-md`
          : "border-gray-200 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/15"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`flex items-center justify-center h-9 w-9 rounded-lg ${color.bg} ${color.text} transition-colors`}
          >
            <TopicIcon topicName={topic.title} size={16} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                {topic.title}
              </h2>
              {isFullySolved && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 px-2 py-0.5 rounded-full border border-success-200/50 dark:border-success-500/20">
                  <CheckCircle2 size={10} strokeWidth={3} />
                  Solved
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {topic.steps.length} step{topic.steps.length !== 1 ? "s" : ""} ·{" "}
              {totalProblems} problem{totalProblems !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mini progress indicator placeholder */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            {topic.steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${color.dot} opacity-25`}
              />
            ))}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400 dark:text-gray-500"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
              <div className="border-t border-gray-100 dark:border-white/5 pt-4">
                {topic.steps.map((step, i) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={i}
                    isLast={i === topic.steps.length - 1}
                    colorDot={color.dot}
                    userProblemStates={userProblemStates}
                    sheetProblems={sheetProblems}
                    bookmarkedProblemIds={bookmarkedProblemIds}
                    isLoggedIn={isLoggedIn}
                    onToggleSolved={onToggleSolved}
                    onToggleBookmark={onToggleBookmark}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
