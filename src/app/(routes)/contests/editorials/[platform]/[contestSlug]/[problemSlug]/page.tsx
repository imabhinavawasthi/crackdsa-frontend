"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Play, 
  FileText, 
  Code2, 
  CheckCircle2, 
  Clock, 
  Share2, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  HelpCircle
} from "lucide-react";
import { fetchContestProblemEditorial, ContestProblemEditorialResponse } from "@/api/contests";
import { PlatformLogo } from "@/components/contests/PlatformLogo";
import ErrorState from "@/components/common/ErrorState";

function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match1 = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match1) return `https://www.youtube.com/embed/${match1[1]}`;
  const match2 = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (match2) return `https://www.youtube.com/embed/${match2[1]}`;
  return null;
}

export default function ContestProblemPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params?.platform as string;
  const contestSlug = params?.contestSlug as string;
  const problemSlug = params?.problemSlug as string;

  const [data, setData] = useState<ContestProblemEditorialResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"statement" | "editorial">("editorial");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProblem = async () => {
      if (!platform || !contestSlug || !problemSlug) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetchContestProblemEditorial(platform, contestSlug, problemSlug);
        if (isMounted) {
          setData(res);
        }
      } catch (err: any) {
        console.error("Failed to load problem editorial:", err);
        if (isMounted) {
          setError(err.message || "Failed to load editorial for this problem.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProblem();

    return () => {
      isMounted = false;
    };
  }, [platform, contestSlug, problemSlug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse select-none">
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="lg:col-span-4 h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ErrorState
          title="Problem Editorial Not Found"
          message={error || "We could not find the requested contest problem."}
          backLink={`/contests/editorials/${platform}/${contestSlug}`}
          backLabel="Back to Contest Overview"
        />
      </div>
    );
  }

  const { contest, problem, prev_problem, next_problem, siblings } = data;
  const platformTitle = contest.platform.charAt(0).toUpperCase() + contest.platform.slice(1);
  const embedUrl = getYouTubeEmbedUrl(problem.video_editorial);
  const diffLabel = problem.difficulty_label || "Medium";

  const diffConfig = {
    Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  }[diffLabel] || "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 select-none">
      {/* 1. Breadcrumbs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
        <nav className="flex items-center gap-1.5 flex-wrap">
          <Link
            href="/contests/editorials"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contest Editorials
          </Link>
          <span>&gt;</span>
          <span className="capitalize">{platformTitle}</span>
          <span>&gt;</span>
          <Link
            href={`/contests/editorials/${platform}/${contestSlug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[200px]"
          >
            {contest.contest}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[240px]">
            {problem.problem_name}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Share2 size={12} />
            <span>{copied ? "Copied Link!" : "Share"}</span>
          </button>

          <Link
            href={`/contests/editorials/${platform}/${contestSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>All Problems</span>
          </Link>
        </div>
      </div>

      {/* 2. Sibling Problems Fast Carousel Bar */}
      <div className="p-2 sm:p-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 shadow-2xs overflow-x-auto hide-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 shrink-0">
          Contest Problems:
        </span>
        {siblings.map((sib) => {
          const isActive = sib.slug_url === problem.slug_url;
          return (
            <Link
              key={sib.id}
              href={`/contests/editorials/${platform}/${contestSlug}/${encodeURIComponent(sib.slug_url)}`}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="truncate max-w-[220px]">
                {sib.problem_name}
              </span>
              {sib.has_editorial && (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-white" : "bg-emerald-500"}`} />
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Hero Header for Current Problem */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {problem.problem_name}
              </h1>

              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${diffConfig}`}>
                {diffLabel}
              </span>

              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {platformTitle}
              </span>
            </div>

            {/* Topic Tags */}
            {problem.topic_tags && problem.topic_tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {problem.topic_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg text-[10.5px] font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {problem.problem_link && (
              <a
                href={problem.problem_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
              >
                <span>Solve on {platformTitle}</span>
                <ExternalLink size={13} />
              </a>
            )}

            {problem.solution_link && (
              <a
                href={problem.solution_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 transition-colors"
              >
                <Code2 size={13} />
                <span>Verified Solution Code</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 4. Split-Screen Layout: Video & Editorial (Left) and Problem Statement (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video Player & Written Editorial (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Player */}
          {embedUrl ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-md">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Video Editorial Walkthrough
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-gray-400">
                  {platformTitle} Editorial
                </span>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title={`${problem.problem_name} Editorial`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center space-y-2">
              <Clock size={28} className="mx-auto text-amber-500 opacity-60" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Video Editorial In Preparation</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Our mentors are preparing the video solution for this problem. In the meantime, you can review the statement and problem link.
              </p>
            </div>
          )}

          {/* Written Editorial Section */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <FileText size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Editorial Explanation &amp; Approach
              </h2>
            </div>

            {problem.editorial ? (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: problem.editorial }}
              />
            ) : (
              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Watch the video above for the full intuitive breakdown, mathematical logic, and edge-case proofs.
                </p>
                {problem.solution_link && (
                  <div className="pt-2">
                    <a
                      href={problem.solution_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>Inspect Official Accepted Submission Code</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Problem Statement & Navigation (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Problem Statement Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-blue-500" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Problem Statement
                </h3>
              </div>

              {problem.problem_link && (
                <a
                  href={problem.problem_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Platform Page</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>

            {problem.problem_description ? (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-xs overflow-x-auto max-h-[600px] overflow-y-auto pr-1"
                dangerouslySetInnerHTML={{ __html: problem.problem_description }}
              />
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs space-y-2">
                <HelpCircle size={24} className="mx-auto opacity-50" />
                <p>Full problem description is hosted directly on {platformTitle}.</p>
                {problem.problem_link && (
                  <a
                    href={problem.problem_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                  >
                    Open Problem on {platformTitle} ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contest Context Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 shadow-2xs text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white">Contest Details</h4>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Contest:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{contest.contest}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Platform:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{platformTitle}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Date:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{contest.date || "Recent"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation: Previous & Next Problem */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        {prev_problem ? (
          <Link
            href={`/contests/editorials/${platform}/${contestSlug}/${encodeURIComponent(prev_problem.slug_url)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs"
          >
            <ChevronLeft size={14} />
            <span className="truncate max-w-[240px]">Previous: {prev_problem.problem_name}</span>
          </Link>
        ) : (
          <div />
        )}

        {next_problem ? (
          <Link
            href={`/contests/editorials/${platform}/${contestSlug}/${encodeURIComponent(next_problem.slug_url)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs"
          >
            <span className="truncate max-w-[240px]">Next: {next_problem.problem_name}</span>
            <ChevronRight size={14} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
