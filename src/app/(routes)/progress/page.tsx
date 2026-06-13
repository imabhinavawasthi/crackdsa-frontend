"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  ArrowRight, 
  Dumbbell, 
  Zap, 
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Video,
  Bookmark,
  Notebook,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStoredToken } from "@/functions/auth";
import { calculateActiveStreak } from "@/utils/streak";
import LoginRequired from "@/components/common/LoginRequired";
import ActivityHeatmap from "@/components/common/ActivityHeatmap";

// Normalizes a date to YYYY-MM-DD string
const formatDateKey = (date: Date): string => {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
};

export default function ProgressPage() {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [userStates, setUserStates] = useState<any[]>([]);

  // Heatmap State
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const firstName = user?.full_name?.split(" ")[0] || "Learner";

  // Fetch all problems & user states on mount
  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getStoredToken();
        const headers = token ? { "Authorization": `Bearer ${token}` } : undefined;

        // 1. Fetch practice problems
        const problemsRes = await fetch(`${backendUrl}/api/v1/practice-problems`, { headers });
        let problemsList: any[] = [];
        if (problemsRes.ok) {
          problemsList = await problemsRes.json();
          setProblems(problemsList);
        }

        // 2. Fetch User progress states
        if (isLoggedIn) {
          const statesRes = await fetch(`${backendUrl}/api/v1/user/assets/states`, { headers });
          if (statesRes.ok) {
            const statesData = await statesRes.json();
            setUserStates(statesData || []);
          }
        } else {
          // Guest Fallback
          const states: any[] = [];
          const storedSolved = localStorage.getItem("crackdsa_solved_problems");
          const solvedIds = storedSolved ? JSON.parse(storedSolved) : [];
          const storedBookmarks = localStorage.getItem("crackdsa_bookmarked_problems");
          const bookmarkedIds = storedBookmarks ? JSON.parse(storedBookmarks) : [];
          const storedStatusMap = localStorage.getItem("crackdsa_problem_status_map");
          const statusMap = storedStatusMap ? JSON.parse(storedStatusMap) : {};

          solvedIds.forEach((id: string) => {
            if (!statusMap[id]) statusMap[id] = "done";
          });

          const todayIso = new Date().toISOString();
          const interactedProblemIds = new Set([...solvedIds, ...bookmarkedIds, ...Object.keys(statusMap)]);

          interactedProblemIds.forEach((id) => {
            const problemObj = problemsList.find((p) => p.id === id);
            const statusVal = statusMap[id] || "pending";
            const isBookmarked = bookmarkedIds.includes(id);

            let notesArr: any[] = [];
            if (problemObj?.slug) {
              const notesKey = `notes-dsa-bootcamp-recordings-problem-${problemObj.slug}`;
              const savedNotes = localStorage.getItem(notesKey);
              if (savedNotes) {
                try {
                  notesArr = JSON.parse(savedNotes);
                } catch (e) {
                  console.error("Failed to parse notes for ", problemObj.slug, e);
                }
              }
            }

            states.push({
              asset_id: id,
              asset_type: "problem",
              status: statusVal,
              is_bookmarked: isBookmarked,
              notes: notesArr,
              last_interacted_at: todayIso,
              updated_at: todayIso
            });
          });

          setUserStates(states);
        }
      } catch (err: any) {
        console.error("Error loading progress data:", err);
        setError("Unable to sync progress details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [isLoggedIn, backendUrl]);

  // Aggregate user statistics
  const stats = useMemo(() => {
    const solvedProblemIds = userStates
      .filter(state => state.asset_type === "problem" && state.status === "done")
      .map(state => state.asset_id);
    const problemsSolved = solvedProblemIds.length;

    const articlesRead = userStates
      .filter(state => state.asset_type === "article" && state.status === "done")
      .length;

    const lecturesCompleted = userStates
      .filter(state => state.asset_type === "video" && state.status === "done")
      .length;

    const bookmarkedItems = userStates
      .filter(state => state.is_bookmarked)
      .sort((a, b) => new Date(b.updated_at || b.last_interacted_at || 0).getTime() - new Date(a.updated_at || a.last_interacted_at || 0).getTime());
    const bookmarkedCount = bookmarkedItems.length;

    const interactionDates = userStates
      .map(state => state.updated_at || state.last_interacted_at)
      .filter(Boolean);

    const streak = calculateActiveStreak(interactionDates);

    const easyTotal = problems.filter(p => p.difficulty === "Easy").length;
    const easySolved = problems.filter(p => p.difficulty === "Easy" && solvedProblemIds.includes(p.id)).length;
    const mediumTotal = problems.filter(p => p.difficulty === "Medium").length;
    const mediumSolved = problems.filter(p => p.difficulty === "Medium" && solvedProblemIds.includes(p.id)).length;
    const hardTotal = problems.filter(p => p.difficulty === "Hard").length;
    const hardSolved = problems.filter(p => p.difficulty === "Hard" && solvedProblemIds.includes(p.id)).length;

    const allNotes: any[] = [];
    userStates.forEach(state => {
      if (state.notes && Array.isArray(state.notes)) {
        state.notes.forEach((note: any) => {
          allNotes.push({ ...note, asset_id: state.asset_id, asset_type: state.asset_type });
        });
      }
    });
    allNotes.sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());

    const heatmapActivity: Record<string, number> = {};
    interactionDates.forEach(dateStr => {
      const key = formatDateKey(new Date(dateStr));
      heatmapActivity[key] = (heatmapActivity[key] || 0) + 1;
    });

    return {
      problemsSolved,
      articlesRead,
      lecturesCompleted,
      bookmarkedCount,
      bookmarkedItems,
      streak,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved,
      recentNotes: allNotes.slice(0, 3),
      heatmapActivity
    };
  }, [userStates, problems]);

  // Generates days for the selected Month and Year
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0); // last day of month
    
    // Align to the start of that week (Sunday)
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    // Align end to the following Saturday
    const endDay = endDate.getDay();
    endDate.setDate(endDate.getDate() + (6 - endDay));

    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return days;
  }, [selectedYear, selectedMonth]);



  const getBookmarkDetails = (state: any) => {
    if (state.asset_type === "problem") {
      const problem = problems.find((p) => p.id === state.asset_id);
      return {
        title: problem?.title || "Unknown Problem",
        subtitle: problem?.difficulty || "Problem",
        href: problem?.slug ? `/problem/${problem.slug}` : "#",
        icon: <Dumbbell size={12} />,
        iconColor: "bg-brand-500/10 text-brand-500",
        diffColor:
          problem?.difficulty === "Easy"
            ? "text-emerald-500"
            : problem?.difficulty === "Hard"
            ? "text-rose-500"
            : "text-amber-500",
      };
    }
    if (state.asset_type === "video") {
      return {
        title: state.asset_id || "Video Lesson",
        subtitle: "Video",
        href: `/profile/bookmarks`,
        icon: <Video size={12} />,
        iconColor: "bg-blue-500/10 text-blue-500",
        diffColor: "text-blue-500",
      };
    }
    return {
      title: state.asset_id || "Article",
      subtitle: "Article",
      href: `/profile/bookmarks`,
      icon: <BookOpen size={12} />,
      iconColor: "bg-purple-500/10 text-purple-500",
      diffColor: "text-purple-500",
    };
  };

  const getNoteTargetInfo = (note: any) => {
    if (note.asset_type === "problem") {
      const problem = problems.find((p) => p.id === note.asset_id);
      return {
        title: problem?.title || "Unknown Problem",
        type: "Problem",
        icon: <Dumbbell size={10} className="text-brand-500" />,
        iconBg: "bg-brand-500/10",
      };
    }
    if (note.asset_type === "video") {
      return {
        title: note.asset_id || "Video Lesson",
        type: "Video",
        icon: <Video size={10} className="text-blue-500" />,
        iconBg: "bg-blue-500/10",
      };
    }
    return {
      title: note.asset_id || "Article",
      type: "Article",
      icon: <BookOpen size={10} className="text-purple-500" />,
      iconBg: "bg-purple-500/10",
    };
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12 select-none">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-150 dark:border-gray-850 pb-5 animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-4 w-72 bg-gray-150 dark:bg-gray-850 rounded-lg" />
          </div>
          <div className="h-12 w-48 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <LoginRequired
          title="Progress Tracking Requires Sign In"
          description="Sign in to track your learning journey, view your activity heatmap, streaks, notes, and saved bookmarks."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 select-none">
      
      {/* 1. Sleek Compact Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-150 dark:border-gray-850 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <Sparkles size={20} className="text-brand-500" />
            </span>
            My Progress
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Welcome back, <span className="text-gray-850 dark:text-gray-200 font-bold">{firstName}</span>! Tracking your study stats, heatmap activity, and personal notes.
          </p>
        </div>

        {/* Compact Solved Difficulty Pill */}
        <div className="flex items-center gap-4 bg-gray-50/60 dark:bg-gray-900/30 border border-gray-200/60 dark:border-gray-800/50 rounded-2xl px-5 py-2.5 shadow-xs">
          <div className="text-center">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Easy</span>
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{stats.easySolved}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-850" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Medium</span>
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{stats.mediumSolved}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-850" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Hard</span>
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{stats.hardSolved}</span>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: stats.problemsSolved, icon: <CheckCircle2 size={16} className="text-emerald-500" />, colorClass: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" },
          { label: "Active Streak", value: `${stats.streak} Days`, icon: <Zap size={16} className="text-amber-500" />, colorClass: "bg-amber-500/5 text-amber-500 border-amber-500/10" },
          { label: "Lectures Watched", value: stats.lecturesCompleted, icon: <Video size={16} className="text-blue-500" />, colorClass: "bg-blue-500/5 text-blue-500 border-blue-500/10" },
          { label: "Articles Read", value: stats.articlesRead, icon: <BookOpen size={16} className="text-purple-500" />, colorClass: "bg-purple-500/5 text-purple-500 border-purple-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between mb-3">
               <div className={`p-2.5 rounded-xl border ${stat.colorClass}`}>{stat.icon}</div>
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
               <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Heatmap & Difficulty Overview Grid */}
      {/* 3. Interactive Contribution Heatmap (Full Width) */}
      <ActivityHeatmap
        calendarDays={calendarDays}
        heatmapActivity={stats.heatmapActivity}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {/* 4. Details Grid (3 columns on lg, 1 column on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Solved Problem Difficulty Breakdown */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Dumbbell size={14} className="text-brand-500" />
              <span>Practice Difficulty Overview</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Syllabus category ratios</p>
          </div>

          <div className="space-y-4 py-2">
            {/* Easy Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-emerald-500">Easy Category</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-550 dark:text-gray-400">{stats.easySolved} / {stats.easyTotal || 20}</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    {stats.easyTotal > 0 ? Math.round((stats.easySolved / stats.easyTotal) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${stats.easyTotal > 0 ? (stats.easySolved / stats.easyTotal) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Medium Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-amber-500">Medium Category</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-550 dark:text-gray-400">{stats.mediumSolved} / {stats.mediumTotal || 35}</span>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                    {stats.mediumTotal > 0 ? Math.round((stats.mediumSolved / stats.mediumTotal) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${stats.mediumTotal > 0 ? (stats.mediumSolved / stats.mediumTotal) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Hard Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-rose-500">Hard Category</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-550 dark:text-gray-400">{stats.hardSolved} / {stats.hardTotal || 15}</span>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded-md">
                    {stats.hardTotal > 0 ? Math.round((stats.hardSolved / stats.hardTotal) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-700" style={{ width: `${stats.hardTotal > 0 ? (stats.hardSolved / stats.hardTotal) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center border-t border-gray-100 dark:border-gray-900 pt-3 shrink-0">
            Total Problems Solved: {stats.problemsSolved}
          </div>
        </div>

        {/* Bookmarked Library Panel */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-1 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Bookmark size={14} className="text-brand-500" />
              <span>Bookmarked Library ({stats.bookmarkedCount})</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Quick-access saved practice items</p>
          </div>

          <div className="flex-grow py-2">
            {stats.bookmarkedCount === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-550 font-medium">No bookmarked items yet. Bookmark items to view them here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.bookmarkedItems.slice(0, 3).map((state: any) => {
                  const details = getBookmarkDetails(state);
                  return (
                    <div key={`${state.asset_type}-${state.asset_id}`} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 hover:bg-gray-100/30 dark:hover:bg-gray-900/20 transition-all select-none animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${details.iconColor}`}>
                          {details.icon}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <Link href={details.href} className="text-xs font-bold text-gray-850 dark:text-gray-200 hover:text-brand-500 truncate block cursor-pointer">
                            {details.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${details.diffColor}`}>
                              {details.subtitle}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-150 dark:bg-gray-900 px-1.5 py-0.2 rounded-md">
                              {state.asset_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={details.href} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-500/5 transition-all cursor-pointer">
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="shrink-0 pt-2 border-t border-gray-100 dark:border-gray-900 text-center">
            <Link href="/profile/bookmarks" className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-bold uppercase tracking-wider cursor-pointer">
              <span>View all bookmarks</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Notepad Summary Feed */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-1 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Notebook size={14} className="text-brand-500" />
              <span>Recent Notepad Entries ({stats.recentNotes.length})</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Overview of your comments and notations</p>
          </div>

          <div className="flex-grow py-2">
            {stats.recentNotes.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-550 font-medium">No notebook comments recorded. Write notes inside workspaces to view them.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recentNotes.map((note) => {
                  const targetInfo = getNoteTargetInfo(note);
                  return (
                    <div key={note.id} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 space-y-2 select-none hover:shadow-xs transition-all animate-fadeIn">
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`p-1 rounded ${targetInfo.iconBg}`}>
                            {targetInfo.icon}
                          </span>
                          <span className="truncate max-w-[130px]">{targetInfo.title}</span>
                          <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded-sm bg-gray-250/20 dark:bg-gray-800/40 text-gray-450 shrink-0">
                            {targetInfo.type}
                          </span>
                        </div>
                        <span className="shrink-0">{note.createdAt || note.created_at}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-750 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="shrink-0 pt-2 border-t border-gray-100 dark:border-gray-900 text-center">
            <Link href="/profile/notes" className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-bold uppercase tracking-wider cursor-pointer">
              <span>View all notes</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
