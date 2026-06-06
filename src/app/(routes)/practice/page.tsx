"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  SlidersHorizontal,
  Code2,
  Trophy,
  Target,
  Flame,
  Sparkles,
  Hash,
  Building2,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredToken } from "@/functions/auth";
import ProblemViewer from "@/components/learning/ProblemViewer";
import PageHeader from "@/components/common/PageHeader";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatTag } from "@/utils/string";

type PracticeProblem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url: string | null;
  solutions: Record<string, any>;
  resources: {
    video_lectures?: string[];
    related_articles?: Array<{ id: string; title: string; slug: string }>;
  };
  attributes: {
    tags?: string[];
    company_tags?: string[];
    hints?: string[];
  };
  is_active: boolean;
};

/* ─── Multiselect Combobox Component ──────────────────────────────── */
function MultiSelectCombobox({
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
                <button onClick={() => setSearchValue("")} className="text-gray-400 hover:text-gray-600 cursor-pointer">
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
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-900"
                  >
                    <div
                      className={`flex items-center justify-center w-4 h-4 rounded border transition-all ${
                        isSelected
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-normal truncate">{formatTag(option)}</span>
                  </Command.Item>
                );
              })}
            </Command.List>

            {selected.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{selected.length} selected</span>
                <button
                  onClick={() => onChange([])}
                  className="text-[10px] text-brand-500 hover:text-brand-600 font-medium cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ─── Selected Tags Pills Row ─────────────────────────────────────── */
function SelectedPills({
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

/* ─── Main Practice Page ──────────────────────────────────────────── */
export default function PracticeProblemsPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solved status tracked in localStorage
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>([]);
  const [problemStatusMap, setProblemStatusMap] = useState<Record<string, "pending" | "done" | "revision">>({});

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedBookmark, setSelectedBookmark] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Slide-over Sheet State
  const [activeProblemSlug, setActiveProblemSlug] = useState<string | null>(null);
  const [activeProblemData, setActiveProblemData] = useState<any | null>(null);
  const [loadingProblemDetail, setLoadingProblemDetail] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUserProgress = async () => {
      const token = getStoredToken();
      if (!token || !isLoggedIn) return;
      try {
        const res = await fetch(`${backendUrl}/api/v1/user/assets/states`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          
          const statusMap: Record<string, "pending" | "done" | "revision"> = {};
          const solvedIds: string[] = [];
          const bookmarkedIds: string[] = [];

          data.forEach((state: any) => {
            if (state.asset_type === "problem") {
              statusMap[state.asset_id] = state.status || "pending";
              if (state.status === "done") {
                solvedIds.push(state.asset_id);
              }
              if (state.is_bookmarked) {
                bookmarkedIds.push(state.asset_id);
              }
            }
          });

          setProblemStatusMap(statusMap);
          setSolvedProblemIds(solvedIds);
          setBookmarkedProblemIds(bookmarkedIds);
        }
      } catch (err) {
        console.error("Error loading user progress:", err);
      }
    };

    if (isLoggedIn) {
      fetchUserProgress();
    } else {
      // Fallback to localStorage for guest users
      try {
        const storedSolved = localStorage.getItem("crackdsa_solved_problems");
        const solvedIds = storedSolved ? JSON.parse(storedSolved) : [];
        setSolvedProblemIds(solvedIds);

        const storedBookmarks = localStorage.getItem("crackdsa_bookmarked_problems");
        const bookmarkedIds = storedBookmarks ? JSON.parse(storedBookmarks) : [];
        setBookmarkedProblemIds(bookmarkedIds);

        const storedStatusMap = localStorage.getItem("crackdsa_problem_status_map");
        const statusMap = storedStatusMap ? JSON.parse(storedStatusMap) : {};
        
        // Backwards compatibility: seed statusMap with solvedIds if empty
        solvedIds.forEach((id: string) => {
          if (!statusMap[id]) statusMap[id] = "done";
        });

        setProblemStatusMap(statusMap);
      } catch (err) {
        console.error("Failed to read solved problems storage:", err);
      }
    }
  }, [isLoggedIn, backendUrl]);

  // Fetch problems list
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getStoredToken();
        const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;
        
        const res = await fetch(`${backendUrl}/api/v1/practice-problems`, { headers });
        if (!res.ok) {
          throw new Error("Unable to fetch practice problems catalog.");
        }
        const data = await res.json();
        setProblems(data || []);
      } catch (err: any) {
        console.error("Error loading problems list:", err);
        setError(err.message || "Failed to load practice problems.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [backendUrl]);

  // Redirect to the dedicated problem page
  const handleOpenProblem = (slug: string) => {
    router.push(`/problem/${slug}`);
  };

  // Toggle solved state with DB upsert
  const handleToggleSolved = async (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStatus = problemStatusMap[id] || "pending";
    let newStatus: "pending" | "done" | "revision" = "done";
    
    if (currentStatus === "done" || currentStatus === "revision") {
      newStatus = "pending";
    } else {
      newStatus = "done";
    }

    const newSolved = newStatus === "done"
      ? (solvedProblemIds.includes(id) ? solvedProblemIds : [...solvedProblemIds, id])
      : solvedProblemIds.filter(pid => pid !== id);

    // 1. Optimistic UI update
    setSolvedProblemIds(newSolved);
    setProblemStatusMap(prev => ({
      ...prev,
      [id]: newStatus
    }));

    if (isLoggedIn) {
      // 2. Save to Backend API
      const token = getStoredToken();
      if (token) {
        try {
          await fetch(`${backendUrl}/api/v1/user/assets/states/problem/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              status: newStatus
            })
          });
        } catch (err) {
          console.error("Failed to update problem status in database:", err);
        }
      }
    } else {
      // 3. Fallback to localStorage for guest
      localStorage.setItem("crackdsa_solved_problems", JSON.stringify(newSolved));
      
      // Update guest status map in localStorage
      try {
        const storedStatusMap = localStorage.getItem("crackdsa_problem_status_map");
        const statusMap = storedStatusMap ? JSON.parse(storedStatusMap) : {};
        statusMap[id] = newStatus;
        localStorage.setItem("crackdsa_problem_status_map", JSON.stringify(statusMap));
        
        // Also update individual problem-state details key
        const problemKey = `problem-state-${slug}`;
        const saved = localStorage.getItem(problemKey);
        let current = saved ? JSON.parse(saved) : {};
        current.status = newStatus;
        localStorage.setItem(problemKey, JSON.stringify(current));
      } catch (e) {
        console.error("Failed to update guest solved progress:", e);
      }
    }
  };

  // Toggle bookmarked state with DB upsert
  const handleToggleBookmark = async (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyBookmarked = bookmarkedProblemIds.includes(id);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedProblemIds.filter(pid => pid !== id)
      : [...bookmarkedProblemIds, id];

    // 1. Optimistic UI update
    setBookmarkedProblemIds(newBookmarks);

    if (isLoggedIn) {
      // 2. Save to Backend API
      const token = getStoredToken();
      if (token) {
        try {
          await fetch(`${backendUrl}/api/v1/user/assets/states/problem/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              is_bookmarked: !isCurrentlyBookmarked
            })
          });
        } catch (err) {
          console.error("Failed to update bookmark state in database:", err);
        }
      }
    } else {
      // 3. Fallback to localStorage for guest
      localStorage.setItem("crackdsa_bookmarked_problems", JSON.stringify(newBookmarks));
      
      // Also update individual problem-state details key
      try {
        const problemKey = `problem-state-${slug}`;
        const saved = localStorage.getItem(problemKey);
        let current = saved ? JSON.parse(saved) : {};
        current.is_bookmarked = !isCurrentlyBookmarked;
        localStorage.setItem(problemKey, JSON.stringify(current));
      } catch (e) {
        console.error("Failed to update guest bookmark progress:", e);
      }
    }
  };

  // Dynamic filter catalogs extracted from loaded problems
  const platformsList = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.platform) set.add(p.platform);
    });
    return Array.from(set).sort();
  }, [problems]);

  const tagsList = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.attributes?.tags) {
        p.attributes.tags.forEach(t => set.add(t));
      }
    });
    return Array.from(set).sort();
  }, [problems]);

  const companiesList = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.attributes?.company_tags) {
        p.attributes.company_tags.forEach(c => set.add(c));
      }
    });
    return Array.from(set).sort();
  }, [problems]);

  // Filter logic — multiselect for tags & companies
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchPlatform = selectedPlatform === "All" || p.platform === selectedPlatform;
      
      // Multiselect: problem must have ALL selected tags
      const matchTags = selectedTags.length === 0 || 
        selectedTags.every(tag => p.attributes?.tags?.includes(tag));
      
      // Multiselect: problem must have at least ONE selected company
      const matchCompanies = selectedCompanies.length === 0 ||
        selectedCompanies.some(company => p.attributes?.company_tags?.includes(company));

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

  // Completion Stats
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

  const hasActiveFilters = searchQuery || 
                           selectedDifficulty !== "All" || 
                           selectedPlatform !== "All" || 
                           selectedTags.length > 0 || 
                           selectedCompanies.length > 0 ||
                           selectedStatus !== "All" ||
                           selectedBookmark !== "All";

  const tickerItems = useMemo(() => {
    const items: string[] = [];
    if (companiesList.length > 0) {
      companiesList.slice(0, 10).forEach(c => items.push(formatTag(c)));
    } else {
      items.push("Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Uber");
    }
    if (tagsList.length > 0) {
      tagsList.slice(0, 12).forEach(t => items.push(formatTag(t)));
    } else {
      items.push("Dynamic Programming", "Graphs", "Trees", "Recursion", "Arrays", "Binary Search", "Two Pointers");
    }
    return items;
  }, [companiesList, tagsList]);

  const headerSlides = useMemo(() => [
    {
      title: "SDE Prep Coding Sheets",
      description: "Curated collections of must-do problems to crack top product companies.",
      badge: "Featured Track",
      color: "brand" as const,
      icon: Sparkles,
      href: "/dsa-sheet",
    },
    {
      title: "Topic-wise Mastery",
      description: "Practice patterns systematically from Arrays to Dynamic Programming.",
      badge: "Practice Path",
      color: "violet" as const,
      icon: Target,
      href: "/practice/topics",
    },
    {
      title: "CrackDSA Community",
      description: "Connect with fellow learners, discuss approaches, and share experiences.",
      badge: "Discussion",
      color: "emerald" as const,
      icon: Trophy,
      href: "/community",
    },
  ], []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDifficulty, selectedPlatform, selectedTags, selectedCompanies, selectedStatus, selectedBookmark]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const paginatedProblems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("All");
    setSelectedPlatform("All");
    setSelectedTags([]);
    setSelectedCompanies([]);
    setSelectedStatus("All");
    setSelectedBookmark("All");
  };

  const getDifficultyConfig = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case "Easy": return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15", barColor: "bg-emerald-500", icon: <Target size={13} /> };
      case "Medium": return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/8 border-amber-500/15", barColor: "bg-amber-500", icon: <Flame size={13} /> };
      case "Hard": return { color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/8 border-rose-500/15", barColor: "bg-rose-500", icon: <Sparkles size={13} /> };
    }
  };

  const getPlatformConfig = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("leetcode")) {
      return "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-orange-400 border border-orange-500/15";
    }
    if (p.includes("geeksforgeeks") || p === "gfg") {
      return "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-teal-400 border border-teal-500/15";
    }
    if (p.includes("codeforces")) {
      return "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15";
    }
    if (p.includes("codechef")) {
      return "bg-gradient-to-r from-amber-700/10 to-yellow-600/10 text-amber-700 dark:text-amber-500 border border-amber-600/15";
    }
    return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800";
  };

  if (loading && problems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 select-none animate-in fade-in duration-300">
        {/* Hero Header Skeleton */}
        <div className="rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
            <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="w-full md:w-80 h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse shrink-0 border border-gray-200/40 dark:border-gray-800/40" />
        </div>

        {/* Filters and Progress Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 space-y-4">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-805 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-center py-1">
              <div className="w-20 h-20 rounded-full border-8 border-gray-100 dark:border-gray-850 animate-pulse flex items-center justify-center" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-900/60 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-900/60 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex justify-between bg-gray-50/50 dark:bg-gray-900/30">
            <div className="h-4 w-10 bg-gray-205 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-205 dark:bg-gray-800 rounded animate-pulse flex-grow max-w-xs" />
            <div className="h-4 w-16 bg-gray-205 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-205 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-205 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-900">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="p-4.5 flex items-center justify-between gap-4">
                <div className="h-5 w-5 bg-gray-100 dark:bg-gray-900 rounded-full animate-pulse shrink-0" />
                <div className="h-5 w-5 bg-gray-100 dark:bg-gray-900 rounded animate-pulse shrink-0" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-grow max-w-sm" />
                <div className="h-6 w-16 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse shrink-0" />
                <div className="h-6 w-20 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse shrink-0" />
                <div className="h-6 w-24 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse shrink-0" />
                <div className="h-4 w-4 bg-gray-100 dark:bg-gray-900 rounded animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      
      {/* ───── 1. Hero Header ───── */}
      <div className="mb-10">
        <PageHeader
          badge="Practice Ground"
          badgeIcon={Code2}
          title={
            <>
              DSA {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                Problems
              </span>
            </>
          }
          subtitle="Solve curated problems across top platforms. Browse editorial solutions, track your progress, and prepare for interviews."
          accent="brand"
          rotatorItems={["Dynamic Programming", "Graph Algorithms", "Recursion & Backtracking", "Tree Traversals", "Greedy Approaches", "Bit Manipulation"]}
          rotatorPrefix="Master concepts like "
          rotatorSuffix=" to ace your coding interviews."
          tickerItems={tickerItems}
          tickerLabel="Target Companies & Core Topics:"
          slides={headerSlides}
        />
      </div>

      {/* ───── 2. Middle Controls Row (2-column layout) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Column: Filters (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
            {/* Filter Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
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
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-semibold cursor-pointer transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="p-5 space-y-4 flex-grow">
              <div className="relative md:col-span-1">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 pl-9 text-xs font-normal placeholder:text-gray-400 dark:placeholder:text-gray-550 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-gray-800 dark:text-gray-200 transition-all shadow-sm"
                  />
                  <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                      <X size={13} />
                    </button>
                  )}
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Search */}
                

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Topics Multiselect */}
                <MultiSelectCombobox
                  options={tagsList}
                  selected={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Select Topics..."
                  icon={<Hash size={13} className="text-gray-400 shrink-0" />}
                  emptyLabel="No topic tags available."
                />

                {/* Companies Multiselect */}
                <MultiSelectCombobox
                  options={companiesList}
                  selected={selectedCompanies}
                  onChange={setSelectedCompanies}
                  placeholder="Select Companies..."
                  icon={<Building2 size={13} className="text-gray-400 shrink-0" />}
                  emptyLabel="No company tags available."
                />
              </div>

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
        </div>

        {/* Right Column: Progress Card with Donut Chart (1/3 width on desktop) */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
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
              <p className="text-[9px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">Overall Ratio</p>
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

      </div>

      {/* ───── 4. Results Count ───── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-xs text-gray-400">
          Showing <span className="font-medium text-gray-600 dark:text-gray-300">{filteredProblems.length}</span> of {problems.length} problems
        </p>
      </div>

      {/* ───── 5. Problems Table ───── */}
      {error ? (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-600">Error Loading Practice Ground</h4>
            <p className="text-xs text-gray-450 dark:text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800/80">
                  <th className="py-4 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-16 text-center">Status</th>
                  <th className="py-4 px-4 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-10 text-center">
                    <Bookmark size={11} className="mx-auto" />
                  </th>
                  <th className="py-4 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest">Problem</th>
                  <th className="py-4 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-28">Difficulty</th>
                  <th className="py-4 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-32">Platform</th>
                  <th className="py-4 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-48">Topics</th>
                  <th className="py-4 px-5 font-bold text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest w-12 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-900 bg-transparent">
                {paginatedProblems.map((prob, index) => {
                  const isSolved = solvedProblemIds.includes(prob.id);
                  const isBookmarked = bookmarkedProblemIds.includes(prob.id);
                  const diffConfig = getDifficultyConfig(prob.difficulty);
                  const platformClass = getPlatformConfig(prob.platform);
                  return (
                    <tr 
                      key={prob.id}
                      onClick={() => handleOpenProblem(prob.slug)}
                      className="group hover:bg-gray-50/45 dark:hover:bg-gray-900/30 cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-500"
                    >
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleSolved(prob.id, prob.slug, e)}
                          className="focus:outline-none flex items-center justify-center mx-auto"
                          title={problemStatusMap[prob.id] === "done" ? "Mark as unsolved" : problemStatusMap[prob.id] === "revision" ? "Revision required - click to mark as unsolved" : "Mark as solved"}
                        >
                          {problemStatusMap[prob.id] === "done" ? (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 scale-100 transition-all hover:scale-110 active:scale-95">
                              <Check size={11} strokeWidth={3.5} />
                            </div>
                          ) : problemStatusMap[prob.id] === "revision" ? (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white shadow-sm shadow-amber-500/20 scale-100 transition-all hover:scale-110 active:scale-95">
                              <Check size={11} strokeWidth={3.5} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 text-transparent transition-all hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/5 hover:scale-110 active:scale-95">
                              <Check size={9} strokeWidth={3.5} />
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(prob.id, prob.slug, e)}
                          className="focus:outline-none flex items-center justify-center mx-auto"
                          title={isBookmarked ? "Remove bookmark" : "Bookmark problem"}
                        >
                          <Bookmark 
                            size={14} 
                            className={`transition-all hover:scale-125 active:scale-95 ${
                              isBookmarked 
                                ? "text-amber-500 fill-amber-500" 
                                : "text-gray-300 dark:text-gray-700 hover:text-amber-500/80"
                            }`} 
                          />
                        </button>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-[13px] font-medium transition-colors ${
                          isSolved 
                            ? "text-gray-400 dark:text-gray-500 font-normal italic animate-fade-in" 
                            : "text-gray-800 dark:text-gray-100 font-semibold group-hover:text-brand-500"
                        }`}>
                          {prob.title}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide border uppercase ${diffConfig.bg} ${diffConfig.color}`}>
                          {diffConfig.icon}
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${platformClass}`}>
                            {prob.platform}
                          </span>
                          {prob.problem_url && (
                            <a
                              href={prob.problem_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-300 dark:text-gray-600 hover:text-brand-500 transition-colors"
                              title={`Solve on ${prob.platform}`}
                            >
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1">
                          {prob.attributes?.tags?.slice(0, 3).map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-550 dark:text-gray-400 text-[10px] font-medium border border-gray-100 dark:border-gray-800/80">
                              {formatTag(t)}
                            </span>
                          ))}
                          {prob.attributes?.tags && prob.attributes.tags.length > 3 && (
                            <span className="text-[10px] text-gray-450 dark:text-gray-500 font-semibold pl-1 self-center">
                              +{prob.attributes.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <ChevronRight 
                          size={15} 
                          className="inline-block text-gray-300 dark:text-gray-700 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all duration-300" 
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
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
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProblems.length)}-
                  {Math.min(currentPage * itemsPerPage, filteredProblems.length)}
                </span> of <span className="font-semibold text-gray-600 dark:text-gray-300">{filteredProblems.length}</span> problems
              </p>
              
              <div className="flex items-center gap-2">
                {/* Previous Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                          onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───── 6. Problem Slide-over Sheet ───── */}
      <AnimatePresence>
        {isSheetOpen && activeProblemSlug && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[68%] lg:w-[58%] xl:w-[52%] bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Code2 size={14} />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Problem Workspace
                  </span>
                </div>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingProblemDetail ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={24} className="animate-spin text-brand-500" />
                    <p className="text-xs text-gray-400">Loading problem details...</p>
                  </div>
                ) : activeProblemData ? (
                  <div className="animate-in fade-in-50 duration-300">
                    <ProblemViewer 
                      slug={activeProblemData.slug} 
                      problemData={activeProblemData} 
                      onStateChange={(updates) => {
                        if (updates.status !== undefined) {
                          setProblemStatusMap(prev => ({ ...prev, [activeProblemData.id]: updates.status! }));
                          if (updates.status === "done") {
                            setSolvedProblemIds(prev => prev.includes(activeProblemData.id) ? prev : [...prev, activeProblemData.id]);
                          } else {
                            setSolvedProblemIds(prev => prev.filter(id => id !== activeProblemData.id));
                          }
                        }
                        if (updates.is_bookmarked !== undefined) {
                          if (updates.is_bookmarked) {
                            setBookmarkedProblemIds(prev => prev.includes(activeProblemData.id) ? prev : [...prev, activeProblemData.id]);
                          } else {
                            setBookmarkedProblemIds(prev => prev.filter(id => id !== activeProblemData.id));
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 text-center">
                    <AlertCircle size={24} className="text-red-500" />
                    <p className="text-xs font-medium text-red-500">Failed to load problem data.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
