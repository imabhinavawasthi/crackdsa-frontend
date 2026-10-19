"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";

export interface PlatformFilterItem {
  id: string;
  label: string;
  count?: number;
}

interface ContestFiltersProps {
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  availablePlatforms?: PlatformFilterItem[];
}

export function ContestFilters({
  selectedPlatform,
  onSelectPlatform,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  availablePlatforms = [],
}: ContestFiltersProps) {
  // If no dynamic platforms passed, fallback to active platforms
  const platforms: PlatformFilterItem[] = availablePlatforms.length > 0
    ? availablePlatforms
    : [
        { id: "all", label: "All Contests" },
        { id: "codeforces", label: "Codeforces" },
        { id: "leetcode", label: "LeetCode" },
        { id: "codechef", label: "CodeChef" },
      ];

  return (
    <div className="space-y-4">
      {/* 1. Top row: Platform pills with horizontal scroll (Only platforms with editorials) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1.5 lg:pb-0">
          {platforms.map((p) => {
            const isSelected = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPlatform(p.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <span>{p.label}</span>
                {typeof p.count === "number" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 dark:bg-gray-750 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {p.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. Search & Sort Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contests..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-3.5 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="latest">Sort by: Latest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="problems">Sort by: Most Problems</option>
            </select>
            <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
