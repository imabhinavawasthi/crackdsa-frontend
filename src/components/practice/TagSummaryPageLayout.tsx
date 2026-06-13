"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, ArrowRight, Sparkles, Hash } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import type { BreadcrumbsItem } from "@/components/common/Breadcrumbs";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import TagSummaryTable from "@/components/practice/TagSummaryTable";
import { TagSummary } from "@/types/practice";
import { formatTag } from "@/utils/string";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardPaletteEntry {
  gradient: string;
  ring: string;
  icon: string;
}

export interface TagSummaryPageConfig {
  /** Breadcrumb trail */
  breadcrumbItems: BreadcrumbsItem[];
  /** PageHeader props */
  title: React.ReactNode;
  subtitle: string;
  /** Data fetcher — returns the array of TagSummary items */
  fetchFn: () => Promise<TagSummary[]>;
  /** Base path for row/card navigation (e.g. "/practice/topics") */
  basePath: string;
  /** Column header label in the table (e.g. "Topic", "Company") */
  nameLabel: string;
  /** Singular entity label for pluralisation (e.g. "topic", "company") */
  entityLabel: string;
  /** Featured section heading (e.g. "Major Domains") */
  featuredSectionLabel: string;
  /** Featured section sub-label (e.g. "Top 4 by volume") */
  featuredSectionSub: string;
  /** Index section label when not searching (e.g. "Complete Index") */
  indexSectionLabel: string;
  /** Icon rendered inside the featured card */
  cardIcon: LucideIcon;
  /** Colour palette for the 4 featured cards */
  cardPalette: CardPaletteEntry[];
  /** Small text in card footer (e.g. "Practice Sheet") */
  cardFooterLabel: string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search */}
      <Skeleton className="h-11 w-full max-w-md rounded-xl" />
      {/* Feature cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-7 w-full rounded-lg" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-11 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <Skeleton className="h-4 w-6 rounded" />
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-5 w-16 rounded-full ml-auto" />
            <Skeleton className="h-4 w-8 rounded hidden md:block" />
            <Skeleton className="h-4 w-8 rounded hidden md:block" />
            <Skeleton className="h-4 w-8 rounded hidden md:block" />
            <Skeleton className="h-2 w-28 rounded-full hidden lg:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────

interface FeaturedCardProps {
  item: TagSummary;
  index: number;
  basePath: string;
  cardIcon: LucideIcon;
  cardPalette: CardPaletteEntry[];
  cardFooterLabel: string;
}

function FeaturedCard({
  item,
  index,
  basePath,
  cardIcon: Icon,
  cardPalette,
  cardFooterLabel,
}: FeaturedCardProps) {
  const p = cardPalette[index % cardPalette.length];
  const total = item.easy_count + item.medium_count + item.hard_count;
  const ep = total > 0 ? Math.round((item.easy_count / total) * 100) : 0;
  const mp = total > 0 ? Math.round((item.medium_count / total) * 100) : 0;
  const hp = 100 - ep - mp;

  return (
    <Link
      href={`${basePath}/${item.slug}`}
      className={`
        group relative flex flex-col justify-between h-full min-h-[176px] p-5
        bg-gradient-to-br ${p.gradient} bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        ring-1 ring-transparent ${p.ring}
        rounded-2xl shadow-sm hover:shadow-md
        transition-all duration-300 overflow-hidden
      `}
    >
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-8 translate-x-8 pointer-events-none" />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${p.icon}`}>
          <Icon size={16} />
        </div>
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-extrabold bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full whitespace-nowrap">
          {item.count} problems
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
        {formatTag(item.name)}
      </h3>

      {/* Difficulty + bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-1 text-[9px] font-extrabold text-center">
          <span className="bg-success-500/10 text-success-700 dark:text-success-400 py-0.5 rounded-md border border-success-500/15">
            {item.easy_count}E
          </span>
          <span className="bg-warning-500/10 text-warning-700 dark:text-warning-400 py-0.5 rounded-md border border-warning-500/15">
            {item.medium_count}M
          </span>
          <span className="bg-error-500/10 text-error-700 dark:text-error-400 py-0.5 rounded-md border border-error-500/15">
            {item.hard_count}H
          </span>
        </div>

        <div className="flex h-1 w-full rounded-full overflow-hidden gap-px">
          <div className="bg-success-500 rounded-l-full" style={{ width: `${ep}%` }} />
          <div className="bg-warning-400" style={{ width: `${mp}%` }} />
          <div className="bg-error-500 rounded-r-full" style={{ width: `${hp}%` }} />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
            {cardFooterLabel}
          </span>
          <ArrowRight
            size={12}
            className="text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Main layout component ────────────────────────────────────────────────────

const TagSummaryPageLayout: React.FC<TagSummaryPageConfig> = (config) => {
  const {
    breadcrumbItems,
    title,
    subtitle,
    fetchFn,
    basePath,
    nameLabel,
    entityLabel,
    featuredSectionLabel,
    featuredSectionSub,
    indexSectionLabel,
    cardIcon,
    cardPalette,
    cardFooterLabel,
  } = config;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TagSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFn()
      .then(setItems)
      .catch((err: any) => setError(err.message || "Failed to load data."))
      .finally(() => setLoading(false));
  }, [fetchFn]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (t) =>
        formatTag(t.name).toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const featuredItems = useMemo(
    () => (!searchQuery ? filteredItems.slice(0, 4) : []),
    [filteredItems, searchQuery]
  );

  const indexItems = useMemo(
    () => (searchQuery ? filteredItems : filteredItems.slice(4)),
    [filteredItems, searchQuery]
  );

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <ErrorState
          title="Error Loading Data"
          message={error}
          backLink="/practice"
          backLabel="Back to Practice Ground"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5 select-none py-2 sm:py-4">

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} listClassName="text-xs font-medium" />

      {/* Header */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        accent="brand"
      />

      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id={`${entityLabel}-search`}
              type="text"
              placeholder={`Search ${entityLabel}s…`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-9 pr-9 text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-800 dark:text-gray-200 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none cursor-pointer"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Featured cards */}
          {!searchQuery && featuredItems.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  <Sparkles size={12} className="text-brand-500" />
                  {featuredSectionLabel}
                </h2>
                <span className="text-[10px] font-semibold text-gray-400">{featuredSectionSub}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredItems.map((item, i) => (
                  <FeaturedCard
                    key={item.slug}
                    item={item}
                    index={i}
                    basePath={basePath}
                    cardIcon={cardIcon}
                    cardPalette={cardPalette}
                    cardFooterLabel={cardFooterLabel}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Index table */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <Hash size={12} className="text-brand-500" />
                {searchQuery ? "Search Results" : indexSectionLabel}
              </h2>
              <span className="text-[10px] font-semibold text-gray-400">
                {indexItems.length} {indexItems.length === 1 ? entityLabel : `${entityLabel}s`}
              </span>
            </div>
            <TagSummaryTable
              items={indexItems}
              basePath={basePath}
              nameLabel={nameLabel}
              searchQuery={searchQuery}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default TagSummaryPageLayout;
