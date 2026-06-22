"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  X,
  RotateCcw,
  SlidersHorizontal,
  Hash,
  Building2,
  Check
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { formatTag } from "@/utils/string";
import ErrorState from "@/components/common/ErrorState";
import { ProblemTableRow } from "@/components/common/ProblemTableRow";

// ─── MultiSelectCombobox Component ───
export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder,
  icon,
  emptyLabel,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
  icon: React.ReactNode;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 text-xs font-normal flex items-center justify-between gap-2 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer text-gray-700 dark:text-gray-300"
        >
          <span className="flex items-center gap-2 truncate">
            {icon}
            {selected.length === 0 ? (
              <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
            ) : (
              <span className="truncate">
                {selected.length} selected
              </span>
            )}
          </span>
          <ChevronDown
            size={14}
            className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-[100] w-[var(--radix-popover-trigger-width)] max-h-[280px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <Command shouldFilter={false}>
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
              <Search size={13} className="text-gray-400 shrink-0" />
              <Command.Input
                value={searchValue}
                onValueChange={setSearchValue}
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                className="flex-1 h-5 text-xs bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-200 font-normal"
              />
              {searchValue && (
                <button type="button" onClick={() => setSearchValue("")} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>

            <Command.List className="max-h-[200px] overflow-y-auto p-1">
              {filteredOptions.length === 0 && (
                <Command.Empty className="px-3 py-4 text-center text-xs text-gray-400">
                  {emptyLabel || "No results found."}
                </Command.Empty>
              )}

              {filteredOptions.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <Command.Item
                    key={option}
                    value={option}
                    onSelect={() => toggleOption(option)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer hover:bg-gray-55 dark:hover:bg-gray-900 transition-colors data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-900"
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? "border-brand-500 bg-brand-500 text-white" : "border-gray-300 dark:border-gray-700"
                    }`}>
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                      {formatTag(option)}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ─── SelectedTagsPills Component ───
export function SelectedPills({
  items,
  onRemove,
  colorClass,
}: {
  items: string[];
  onRemove: (val: string) => void;
  colorClass: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${colorClass}`}
        >
          {formatTag(item)}
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="hover:opacity-70 cursor-pointer ml-0.5"
          >
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  );
}

// ─── CatalogFilters Component ───
export function CatalogFilters({
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
  platformsList,
  tagsList,
  companiesList,
  hasActiveFilters,
  resetFilters,
  compact = false,
  hideTagsFilter = false,
  hideCompaniesFilter = false,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedBookmark: string;
  setSelectedBookmark: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: (val: string[]) => void;
  selectedCompanies: string[];
  setSelectedCompanies: (val: string[]) => void;
  platformsList: string[];
  tagsList: string[];
  companiesList: string[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
  compact?: boolean;
  hideTagsFilter?: boolean;
  hideCompaniesFilter?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
      {/* Filter Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Search & Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-[10px] text-white font-semibold shadow-sm">
              {[
                searchQuery ? 1 : 0,
                selectedDifficulty !== "All" ? 1 : 0,
                selectedPlatform !== "All" ? 1 : 0,
                selectedTags.length > 0 ? 1 : 0,
                selectedCompanies.length > 0 ? 1 : 0,
                selectedStatus !== "All" ? 1 : 0,
                selectedBookmark !== "All" ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 flex-grow">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 pl-9 text-xs font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-gray-800 dark:text-gray-200 transition-all shadow-sm"
          />
          <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>

        <div className={compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"}>
          {/* Difficulty */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 text-xs font-normal text-gray-700 dark:text-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">🟢 Easy</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Hard">🔴 Hard</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Platform */}
          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 text-xs font-normal text-gray-700 dark:text-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
            >
              <option value="All">All Platforms</option>
              {platformsList.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 text-xs font-normal text-gray-700 dark:text-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Revision">Revision</option>
              <option value="Done">Done</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Bookmarks */}
          <div className="relative">
            <select
              value={selectedBookmark}
              onChange={(e) => setSelectedBookmark(e.target.value)}
              className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 text-xs font-normal text-gray-700 dark:text-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
            >
              <option value="All">All Bookmarked</option>
              <option value="Bookmarked">Bookmarked Only</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Multiselect Row */}
        {(!hideTagsFilter || !hideCompaniesFilter) && (
          <div className={
            hideTagsFilter || hideCompaniesFilter 
              ? "grid grid-cols-1 gap-3" 
              : compact 
                ? "grid grid-cols-1 gap-3" 
                : "grid grid-cols-1 md:grid-cols-2 gap-3"
          }>
            {/* Topics Multiselect */}
            {!hideTagsFilter && (
              <MultiSelectCombobox
                options={tagsList}
                selected={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select Topics..."
                icon={<Hash size={13} className="text-gray-400 shrink-0" />}
                emptyLabel="No topic tags available."
              />
            )}

            {/* Companies Multiselect */}
            {!hideCompaniesFilter && (
              <MultiSelectCombobox
                options={companiesList}
                selected={selectedCompanies}
                onChange={setSelectedCompanies}
                placeholder="Select Companies..."
                icon={<Building2 size={13} className="text-gray-400 shrink-0" />}
                emptyLabel="No company tags available."
              />
            )}
          </div>
        )}

        {/* Selected Pills */}
        {(selectedTags.length > 0 || selectedCompanies.length > 0) && (
          <div className="flex flex-wrap items-start gap-4 pt-1">
            {selectedTags.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Topics</span>
                <SelectedPills
                  items={selectedTags}
                  onRemove={(tag) => setSelectedTags(selectedTags.filter(t => t !== tag))}
                  colorClass="bg-blue-500/8 text-blue-600 dark:text-blue-400 border-blue-500/15"
                />
              </div>
            )}
            {selectedCompanies.length > 0 && (
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Companies</span>
                <SelectedPills
                  items={selectedCompanies}
                  onRemove={(company) => setSelectedCompanies(selectedCompanies.filter(c => c !== company))}
                  colorClass="bg-violet-500/8 text-violet-600 dark:text-violet-400 border-violet-500/15"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ProgressDonutCard Component ───
export function ProgressDonutCard({
  stats,
}: {
  stats: {
    total: number;
    solved: number;
    percent: number;
    easySolved: number;
    easyTotal: number;
    mediumSolved: number;
    mediumTotal: number;
    hardSolved: number;
    hardTotal: number;
  };
}) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Progress</span>
        <span className="text-xs font-semibold text-emerald-500">{stats.percent}% Complete</span>
      </div>

      <div className="flex items-center justify-center gap-6 py-2">
        {/* SVG Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="donutProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#465fff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              className="stroke-gray-100 dark:stroke-gray-800"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="url(#donutProgressGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="238.76"
              strokeDashoffset={238.76 * (1 - stats.percent / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Central Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">
              {stats.solved}
            </span>
            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-1.5">
              / {stats.total}
            </span>
          </div>
        </div>

        {/* Overall Percentage Label */}
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-none">{stats.percent}%</h4>
          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Overall Ratio</p>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="space-y-2">
        {/* Easy */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Easy
            </span>
            <span>{stats.easySolved} / {stats.easyTotal}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.easyTotal > 0 ? (stats.easySolved / stats.easyTotal) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Medium */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium
            </span>
            <span>{stats.mediumSolved} / {stats.mediumTotal}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.mediumTotal > 0 ? (stats.mediumSolved / stats.mediumTotal) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Hard */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Hard
            </span>
            <span>{stats.hardSolved} / {stats.hardTotal}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.hardTotal > 0 ? (stats.hardSolved / stats.hardTotal) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ProblemsTable Component ───
export function ProblemsTable({
  problems,
  solvedProblemIds,
  bookmarkedProblemIds,
  problemStatusMap,
  currentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  onPageChange,
  onToggleSolved,
  onToggleBookmark,
  onOpenProblem,
  resetFilters,
  hasActiveFilters,
  error = null,
  isLoggedIn = true,
}: {
  problems: any[];
  solvedProblemIds: string[];
  bookmarkedProblemIds: string[];
  problemStatusMap: Record<string, "pending" | "done" | "revision">;
  currentPage: number;
  itemsPerPage: number;
  setItemsPerPage?: (val: number) => void;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleSolved: (id: string, slug: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, slug: string, e: React.MouseEvent) => void;
  onOpenProblem: (slug: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  error?: string | null;
  isLoggedIn?: boolean;
}) {

  if (error) {
    return (
      <ErrorState
        title="Error Loading Practice Ground"
        message={error}
        icon={SlidersHorizontal}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800/80">
              <th className="py-3 px-3 sm:px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-16 text-center">Status</th>
              <th className="py-3 px-2 sm:px-4 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-10 text-center">
                <Bookmark size={11} className="mx-auto" />
              </th>
              <th className="py-3 px-3 sm:px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest">Problem</th>
              <th className="py-3 px-3 sm:px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-28">Difficulty</th>
              <th className="py-3 px-3 sm:px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-32">Platform</th>
              <th className="py-3 px-3 sm:px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-48">Topics</th>
              <th className="py-3 px-3 sm:px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-12 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-900 bg-transparent">
            {problems.map((prob) => (
              <ProblemTableRow
                key={prob.id}
                prob={prob}
                isSolved={solvedProblemIds.includes(prob.id)}
                isBookmarked={bookmarkedProblemIds.includes(prob.id)}
                status={problemStatusMap[prob.id] || "pending"}
                isLoggedIn={isLoggedIn}
                onToggleSolved={onToggleSolved}
                onToggleBookmark={onToggleBookmark}
                onOpenProblem={onOpenProblem}
              />
            ))}

            {problems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <Search size={20} className="text-gray-300 dark:text-gray-700" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No problems found</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Try adjusting your filters or search query.</p>
                    </div>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-medium cursor-pointer mt-1"
                      >
                        <RotateCcw size={12} />
                        Reset all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10">
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600 dark:text-gray-300">
                {Math.min((currentPage - 1) * itemsPerPage + 1, problems.length)}-
                {Math.min(currentPage * itemsPerPage, problems.length)}
              </span> of <span className="font-semibold text-gray-600 dark:text-gray-300">{problems.length}</span> problems
            </p>
            {setItemsPerPage && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Rows:</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    onPageChange(1);
                  }}
                  className="h-7 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-2 text-gray-600 dark:text-gray-400 outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous Page */}
            <button
              type="button"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors shadow-sm"
            >
              <ChevronLeft size={13} />
            </button>
            
            {/* Numbered Page Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => onPageChange(pageNum)}
                      className={`w-7 h-7 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        currentPage === pageNum
                          ? "bg-brand-500 text-white"
                          : "border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return (
                    <span key={pageNum} className="text-gray-400 dark:text-gray-600 px-0.5 text-xs select-none">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Next Page */}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors shadow-sm"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
