"use client";

import React, { useState } from "react";
import { Code2, HelpCircle, Video, FileText } from "lucide-react";
import ProblemNotes from "./ProblemNotes";
import {
  ProblemDetail,
  ProblemViewerProps,
} from "@/types/practice";
import ErrorState from "@/components/common/ErrorState";
import ProblemStatement from "./ProblemStatement";
import ProblemSolutions from "./ProblemSolutions";
import StatusSelector from "./StatusSelector";
import BookmarkButton from "./BookmarkButton";
import ProblemEditorial from "./ProblemEditorial";

type TabId = "statement" | "solutions" | "editorial" | "notes";

const TABS: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: "statement",  label: "Problem",   shortLabel: "Problem",  icon: <HelpCircle size={14} /> },
  { id: "solutions",  label: "Solution",  shortLabel: "Solution", icon: <Code2 size={14} /> },
  { id: "editorial",  label: "Editorial", shortLabel: "Editorial",icon: <Video size={14} /> },
  { id: "notes",      label: "Notes",     shortLabel: "Notes",    icon: <FileText size={14} /> },
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
        code: problemData.solutions?.cpp?.code || (typeof problemData.solutions?.cpp === "string" ? problemData.solutions.cpp : "") || "// C++ Solution is not provided",
        timeComplexity: problemData.solutions?.cpp?.time_complexity || problemData.solutions?.cpp?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.cpp?.space_complexity || problemData.solutions?.cpp?.spaceComplexity || "",
        explanation: problemData.solutions?.cpp?.explanation || ""
      },
      python: {
        code: problemData.solutions?.python?.code || (typeof problemData.solutions?.python === "string" ? problemData.solutions.python : "") || "# Python Solution is not provided",
        timeComplexity: problemData.solutions?.python?.time_complexity || problemData.solutions?.python?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.python?.space_complexity || problemData.solutions?.python?.spaceComplexity || "",
        explanation: problemData.solutions?.python?.explanation || ""
      },
      java: {
        code: problemData.solutions?.java?.code || (typeof problemData.solutions?.java === "string" ? problemData.solutions.java : "") || "// Java Solution is not provided",
        timeComplexity: problemData.solutions?.java?.time_complexity || problemData.solutions?.java?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.java?.space_complexity || problemData.solutions?.java?.spaceComplexity || "",
        explanation: problemData.solutions?.java?.explanation || ""
      },
      javascript: {
        code: problemData.solutions?.javascript?.code || (typeof problemData.solutions?.javascript === "string" ? problemData.solutions.javascript : "") || "// JavaScript Solution is not provided",
        timeComplexity: problemData.solutions?.javascript?.time_complexity || problemData.solutions?.javascript?.timeComplexity || "",
        spaceComplexity: problemData.solutions?.javascript?.space_complexity || problemData.solutions?.javascript?.spaceComplexity || "",
        explanation: problemData.solutions?.javascript?.explanation || ""
      }
    },
    companyTags: problemData.attributes?.company_tags || problemData.attributes?.companyTags || [],
    topicTags: problemData.attributes?.tags || problemData.attributes?.topicTags || [],
    hints: problemData.attributes?.hints || []
  };

  return (
    <div className="w-full flex flex-col select-none">

      {/* ── Sticky Tab Bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 md:px-8 pt-4 pb-4 sm:pt-5">
        {/* Tabs + Actions row */}
        <div className="flex items-center justify-between gap-3">

          {/* Tab triggers */}
          <div className="flex items-center gap-0.5 min-w-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`problem-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2.5 text-[11px] sm:text-xs font-bold
                    rounded-t-xl border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${isActive
                      ? "border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }
                  `}
                  aria-selected={isActive}
                >
                  <span className={isActive ? "text-brand-500" : "text-gray-400"}>{tab.icon}</span>
                  <span className="hidden xs:inline sm:inline">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Progress Controls */}
          <div className="flex items-center gap-2 shrink-0">
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

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
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

    </div>
  );
};

export default ProblemViewer;
