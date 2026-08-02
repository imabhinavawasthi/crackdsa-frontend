"use client";

import React from "react";
import { Search } from "lucide-react";

export type CategoryFilterType = "all" | "ds" | "algo" | "foundations";

interface DSACatalogFilterProps {
  activeCategory: CategoryFilterType;
  onCategoryChange: (category: CategoryFilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categoryTabs: { id: CategoryFilterType; label: string }[] = [
  { id: "all", label: "All Modules" },
  { id: "ds", label: "Data Structures" },
  { id: "algo", label: "Algorithms" },
  { id: "foundations", label: "Foundations" },
];

export function DSACatalogFilter({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: DSACatalogFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onCategoryChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-white/70 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/60 dark:border-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[240px] sm:w-72">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search topics (e.g. Trees, DP, Graphs)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-sm pl-10 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
        />
      </div>
    </div>
  );
}
