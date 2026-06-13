"use client";

import React, { useMemo, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { DSASheet, Problem, Topic, DetailedProblem } from "@/types/dsa-sheet";
import { TopicSection } from "./TopicSection";
import { SheetHeaderCard } from "./SheetHeaderCard";
import { SheetProgressSection } from "./SheetProgressSection";
import { SheetToolbar } from "./SheetToolbar";
import { motion } from "framer-motion";

interface SheetContentViewProps {
  sheet: DSASheet;
  sheetProblems?: DetailedProblem[];
  userProblemStates?: Record<string, string>;
  bookmarkedProblemIds?: string[];
  isLoggedIn?: boolean;
  onToggleSolved?: (id: string, slug: string, e: React.MouseEvent) => void;
  onToggleBookmark?: (id: string, slug: string, e: React.MouseEvent) => void;
}

export const SheetContentView: React.FC<SheetContentViewProps> = ({
  sheet,
  sheetProblems = [],
  userProblemStates = {},
  bookmarkedProblemIds = [],
  isLoggedIn = false,
  onToggleSolved,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const [expandToggleKey, setExpandToggleKey] = useState(0);

  const topics = useMemo(() => sheet.sheet_json?.topics || [], [sheet.sheet_json]);

  // Calculate Progress and Next Problem
  const progressStats = useMemo(() => {
    let totalProblems = 0;
    let solvedCount = 0;
    let firstPendingProblem: any = null;
    let firstPendingTopicIndex: number = 0;
    let foundPending = false;

    topics.forEach((topic, tIndex) => {
      topic.steps.forEach((step) => {
        step.problems.forEach((problem) => {
          totalProblems++;
          const status = userProblemStates[problem.problem_id];
          if (status === "done") {
            solvedCount++;
          } else if (!foundPending) {
            firstPendingProblem = problem;
            firstPendingTopicIndex = tIndex;
            foundPending = true;
          }
        });
      });
    });

    return { totalProblems, solvedCount, firstPendingProblem, firstPendingTopicIndex };
  }, [topics, userProblemStates]);

  const { totalProblems, solvedCount, firstPendingProblem, firstPendingTopicIndex } = progressStats;
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
  
  // Details for the next problem
  const nextProblemDetailed = useMemo(() => {
    if (!firstPendingProblem) return null;
    return sheetProblems.find(p => p.slug === firstPendingProblem.problem_id) || null;
  }, [firstPendingProblem, sheetProblems]);

  // Filter topics by search
  const filteredTopics: Topic[] = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics
      .map((topic) => {
        const matchedSteps = topic.steps
          .map((step) => {
            const matchedProblems = step.problems.filter((p) => {
              const title =
                p.title ||
                p.problem_id
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
              return (
                title.toLowerCase().includes(q) ||
                p.problem_id.toLowerCase().includes(q)
              );
            });
            if (
              step.title.toLowerCase().includes(q) ||
              step.pattern_id.toLowerCase().includes(q)
            ) {
              return step; // include full step if step title matches
            }
            if (matchedProblems.length > 0) {
              return { ...step, problems: matchedProblems };
            }
            return null;
          })
          .filter(Boolean) as typeof topic.steps;

        if (topic.title.toLowerCase().includes(q)) {
          return topic; // include full topic if topic title matches
        }
        if (matchedSteps.length > 0) {
          return { ...topic, steps: matchedSteps };
        }
        return null;
      })
      .filter(Boolean) as Topic[];
  }, [topics, searchQuery]);

  const handleExpandAll = useCallback(() => {
    setExpandAll((prev) => !prev);
    setExpandToggleKey((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full pb-16">
      {/* Hero Banner & Progress Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <SheetHeaderCard 
          sheet={sheet} 
          totalProblems={totalProblems} 
          totalTopics={topics.length} 
        >
          <SheetProgressSection
            totalProblems={totalProblems}
            solvedCount={solvedCount}
            progressPercentage={progressPercentage}
            firstPendingProblem={firstPendingProblem}
            nextProblemDetailed={nextProblemDetailed}
          />
        </SheetHeaderCard>
      </motion.div>

      <SheetToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandAll={expandAll}
        handleExpandAll={handleExpandAll}
        filteredTopicsLength={filteredTopics.length}
      />

      {/* Topics list */}
      <div className="flex flex-col gap-3">
        {filteredTopics.map((topic, index) => (
          <TopicSection
            key={topic.id}
            topic={topic}
            index={index}
            forceExpand={expandAll}
            defaultExpanded={index === firstPendingTopicIndex}
            expandToggleKey={expandToggleKey}
            isSearching={!!searchQuery}
            userProblemStates={userProblemStates}
            sheetProblems={sheetProblems}
            bookmarkedProblemIds={bookmarkedProblemIds}
            isLoggedIn={isLoggedIn}
            onToggleSolved={onToggleSolved}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredTopics.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <BookOpen
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No topics available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This sheet doesn&apos;t have any topics yet.
          </p>
        </div>
      )}
    </div>
  );
};
