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
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoginRequired from "@/components/common/LoginRequired";
import ErrorState from "@/components/common/ErrorState";
import { fetchUserBookmarks, UserBookmarkItem } from "@/api/user";

type AssetType = "all" | "problem" | "video" | "article";

export default function BookmarksPage() {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<UserBookmarkItem[]>([]);
  const [filterType, setFilterType] = useState<AssetType>("all");

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Single unified call: backend directly resolves all metadata
        const data = await fetchUserBookmarks();
        setBookmarks(data || []);
      } catch (err) {
        console.error("Error loading bookmarks:", err);
        setError("Unable to sync your bookmarks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => filterType === "all" || b.asset_type === filterType);
  }, [bookmarks, filterType]);

  const counts = useMemo(() => {
    return {
      all: bookmarks.length,
      problem: bookmarks.filter((b) => b.asset_type === "problem").length,
      video: bookmarks.filter((b) => b.asset_type === "video").length,
      article: bookmarks.filter((b) => b.asset_type === "article").length,
    };
  }, [bookmarks]);

  const getItemVisuals = (item: UserBookmarkItem) => {
    if (item.asset_type === "problem") {
      const isCp = item.asset_id.startsWith("cp:");
      return {
        icon: isCp ? <Trophy size={16} /> : <Dumbbell size={16} />,
        iconColor: isCp ? "bg-blue-500/10 text-blue-500" : "bg-brand-500/10 text-brand-500",
        diffColor:
          item.difficulty === "Easy"
            ? "text-emerald-500"
            : item.difficulty === "Hard"
            ? "text-rose-500"
            : "text-amber-500",
      };
    }
    if (item.asset_type === "video") {
      return {
        icon: <Video size={16} />,
        iconColor: "bg-blue-500/10 text-blue-500",
        diffColor: "text-blue-500",
      };
    }
    return {
      icon: <BookOpen size={16} />,
      iconColor: "bg-purple-500/10 text-purple-500",
      diffColor: "text-purple-500",
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
              {counts.all} saved item{counts.all !== 1 ? "s" : ""} across all categories
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
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === tab.key
                ? "bg-white dark:bg-gray-800 text-brand-500 shadow-xs border border-gray-200 dark:border-gray-700"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Bookmarked Items List */}
      {filteredBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl py-16 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <Bookmark size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              No bookmarks found
            </p>
            <p className="text-xs text-gray-400 max-w-xs">
              Bookmark problems, videos, and articles while studying to save them here for quick access.
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
          {filteredBookmarks.map((item) => {
            const visuals = getItemVisuals(item);
            return (
              <motion.div
                key={`${item.asset_type}-${item.asset_id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${visuals.iconColor}`}
                  >
                    {visuals.icon}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={item.href}
                      className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500 truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${visuals.diffColor}`}
                      >
                        {item.subtitle}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-md">
                        {item.asset_type}
                      </span>
                      {item.status === "done" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                          <CheckCircle2 size={10} /> {item.asset_type === "video" ? "Watched" : item.asset_type === "article" ? "Read" : "Solved"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={item.href}
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
