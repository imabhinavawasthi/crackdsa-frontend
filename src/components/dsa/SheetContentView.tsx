"use client";

import React, { useMemo, useState, useCallback } from "react";
import { DSASheet, Problem, Topic } from "@/types/dsa-sheet";
import { TopicSection } from "./TopicSection";
import {
  PlayCircle,
  Search,
  Clock,
  BookOpen,
  Layers,
  Code2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SheetContentViewProps {
  sheet: DSASheet;
}

export const SheetContentView: React.FC<SheetContentViewProps> = ({
  sheet,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const [expandToggleKey, setExpandToggleKey] = useState(0);

  const topics = sheet.sheet_json?.topics || [];

  // Compute stats
  const totalTopics = topics.length;
  const totalSteps = topics.reduce(
    (acc, t) => acc + (t.steps?.length || 0),
    0
  );
  const totalProblems = topics.reduce(
    (acc, t) =>
      acc +
      (t.steps?.reduce(
        (acc2, s) => acc2 + (s.problems?.length || 0),
        0
      ) || 0),
    0
  );

  // First problem for CTA
  const firstProblem: Problem | null = useMemo(() => {
    for (const topic of topics) {
      for (const step of topic.steps) {
        if (step.problems && step.problems.length > 0) {
          return step.problems[0];
        }
      }
    }
    return null;
  }, [topics]);

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

  const levelColors: Record<string, string> = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    intermediate:
      "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
    advanced:
      "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  };

  return (
    <div className="w-full pb-16">
      {/* Hero Banner — breaks out of parent padding for edge-to-edge feel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-6 overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 dark:from-brand-700 dark:via-brand-600 dark:to-brand-500"
      >
        {/* Decorative mesh */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.04]" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/[0.04]" />

        <div className="relative z-10 px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left: Title + description */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {sheet.level && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                    {sheet.level}
                  </span>
                )}
                {sheet.tags &&
                  sheet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">
                {sheet.title || "DSA Learning Sheet"}
              </h1>
              <p className="text-white/60 text-sm max-w-lg truncate">
                {sheet.description ||
                  "A structured roadmap guiding you step-by-step through essential DSA patterns."}
              </p>

              {/* Topics & Patterns overview */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {topics.map((t) => (
                  <span key={t.id} className="px-2 py-0.5 rounded bg-white/15 text-[10px] font-semibold text-white/90 tracking-wide">
                    {t.title}
                  </span>
                ))}
                <span className="text-white/30 mx-1">|</span>
                {Array.from(new Set(topics.flatMap((t) => t.steps.map((s) => s.pattern_id)))).map((pid) => (
                  <span key={pid} className="px-2 py-0.5 rounded bg-white/8 text-[10px] font-medium text-white/60 tracking-wide border border-white/10">
                    {pid.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Stats + CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-1 text-white/50 text-xs">
                <BookOpen size={13} />
                <span className="font-semibold text-white/90">{totalTopics}</span> topics
                <span className="mx-1">·</span>
                <Layers size={13} />
                <span className="font-semibold text-white/90">{totalSteps}</span> steps
                <span className="mx-1">·</span>
                <Code2 size={13} />
                <span className="font-semibold text-white/90">{totalProblems}</span> problems
                {sheet.estimated_hours && (
                  <>
                    <span className="mx-1">·</span>
                    <Clock size={13} />
                    <span className="font-semibold text-white/90">~{sheet.estimated_hours}h</span>
                  </>
                )}
              </div>

              {firstProblem && (
                <a
                  href={`/practice/${firstProblem.problem_id}`}
                  className="flex items-center gap-2 bg-white text-brand-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-white/90 transition-colors shadow-md"
                >
                  <PlayCircle size={16} />
                  Start Learning
                </a>
              )}
            </div>
          </div>

          {/* Mobile stats */}
          <div className="flex md:hidden items-center gap-3 mt-4 text-[11px] text-white/50">
            <span><span className="font-semibold text-white/90">{totalTopics}</span> Topics</span>
            <span>·</span>
            <span><span className="font-semibold text-white/90">{totalSteps}</span> Steps</span>
            <span>·</span>
            <span><span className="font-semibold text-white/90">{totalProblems}</span> Problems</span>
            {sheet.estimated_hours && (
              <>
                <span>·</span>
                <span>~{sheet.estimated_hours}h</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Toolbar: Search + Expand All */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, patterns, or problems..."
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Expand/Collapse All */}
        <button
          onClick={handleExpandAll}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shrink-0"
        >
          <Layers size={14} />
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </motion.div>

      {/* Search results info */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTopics.length > 0 ? (
                <>
                  Found results in{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {filteredTopics.length}
                  </span>{" "}
                  topic{filteredTopics.length > 1 ? "s" : ""} for &quot;
                  <span className="font-semibold text-brand-600 dark:text-brand-400">
                    {searchQuery}
                  </span>
                  &quot;
                </>
              ) : (
                <>
                  No results for &quot;
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {searchQuery}
                  </span>
                  &quot;
                </>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topics list */}
      <div className="flex flex-col gap-3">
        {filteredTopics.map((topic, index) => (
          <TopicSection
            key={topic.id}
            topic={topic}
            index={index}
            forceExpand={expandAll}
            expandToggleKey={expandToggleKey}
            isSearching={!!searchQuery}
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
