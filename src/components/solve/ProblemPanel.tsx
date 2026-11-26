"use client";

import React, { useState } from "react";
import {
  FileText,
  BookOpen,
  FlaskConical,
  History,
  Maximize2,
  Minimize2,
  Check,
  Tag,
  Lock,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Code2,
} from "lucide-react";
import { ProblemSolveData } from "./solveProblemsData";

interface ProblemPanelProps {
  problem: ProblemSolveData;
  activeTab: "description" | "editorial" | "solutions" | "submissions";
  onTabChange: (tab: "description" | "editorial" | "solutions" | "submissions") => void;
  submissionsList?: Array<{
    id: string;
    status: "Accepted" | "Wrong Answer" | "Runtime Error";
    runtime: string;
    memory: string;
    language: string;
    timestamp: string;
  }>;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  activeTab,
  onTabChange,
  submissionsList = [],
}) => {
  const [showTopics, setShowTopics] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const [expandedHints, setExpandedHints] = useState<Record<number, boolean>>({});
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleHint = (idx: number) => {
    setExpandedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="h-full flex flex-col bg-[#262626] rounded-xl border border-[#333333] overflow-hidden text-neutral-200 shadow-xl">
      {/* Top Tab Bar */}
      <div className="h-10 bg-[#212121] border-b border-[#333333] flex items-center justify-between px-2 shrink-0 select-none">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onTabChange("description")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "description"
                ? "bg-[#2e2e2e] text-white shadow-2xs font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]"
            }`}
          >
            <FileText size={13} className="text-blue-400" />
            <span>Description</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("editorial")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "editorial"
                ? "bg-[#2e2e2e] text-white shadow-2xs font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]"
            }`}
          >
            <BookOpen size={13} className="text-amber-400" />
            <span>Editorial</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("solutions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "solutions"
                ? "bg-[#2e2e2e] text-white shadow-2xs font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]"
            }`}
          >
            <FlaskConical size={13} className="text-purple-400" />
            <span>Solutions</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("submissions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "submissions"
                ? "bg-[#2e2e2e] text-white shadow-2xs font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]"
            }`}
          >
            <History size={13} className="text-emerald-400" />
            <span>Submissions</span>
          </button>
        </div>

        {/* Right Tab Tools */}
        <div className="flex items-center gap-1 text-neutral-400">
          <button
            type="button"
            className="p-1 hover:text-white hover:bg-[#2e2e2e] rounded"
            title="Full Screen Panel"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar text-[13px] leading-relaxed">
        {activeTab === "description" && (
          <div className="space-y-5 pb-8">
            {/* Title & Solved Badge */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {problem.title}
              </h1>
              {problem.isSolved && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold shrink-0 pt-1">
                  <span>Solved</span>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>

            {/* Badges Row: Difficulty + Topics + Companies + Hint */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Difficulty badge */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : problem.difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {problem.difficulty}
              </span>

              {/* Topics dropdown toggle */}
              <button
                type="button"
                onClick={() => setShowTopics(!showTopics)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                  showTopics
                    ? "bg-[#333333] text-white border-neutral-600"
                    : "bg-[#2e2e2e] text-neutral-300 border-[#3e3e3e] hover:bg-[#383838]"
                }`}
              >
                <Tag size={11} />
                <span>Topics</span>
                <ChevronDown size={12} className={`transition-transform ${showTopics ? "rotate-180" : ""}`} />
              </button>

              {/* Companies dropdown toggle */}
              <button
                type="button"
                onClick={() => setShowCompanies(!showCompanies)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                  showCompanies
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-[#2e2e2e] text-amber-400 border-[#3e3e3e] hover:bg-[#383838]"
                }`}
              >
                <Lock size={11} />
                <span>Companies</span>
                <ChevronDown size={12} className={`transition-transform ${showCompanies ? "rotate-180" : ""}`} />
              </button>

              {/* Hint badge */}
              {problem.hints && problem.hints.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleHint(0)}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2e2e2e] hover:bg-[#383838] text-neutral-300 border border-[#3e3e3e] transition-colors"
                >
                  <Lightbulb size={11} className="text-yellow-400" />
                  <span>Hint</span>
                </button>
              )}
            </div>

            {/* Revealed Topics */}
            {showTopics && (
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#1f1f1f] rounded-lg border border-[#333333] animate-in fade-in">
                {problem.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-[#2e2e2e] text-neutral-300 text-xs hover:text-white transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Revealed Companies */}
            {showCompanies && (
              <div className="p-2.5 bg-[#1f1f1f] rounded-lg border border-[#333333] space-y-1.5 animate-in fade-in">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                  Frequently Asked By:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {problem.companies.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Problem Statement */}
            <div className="space-y-3 text-neutral-300 text-[13px] leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: problem.description.statement
                    .replace(/\n\n/g, "<br/><br/>")
                    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[#333333] text-amber-300 rounded text-xs font-mono">$1</code>')
                    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
                    .replace(/\*\*([^*]+)\*\*/g, "<strong class='text-white'>$1</strong>"),
                }}
              />
            </div>

            {/* Examples */}
            <div className="space-y-4 pt-2">
              {problem.description.examples.map((ex, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="font-bold text-white text-[13px]">
                    Example {idx + 1}:
                  </span>
                  <div className="bg-[#1f1f1f] p-3 rounded-xl border border-[#333333] font-mono text-xs space-y-1.5 text-neutral-300">
                    <div>
                      <span className="text-neutral-500 select-none">Input: </span>
                      <span className="text-neutral-100">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 select-none">Output: </span>
                      <span className="text-neutral-100">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-neutral-400 font-sans text-xs pt-1 border-t border-[#2e2e2e]">
                        <span className="font-semibold text-neutral-300">Explanation: </span>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            {problem.description.constraints.length > 0 && (
              <div className="space-y-2 pt-3">
                <span className="font-bold text-white text-[13px]">Constraints:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400">
                  {problem.description.constraints.map((c, i) => (
                    <li key={i}>
                      <code className="px-1.5 py-0.5 bg-[#1f1f1f] text-neutral-200 rounded font-mono border border-[#333333]">
                        {c}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints collapsible */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="space-y-2 pt-3">
                {problem.hints.map((hint, i) => (
                  <div key={i} className="border border-[#333333] rounded-lg overflow-hidden bg-[#1f1f1f]">
                    <button
                      type="button"
                      onClick={() => toggleHint(i)}
                      className="w-full px-3 py-2 text-left flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb size={13} className="text-yellow-400" />
                        <span>Hint {i + 1}</span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`transition-transform text-neutral-500 ${
                          expandedHints[i] ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expandedHints[i] && (
                      <div className="p-3 text-xs text-neutral-300 bg-[#262626] border-t border-[#333333] leading-relaxed">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editorial Tab */}
        {activeTab === "editorial" && (
          <div className="space-y-6 pb-8">
            <div>
              <h2 className="text-lg font-bold text-white">Editorial & Approach</h2>
              <p className="text-xs text-neutral-400 mt-1">{problem.editorial.summary}</p>
            </div>

            <div className="space-y-5">
              {problem.editorial.approaches.map((appr, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#1f1f1f] rounded-xl border border-[#333333] space-y-3"
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-white text-sm">{appr.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#2e2e2e] text-amber-400">
                        Time: {appr.timeComplexity}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#2e2e2e] text-blue-400">
                        Space: {appr.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300">{appr.intuition}</p>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase">
                      Algorithm:
                    </span>
                    <ol className="list-decimal list-inside text-xs text-neutral-300 space-y-0.5">
                      {appr.algorithm.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-2">
                    <pre className="p-3 bg-[#171717] rounded-lg border border-[#2e2e2e] text-xs font-mono text-emerald-400 overflow-x-auto">
                      <code>{appr.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {activeTab === "solutions" && (
          <div className="space-y-4 pb-8">
            <h2 className="text-base font-bold text-white">Community & Official Solutions</h2>
            {problem.solutions.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No external solutions submitted yet. Check the Editorial tab for official optimal solutions!
              </div>
            ) : (
              problem.solutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#1f1f1f] rounded-xl border border-[#333333] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={sol.avatar}
                        alt={sol.author}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-neutral-200">
                        {sol.author}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">👍 {sol.votes}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white hover:text-amber-400 transition-colors">
                    {sol.title}
                  </h4>
                  <div className="flex gap-1">
                    {sol.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2e2e2e] text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <pre className="p-2.5 bg-[#171717] rounded-lg text-xs font-mono text-neutral-300 overflow-x-auto">
                    <code>{sol.code}</code>
                  </pre>
                </div>
              ))
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-3 pb-8">
            <h2 className="text-base font-bold text-white">Submission History</h2>
            {submissionsList.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs space-y-2">
                <History size={28} className="mx-auto opacity-30" />
                <p>No submissions recorded yet for this session.</p>
                <p className="text-[11px] text-neutral-600">Click &ldquo;Submit&rdquo; in the top bar to record your solution attempt!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#333333] border border-[#333333] rounded-xl overflow-hidden bg-[#1f1f1f]">
                {submissionsList.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 flex items-center justify-between text-xs hover:bg-[#282828] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-bold ${
                          sub.status === "Accepted"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {sub.status}
                      </span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-400 font-mono">{sub.runtime}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-400 font-mono">{sub.memory}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#2e2e2e] text-neutral-300 uppercase">
                        {sub.language}
                      </span>
                      <span>{sub.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar: Likes, Dislikes, Comments, Online count */}
      <div className="h-10 bg-[#212121] border-t border-[#333333] px-3 flex items-center justify-between text-xs text-neutral-400 select-none shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like */}
          <button
            type="button"
            onClick={() => setLiked(liked === true ? null : true)}
            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2e2e2e] transition-colors ${
              liked === true ? "text-amber-400" : "hover:text-white"
            }`}
          >
            <ThumbsUp size={13} className={liked === true ? "fill-amber-400" : ""} />
            <span>{problem.likes}</span>
          </button>

          {/* Dislike */}
          <button
            type="button"
            onClick={() => setLiked(liked === false ? null : false)}
            className={`p-1 rounded hover:bg-[#2e2e2e] transition-colors ${
              liked === false ? "text-rose-400" : "hover:text-white"
            }`}
          >
            <ThumbsDown size={13} className={liked === false ? "fill-rose-400" : ""} />
          </button>

          <span className="text-neutral-600">|</span>

          {/* Comments */}
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2e2e2e] hover:text-white transition-colors"
          >
            <MessageSquare size={13} />
            <span>{problem.commentsCount}</span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-1 rounded hover:bg-[#2e2e2e] transition-colors ${
              isBookmarked ? "text-amber-400" : "hover:text-white"
            }`}
            title="Bookmark"
          >
            <Bookmark size={13} className={isBookmarked ? "fill-amber-400" : ""} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="p-1 rounded hover:bg-[#2e2e2e] hover:text-white transition-colors"
            title="Share Link"
          >
            <Share2 size={13} />
          </button>
        </div>

        {/* Online Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{problem.onlineCount} Online</span>
        </div>
      </div>
    </div>
  );
};
