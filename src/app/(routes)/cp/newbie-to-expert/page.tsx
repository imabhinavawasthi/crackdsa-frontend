"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Home,
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  CircleDot, 
  Search, 
  X, 
  Code2, 
  Sparkles, 
  Trophy, 
  Check, 
  FileText,
  BarChart2,
  Play,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Layers,
  ArrowRight
} from "lucide-react";
import { fetchNewbieToExpertSheet, ExpertProblem } from "@/api/cp";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";
import { getProblemTopics, ALL_AVAILABLE_TAGS } from "@/config/cp-tags";
import ErrorState from "@/components/common/ErrorState";

interface RatingBand {
  id: string;
  label: string;
  title: string;
  min: number;
  max: number;
}

const RATING_BANDS: RatingBand[] = [
  { id: "all", label: "All Problems", title: "All Problems", min: 0, max: 9999 },
  { id: "800-1000", label: "800 - 1000", title: "Division 1: Newbie (800 - 1000)", min: 800, max: 1000 },
  { id: "1100-1200", label: "1100 - 1200", title: "Division 2: Pupil (1100 - 1200)", min: 1100, max: 1200 },
  { id: "1300-1400", label: "1300 - 1400", title: "Division 3: Specialist (1300 - 1400)", min: 1300, max: 1400 },
  { id: "1500-1600", label: "1500 - 1600", title: "Division 4: Candidate Master (1500 - 1600)", min: 1500, max: 1600 },
  { id: "1600+", label: "1600+", title: "Division 5: Expert (1600+)", min: 1600, max: 9999 },
];

