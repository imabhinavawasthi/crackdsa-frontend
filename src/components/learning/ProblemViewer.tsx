"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  HelpCircle,
  Video,
  FileText,
  ExternalLink,
  Tag,
  Building2,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Share2,
} from "lucide-react";
import ProblemNotes from "./ProblemNotes";
import { ProblemDetail, ProblemViewerProps } from "@/types/practice";
import ErrorState from "@/components/common/ErrorState";
import ProblemStatement from "./ProblemStatement";
import ProblemSolutions from "./ProblemSolutions";
import StatusSelector from "./StatusSelector";
import BookmarkButton from "./BookmarkButton";
import ProblemEditorial from "./ProblemEditorial";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import TagPill from "@/components/ui/TagPill";
import { formatTag, slugify } from "@/utils/string";

type TabId = "statement" | "solutions" | "editorial" | "notes";

const TABS: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: "statement", label: "Problem Statement", shortLabel: "Problem", icon: <FileText size={15} /> },
  { id: "solutions", label: "Multi-Language Solutions", shortLabel: "Solutions", icon: <Code2 size={15} /> },
  { id: "editorial", label: "Editorial & Video", shortLabel: "Editorial", icon: <Video size={15} /> },
  { id: "notes", label: "My Notes", shortLabel: "Notes", icon: <FileText size={15} /> },
];

