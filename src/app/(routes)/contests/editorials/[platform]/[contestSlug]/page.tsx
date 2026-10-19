"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Layers, 
  Play, 
  FileText, 
  ChevronRight,
  Search,
  Filter,
  X,
  Sparkles,
  Tag,
  CheckCircle2
} from "lucide-react";
import { ContestDetail, ContestProblem } from "@/types/contest";
import { fetchContestDetail } from "@/api/contests";
import { PlatformLogo } from "@/components/contests/PlatformLogo";
import { EditorialModal } from "@/components/contests/EditorialModal";
import ErrorState from "@/components/common/ErrorState";

export default function ContestDetailPage() {
  const params = useParams();
  const platform = params?.platform as string;
  const contestSlug = params?.contestSlug as string;

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Selected Problem for Editorial Modal
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadContest = async () => {
      if (!platform || !contestSlug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchContestDetail(platform, contestSlug);
        if (isMounted) {
          setContest(data);
        }
      } catch (err: any) {
        console.error("Failed to load contest detail:", err);
        if (isMounted) {
          setError(err.message || "Failed to load contest details.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContest();

    return () => {
      isMounted = false;
    };
  }, [platform, contestSlug]);

  // Extract all unique topic tags with counts
  const topicTagCounts = useMemo(() => {
    if (!contest?.problems) return {};
    const counts: Record<string, number> = {};
    contest.problems.forEach((p) => {
      (p.topic_tags || []).forEach((tag) => {
        const t = tag.trim();
        if (t) {
          counts[t] = (counts[t] || 0) + 1;
        }
      });
    });
    return counts;
  }, [contest]);

  const uniqueTopicTags = useMemo(() => {
    return Object.keys(topicTagCounts).sort((a, b) => {
      // Sort by frequency descending, then alphabetically
      const diff = topicTagCounts[b] - topicTagCounts[a];
      return diff !== 0 ? diff : a.localeCompare(b);
    });
  }, [topicTagCounts]);

  // Filter problems based on search, topic, and difficulty
  const filteredProblems = useMemo(() => {
    if (!contest?.problems) return [];
    return contest.problems.filter((p) => {
      // 1. Search Query filter (matches name or any tag)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.problem_name.toLowerCase().includes(q);
        const matchesTags = (p.topic_tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTags) return false;
      }

      // 2. Topic tag filter
      if (selectedTopic !== "all") {
        const matchesTopic = (p.topic_tags || []).some(
          (t) => t.toLowerCase() === selectedTopic.toLowerCase()
        );
        if (!matchesTopic) return false;
      }

      // 3. Difficulty filter
      if (selectedDifficulty !== "all") {
        const diff = (p.difficulty_label || "Medium").toLowerCase();
        if (diff !== selectedDifficulty.toLowerCase()) return false;
      }

      return true;
    });
  }, [contest, searchQuery, selectedTopic, selectedDifficulty]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedTopic !== "all" || selectedDifficulty !== "all"
  );

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
    setSelectedDifficulty("all");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-pulse select-none">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ErrorState
          title="Contest Not Found"
          message={error || "The requested contest was not found in our database."}
          backLink="/contests/editorials"
          backLabel="Back to Contest Editorials"
        />
      </div>
    );
  }

  const platformTitle = contest.platform.charAt(0).toUpperCase() + contest.platform.slice(1);

  // Difficulty badge stylings
  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
      case "Hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
    }
  };

  const totalVideos = contest.problems.filter((p) => Boolean(p.video_editorial)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 select-none">
      {/* 1. Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        <Link
          href="/contests/editorials"
          className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Contest Editorials</span>
        </Link>
        <span>&gt;</span>
        <span className="text-gray-700 dark:text-gray-300 font-semibold">{platformTitle}</span>
        <span>&gt;</span>
        <span className="text-gray-900 dark:text-white font-bold truncate max-w-xs sm:max-w-md">
          {contest.contest}
        </span>
      </nav>

      {/* 2. Contest Header Banner */}
      <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <PlatformLogo platform={contest.platform} size={44} />

            <div className="space-y-1.5 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                {contest.contest}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
                  {platformTitle}
                </span>

                {contest.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{contest.date}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5">
                  <Layers size={13} className="text-gray-400" />
                  <span>{contest.total_problems} problems</span>
                </span>

                {totalVideos > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20">
                    <Play size={10} fill="currentColor" />
                    <span>{totalVideos} Video Solutions</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA: Visit Official Contest */}
          {contest.contest_url && (
            <a
              href={contest.contest_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
            >
              <span>Visit Official Contest</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by problem name or topic tag..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Topic Tag Filter */}
            <div className="relative flex items-center gap-1.5">
              <Tag size={13} className="text-gray-400" />
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                <option value="all">All Topics ({contest.problems.length})</option>
                {uniqueTopicTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag} ({topicTagCounts[tag]})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
              >
                <X size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick topic tags pills bar */}
        {uniqueTopicTags.length > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto hide-scrollbar text-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Popular Tags:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTopic("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedTopic === "all"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              All ({contest.problems.length})
            </button>
            {uniqueTopicTags.slice(0, 8).map((tag) => {
              const isActive = selectedTopic.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTopic(isActive ? "all" : tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-2xs font-bold"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  #{tag} ({topicTagCounts[tag]})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Problems List / Table (NO problem number column as requested) */}
      <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Round Problems
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {filteredProblems.length}
            </span>
          </div>

          <span className="text-xs text-gray-400 font-medium">
            Showing {filteredProblems.length} of {contest.problems.length} problems
          </span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No problems match your current filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/40 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5 min-w-[240px]">Problem</th>
                  <th className="py-3.5 px-4 w-32">Difficulty</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Topic Tags</th>
                  <th className="py-3.5 px-5 text-right min-w-[280px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                {filteredProblems.map((prob) => {
                  const hasVideo = Boolean(prob.video_editorial);
                  const problemPageUrl = `/contests/editorials/${encodeURIComponent(
                    platform
                  )}/${encodeURIComponent(contestSlug)}/${encodeURIComponent(prob.slug_url)}`;

                  return (
                    <tr
                      key={prob.id}
                      className="group hover:bg-gray-50/70 dark:hover:bg-gray-850/50 transition-colors"
                    >
                      {/* 1. Problem Title */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <Link
                            href={problemPageUrl}
                            className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block"
                          >
                            {prob.problem_name}
                          </Link>
                          {prob.solution_link && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 size={11} /> Verified Solution
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Difficulty */}
                      <td className="py-4 px-4 align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${getDifficultyBadge(
                            prob.difficulty_label
                          )}`}
                        >
                          {prob.difficulty_label || "Medium"}
                        </span>
                      </td>

                      {/* 3. Topic Tags (Clickable to filter) */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(prob.topic_tags || []).length > 0 ? (
                            (prob.topic_tags || []).map((tag) => {
                              const isTagActive = selectedTopic.toLowerCase() === tag.toLowerCase();
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => setSelectedTopic(tag)}
                                  title={`Filter by #${tag}`}
                                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
                                    isTagActive
                                      ? "bg-blue-600 text-white font-bold"
                                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  #{tag}
                                </button>
                              );
                            })
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* 4. Actions: Watch Editorial + Solve Online (External Link) + Problem Page */}
                      <td className="py-4 px-5 align-middle text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* 1. Watch Editorial Button */}
                          {hasVideo && (
                            <button
                              type="button"
                              onClick={() => setSelectedProblem(prob)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-500/20 transition-all cursor-pointer shadow-2xs"
                              title="Watch Video Editorial"
                            >
                              <Play size={12} fill="currentColor" />
                              <span>Watch Editorial</span>
                            </button>
                          )}

                          {/* 2. Solve Online External Link */}
                          {prob.problem_link && (
                            <a
                              href={prob.problem_link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 transition-colors inline-flex items-center gap-1"
                              title={`Solve on ${platformTitle}`}
                            >
                              <ExternalLink size={13} />
                              <span className="hidden sm:inline">Solve Online</span>
                            </a>
                          )}

                          {/* 3. Dedicated Problem Page Button */}
                          <Link
                            href={problemPageUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs active:scale-95"
                            title="Open Problem Statement &amp; Full Editorial"
                          >
                            <FileText size={12} />
                            <span>View Problem</span>
                            <ChevronRight size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Editorial Modal (for quick video preview) */}
      <EditorialModal
        problem={selectedProblem}
        contestSlug={contestSlug}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
}
