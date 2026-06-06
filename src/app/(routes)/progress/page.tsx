"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  ArrowRight, 
  Dumbbell, 
  Zap, 
  Timer,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Video,
  Award,
  Bookmark,
  Notebook,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStoredToken } from "@/functions/auth";
import { formatTag } from "@/utils/string";

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

        // 1. Fetch practice problems (to match details, calculate total counts)
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
          // Guest Fallback - Load progress from localStorage keys
          const states: any[] = [];

          // Solved problems key
          const storedSolved = localStorage.getItem("crackdsa_solved_problems");
          const solvedIds = storedSolved ? JSON.parse(storedSolved) : [];

          // Bookmarked problems key
          const storedBookmarks = localStorage.getItem("crackdsa_bookmarked_problems");
          const bookmarkedIds = storedBookmarks ? JSON.parse(storedBookmarks) : [];

          // Status map key
          const storedStatusMap = localStorage.getItem("crackdsa_problem_status_map");
          const statusMap = storedStatusMap ? JSON.parse(storedStatusMap) : {};

          // Seed default statuses for solved ids
          solvedIds.forEach((id: string) => {
            if (!statusMap[id]) statusMap[id] = "done";
          });

          // Compile mock asset state rows for problems present in local storage
          const todayIso = new Date().toISOString();
          
          // Collect all problem IDs we have interacted with
          const interactedProblemIds = new Set([
            ...solvedIds,
            ...bookmarkedIds,
            ...Object.keys(statusMap)
          ]);

          interactedProblemIds.forEach((id) => {
            const problemObj = problemsList.find((p) => p.id === id);
            const statusVal = statusMap[id] || "pending";
            const isBookmarked = bookmarkedIds.includes(id);

            // Fetch individual notes if available
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
    // 1. Problems Solved
    const solvedProblemIds = userStates
      .filter(state => state.asset_type === "problem" && state.status === "done")
      .map(state => state.asset_id);
    const problemsSolved = solvedProblemIds.length;

    // 2. Articles Read
    const articlesRead = userStates
      .filter(state => state.asset_type === "article" && state.status === "done")
      .length;

    // 3. Lectures Completed
    const lecturesCompleted = userStates
      .filter(state => state.asset_type === "video" && state.status === "done")
      .length;

    // 4. Bookmarks Count
    const bookmarkedCount = userStates.filter(state => state.is_bookmarked).length;

    // 5. XP and level calculation
    // Solved Problem = 100 XP, Article = 50 XP, Video = 75 XP
    const totalXP = (problemsSolved * 100) + (articlesRead * 50) + (lecturesCompleted * 75);
    const level = Math.floor(totalXP / 1000) + 1;
    const xpIntoLevel = totalXP % 1000;

    // 6. Streak calculation
    const interactionDates = userStates
      .map(state => state.updated_at || state.last_interacted_at)
      .filter(Boolean);

    let streak = 0;
    if (interactionDates.length > 0) {
      const uniqueDays = Array.from(new Set(
        interactionDates.map(d => formatDateKey(new Date(d)))
      )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      const today = formatDateKey(new Date());
      const yesterday = formatDateKey(new Date(Date.now() - 86400000));

      if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
        streak = 1;
        let activeDate = new Date(uniqueDays[0]);

        for (let i = 1; i < uniqueDays.length; i++) {
          const prevDate = new Date(uniqueDays[i]);
          const diffTime = activeDate.getTime() - prevDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            streak++;
            activeDate = prevDate;
          } else if (diffDays > 1) {
            break;
          }
        }
      }
    }

    // 7. Solved problem difficulty ratios
    const easyTotal = problems.filter(p => p.difficulty === "Easy").length;
    const easySolved = problems.filter(p => p.difficulty === "Easy" && solvedProblemIds.includes(p.id)).length;
    const mediumTotal = problems.filter(p => p.difficulty === "Medium").length;
    const mediumSolved = problems.filter(p => p.difficulty === "Medium" && solvedProblemIds.includes(p.id)).length;
    const hardTotal = problems.filter(p => p.difficulty === "Hard").length;
    const hardSolved = problems.filter(p => p.difficulty === "Hard" && solvedProblemIds.includes(p.id)).length;

    // 8. Flat list of notes
    const allNotes: any[] = [];
    userStates.forEach(state => {
      if (state.notes && Array.isArray(state.notes)) {
        state.notes.forEach((note: any) => {
          allNotes.push({
            ...note,
            asset_id: state.asset_id,
            asset_type: state.asset_type
          });
        });
      }
    });
    // Sort notes recent first
    allNotes.sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());

    // 9. Heatmap data map (Date Key -> interaction count)
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
      totalXP,
      level,
      xpIntoLevel,
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

  // Generates past 24 weeks starting on Sunday to align calendar cells
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const now = new Date();
    
    // Start 24 weeks (168 days) ago
    const startDate = new Date();
    startDate.setDate(now.getDate() - 168);
    
    // Align to the start of that week (Sunday)
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    const tempDate = new Date(startDate);
    while (tempDate <= now) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return days;
  }, []);

  // Branded Loading Skeleton
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-10 pb-12 select-none">
        {/* Banner Skeleton */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-6 py-8 border border-white/5 h-64 animate-pulse flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-800 rounded-full" />
            <div className="h-10 w-1/3 bg-gray-800 rounded-xl" />
            <div className="h-4 w-1/2 bg-gray-800 rounded-lg" />
          </div>
          <div className="h-12 w-44 bg-gray-850 rounded-2xl" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 space-y-4 animate-pulse">
              <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-150 dark:bg-gray-850 rounded" />
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap & Ratio Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-4 animate-pulse">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-36 bg-gray-100 dark:bg-gray-850 rounded-2xl w-full" />
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 space-y-4 animate-pulse">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="space-y-3 pt-4">
              <div className="h-8 bg-gray-100 dark:bg-gray-850 rounded-xl" />
              <div className="h-8 bg-gray-100 dark:bg-gray-850 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 select-none">
      
      {/* 1. Premium Branded Impact Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-6 py-8 shadow-2xl dark:bg-black/40 border border-white/5 mx-auto">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-12 xl:col-span-7 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-400 border border-brand-500/20">
                <Sparkles size={10} />
                <span>Performance Insight</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500">
                Rank: active learner
              </span>
            </motion.div>
            
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.1]">
                Your Journey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-indigo-300">{firstName}!</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed font-normal">
                You have completed <span className="text-white font-semibold">{stats.problemsSolved} practice problems</span>. <br className="hidden md:block" />
                Keep solving and testing your skills systematically to ace tech interviews.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/practice"
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-950 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5 cursor-pointer"
              >
                <span>Continue Practice</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
             {/* Gamified Level & XP Card */}
             <motion.div whileHover={{ y: -2 }} className="group relative overflow-hidden rounded-3xl bg-white/[0.03] p-5 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
                         <Award size={16} />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Level {stats.level}</span>
                   </div>
                   <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{1000 - stats.xpIntoLevel} XP to Next Level</span>
                </div>
                <div className="space-y-2">
                   <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5 p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${stats.xpIntoLevel / 10}%` }} 
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-400" 
                      />
                   </div>
                   <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                     <span>{stats.xpIntoLevel} XP</span>
                     <span>1000 XP</span>
                   </div>
                </div>
             </motion.div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Contribution Heatmap */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex flex-col justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-500" />
              <span>Contribution Activity Heatmap</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Aggregate interactions over the last 6 months</p>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="min-w-[550px] flex flex-col gap-2">
              {/* Heatmap Grid Cells */}
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {calendarDays.map((day, index) => {
                  const key = formatDateKey(day);
                  const count = stats.heatmapActivity[key] || 0;
                  
                  // Color thresholds based on activity count
                  let colorClass = "bg-gray-100 dark:bg-gray-900 border border-gray-250/20 dark:border-gray-800/25";
                  if (count === 1) colorClass = "bg-brand-500/20 border border-brand-500/10";
                  else if (count === 2) colorClass = "bg-brand-500/50";
                  else if (count >= 3) colorClass = "bg-brand-500 shadow-sm shadow-brand-500/20";

                  const dateFormatted = day.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <div
                      key={index}
                      className={`w-3.5 h-3.5 rounded-[3px] transition-colors relative group/cell cursor-pointer ${colorClass}`}
                    >
                      {/* Interactive CSS Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/cell:flex flex-col items-center z-30 pointer-events-none">
                        <div className="bg-gray-950 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 shadow-md whitespace-nowrap border border-gray-800">
                          {count === 0 ? "No" : count} {count === 1 ? "activity" : "activities"} on {dateFormatted}
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-950 rotate-45 -mt-1 border-r border-b border-gray-800" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calendar Heatmap Legend */}
          <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider pt-2 border-t border-gray-100 dark:border-gray-900 shrink-0">
            <span>{calendarDays[0].toLocaleDateString("en-US", { month: "short", year: "numeric" })} – Present</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-3 h-3 rounded-[3px] bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
              <div className="w-3 h-3 rounded-[3px] bg-brand-500/20 border border-brand-500/10" />
              <div className="w-3 h-3 rounded-[3px] bg-brand-500/50" />
              <div className="w-3 h-3 rounded-[3px] bg-brand-500" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Right: Solved Problem Difficulty Breakdown */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Dumbbell size={14} className="text-brand-500" />
              <span>Practice Difficulty Overview</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Syllabus category ratios</p>
          </div>

          <div className="space-y-4 py-2">
            {/* Easy Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-emerald-500">Easy Category</span>
                <span className="text-gray-550 dark:text-gray-400">{stats.easySolved} / {stats.easyTotal || 20}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.easyTotal > 0 ? (stats.easySolved / stats.easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-amber-500">Medium Category</span>
                <span className="text-gray-550 dark:text-gray-400">{stats.mediumSolved} / {stats.mediumTotal || 35}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.mediumTotal > 0 ? (stats.mediumSolved / stats.mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-rose-500">Hard Category</span>
                <span className="text-gray-550 dark:text-gray-400">{stats.hardSolved} / {stats.hardTotal || 15}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.hardTotal > 0 ? (stats.hardSolved / stats.hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center border-t border-gray-100 dark:border-gray-900 pt-3 shrink-0">
            Total Problems Solved: {stats.problemsSolved}
          </div>
        </div>
      </div>

      {/* 4. Bookmarks & Recent Notes Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
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
            {userStates.filter(state => state.is_bookmarked).length === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-550 font-medium">No bookmarked items yet. Bookmark tags/problems to pin them here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userStates.filter(state => state.is_bookmarked).slice(0, 3).map((state) => {
                  const matchedProblem = problems.find(p => p.id === state.asset_id);
                  if (!matchedProblem) return null;
                  return (
                    <div key={state.asset_id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 hover:bg-gray-100/30 dark:hover:bg-gray-900/20 transition-all select-none">
                      <div className="space-y-1 min-w-0">
                        <Link href={`/problem/${matchedProblem.slug}`} className="text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500 truncate block cursor-pointer">
                          {matchedProblem.title}
                        </Link>
                        <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-widest ${
                          matchedProblem.difficulty === "Easy" ? "text-emerald-500" :
                          matchedProblem.difficulty === "Hard" ? "text-rose-500" : "text-amber-500"
                        }`}>
                          {matchedProblem.difficulty}
                        </span>
                      </div>
                      <Link href={`/problem/${matchedProblem.slug}`} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-500/5 transition-all cursor-pointer">
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="shrink-0 pt-2 border-t border-gray-100 dark:border-gray-900 text-center">
            <Link href="/practice" className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-bold uppercase tracking-wider cursor-pointer">
              <span>Go to Practice ground</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Notepad Summary Feed */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-1 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Notebook size={14} className="text-brand-500" />
              <span>Recent Notepad Entries ({stats.recentNotes.length ? userStates.filter(s => s.notes && s.notes.length).length : 0})</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Overview of your comments and notations</p>
          </div>

          <div className="flex-grow py-2">
            {stats.recentNotes.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-550 font-medium">No notebook comments recorded. Write notes inside any problem workspace to view them.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recentNotes.map((note) => {
                  const matchedProblem = problems.find(p => p.id === note.asset_id);
                  return (
                    <div key={note.id} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 space-y-1.5 select-none">
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        <span className="truncate max-w-[150px]">{matchedProblem ? matchedProblem.title : "DSA Lesson"}</span>
                        <span>{note.createdAt || note.created_at}</span>
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
            {stats.recentNotes.length > 0 && stats.recentNotes[0].asset_id ? (
              (() => {
                const recentProblem = problems.find(p => p.id === stats.recentNotes[0].asset_id);
                if (recentProblem) {
                  return (
                    <Link href={`/problem/${recentProblem.slug}`} className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-bold uppercase tracking-wider cursor-pointer">
                      <span>View recent workspace notepad</span>
                      <ChevronRight size={14} />
                    </Link>
                  );
                }
                return null;
              })()
            ) : (
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Notepad empty</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
