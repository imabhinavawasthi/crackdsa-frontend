"use client";

import React from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { LiveClassCounts } from "@/types/live-class";

export type ClassStatusFilter = "all" | "live" | "upcoming" | "completed";

interface LiveClassesToolbarProps {
  statusFilter: ClassStatusFilter;
  onStatusChange: (status: ClassStatusFilter) => void;
  counts: LiveClassCounts;
  topics: string[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function LiveClassesToolbar({
  statusFilter,
  onStatusChange,
  counts,
  topics,
  selectedTopic,
  onTopicChange,
  searchQuery,
  onSearchChange,
}: LiveClassesToolbarProps) {
  const tabs = [
    { id: "all", label: "All Classes", count: counts.all },
    { id: "live", label: "Live Now", count: counts.live },
    { id: "upcoming", label: "Upcoming", count: counts.upcoming },
    { id: "completed", label: "Completed", count: counts.completed },
  ] as const;

  return (
    <div className="flex flex-col gap-3.5 py-1">
      {/* Top Bar: Search by Lecture Name & Topic Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lectures by name or keyword..."
            className="w-full h-10 pl-10 pr-9 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Real Topic Selector */}
        <div className="relative inline-block self-start sm:self-auto shrink-0">
          <select
            aria-label="Filter by topic"
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="appearance-none h-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Topics</option>
            {topics.map((t) => {
              const label =
                t.toLowerCase() === "dsa"
                  ? "DSA"
                  : t.toLowerCase() === "cs-fundamental"
                  ? "CS Fundamentals"
                  : t.toLowerCase() === "competitive-programming"
                  ? "Competitive Programming"
                  : t
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");
              return (
                <option key={t} value={t}>
                  {label}
                </option>
              );
            })}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Bottom Bar: Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full pb-1">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`px-4 sm:px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-xs"
                  : "bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
