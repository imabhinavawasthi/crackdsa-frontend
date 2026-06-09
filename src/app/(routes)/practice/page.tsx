"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  SlidersHorizontal,
  Code2,
  Trophy,
  Target,
  Flame,
  Sparkles,
  Hash,
  Building2,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemViewer from "@/components/learning/ProblemViewer";
import { fetchProblems } from "@/api/problems";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";
import PageHeader from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatTag } from "@/utils/string";
import { CatalogFilters, ProblemsTable, ProgressDonutCard } from "@/components/practice/PracticeCatalog";
import { PracticeProblem } from "@/types/practice";

/* ─── Main Practice Page ──────────────────────────────────────────── */
/* ─── Main Practice Page ──────────────────────────────────────────── */
export default function PracticeProblemsPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solved status tracked in localStorage
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>([]);
  const [problemStatusMap, setProblemStatusMap] = useState<Record<string, "pending" | "done" | "revision">>({});

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedBookmark, setSelectedBookmark] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Slide-over Sheet State
  const [activeProblemSlug, setActiveProblemSlug] = useState<string | null>(null);
  const [activeProblemData, setActiveProblemData] = useState<any | null>(null);
  const [loadingProblemDetail, setLoadingProblemDetail] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch user states
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isLoggedIn) return;
      try {
        const data = await fetchUserAssetStates();
        const statusMap: Record<string, "pending" | "done" | "revision"> = {};
        const solvedIds: string[] = [];
        const bookmarkedIds: string[] = [];

        data.forEach((state: any) => {
          if (state.asset_type === "problem") {
            statusMap[state.asset_id] = state.status || "pending";
            if (state.status === "done") {
              solvedIds.push(state.asset_id);
            }
            if (state.is_bookmarked) {
              bookmarkedIds.push(state.asset_id);
            }
          }
        });

        setProblemStatusMap(statusMap);
        setSolvedProblemIds(solvedIds);
        setBookmarkedProblemIds(bookmarkedIds);
      } catch (err) {
        console.error("Error loading user progress:", err);
      }
    };

    fetchUserProgress();
  }, [isLoggedIn]);

  // Fetch problems list
  useEffect(() => {
    const getProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProblems();
        setProblems(data || []);
      } catch (err: any) {
        console.error("Error loading problems list:", err);
        setError(err.message || "Failed to load practice problems.");
      } finally {
        setLoading(false);
      }
    };

    getProblems();
  }, []);

  // Redirect to the dedicated problem page
  const handleOpenProblem = (slug: string) => {
    router.push(`/problem/${slug}`);
  };

  // Toggle solved state with DB upsert
  const handleToggleSolved = async (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const currentStatus = problemStatusMap[id] || "pending";
    let newStatus: "pending" | "done" | "revision" = "done";
    
    if (currentStatus === "done" || currentStatus === "revision") {
      newStatus = "pending";
    } else {
      newStatus = "done";
    }

    const newSolved = newStatus === "done"
      ? (solvedProblemIds.includes(id) ? solvedProblemIds : [...solvedProblemIds, id])
      : solvedProblemIds.filter(pid => pid !== id);

    // 1. Optimistic UI update
    setSolvedProblemIds(newSolved);
    setProblemStatusMap(prev => ({
      ...prev,
      [id]: newStatus
    }));

    // 2. Save to Backend API
    try {
      await updateUserAssetState("problem", id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update problem status in database:", err);
    }
  };

  // Toggle bookmarked state with DB upsert
  const handleToggleBookmark = async (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const isCurrentlyBookmarked = bookmarkedProblemIds.includes(id);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedProblemIds.filter(pid => pid !== id)
      : [...bookmarkedProblemIds, id];

    // 1. Optimistic UI update
    setBookmarkedProblemIds(newBookmarks);

    // 2. Save to Backend API
    try {
      await updateUserAssetState("problem", id, { is_bookmarked: !isCurrentlyBookmarked });
    } catch (err) {
      console.error("Failed to update bookmark state in database:", err);
    }
  };

  // Dynamic filter catalogs extracted from loaded problems
  const platformsList = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.platform) set.add(p.platform);
    });
    return Array.from(set).sort();
  }, [problems]);

  const tagsList = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.attributes?.tags) {
        p.attributes.tags.forEach(t => set.add(t));
      }
    });
    return Array.from(set).sort();
  }, [problems]);

  const companiesList = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.attributes?.company_tags) {
        p.attributes.company_tags.forEach(c => set.add(c));
      }
    });
    return Array.from(set).sort();
  }, [problems]);

  // Filter logic — multiselect for tags & companies
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchPlatform = selectedPlatform === "All" || p.platform === selectedPlatform;
      
      // Multiselect: problem must have ALL selected tags
      const matchTags = selectedTags.length === 0 || 
        selectedTags.every(tag => p.attributes?.tags?.includes(tag));
      
      // Multiselect: problem must have at least ONE selected company
      const matchCompanies = selectedCompanies.length === 0 ||
        selectedCompanies.some(company => p.attributes?.company_tags?.includes(company));

      const matchStatus = selectedStatus === "All" || (
        selectedStatus === "Pending" && (problemStatusMap[p.id] === "pending" || !problemStatusMap[p.id])
      ) || (
        selectedStatus === "Revision" && problemStatusMap[p.id] === "revision"
      ) || (
        selectedStatus === "Done" && problemStatusMap[p.id] === "done"
      );

      const matchBookmark = selectedBookmark === "All" || (
        selectedBookmark === "Bookmarked" && bookmarkedProblemIds.includes(p.id)
      );

      return matchSearch && matchDiff && matchPlatform && matchTags && matchCompanies && matchStatus && matchBookmark;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedPlatform, selectedTags, selectedCompanies, selectedStatus, selectedBookmark, problemStatusMap, bookmarkedProblemIds]);

  // Completion Stats
  const stats = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter(p => solvedProblemIds.includes(p.id)).length;
    
    const easyTotal = problems.filter(p => p.difficulty === "Easy").length;
    const easySolved = problems.filter(p => p.difficulty === "Easy" && solvedProblemIds.includes(p.id)).length;
    
    const mediumTotal = problems.filter(p => p.difficulty === "Medium").length;
    const mediumSolved = problems.filter(p => p.difficulty === "Medium" && solvedProblemIds.includes(p.id)).length;
    
    const hardTotal = problems.filter(p => p.difficulty === "Hard").length;
    const hardSolved = problems.filter(p => p.difficulty === "Hard" && solvedProblemIds.includes(p.id)).length;

    return {
      total, solved, percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      easyTotal, easySolved,
      mediumTotal, mediumSolved,
      hardTotal, hardSolved
    };
  }, [problems, solvedProblemIds]);

  const hasActiveFilters = !!searchQuery || 
                           selectedDifficulty !== "All" || 
                           selectedPlatform !== "All" || 
                           selectedTags.length > 0 || 
                           selectedCompanies.length > 0 ||
                           selectedStatus !== "All" ||
                           selectedBookmark !== "All";

  const tickerItems = useMemo(() => {
    const items: string[] = [];
    if (companiesList.length > 0) {
      companiesList.slice(0, 10).forEach(c => items.push(formatTag(c)));
    } else {
      items.push("Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Uber");
    }
    if (tagsList.length > 0) {
      tagsList.slice(0, 12).forEach(t => items.push(formatTag(t)));
    } else {
      items.push("Dynamic Programming", "Graphs", "Trees", "Recursion", "Arrays", "Binary Search", "Two Pointers");
    }
    return items;
  }, [companiesList, tagsList]);

  const headerSlides = useMemo(() => [
    {
      title: "SDE Prep Coding Sheets",
      description: "Curated collections of must-do problems to crack top product companies.",
      badge: "Featured Track",
      color: "brand" as const,
      icon: Sparkles,
      href: "/dsa-sheet",
    },
    {
      title: "Topic-wise Mastery",
      description: "Practice patterns systematically from Arrays to Dynamic Programming.",
      badge: "Practice Path",
      color: "violet" as const,
      icon: Target,
      href: "/practice/topics",
    },
    {
      title: "CrackDSA Community",
      description: "Connect with fellow learners, discuss approaches, and share experiences.",
      badge: "Discussion",
      color: "emerald" as const,
      icon: Trophy,
      href: "/community",
    },
  ], []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDifficulty, selectedPlatform, selectedTags, selectedCompanies, selectedStatus, selectedBookmark]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const paginatedProblems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("All");
    setSelectedPlatform("All");
    setSelectedTags([]);
    setSelectedCompanies([]);
    setSelectedStatus("All");
    setSelectedBookmark("All");
  };

  const getDifficultyConfig = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case "Easy": return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15", barColor: "bg-emerald-500", icon: <Target size={13} /> };
      case "Medium": return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/8 border-amber-500/15", barColor: "bg-amber-500", icon: <Flame size={13} /> };
      case "Hard": return { color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/8 border-rose-500/15", barColor: "bg-rose-500", icon: <Sparkles size={13} /> };
    }
  };

  const getPlatformConfig = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("leetcode")) {
      return "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-orange-400 border border-orange-500/15";
    }
    if (p.includes("geeksforgeeks") || p === "gfg") {
      return "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-teal-400 border border-teal-500/15";
    }
    if (p.includes("codeforces")) {
      return "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15";
    }
    if (p.includes("codechef")) {
      return "bg-gradient-to-r from-amber-700/10 to-yellow-600/10 text-amber-700 dark:text-amber-500 border border-amber-600/15";
    }
    return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800";
  };

  if (loading && problems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-8 space-y-6 select-none animate-in fade-in duration-300">
        {/* Hero Header Skeleton */}
        <div className="rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
            <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="w-full md:w-80 h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse shrink-0 border border-gray-200/40 dark:border-gray-800/40" />
        </div>

        {/* Filters and Progress Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 space-y-4">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-805 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-center py-1">
              <div className="w-20 h-20 rounded-full border-8 border-gray-100 dark:border-gray-800 animate-pulse flex items-center justify-center" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-900/60 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-900/60 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex justify-between bg-gray-50/50 dark:bg-gray-900/30">
            <div className="h-4 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-grow max-w-xs" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-900">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="p-4.5 flex items-center justify-between gap-4">
                <div className="h-4 w-8 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-100 dark:bg-gray-900 rounded animate-pulse flex-grow max-w-xs" />
                <div className="h-4 w-12 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 py-4 sm:py-8 select-none">
      
      {/* ───── 1. Hero Header ───── */}
      <div className="mb-6 sm:mb-8">
        <PageHeader
          badge="Practice Ground"
          badgeIcon={Code2}
          title={
            <>
              DSA {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                Problems
              </span>
            </>
          }
          subtitle="Solve curated problems across top platforms. Browse editorial solutions, track your progress, and prepare for interviews."
          accent="brand"
          rotatorItems={["Dynamic Programming", "Graph Algorithms", "Recursion & Backtracking", "Tree Traversals", "Greedy Approaches", "Bit Manipulation"]}
          rotatorPrefix="Master concepts like "
          rotatorSuffix=" to ace your coding interviews."
          tickerItems={tickerItems}
          tickerLabel="Target Companies & Core Topics:"
          slides={headerSlides}
        />
      </div>

      {/* ───── 2. Middle Controls Row (2-column layout) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        
        {/* Left Column: Filters (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <CatalogFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedBookmark={selectedBookmark}
            setSelectedBookmark={setSelectedBookmark}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            platformsList={platformsList}
            tagsList={tagsList}
            companiesList={companiesList}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetFilters}
          />
        </div>

        {/* Right Column: Progress Card (1/3 width on desktop) */}
        <div>
          <ProgressDonutCard stats={stats} />
        </div>

      </div>

      {/* ───── 4. Results Count ───── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-xs text-gray-400">
          Showing <span className="font-medium text-gray-600 dark:text-gray-300">{filteredProblems.length}</span> of {problems.length} problems
        </p>
      </div>

      {/* ───── 5. Problems Table ───── */}
      <ProblemsTable
        problems={paginatedProblems}
        solvedProblemIds={solvedProblemIds}
        bookmarkedProblemIds={bookmarkedProblemIds}
        problemStatusMap={problemStatusMap}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onToggleSolved={handleToggleSolved}
        onToggleBookmark={handleToggleBookmark}
        onOpenProblem={handleOpenProblem}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        error={error}
        isLoggedIn={isLoggedIn}
      />

      {/* ───── 6. Problem Slide-over Sheet ───── */}
      <AnimatePresence>
        {isSheetOpen && activeProblemSlug && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[68%] lg:w-[58%] xl:w-[52%] bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Code2 size={14} />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Problem Workspace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingProblemDetail ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={24} className="animate-spin text-brand-500" />
                    <p className="text-xs text-gray-400">Loading problem details...</p>
                  </div>
                ) : activeProblemData ? (
                  <div className="animate-in fade-in-50 duration-300">
                    <ProblemViewer 
                      slug={activeProblemData.slug} 
                      problemData={activeProblemData} 
                      onStateChange={(updates) => {
                        if (updates.status !== undefined) {
                          setProblemStatusMap(prev => ({ ...prev, [activeProblemData.id]: updates.status! }));
                          if (updates.status === "done") {
                            setSolvedProblemIds(prev => prev.includes(activeProblemData.id) ? prev : [...prev, activeProblemData.id]);
                          } else {
                            setSolvedProblemIds(prev => prev.filter(id => id !== activeProblemData.id));
                          }
                        }
                        if (updates.is_bookmarked !== undefined) {
                          if (updates.is_bookmarked) {
                            setBookmarkedProblemIds(prev => prev.includes(activeProblemData.id) ? prev : [...prev, activeProblemData.id]);
                          } else {
                            setBookmarkedProblemIds(prev => prev.filter(id => id !== activeProblemData.id));
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 text-center">
                    <AlertCircle size={24} className="text-red-500" />
                    <p className="text-xs font-medium text-red-500">Failed to load problem data.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
