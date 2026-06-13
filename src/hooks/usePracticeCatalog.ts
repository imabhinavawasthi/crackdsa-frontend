import { useState, useEffect, useMemo } from "react";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";
import { PracticeProblem } from "@/types/practice";

interface UsePracticeCatalogProps {
  fetchFn: () => Promise<any[]>;
  isLoggedIn: boolean;
  itemsPerPage?: number;
}

export function usePracticeCatalog({ fetchFn, isLoggedIn, itemsPerPage = 10 }: UsePracticeCatalogProps) {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(isLoggedIn);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);

  // Progress State
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
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  // Load progress states on mount/auth-change
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isLoggedIn) {
        setLoadingProgress(false);
        return;
      }
      try {
        setLoadingProgress(true);
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
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchUserProgress();
  }, [isLoggedIn]);

  // Fetch problems list
  useEffect(() => {
    const getProblems = async () => {
      try {
        setLoadingProblems(true);
        setError(null);
        const data = await fetchFn();
        setProblems(data || []);
      } catch (err: any) {
        console.error("Error loading problems:", err);
        setError(err.message || "Failed to load problems.");
      } finally {
        setLoadingProblems(false);
      }
    };

    getProblems();
  }, [fetchFn]);

  const loading = loadingProblems || loadingProgress;

  // Toggle solved state with DB upsert
  const handleToggleSolved = async (id: string, slug: string, e: React.MouseEvent) => {
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
  const handleToggleBookmark = async (id: string, slug: string, e: React.MouseEvent) => {
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
      const matchTags = selectedTags.length === 0 || selectedTags.every(t => p.attributes?.tags?.includes(t));
      const matchCompanies = selectedCompanies.length === 0 || selectedCompanies.some(c => p.attributes?.company_tags?.includes(c));
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

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPageState);
  const paginatedProblems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPageState;
    return filteredProblems.slice(startIdx, startIdx + itemsPerPageState);
  }, [filteredProblems, currentPage, itemsPerPageState]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDifficulty, selectedPlatform, selectedTags, selectedCompanies, selectedStatus, selectedBookmark]);

  return {
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
    itemsPerPage: itemsPerPageState,
    setItemsPerPage: setItemsPerPageState,
    totalPages,
    handleToggleSolved,
    handleToggleBookmark,
    platformsList,
    tagsList,
    companiesList,
    stats,
    hasActiveFilters,
    resetFilters,
  };
}
