"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Video,
  BookOpen,
  Dumbbell,
  Loader2,
  ArrowLeft,
  Filter,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStoredToken } from "@/functions/auth";
import LoginRequired from "@/components/common/LoginRequired";
import ErrorState from "@/components/common/ErrorState";
import { BACKEND_URL } from "@/config/api";
import { fetchPracticeProblems } from "@/api/problems";
import { fetchVideoLectures } from "@/api/videos";
import { fetchArticles } from "@/api/articles";
import { fetchLiveClasses } from "@/api/live-classes";
import { fetchNewbieToExpertSheet } from "@/api/cp";
import { fetchUserAssetStates } from "@/api/user";

type AssetType = "all" | "problem" | "video" | "article";

export default function BookmarksPage() {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [cpProblems, setCpProblems] = useState<any[]>([]);
  const [userStates, setUserStates] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<AssetType>("all");

  const backendUrl = BACKEND_URL;

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        const [probs, vids, arts, lcs, cpSheet, states] = await Promise.all([
          fetchPracticeProblems().catch(() => []),
          fetchVideoLectures().catch(() => []),
          fetchArticles().catch(() => []),
          fetchLiveClasses().catch(() => []),
          fetchNewbieToExpertSheet().catch(() => null),
          fetchUserAssetStates().catch(() => []),
        ]);

        setProblems(probs || []);
        setVideos(vids || []);
        setArticles(arts || []);
        setLiveClasses(Array.isArray(lcs) ? lcs : (lcs?.items || []));
        if (cpSheet?.problems) {
          setCpProblems(cpSheet.problems);
        }
        setUserStates(states || []);
      } catch (err) {
        console.error("Error loading bookmarks:", err);
        setError("Unable to sync your bookmarks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, backendUrl]);

  const bookmarkedStates = useMemo(() => {
    return userStates
      .filter((s) => s.is_bookmarked)
      .filter((s) => filterType === "all" || s.asset_type === filterType)
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.last_interacted_at).getTime() -
          new Date(a.updated_at || a.last_interacted_at).getTime()
      );
  }, [userStates, filterType]);

  const counts = useMemo(() => {
    const all = userStates.filter((s) => s.is_bookmarked);
    return {
      all: all.length,
      problem: all.filter((s) => s.asset_type === "problem").length,
      video: all.filter((s) => s.asset_type === "video").length,
      article: all.filter((s) => s.asset_type === "article").length,
    };
  }, [userStates]);

  const getAssetDetails = (state: any) => {
    if (state.asset_type === "problem") {
      // 1. Check CP Sheet problem (starts with "cp:")
      if (state.asset_id && state.asset_id.startsWith("cp:")) {
        const rawId = state.asset_id.replace(/^cp:/, "");
        const cp = cpProblems.find(
          (p) => p.id === rawId || p.id === state.asset_id || p.problem_name === rawId
        );
        if (cp) {
          return {
            title: cp.problem_name,
            subtitle: `CP Sheet • Rating ${cp.difficulty}`,
            href: "/cp/newbie-to-expert",
            icon: <Trophy size={16} />,
            iconColor: "bg-blue-500/10 text-blue-500",
            diffColor: "text-blue-500",
            tags: ["Codeforces", `${cp.difficulty}`],
          };
        }
        return {
          title: state.metadata?.problem_name || state.metadata?.title || "CP Sheet Problem",
          subtitle: "CP Sheet",
          href: "/cp/newbie-to-expert",
          icon: <Trophy size={16} />,
          iconColor: "bg-blue-500/10 text-blue-500",
          diffColor: "text-blue-500",
          tags: ["Codeforces"],
        };
      }

      // 2. Standard Practice Problem
      const problem = problems.find(
        (p) => p.id === state.asset_id || p.slug === state.asset_id
      );
      if (problem) {
        return {
          title: problem.title,
          subtitle: problem.difficulty || "Practice Problem",
          href: problem.slug ? `/problem/${problem.slug}` : "/practice",
          icon: <Dumbbell size={16} />,
          iconColor: "bg-brand-500/10 text-brand-500",
          diffColor:
            problem.difficulty === "Easy"
              ? "text-emerald-500"
              : problem.difficulty === "Hard"
              ? "text-rose-500"
              : "text-amber-500",
          tags: problem.tags || [],
        };
      }

      return {
        title: state.metadata?.title || "Practice Problem",
        subtitle: "Problem",
        href: "/practice",
        icon: <Dumbbell size={16} />,
        iconColor: "bg-brand-500/10 text-brand-500",
        diffColor: "text-amber-500",
        tags: [],
      };
    } else if (state.asset_type === "video") {
      // 1. Check Live Class Recording / Session
      const liveClass = liveClasses.find((lc) => lc.id === state.asset_id);
      if (liveClass) {
        return {
          title: liveClass.class_name,
          subtitle: "Live Class Recording",
          href: `/live-sessions/${liveClass.id}`,
          icon: <Video size={16} />,
          iconColor: "bg-rose-500/10 text-rose-500",
          diffColor: "text-rose-500",
          tags: ["Live Class", liveClass.instructor_name || "Recording"],
        };
      }

      // 2. Course Lecture Video
      const video = videos.find((v) => v.id === state.asset_id);
      if (video) {
        return {
          title: video.title,
          subtitle: "Course Lecture",
          href: video.course_slug ? `/learn/${video.course_slug}` : "/learn",
          icon: <Video size={16} />,
          iconColor: "bg-blue-500/10 text-blue-500",
          diffColor: "text-gray-500",
          tags: ["Lecture"],
        };
      }

      return {
        title: state.metadata?.class_name || state.metadata?.title || "Video Recording",
        subtitle: "Video",
        href: "/live-sessions",
        icon: <Video size={16} />,
        iconColor: "bg-rose-500/10 text-rose-500",
        diffColor: "text-gray-500",
        tags: [],
      };
    } else if (state.asset_type === "article") {
      const article = articles.find((a) => a.id === state.asset_id);
      return {
        title: article?.title || state.metadata?.title || "Article",
        subtitle: "Article",
        href: "/learn",
        icon: <BookOpen size={16} />,
        iconColor: "bg-purple-500/10 text-purple-500",
        diffColor: "text-gray-500",
        tags: [],
      };
    }
    
    return {
      title: state.asset_id,
      subtitle: state.asset_type,
      href: "#",
      icon: <BookOpen size={16} />,
      iconColor: "bg-gray-500/10 text-gray-500",
      diffColor: "text-gray-500",
      tags: [],
    };
  };

  if (!isLoggedIn && !loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Profile
          </Link>
        </div>
        <LoginRequired
          title="Bookmarks Require Sign In"
          description="Sign in to save and access your bookmarked problems, videos, and articles across devices."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState 
          title="Error Loading Bookmarks"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const filterTabs: { key: AssetType; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "problem", label: "Problems", count: counts.problem },
    { key: "video", label: "Videos", count: counts.video },
    { key: "article", label: "Articles", count: counts.article },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 select-none space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Bookmark size={20} />
              </span>
              My Bookmarks
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {counts.all} saved item{counts.all !== 1 ? "s" : ""} across all
              categories
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filterType === tab.key
                ? "bg-white dark:bg-gray-800 text-brand-500 shadow-sm border border-gray-200 dark:border-gray-700"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Bookmarked Items List */}
      {bookmarkedStates.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl py-16 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <Bookmark size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              No bookmarks found
            </p>
            <p className="text-xs text-gray-400 max-w-xs">
              Bookmark problems, videos, and articles while studying to save
              them here for quick access.
            </p>
          </div>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-bold uppercase tracking-wider"
          >
            Go to Practice <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedStates.map((state) => {
            const details = getAssetDetails(state);
            return (
              <motion.div
                key={`${state.asset_type}-${state.asset_id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${details.iconColor}`}
                  >
                    {details.icon}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={details.href}
                      className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500 truncate block"
                    >
                      {details.title}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${details.diffColor}`}
                      >
                        {details.subtitle}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-md">
                        {state.asset_type}
                      </span>
                      {state.status === "done" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                          <CheckCircle2 size={10} /> {state.asset_type === "video" ? "Watched" : state.asset_type === "article" ? "Read" : "Solved"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={details.href}
                  className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-500/5 transition-all shrink-0"
                >
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