const ProblemViewer: React.FC<ProblemViewerProps> = ({ slug, problemData, onStateChange }) => {
  const [activeTab, setActiveTab] = useState<TabId>("statement");

  if (!problemData) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <ErrorState
          title="Practice Problem Not Found"
          message="The specifications for this coding problem are not available in the database. Check your syllabus details or try again."
          icon={HelpCircle}
        />
      </div>
    );
  }

  const problem: ProblemDetail = {
    title: problemData.title || "Untitled Problem",
    difficulty: (problemData.difficulty || "Medium") as "Easy" | "Medium" | "Hard",
    platform: problemData.platform || "Internal",
    problemUrl: problemData.problem_url || problemData.problemUrl || "",
    description: problemData.description || "",
    solutions: {
      cpp: {
        code:
          problemData.solutions?.cpp?.code ||
          (typeof problemData.solutions?.cpp === "string" ? problemData.solutions.cpp : "") ||
          "// C++ Solution is not provided",
        timeComplexity:
          problemData.solutions?.cpp?.time_complexity || problemData.solutions?.cpp?.timeComplexity || "",
        spaceComplexity:
          problemData.solutions?.cpp?.space_complexity || problemData.solutions?.cpp?.spaceComplexity || "",
        explanation: problemData.solutions?.cpp?.explanation || "",
      },
      python: {
        code:
          problemData.solutions?.python?.code ||
          (typeof problemData.solutions?.python === "string" ? problemData.solutions.python : "") ||
          "# Python Solution is not provided",
        timeComplexity:
          problemData.solutions?.python?.time_complexity || problemData.solutions?.python?.timeComplexity || "",
        spaceComplexity:
          problemData.solutions?.python?.space_complexity || problemData.solutions?.python?.spaceComplexity || "",
        explanation: problemData.solutions?.python?.explanation || "",
      },
      java: {
        code:
          problemData.solutions?.java?.code ||
          (typeof problemData.solutions?.java === "string" ? problemData.solutions.java : "") ||
          "// Java Solution is not provided",
        timeComplexity:
          problemData.solutions?.java?.time_complexity || problemData.solutions?.java?.timeComplexity || "",
        spaceComplexity:
          problemData.solutions?.java?.space_complexity || problemData.solutions?.java?.spaceComplexity || "",
        explanation: problemData.solutions?.java?.explanation || "",
      },
      javascript: {
        code:
          problemData.solutions?.javascript?.code ||
          (typeof problemData.solutions?.javascript === "string" ? problemData.solutions.javascript : "") ||
          "// JavaScript Solution is not provided",
        timeComplexity:
          problemData.solutions?.javascript?.time_complexity || problemData.solutions?.javascript?.timeComplexity || "",
        spaceComplexity:
          problemData.solutions?.javascript?.space_complexity || problemData.solutions?.javascript?.spaceComplexity || "",
        explanation: problemData.solutions?.javascript?.explanation || "",
      },
    },
    companyTags: problemData.attributes?.company_tags || problemData.attributes?.companyTags || [],
    topicTags: problemData.attributes?.tags || problemData.attributes?.topicTags || [],
    hints: problemData.attributes?.hints || [],
  };

  const platformLower = (problem.platform || "").toLowerCase();
  const isLeetCode = platformLower.includes("leetcode") || !problem.platform || platformLower === "internal";
  const externalUrl =
    problem.problemUrl ||
    (isLeetCode ? `https://leetcode.com/problems/${slug}/` : null);

  return (
    <div className="w-full flex flex-col">
      {/* ── Sticky Modern Tab Header ───────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 md:px-8 py-3 select-none">
        <div className="flex items-center justify-between gap-3">
          {/* Tab triggers */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`problem-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 text-xs font-bold
                    rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${
                      isActive
                        ? "bg-brand-500 text-white shadow-xs shadow-brand-500/20"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/60"
                    }
                  `}
                  aria-selected={isActive}
                >
                  <span className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Header Controls (Always accessible) */}
          <div className="flex items-center gap-2 shrink-0">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-all shadow-2xs"
                title="Solve on External Platform"
              >
                {isLeetCode ? (
                  <Image
                    src="/logos/leetcode.png"
                    alt="LeetCode"
                    width={13}
                    height={13}
                    className="w-3.5 h-3.5 object-contain"
                  />
                ) : (
                  <ExternalLink size={13} />
                )}
                <span>Solve</span>
              </a>
            )}

            <StatusSelector
              assetId={problemData.id}
              assetType="problem"
              onStateChange={onStateChange}
            />
            <BookmarkButton
              assetId={problemData.id}
              assetType="problem"
              onStateChange={onStateChange}
            />
          </div>
        </div>
      </div>

      {/* ── Main Content Area with Desktop Sidebar ─────────────────────────── */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Column: Tab Content */}
          <div className="lg:col-span-8 xl:col-span-8 min-w-0">
            {activeTab === "statement" && (
              <ProblemStatement problem={problem} slug={slug} />
            )}
            {activeTab === "solutions" && (
              <ProblemSolutions solutions={problem.solutions} />
            )}
            {activeTab === "editorial" && (
              <ProblemEditorial
                videoIds={problemData?.resources?.video_lectures}
                articles={problemData?.resources?.related_articles}
              />
            )}
            {activeTab === "notes" && (
              <ProblemNotes
                slug={slug}
                itemId={problemData.id}
                onStateChange={onStateChange}
              />
            )}
          </div>

          {/* Desktop Right Sidebar (Sticky) */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col gap-5 sticky top-20">
            {/* 1. Solve on LeetCode Card */}
            {externalUrl && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                    {isLeetCode ? (
                      <Image
                        src="/logos/leetcode.png"
                        alt="LeetCode"
                        width={18}
                        height={18}
                        className="w-4 h-4 object-contain"
                      />
                    ) : (
                      <ExternalLink size={16} className="text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Ready to code?
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Solve live on {isLeetCode ? "LeetCode" : "external editor"}
                    </p>
                  </div>
                </div>

                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-98 transition-all shadow-md shadow-amber-500/20"
                >
                  {isLeetCode && (
                    <Image
                      src="/logos/leetcode.png"
                      alt="LeetCode"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 object-contain"
                    />
                  )}
                  <span>Solve on {isLeetCode ? "LeetCode" : "Platform"}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}

            {/* 2. Metadata & Quick Stats Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Problem Specifications
              </h4>

              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                  <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Platform</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 uppercase text-[11px]">
                    {problem.platform || "LeetCode"}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Target Time</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {problem.difficulty === "Easy"
                      ? "10–15 mins"
                      : problem.difficulty === "Hard"
                      ? "30–45 mins"
                      : "20–25 mins"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Company Tags Card */}
            {problem.companyTags && problem.companyTags.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Building2 size={13} className="text-violet-500" />
                  <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Asked in Interviews
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {problem.companyTags.map((tag) => (
                    <TagPill
                      key={tag}
                      label={formatTag(tag)}
                      href={`/practice/companies/${slugify(tag)}`}
                      variant="company"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 4. Topic Tags Card */}
            {problem.topicTags && problem.topicTags.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-brand-500" />
                  <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Related Concepts
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {problem.topicTags.map((tag) => (
                    <TagPill
                      key={tag}
                      label={formatTag(tag)}
                      href={`/practice/topics/${slugify(tag)}`}
                      variant="topic"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemViewer;
