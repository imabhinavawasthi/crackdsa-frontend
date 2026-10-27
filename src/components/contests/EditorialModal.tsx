"use client";

import React, { useState } from "react";
import { X, ExternalLink, Play, FileText, Code2, CheckCircle2, Clock } from "lucide-react";
import { ContestProblem } from "@/types/contest";

interface EditorialModalProps {
  problem: ContestProblem | null;
  contestSlug?: string;
  onClose: () => void;
}

function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  // Handle youtu.be/ID or youtube.com/watch?v=ID
  const match1 = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match1) return `https://www.youtube.com/embed/${match1[1]}`;
  const match2 = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (match2) return `https://www.youtube.com/embed/${match2[1]}`;
  return null;
}

export function EditorialModal({ problem, contestSlug, onClose }: EditorialModalProps) {
  const [activeTab, setActiveTab] = useState<"video" | "editorial" | "description">("video");

  if (!problem) return null;

  const embedUrl = getYouTubeEmbedUrl(problem.video_editorial);
  const diffLabel = problem.difficulty_label || "Medium";
  const diffConfig = {
    Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  }[diffLabel] || "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";

  const fullProblemUrl = contestSlug && problem.slug_url
    ? `/contests/editorials/${encodeURIComponent(problem.platform)}/${encodeURIComponent(contestSlug)}/${encodeURIComponent(problem.slug_url)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                {problem.problem_name}
              </h2>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${diffConfig}`}>
                {diffLabel}
              </span>
            </div>

            {/* Topic tags */}
            {problem.topic_tags && problem.topic_tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {problem.topic_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {fullProblemUrl && (
              <a
                href={fullProblemUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 transition-colors"
                title="Open Dedicated Problem Page"
              >
                <FileText size={12} />
                <span className="hidden sm:inline">Problem Page</span>
              </a>
            )}

            {problem.problem_link && (
              <a
                href={problem.problem_link}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <span>Solve Online</span>
                <ExternalLink size={12} />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 text-xs font-bold bg-gray-50/50 dark:bg-gray-950/30">
          {embedUrl && (
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === "video"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Play size={14} /> Video Editorial
            </button>
          )}

          {problem.editorial && (
            <button
              type="button"
              onClick={() => setActiveTab("editorial")}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === "editorial"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <FileText size={14} /> Written Editorial
            </button>
          )}

          {problem.problem_description && (
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === "description"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Code2 size={14} /> Problem Statement
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Video Player Tab */}
          {activeTab === "video" && embedUrl && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={embedUrl}
                  title={`${problem.problem_name} Editorial`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {problem.solution_link && (
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Verified Solution Code Available
                    </span>
                  </div>
                  <a
                    href={problem.solution_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Submission <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 2. Written Editorial Tab */}
          {activeTab === "editorial" && (
            <div className="space-y-4">
              {problem.editorial ? (
                <div 
                  className="problem-description prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: problem.editorial }}
                />
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <Clock size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Written editorial is being prepared for this problem.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. Problem Statement Tab */}
          {activeTab === "description" && (
            <div className="space-y-4">
              {problem.problem_description ? (
                <div 
                  className="problem-description prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: problem.problem_description }}
                />
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-xs">No description text provided. Please solve directly on the platform.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-950">
          <div className="text-gray-400">
            Contest: <span className="font-semibold text-gray-700 dark:text-gray-300">{problem.contest || "N/A"}</span>
          </div>
          {problem.problem_link && (
            <a
              href={problem.problem_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Solve Problem</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
