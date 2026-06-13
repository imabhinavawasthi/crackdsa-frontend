"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatTag } from "@/utils/string";
import PageHeader from "@/components/common/PageHeader";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import type { BreadcrumbsItem } from "@/components/common/Breadcrumbs";
import { CatalogFilters, ProblemsTable, ProgressDonutCard } from "@/components/practice/PracticeCatalog";
import { usePracticeCatalog } from "@/hooks/usePracticeCatalog";

export interface TagDetailPageConfig {
  slug: string;
  fetchFn: (slug: string) => Promise<any[]>;
  breadcrumbParent: BreadcrumbsItem;
  titleSuffix: React.ReactNode;
  subtitleTemplate: (title: string) => string;
}

const TagDetailPageLayout: React.FC<TagDetailPageConfig> = ({
  slug,
  fetchFn,
  breadcrumbParent,
  titleSuffix,
  subtitleTemplate,
}) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const boundFetchFn = useCallback(() => fetchFn(slug), [fetchFn, slug]);

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
    fetchFn: boundFetchFn,
    isLoggedIn,
    itemsPerPage: 10,
  });

  const title = formatTag(slug);

  const handleOpenProblem = (pSlug: string) => {
    router.push(`/problem/${pSlug}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-8 space-y-6 select-none animate-in fade-in duration-300">
        <div className="rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
            <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="w-full md:w-80 h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const breadcrumbsList = [
    { title: "Practice", href: "/practice" },
    breadcrumbParent,
    { title }
  ];

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-5 select-none">
      {/* Breadcrumbs instead of Back Link */}
      <div className="mb-3 px-1">
        <Breadcrumbs items={breadcrumbsList} listClassName="text-xs font-medium" />
      </div>

      {/* Header */}
      <div className="mb-4 sm:mb-5">
        <PageHeader
          title={
            <>
              {title} {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                {titleSuffix}
              </span>
            </>
          }
          subtitle={subtitleTemplate(title)}
          accent="brand"
        />
      </div>

      {/* Filters (Full Width) */}
      <div className="mb-4">
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
          hideTagsFilter={true}
          hideCompaniesFilter={true}
        />
      </div>

      {/* Split screen content area (2/3 table vs 1/3 progress stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Left Column (2/3 width) - Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-400">
              Showing <span className="font-medium text-gray-650 dark:text-gray-300">{filteredProblems.length}</span> of {problems.length} problems
            </p>
          </div>

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
        </div>

        {/* Right Column (1/3 width) - Stats */}
        <div className="space-y-6">
          <ProgressDonutCard stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default TagDetailPageLayout;
