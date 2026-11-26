"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export type SortOption = "popularity" | "price-asc" | "price-desc" | "title";

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

interface CoursesToolbarProps {
  categories: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function CoursesToolbar({
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: CoursesToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-1">
      {/* 1. Category Filter Pills */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-xs"
                  : "bg-[#f1f5f9] dark:bg-gray-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-gray-700"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          );
        })}
      </div>

      {/* 2. Sort Dropdown (Right-aligned) */}
      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">
          Sort by
        </span>

        <div className="relative inline-block">
          <select
            id="course-sort-select"
            aria-label="Sort courses by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title">Title (A–Z)</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
