"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { fetchBatchTopicDetails, BatchTopicResponse } from "@/api/courses";
import { dsaModules } from "@/config/dsa-catalog";
import { hydrateModulesWithBatchResponse } from "@/utils/courseCatalogSync";
import { DSACarouselSection } from "@/components/dsa/DSACarouselSection";
import { DSATopicCard } from "@/components/dsa/DSATopicCard";

const DSA_COURSE_SLUG =
  process.env.NEXT_PUBLIC_DSA_COURSE_SLUG ||
  "data-structures-algorithms-mastery-program";

export default function DsaPage() {
  const [batchData, setBatchData] = useState<BatchTopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "foundations" | "ds" | "algo">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<"all" | "Beginner" | "Medium" | "Advanced">("all");
  const [activeStatus, setActiveStatus] = useState<"all" | "available" | "upcoming">("all");

  useEffect(() => {
    async function loadBatchDetails() {
      setIsLoading(true);
      try {
        // Collect all topic IDs to pass to single batch endpoint
        const topicIds = dsaModules.map((m) => m.id);
        const data = await fetchBatchTopicDetails(DSA_COURSE_SLUG, topicIds);
        setBatchData(data);
      } catch (err) {
        console.warn("Batch topic details endpoint unavailable:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBatchDetails();
  }, []);

  // Hydrate catalog modules using exact trimmed & case-insensitive title match from backend batch response
  const hydratedModules = useMemo(
    () => hydrateModulesWithBatchResponse(dsaModules, batchData),
    [batchData]
  );

  const foundationsModules = useMemo(
    () => hydratedModules.filter((m) => m.category === "foundations"),
    [hydratedModules]
  );

  const dsModules = useMemo(
    () => hydratedModules.filter((m) => m.category === "ds"),
    [hydratedModules]
  );

  const algoModules = useMemo(
    () => hydratedModules.filter((m) => m.category === "algo"),
    [hydratedModules]
  );

  // Check if any filter or search query is active
  const isFilteringOrSearching = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      activeCategory !== "all" ||
      activeDifficulty !== "all" ||
      activeStatus !== "all"
    );
  }, [searchQuery, activeCategory, activeDifficulty, activeStatus]);

  // Dynamic search and multi-criteria filtering
  const filteredResults = useMemo(() => {
    return hydratedModules.filter((m) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        (m.subtitle && m.subtitle.toLowerCase().includes(query)) ||
        m.topics.some((t) => t.toLowerCase().includes(query));

      const matchesCategory = activeCategory === "all" || m.category === activeCategory;
      const matchesDifficulty = activeDifficulty === "all" || m.difficulty === activeDifficulty;
      const matchesStatus =
        activeStatus === "all" ||
        (activeStatus === "upcoming" ? m.isUpcoming : !m.isUpcoming);

      return matchesQuery && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [hydratedModules, searchQuery, activeCategory, activeDifficulty, activeStatus]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveDifficulty("all");
    setActiveStatus("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-4 space-y-8">
      {/* Enhanced Search & Filter Options Bar */}
      <div className="space-y-4">
        {/* Top Search Input Row */}
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Data Structures, Algorithms, or topics (e.g., Binary Trees, DP, Arrays)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] backdrop-blur-sm pl-11 pr-10 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {[
              { id: "all", label: "All Topics" },
              { id: "foundations", label: "Fundamentals" },
              { id: "ds", label: "Data Structures" },
              { id: "algo", label: "Algorithms" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === tab.id
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                    : "bg-gray-100/80 dark:bg-[#121722] text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Difficulty & Status Filter Controls */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {/* Difficulty Dropdown / Pills */}
            <div className="flex items-center gap-1">
              {[
                { id: "all", label: "All Difficulties" },
                { id: "Beginner", label: "Beginner" },
                { id: "Medium", label: "Medium" },
                { id: "Advanced", label: "Advanced" },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setActiveDifficulty(diff.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap border ${
                    activeDifficulty === diff.id
                      ? "bg-brand-500 text-white border-brand-500 shadow-2xs"
                      : "bg-white/60 dark:bg-[#121722] text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>

            {/* Status Filter: All / Available / Upcoming */}
            <div className="flex items-center gap-1 border-l border-gray-200/60 dark:border-gray-800 pl-2 ml-1">
              {[
                { id: "all", label: "All Status" },
                { id: "available", label: "Available" },
                { id: "upcoming", label: "Upcoming" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStatus(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap border ${
                    activeStatus === st.id
                      ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 border-gray-800 dark:border-gray-200 shadow-2xs"
                      : "bg-white/60 dark:bg-[#121722] text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Clear All Filters Button */}
            {isFilteringOrSearching && (
              <button
                onClick={clearAllFilters}
                className="ml-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Display */}
      {isFilteringOrSearching ? (
        /* Filtered Grid View */
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Matching Topics ({isLoading ? "..." : filteredResults.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((idx) => (
                <DSATopicCard key={idx} module={dsaModules[0]} isLoading />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredResults.map((module) => (
                <DSATopicCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                No topics match your selected search/filter criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Horizontal Carousels View */
        <div className="space-y-10 pt-2">
          {/* Section 1: Fundamentals */}
          <DSACarouselSection
            title="Fundamentals"
            description="Core foundations, Big-O complexity analysis, and programming basics"
            modules={foundationsModules}
            isLoading={isLoading}
          />

          {/* Section 2: Data Structures */}
          <DSACarouselSection
            title="Data Structures"
            description="Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Heaps, and Graphs"
            modules={dsModules}
            isLoading={isLoading}
          />

          {/* Section 3: Algorithms */}
          <DSACarouselSection
            title="Algorithms"
            description="Two Pointers, Binary Search, Sorting, Backtracking, Dynamic Programming & Greedy"
            modules={algoModules}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
