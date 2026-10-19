"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trophy, Search, Video, Sparkles, BookOpen } from "lucide-react";
import { ContestSummary } from "@/types/contest";
import { fetchContests } from "@/api/contests";
import { ContestCard } from "@/components/contests/ContestCard";
import { ContestFilters, PlatformFilterItem } from "@/components/contests/ContestFilters";
import { SuggestContestModal } from "@/components/contests/SuggestContestModal";
import PageHeader from "@/components/common/PageHeader";
import ErrorState from "@/components/common/ErrorState";

export default function ContestEditorialsPage() {
  const [allContests, setAllContests] = useState<ContestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Modal
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadContests = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all contests once to accurately derive counts per platform
        const data = await fetchContests();
        if (isMounted) {
          setAllContests(data || []);
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
  }, []);

  // Derive ONLY platforms that actually have editorials in the database!
  const availablePlatforms: PlatformFilterItem[] = useMemo(() => {
    const platformCounts: Record<string, number> = {};
    allContests.forEach((c) => {
      const p = c.platform.toLowerCase();
      platformCounts[p] = (platformCounts[p] || 0) + 1;
    });

    const formatPlatformName = (p: string) => {
      if (p === "codeforces") return "Codeforces";
      if (p === "leetcode") return "LeetCode";
      if (p === "codechef") return "CodeChef";
      if (p === "atcoder") return "AtCoder";
      return p.charAt(0).toUpperCase() + p.slice(1);
    };

    const list: PlatformFilterItem[] = [
      { id: "all", label: "All Contests", count: allContests.length },
    ];

    Object.entries(platformCounts).forEach(([p, count]) => {
      if (count > 0) {
        list.push({
          id: p,
          label: formatPlatformName(p),
          count,
        });
      }
    });

    return list;
  }, [allContests]);

  // Filter & sort contests client-side
  const filteredContests = useMemo(() => {
    return allContests.filter((c) => {
      const matchesPlatform =
        selectedPlatform === "all" ||
        c.platform.toLowerCase() === selectedPlatform.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.contest.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q);

      return matchesPlatform && matchesSearch;
    });
  }, [allContests, selectedPlatform, searchQuery]);

  const sortedContests = useMemo(() => {
    const list = [...filteredContests];
    if (sortBy === "oldest") {
      return list.reverse();
    }
    if (sortBy === "problems") {
      return list.sort((a, b) => b.total_problems - a.total_problems);
    }
    return list; // latest default
  }, [filteredContests, sortBy]);

  // Total problems across all contests
  const totalProblemsCount = useMemo(() => {
    return allContests.reduce((acc, c) => acc + (c.total_problems || 0), 0);
  }, [allContests]);

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
          { label: "Contests Indexed", value: allContests.length > 0 ? `${allContests.length}+` : "77+", icon: Trophy, iconColor: "text-amber-500" },
          { label: "Problem Editorials", value: totalProblemsCount > 0 ? `${totalProblemsCount}+` : "300+", icon: Video, iconColor: "text-blue-500" },
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
        onSelectPlatform={setSelectedPlatform}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        availablePlatforms={availablePlatforms}
      />

      {/* 3. Contest List */}
      <div className="space-y-3">
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
            onRetry={() => window.location.reload()}
          />
        )}

        {!loading && !error && sortedContests.length === 0 && (
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
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && !error && sortedContests.length > 0 && (
          <div className="space-y-3">
            {sortedContests.map((c) => (
              <ContestCard key={c.id} contest={c} />
            ))}
          </div>
        )}
      </div>

      {/* Suggest Contest Modal Dialog */}
      <SuggestContestModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />
    </div>
  );
}
