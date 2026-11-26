"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  Dumbbell, 
  Zap, 
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Video,
  Bookmark,
  Notebook,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { fetchUserProgressSummary, UserProgressSummary } from "@/api/user";
import LoginRequired from "@/components/common/LoginRequired";
import ActivityHeatmap from "@/components/common/ActivityHeatmap";
import ErrorState from "@/components/common/ErrorState";

export default function ProgressPage() {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<UserProgressSummary | null>(null);

  // Heatmap State
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const firstName = user?.full_name?.split(" ")[0] || "Learner";

  // Fetch unified progress summary on mount (Zero calls to fetch all problems!)
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const loadProgressData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserProgressSummary();
        setSummary(data);
      } catch (err: any) {
        console.error("Error loading progress data:", err);
        setError("Unable to sync progress details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [isLoggedIn]);

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

  if (error || !summary) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <ErrorState 
          title="Error Loading Progress"
          message={error || "Failed to load progress summary"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const {
    problems_solved,
    total_problems,
    articles_read,
    lectures_completed,
    bookmarked_count,
    streak,
    recent_bookmarks,
    recent_notes,
    heatmap_activity,
  } = summary;

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
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{problems_solved.easy}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-850" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Medium</span>
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{problems_solved.medium}</span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-850" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Hard</span>
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{problems_solved.hard}</span>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: problems_solved.total, icon: <CheckCircle2 size={16} className="text-emerald-500" />, colorClass: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" },
          { label: "Active Streak", value: `${streak} Days`, icon: <Zap size={16} className="text-amber-500" />, colorClass: "bg-amber-500/5 text-amber-500 border-amber-500/10" },
          { label: "Lectures Watched", value: lectures_completed, icon: <Video size={16} className="text-blue-500" />, colorClass: "bg-blue-500/5 text-blue-500 border-blue-500/10" },
          { label: "Articles Read", value: articles_read, icon: <BookOpen size={16} className="text-purple-500" />, colorClass: "bg-purple-500/5 text-purple-500 border-purple-500/10" },
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

      {/* 3. Interactive Contribution Heatmap (Full Width) */}
      <ActivityHeatmap
        calendarDays={calendarDays}
        heatmapActivity={heatmap_activity}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {/* 4. Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Solved Problem Difficulty Breakdown */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex flex-col justify-between gap-5 shadow-xs">
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
                  <span className="text-gray-550 dark:text-gray-400">{problems_solved.easy} / {total_problems.easy || 20}</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    {total_problems.easy > 0 ? Math.round((problems_solved.easy / total_problems.easy) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${total_problems.easy > 0 ? (problems_solved.easy / total_problems.easy) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Medium Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-amber-500">Medium Category</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-550 dark:text-gray-400">{problems_solved.medium} / {total_problems.medium || 35}</span>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                    {total_problems.medium > 0 ? Math.round((problems_solved.medium / total_problems.medium) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${total_problems.medium > 0 ? (problems_solved.medium / total_problems.medium) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Hard Category */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-rose-500">Hard Category</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-550 dark:text-gray-400">{problems_solved.hard} / {total_problems.hard || 15}</span>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded-md">
                    {total_problems.hard > 0 ? Math.round((problems_solved.hard / total_problems.hard) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-200/50 dark:border-gray-800/50 p-[1px]">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-700" style={{ width: `${total_problems.hard > 0 ? (problems_solved.hard / total_problems.hard) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center border-t border-gray-100 dark:border-gray-900 pt-3 shrink-0">
            Total Problems Solved: {problems_solved.total}
          </div>
        </div>

        {/* Bookmarked Library Panel */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-1 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Bookmark size={14} className="text-brand-500" />
              <span>Bookmarked Library ({bookmarked_count})</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Quick-access saved practice items</p>
          </div>

          <div className="flex-grow py-2">
            {recent_bookmarks.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-550 font-medium">No bookmarked items yet. Bookmark items to view them here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recent_bookmarks.map((item) => {
                  const isProblem = item.asset_type === "problem";
                  const isCp = item.asset_id.startsWith("cp:");
                  const isVideo = item.asset_type === "video";
                  return (
                    <div key={`${item.asset_type}-${item.asset_id}`} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 hover:bg-gray-100/30 dark:hover:bg-gray-900/20 transition-all select-none animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isProblem ? (isCp ? "bg-blue-500/10 text-blue-500" : "bg-brand-500/10 text-brand-500") : isVideo ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}>
                          {isProblem ? (isCp ? <Trophy size={12} /> : <Dumbbell size={12} />) : isVideo ? <Video size={12} /> : <BookOpen size={12} />}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <Link href={item.href} className="text-xs font-bold text-gray-850 dark:text-gray-200 hover:text-brand-500 truncate block cursor-pointer">
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">
                              {item.subtitle}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-150 dark:bg-gray-900 px-1.5 py-0.2 rounded-md">
                              {item.asset_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={item.href} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-500/5 transition-all cursor-pointer">
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
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-1 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Notebook size={14} className="text-brand-500" />
              <span>Recent Notepad Entries ({recent_notes.length})</span>
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Overview of your comments and notations</p>
          </div>

          <div className="flex-grow py-2">
            {recent_notes.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl py-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-550 font-medium">No notebook comments recorded. Write notes inside workspaces to view them.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recent_notes.map((note) => {
                  const isProblem = note.asset_type === "problem";
                  const isVideo = note.asset_type === "video";
                  return (
                    <div key={note.id} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 space-y-2 select-none hover:shadow-2xs transition-all animate-fadeIn">
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`p-1 rounded ${isProblem ? "bg-brand-500/10" : isVideo ? "bg-blue-500/10" : "bg-purple-500/10"}`}>
                            {isProblem ? <Dumbbell size={10} className="text-brand-500" /> : isVideo ? <Video size={10} className="text-blue-500" /> : <BookOpen size={10} className="text-purple-500" />}
                          </span>
                          <span className="truncate max-w-[130px]">{note.title}</span>
                          <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded-sm bg-gray-250/20 dark:bg-gray-800/40 text-gray-450 shrink-0">
                            {note.subtitle}
                          </span>
                        </div>
                        <span className="shrink-0">{note.created_at ? note.created_at.slice(0, 10) : ""}</span>
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
