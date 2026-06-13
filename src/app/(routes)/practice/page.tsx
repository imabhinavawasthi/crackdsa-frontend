"use client";

import React, { useMemo, useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  Code2,
  Trophy,
  Target,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProblemViewer from "@/components/learning/ProblemViewer";
import { fetchProblems } from "@/api/problems";
import PageHeader from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatTag } from "@/utils/string";
import { CatalogFilters, ProblemsTable, ProgressDonutCard } from "@/components/practice/PracticeCatalog";
import { usePracticeCatalog } from "@/hooks/usePracticeCatalog";

/* ─── Main Practice Page ──────────────────────────────────────────── */
export default function PracticeProblemsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const {
    loading,
    error,
    problems,
    filteredProblems,
    paginatedProblems,
    solvedProblemIds,
    bookmarkedProblemIds,
    problemStatusMap,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedPlatform,
    setSelectedPlatform,
    selectedStatus,
    setSelectedStatus,
    selectedBookmark,
    setSelectedBookmark,
    selectedTags,
    setSelectedTags,
    selectedCompanies,
    setSelectedCompanies,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    handleToggleSolved,
    handleToggleBookmark,
    platformsList,
    tagsList,
    companiesList,
    stats,
    hasActiveFilters,
    resetFilters,
  } = usePracticeCatalog({
    fetchFn: fetchProblems,
    isLoggedIn,
    itemsPerPage: 10,
  });

  // Slide-over Sheet State
  const [activeProblemSlug, setActiveProblemSlug] = useState<string | null>(null);
  const [activeProblemData, setActiveProblemData] = useState<any | null>(null);
  const [loadingProblemDetail, setLoadingProblemDetail] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Redirect to the dedicated problem page
  const handleOpenProblem = (slug: string) => {
    router.push(`/problem/${slug}`);
  };

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

  // Render functions
  const renderSkeleton = () => (
    <div className="space-y-6 animate-in fade-in duration-300 pt-2 sm:pt-4">
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

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 py-4 sm:py-5 select-none">
      
      {/* ───── 1. Hero Header ───── */}
      <div className="mb-4 sm:mb-5">
        <PageHeader
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

      {(loading && problems.length === 0) ? renderSkeleton() : (
        <>
          {/* ───── 2. Middle Controls Row (2-column layout) ───── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
            
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
            setItemsPerPage={setItemsPerPage}
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
        </>
      )}

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
