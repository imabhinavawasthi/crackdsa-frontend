"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Hash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatTag } from "@/utils/string";
import PageHeader from "@/components/common/PageHeader";
import { fetchTopicProblems } from "@/api/problems";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";
import { CatalogFilters, ProblemsTable, ProgressDonutCard } from "@/components/practice/PracticeCatalog";

export default function PracticeTopicDynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>([]);
  const [problemStatusMap, setProblemStatusMap] = useState<Record<string, "pending" | "done" | "revision">>({});

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBookmark, setSelectedBookmark] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const title = formatTag(slug);

  // Load progress states on mount/auth-change
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isLoggedIn) return;
      try {
        const data = await fetchUserAssetStates();
        const statusMap: Record<string, "pending" | "done" | "revision"> = {};
        const solvedIds: string[] = [];
        const bookmarkedIds: string[] = [];

        data.forEach((state: any) => {
          if (state.asset_type === "problem") {
            statusMap[state.asset_id] = state.status || "pending";
            if (state.status === "done") solvedIds.push(state.asset_id);
            if (state.is_bookmarked) bookmarkedIds.push(state.asset_id);
          }
        });

        setProblemStatusMap(statusMap);
        setSolvedProblemIds(solvedIds);
        setBookmarkedProblemIds(bookmarkedIds);
      } catch (err) {
        console.error("Error loading user progress:", err);
      }
    };

    fetchUserProgress();
  }, [isLoggedIn]);

  // Fetch problems list filtered by topic slug on mount/slug-change
  useEffect(() => {
    const getTopicProblems = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopicProblems(slug);
        setProblems(data || []);
      } catch (err: any) {
        console.error("Error loading topic problems list:", err);
        setError(err.message || "Failed to load topic problems.");
      } finally {
        setLoading(false);
      }
    };

    getTopicProblems();
  }, [slug]);

  const handleOpenProblem = (pSlug: string) => {
    router.push(`/problem/${pSlug}`);
  };

  // Toggle solved state with DB upsert
  const handleToggleSolved = async (id: string, pSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const currentStatus = problemStatusMap[id] || "pending";
    const newStatus = (currentStatus === "done" || currentStatus === "revision") ? "pending" : "done";
    const newSolved = newStatus === "done"
      ? (solvedProblemIds.includes(id) ? solvedProblemIds : [...solvedProblemIds, id])
      : solvedProblemIds.filter(pid => pid !== id);

    setSolvedProblemIds(newSolved);
    setProblemStatusMap(prev => ({ ...prev, [id]: newStatus }));

    try {
      await updateUserAssetState("problem", id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status in DB:", err);
    }
  };

  // Toggle bookmarked state with DB upsert
  const handleToggleBookmark = async (id: string, pSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const isCurrentlyBookmarked = bookmarkedProblemIds.includes(id);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedProblemIds.filter(pid => pid !== id)
      : [...bookmarkedProblemIds, id];

    setBookmarkedProblemIds(newBookmarks);

    try {
      await updateUserAssetState("problem", id, { is_bookmarked: !isCurrentlyBookmarked });
    } catch (err) {
      console.error("Failed to update bookmark in DB:", err);
    }
  };

  // Compile lists for filter suggestions
  const { platformsList, tagsList, companiesList } = useMemo(() => {
    const platforms = new Set<string>();
    const tags = new Set<string>();
    const companies = new Set<string>();

    problems.forEach(p => {
      if (p.platform) platforms.add(p.platform);
      if (p.attributes?.tags) p.attributes.tags.forEach((t: string) => tags.add(t));
      if (p.attributes?.company_tags) p.attributes.company_tags.forEach((c: string) => companies.add(c));
    });

    return {
      platformsList: Array.from(platforms).sort(),
      tagsList: Array.from(tags).sort(),
      companiesList: Array.from(companies).sort()
    };
  }, [problems]);

  // Filters logic
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchPlatform = selectedPlatform === "All" || p.platform === selectedPlatform;
      const matchTags = selectedTags.length === 0 || selectedTags.every((t: string) => p.attributes?.tags?.includes(t));
      const matchCompanies = selectedCompanies.length === 0 || selectedCompanies.some((c: string) => p.attributes?.company_tags?.includes(c));
      const matchStatus = selectedStatus === "All" || (
        selectedStatus === "Pending" && (problemStatusMap[p.id] === "pending" || !problemStatusMap[p.id])
      ) || (
        selectedStatus === "Revision" && problemStatusMap[p.id] === "revision"
      ) || (
        selectedStatus === "Done" && problemStatusMap[p.id] === "done"
      );
      const matchBookmark = selectedBookmark === "All" || (
        selectedBookmark === "Bookmarked" && bookmarkedProblemIds.includes(p.id)
      );

      return matchSearch && matchDiff && matchPlatform && matchTags && matchCompanies && matchStatus && matchBookmark;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedPlatform, selectedTags, selectedCompanies, selectedStatus, selectedBookmark, problemStatusMap, bookmarkedProblemIds]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter(p => solvedProblemIds.includes(p.id)).length;
    const easyTotal = problems.filter(p => p.difficulty === "Easy").length;
    const easySolved = problems.filter(p => p.difficulty === "Easy" && solvedProblemIds.includes(p.id)).length;
    const mediumTotal = problems.filter(p => p.difficulty === "Medium").length;
    const mediumSolved = problems.filter(p => p.difficulty === "Medium" && solvedProblemIds.includes(p.id)).length;
    const hardTotal = problems.filter(p => p.difficulty === "Hard").length;
    const hardSolved = problems.filter(p => p.difficulty === "Hard" && solvedProblemIds.includes(p.id)).length;

    return {
      total, solved, percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      easyTotal, easySolved,
      mediumTotal, mediumSolved,
      hardTotal, hardSolved
    };
  }, [problems, solvedProblemIds]);

  const hasActiveFilters = !!searchQuery || selectedDifficulty !== "All" || selectedPlatform !== "All" || selectedTags.length > 0 || selectedCompanies.length > 0 || selectedStatus !== "All" || selectedBookmark !== "All";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("All");
    setSelectedPlatform("All");
    setSelectedTags([]);
    setSelectedCompanies([]);
    setSelectedStatus("All");
    setSelectedBookmark("All");
  };

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProblems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDifficulty, selectedPlatform, selectedTags, selectedCompanies, selectedStatus, selectedBookmark]);

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

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 py-2 sm:py-8 select-none">
      {/* Back link */}
      <div className="mb-4 flex items-center justify-between px-1">
        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-500 font-semibold transition-colors"
        >
          <ArrowLeft size={13} />
          <span>All Practice Problems</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <PageHeader
          title={
            <>
              {title} {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                Problems
              </span>
            </>
          }
          subtitle={`Master coding questions on ${title}. Solve interactive exercises, explore complexity profiles, and prepare for interviews.`}
          accent="brand"
        />
      </div>

      {/* Filters (Full Width) */}
      <div className="mb-6">
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
}
