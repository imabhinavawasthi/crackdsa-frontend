"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trophy, Search, Video, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { ContestSummary, ContestPaginatedResponse } from "@/types/contest";
import { fetchPaginatedContests } from "@/api/contests";
import { ContestCard } from "@/components/contests/ContestCard";
import { ContestFilters, PlatformFilterItem } from "@/components/contests/ContestFilters";
import { SuggestContestModal } from "@/components/contests/SuggestContestModal";
import PageHeader from "@/components/common/PageHeader";
import ErrorState from "@/components/common/ErrorState";

export default function ContestEditorialsPage() {
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalContests, setTotalContests] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const pageSize = 10;

  // Filter & Search states
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [availablePlatforms, setAvailablePlatforms] = useState<PlatformFilterItem[]>([]);

  // Modal
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  // Scroll ref
  const listRef = useRef<HTMLDivElement>(null);

  // In-memory cache for loaded and prefetched pages
  const pageCache = useRef<Map<string, ContestPaginatedResponse>>(new Map());

  const getCacheKey = (platform: string, search: string, sort: string, page: number) => {
    return `${platform.toLowerCase()}::${search.trim().toLowerCase()}::${sort}::${page}`;
  };

  // Prefetch a specific page in background without altering active UI state
  const prefetchPage = useCallback(async (
    targetPage: number,
    platform: string,
    search: string,
    sort: string
  ) => {
    const key = getCacheKey(platform, search, sort, targetPage);
    if (pageCache.current.has(key)) return;

    try {
      const res = await fetchPaginatedContests({
        platform,
        search,
        sortBy: sort,
        page: targetPage,
        limit: pageSize,
      });
      pageCache.current.set(key, res);
    } catch {
      // Silent ignore for background prefetch
    }
  }, [pageSize]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch paginated contests (with instant cache retrieval & next-page prefetch)
  useEffect(() => {
    let isMounted = true;
    const currentKey = getCacheKey(selectedPlatform, debouncedSearch, sortBy, currentPage);

    // 1. If current page is already in cache (prefetched or previously visited), show immediately!
    if (pageCache.current.has(currentKey)) {
      const cached = pageCache.current.get(currentKey)!;
      setContests(cached.items || []);
      setTotalCount(cached.total_count || 0);
      setTotalPages(cached.total_pages || 1);
      setTotalContests(cached.total_contests || 0);
      setTotalProblems(cached.total_problems || 0);
      if (cached.platforms && cached.platforms.length > 0) {
        setAvailablePlatforms(cached.platforms);
      }
      setLoading(false);

      // Advance prefetch: fetch next page in advance to eliminate any delay loading
      if (currentPage < cached.total_pages) {
        prefetchPage(currentPage + 1, selectedPlatform, debouncedSearch, sortBy);
      }
      return;
    }

    // 2. Otherwise fetch from network
    const loadContests = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchPaginatedContests({
          platform: selectedPlatform,
          search: debouncedSearch,
          sortBy: sortBy,
          page: currentPage,
          limit: pageSize,
        });

        if (isMounted) {
          pageCache.current.set(currentKey, res);
          setContests(res.items || []);
          setTotalCount(res.total_count || 0);
          setTotalPages(res.total_pages || 1);
          setTotalContests(res.total_contests || 0);
          setTotalProblems(res.total_problems || 0);
          if (res.platforms && res.platforms.length > 0) {
            setAvailablePlatforms(res.platforms);
          }

          // Advance prefetch: automatically fetch next page in advance
          if (currentPage < res.total_pages) {
            prefetchPage(currentPage + 1, selectedPlatform, debouncedSearch, sortBy);
          }
        }
      } catch (err: any) {
        console.error("Failed to load contests:", err);
        if (isMounted) {
          setError(err.message || "Failed to load contest editorials.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContests();

    return () => {
      isMounted = false;
    };
  }, [selectedPlatform, debouncedSearch, sortBy, currentPage, prefetchPage]);

  const handleSelectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generate pagination pill numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const startIdx = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 select-none">
      {/* 1. Header Section with PageHeader & Suggest CTA */}
      <PageHeader
        badge="Live Upsolving"
        badgeIcon={Trophy}
        title={
          <>
            Contest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Editorials
            </span>
          </>
        }
        subtitle="Master post-contest problem solving with structured video explanations, in-depth text editorials, and verified solution code from major competitive programming platforms."
        accent="sky"
        rotatorPrefix="Learn step-by-step solutions for "
        rotatorItems={["Codeforces Div. 2 & 3", "LeetCode Weekly Contests", "CodeChef Starters", "Biweekly Contests"]}
        rotatorSuffix="."
        tickerLabel="Common Topics:"
        tickerItems={["Dynamic Programming", "Binary Search", "Graph Traversal", "Segment Trees", "Greedy", "Number Theory", "Two Pointers"]}
        stats={[
          { label: "Contests Indexed", value: totalContests > 0 ? `${totalContests}+` : "77+", icon: Trophy, iconColor: "text-amber-500" },
          { label: "Problem Editorials", value: totalProblems > 0 ? `${totalProblems}+` : "300+", icon: Video, iconColor: "text-blue-500" },
          { label: "Active Platforms", value: availablePlatforms.length > 1 ? availablePlatforms.length - 1 : 3, icon: BookOpen, iconColor: "text-emerald-500" },
        ]}
        actions={[
          {
            label: "Suggest a Contest",
            onClick: () => setIsSuggestModalOpen(true),
            variant: "primary",
            icon: Plus,
          },
        ]}
      />

      {/* 2. Platform Filter Pills (Only platforms with editorials), Search Bar & Sort Dropdown */}
      <ContestFilters
        selectedPlatform={selectedPlatform}
        onSelectPlatform={handleSelectPlatform}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        availablePlatforms={availablePlatforms}
      />

      {/* 3. Contest List Anchor & Container */}
      <div ref={listRef} className="space-y-3 pt-1">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 animate-pulse p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-800" />
                  <div className="space-y-2">
                    <div className="w-48 h-4 rounded-md bg-gray-200 dark:bg-gray-800" />
                    <div className="w-24 h-3 rounded-md bg-gray-100 dark:bg-gray-850" />
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-16 h-6 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  <div className="w-16 h-6 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  <div className="w-24 h-8 rounded-xl bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <ErrorState
            title="Failed to load contests"
            message={error}
            onRetry={() => {
              pageCache.current.clear();
              setCurrentPage(1);
            }}
          />
        )}

        {!loading && !error && contests.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mx-auto flex items-center justify-center">
              <Search size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">No Contests Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              We couldn&apos;t find any contests matching your search or platform filter. Try selecting &quot;All Contests&quot; or suggest a contest!
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPlatform("all");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && !error && contests.length > 0 && (
          <div className="space-y-3">
            {contests.map((c) => (
              <ContestCard key={c.id} contest={c} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Pagination Controls Bar */}
      {!loading && !error && totalCount > 0 && totalPages > 1 && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-gray-800">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 dark:text-white">{startIdx}</strong>–
            <strong className="text-slate-900 dark:text-white">{endIdx}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{totalCount}</strong> contests
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onMouseEnter={() => {
                if (currentPage > 1) {
                  prefetchPage(currentPage - 1, selectedPlatform, debouncedSearch, sortBy);
                }
              }}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {/* Page number pills */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) => {
                if (typeof pageNum === "string") {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-400 select-none">
                      ...
                    </span>
                  );
                }
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onMouseEnter={() => {
                      prefetchPage(pageNum, selectedPlatform, debouncedSearch, sortBy);
                    }}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onMouseEnter={() => {
                if (currentPage < totalPages) {
                  prefetchPage(currentPage + 1, selectedPlatform, debouncedSearch, sortBy);
                }
              }}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Suggest Contest Modal Dialog */}
      <SuggestContestModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />
    </div>
  );
}