export default function NewbieToExpertPage() {
  const [problems, setProblems] = useState<ExpertProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedBand, setSelectedBand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "rating-asc" | "rating-desc" | "name">("default");
  const [viewMode, setViewMode] = useState<"table" | "sections">("table");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // User asset states keyed by asset_id (e.g. "cp:<problem_id>")
  const [assetStates, setAssetStates] = useState<
    Record<string, { status: "pending" | "done" | "revision"; is_bookmarked: boolean }>
  >({});

  // Active status / actions dropdown tracking
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch CP Sheet data
        const sheetData = await fetchNewbieToExpertSheet();
        if (isMounted) {
          setProblems(sheetData.problems || []);
        }

        // 2. Fetch User Asset States from remote API
        try {
          const remoteStates = await fetchUserAssetStates();
          if (isMounted && remoteStates && remoteStates.length > 0) {
            const mapped: Record<
              string,
              { status: "pending" | "done" | "revision"; is_bookmarked: boolean }
            > = {};
            remoteStates.forEach((st) => {
              if (st.asset_id && st.asset_id.startsWith("cp:")) {
                mapped[st.asset_id] = {
                  status: st.status || "pending",
                  is_bookmarked: Boolean(st.is_bookmarked),
                };
              }
            });
            setAssetStates(mapped);
          }
        } catch (authErr) {
          // If not logged in, fallback to local storage
          if (typeof window !== "undefined") {
            const local = localStorage.getItem("crackdsa_cp_sheet_states");
            if (local) {
              try {
                setAssetStates(JSON.parse(local));
              } catch {}
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to load CP sheet:", err);
        if (isMounted) {
          setError(err.message || "Failed to load Newbie to Expert CP Sheet.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Helper to get state for a problem
  const getProblemState = (problemId: string) => {
    const key = `cp:${problemId}`;
    return assetStates[key] || { status: "pending", is_bookmarked: false };
  };

  // Update status with "cp:<id>" identifier
  const handleStatusChange = async (
    problemId: string,
    newStatus: "pending" | "done" | "revision"
  ) => {
    const key = `cp:${problemId}`;
    const current = getProblemState(problemId);
    const updated = { ...current, status: newStatus };

    setAssetStates((prev) => {
      const next = { ...prev, [key]: updated };
      if (typeof window !== "undefined") {
        localStorage.setItem("crackdsa_cp_sheet_states", JSON.stringify(next));
      }
      return next;
    });
    setOpenStatusMenu(null);

    try {
      await updateUserAssetState("problem", key, {
        status: newStatus,
        is_bookmarked: current.is_bookmarked,
      });
      showToast(newStatus === "done" ? "Marked as Solved! 🎉" : newStatus === "revision" ? "Moved to In Progress" : "Marked as Pending");
    } catch (err) {
      console.warn("Failed to persist asset state remotely, kept locally:", err);
    }
  };

  // Toggle bookmark with "cp:<id>" identifier
  const handleToggleBookmark = async (problemId: string) => {
    const key = `cp:${problemId}`;
    const current = getProblemState(problemId);
    const updated = { ...current, is_bookmarked: !current.is_bookmarked };

    setAssetStates((prev) => {
      const next = { ...prev, [key]: updated };
      if (typeof window !== "undefined") {
        localStorage.setItem("crackdsa_cp_sheet_states", JSON.stringify(next));
      }
      return next;
    });

    try {
      await updateUserAssetState("problem", key, {
        status: current.status,
        is_bookmarked: updated.is_bookmarked,
      });
      showToast(updated.is_bookmarked ? "Problem bookmarked 🔖" : "Bookmark removed");
    } catch (err) {
      console.warn("Failed to persist bookmark remotely, kept locally:", err);
    }
  };

  // Difficulty Tier calculation
  const getDifficultyTier = (rating: number): "Easy" | "Medium" | "Hard" => {
    if (rating <= 1000) return "Easy";
    if (rating <= 1300) return "Medium";
    return "Hard";
  };

  const getDifficultyBadge = (tier: "Easy" | "Medium" | "Hard") => {
    switch (tier) {
      case "Easy":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60";
      case "Medium":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60";
      case "Hard":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60";
    }
  };

  // Filtered & Sorted problems
  const filteredProblems = useMemo(() => {
    const selectedBandObj = RATING_BANDS.find((b) => b.id === selectedBand) || RATING_BANDS[0];

    let result = problems.filter((p) => {
      // 1. Rating band tab filter
      if (p.difficulty < selectedBandObj.min || p.difficulty > selectedBandObj.max) {
        return false;
      }

      // 2. Status filter
      const st = getProblemState(p.id);
      if (statusFilter === "done" && st.status !== "done") return false;
      if (statusFilter === "revision" && st.status !== "revision") return false;
      if (statusFilter === "pending" && st.status !== "pending") return false;
      if (statusFilter === "bookmarked" && !st.is_bookmarked) return false;

      // 3. Difficulty filter (Easy / Medium / Hard)
      if (difficultyFilter !== "all") {
        const tier = getDifficultyTier(p.difficulty);
        if (tier.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
      }

      // 4. Tag filter
      if (tagFilter !== "all") {
        const topics = getProblemTopics(p.problem_name, p.difficulty);
        if (!topics.some((t) => t.toLowerCase() === tagFilter.toLowerCase())) return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.problem_name.toLowerCase().includes(q);
        const matchesRating = String(p.difficulty).includes(q);
        const matchesTag = getProblemTopics(p.problem_name, p.difficulty).some((t) =>
          t.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesRating && !matchesTag) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "rating-asc") {
      result.sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.difficulty - a.difficulty);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.problem_name.localeCompare(b.problem_name));
    }

    return result;
  }, [
    problems,
    selectedBand,
    statusFilter,
    tagFilter,
    difficultyFilter,
    searchQuery,
    sortBy,
    assetStates,
  ]);

  // Overall Stats
  const totalCount = problems.length;
  const solvedCount = useMemo(() => {
    return problems.filter((p) => getProblemState(p.id).status === "done").length;
  }, [problems, assetStates]);

  const inProgressCount = useMemo(() => {
    return problems.filter((p) => getProblemState(p.id).status === "revision").length;
  }, [problems, assetStates]);

  const bookmarkedCount = useMemo(() => {
    return problems.filter((p) => getProblemState(p.id).is_bookmarked).length;
  }, [problems, assetStates]);

  const remainingCount = Math.max(0, totalCount - solvedCount);
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Pagination calculation
  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBand, statusFilter, tagFilter, difficultyFilter, searchQuery, pageSize]);

  const resetAllFilters = () => {
    setSelectedBand("all");
    setStatusFilter("all");
    setTagFilter("all");
    setDifficultyFilter("all");
    setSearchQuery("");
    setSortBy("default");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse select-none">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      </div>
    );
  }

  if (error || problems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ErrorState
          title="CP Sheet Not Found"
          message={error || "Could not load the Newbie to Expert CP Sheet."}
          backLink="/dsa-sheet"
          backLabel="Back to DSA Sheets"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-3 flex items-center gap-2">
          <Sparkles size={13} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        <Link
          href="/"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <Home size={13} />
        </Link>
        <span>&gt;</span>
        <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
          CP Sheet
        </span>
        <span>&gt;</span>
        <span className="text-gray-900 dark:text-white font-bold">
          Newbie to Expert CP Sheet
        </span>
      </nav>

      {/* 2. Hero Header + Your Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Title, Description, and Feature Chips */}
        <div className="lg:col-span-7 space-y-3.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Newbie to Expert CP Sheet
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            Hand-picked competitive programming problems with video editorials, coded solutions, and structured progression from beginner to expert.
          </p>

          {/* Feature Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 shadow-2xs">
              <FileText size={13} className="text-blue-600" />
              <span>175 Problems</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700 shadow-2xs">
              <BarChart2 size={13} className="text-indigo-500" />
              <span>5 Difficulty Levels</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700 shadow-2xs">
              <Trophy size={13} className="text-amber-500" />
              <span>Curated Carefully</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 shadow-2xs">
              <Play size={12} fill="currentColor" className="text-blue-600" />
              <span>Video Editorials</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700 shadow-2xs">
              <Code2 size={13} className="text-emerald-500" />
              <span>C++ Solutions</span>
            </span>
          </div>
        </div>

        {/* Right: Your Progress Card matching mockup */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Your Progress
            </h3>
            <Link
              href="/progress"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View Analytics</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
              <div className="w-full mr-3 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="shrink-0 text-gray-900 dark:text-white font-mono">
                {solvedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* 4 Stat Boxes in a row */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            {/* 1. Solved */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} />
                <span>{solvedCount}</span>
              </div>
              <p className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                Solved
              </p>
            </div>

            {/* 2. In Progress */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <RotateCcw size={13} />
                <span>{inProgressCount}</span>
              </div>
              <p className="text-[10px] font-semibold text-amber-700/80 dark:text-amber-300/80">
                In Progress
              </p>
            </div>

            {/* 3. Bookmarked */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                <Bookmark size={13} className="fill-orange-500 text-orange-500" />
                <span>{bookmarkedCount}</span>
              </div>
              <p className="text-[10px] font-semibold text-orange-700/80 dark:text-orange-300/80">
                Bookmarked
              </p>
            </div>

            {/* 4. Remaining */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                <FileText size={13} />
                <span>{remainingCount}</span>
              </div>
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                Remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Rating Range Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {RATING_BANDS.map((band) => {
          const isActive = selectedBand === band.id;
          const countInBand = problems.filter(
            (p) => p.difficulty >= band.min && p.difficulty <= band.max
          ).length;

          return (
            <button
              key={band.id}
              type="button"
              onClick={() => setSelectedBand(band.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <span>{band.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {countInBand}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Filters & Search Bar matching mockup */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by name, rating (e.g. 1200), tags (e.g. dp, graphs)..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns + Reset */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="done">Solved</option>
              <option value="revision">In Progress</option>
              <option value="pending">Pending</option>
              <option value="bookmarked">Bookmarked</option>
            </select>

            {/* Tags Filter Dropdown */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              {ALL_AVAILABLE_TAGS.map((tag) => (
                <option key={tag} value={tag === "All Tags" ? "all" : tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Difficulty Filter Dropdown */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Reset Button */}
            <button
              type="button"
              onClick={resetAllFilters}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 5. Problems Section Header & Table */}
      <div className="rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Problems
            </h2>
            <span className="text-xs font-bold text-gray-400">
              ({filteredProblems.length})
            </span>
          </div>

          {/* Right Toolbar: Sort & View Toggle */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="name">Problem Name (A-Z)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
                title="Table View"
              >
                <LayoutList size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("sections")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "sections"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
                title="Four Sections View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No problems match your current filter criteria.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/40 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Problem</th>
                  <th className="py-3.5 px-4 w-24 text-center">Rating</th>
                  <th className="py-3.5 px-4 w-28 text-center">Difficulty</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Topics</th>
                  <th className="py-3.5 px-4 w-32 text-center">Status</th>
                  <th className="py-3.5 px-4 w-28 text-center">Editorial</th>
                  <th className="py-3.5 px-4 w-32 text-center">Solution</th>
                  <th className="py-3.5 px-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                {paginatedProblems.map((prob, idx) => {
                  const state = getProblemState(prob.id);
                  const tier = getDifficultyTier(prob.difficulty);
                  const topics = getProblemTopics(prob.problem_name, prob.difficulty);
                  const isStatusOpen = openStatusMenu === prob.id;
                  const isActionOpen = openActionMenu === prob.id;
                  const serialIndex = (currentPage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={prob.id}
                      className="group hover:bg-gray-50/70 dark:hover:bg-gray-850/50 transition-colors"
                    >
                      {/* # Number */}
                      <td className="py-3.5 px-4 text-center font-bold text-gray-400 dark:text-gray-500">
                        {serialIndex}
                      </td>

                      {/* Problem Name & CF Link */}
                      <td className="py-3.5 px-4">
                        <a
                          href={prob.problem_link || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                          title="Open problem on Codeforces"
                        >
                          <span>{prob.problem_name}</span>
                          <ExternalLink
                            size={11}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
                          />
                        </a>
                      </td>

                      {/* Codeforces Numeric Rating */}
                      <td className="py-3.5 px-4 text-center align-middle font-mono font-bold text-gray-700 dark:text-gray-300">
                        {prob.difficulty}
                      </td>

                      {/* Difficulty Badge (Easy / Medium / Hard) */}
                      <td className="py-3.5 px-4 text-center align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold ${getDifficultyBadge(
                            tier
                          )}`}
                        >
                          {tier}
                        </span>
                      </td>

                      {/* Topics Chips */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {topics.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTagFilter(t)}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Status Dropdown Pill */}
                      <td className="py-3.5 px-4 text-center align-middle">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenStatusMenu(isStatusOpen ? null : prob.id)
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                              state.status === "done"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : state.status === "revision"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {state.status === "done" && (
                              <CheckCircle2 size={12} className="text-emerald-500" />
                            )}
                            {state.status === "revision" && (
                              <RotateCcw size={12} className="text-amber-500" />
                            )}
                            {state.status === "pending" && (
                              <CircleDot size={12} className="text-gray-400" />
                            )}
                            <span>
                              {state.status === "done"
                                ? "Solved"
                                : state.status === "revision"
                                ? "In Progress"
                                : "Pending"}
                            </span>
                            <ChevronDown size={10} className="opacity-60" />
                          </button>

                          {/* Status Options Menu */}
                          {isStatusOpen && (
                            <div className="absolute left-0 mt-1 w-36 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-30 p-1 space-y-0.5 text-xs animate-in fade-in-50 zoom-in-95">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(prob.id, "done")}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  <CheckCircle2 size={12} /> Solved
                                </span>
                                {state.status === "done" && <Check size={11} />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(prob.id, "revision")}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  <RotateCcw size={12} /> In Progress
                                </span>
                                {state.status === "revision" && <Check size={11} />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(prob.id, "pending")}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  <CircleDot size={12} /> Pending
                                </span>
                                {state.status === "pending" && <Check size={11} />}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Editorial: [▶ Watch] Blue button that redirects directly to YouTube */}
                      <td className="py-3.5 px-4 text-center align-middle">
                        {prob.video_link ? (
                          <a
                            href={prob.video_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                            title="Watch Video Editorial on YouTube"
                          >
                            <Play size={11} fill="currentColor" />
                            <span>Watch</span>
                          </a>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-700 text-xs">-</span>
                        )}
                      </td>

                      {/* Solution: [</> View Code] Light blue button opening submission */}
                      <td className="py-3.5 px-4 text-center align-middle">
                        {prob.code_link ? (
                          <a
                            href={prob.code_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 border border-blue-200/50 dark:border-blue-900/50 transition-colors"
                            title="View Verified Code Submission"
                          >
                            <Code2 size={12} />
                            <span>View Code</span>
                          </a>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-700 text-xs">-</span>
                        )}
                      </td>

                      {/* Actions: Bookmark & More */}
                      <td className="py-3.5 px-4 text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          {/* Bookmark */}
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(prob.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              state.is_bookmarked
                                ? "text-orange-500 hover:text-orange-600"
                                : "text-gray-300 dark:text-gray-600 hover:text-gray-500"
                            }`}
                            title={state.is_bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                          >
                            <Bookmark
                              size={15}
                              className={state.is_bookmarked ? "fill-orange-500" : ""}
                            />
                          </button>

                          {/* More Options Dropdown */}
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenActionMenu(isActionOpen ? null : prob.id)
                              }
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                              <MoreHorizontal size={15} />
                            </button>

                            {isActionOpen && (
                              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-30 p-1 text-xs animate-in fade-in-50 zoom-in-95">
                                <a
                                  href={prob.problem_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                                >
                                  <ExternalLink size={12} />
                                  <span>Solve on Codeforces</span>
                                </a>

                                {prob.video_link && (
                                  <a
                                    href={prob.video_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                                  >
                                    <Play size={12} />
                                    <span>Watch on YouTube</span>
                                  </a>
                                )}

                                {prob.code_link && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(prob.code_link);
                                      setOpenActionMenu(null);
                                      showToast("Code link copied!");
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium cursor-pointer"
                                  >
                                    <Copy size={12} />
                                    <span>Copy Solution Link</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Pagination Bar matching mockup */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredProblems.length)} of{" "}
              {filteredProblems.length} problems
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-1">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-200 focus:outline-hidden cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Pagination Number Pills */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
