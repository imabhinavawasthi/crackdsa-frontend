"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Notebook,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Dumbbell,
  Video,
  BookOpen,
  MessageSquareText,
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

interface NoteEntry {
  id: string;
  text: string;
  createdAt?: string;
  created_at?: string;
  asset_id: string;
  asset_type: string;
}

export default function NotesPage() {
  const { isLoggedIn } = useAuth();
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
        console.error("Error loading notes:", err);
        setError("Unable to sync your notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, backendUrl]);

  // Flatten all notes with their parent asset info
  const allNotes = useMemo(() => {
    const notes: NoteEntry[] = [];
    userStates.forEach((state) => {
      if (state.notes && Array.isArray(state.notes) && state.notes.length > 0) {
        state.notes.forEach((note: any) => {
          notes.push({
            ...note,
            asset_id: state.asset_id,
            asset_type: state.asset_type,
          });
        });
      }
    });
    // Sort by most recent
    notes.sort(
      (a, b) =>
        new Date(b.createdAt || b.created_at || 0).getTime() -
        new Date(a.createdAt || a.created_at || 0).getTime()
    );
    return notes;
  }, [userStates]);

  const filteredNotes = useMemo(() => {
    if (filterType === "all") return allNotes;
    return allNotes.filter((n) => n.asset_type === filterType);
  }, [allNotes, filterType]);

  const counts = useMemo(() => {
    return {
      all: allNotes.length,
      problem: allNotes.filter((n) => n.asset_type === "problem").length,
      video: allNotes.filter((n) => n.asset_type === "video").length,
      article: allNotes.filter((n) => n.asset_type === "article").length,
    };
  }, [allNotes]);

  const getAssetInfo = (note: NoteEntry) => {
    if (note.asset_type === "problem") {
      // 1. Check CP Sheet Problem
      if (note.asset_id && note.asset_id.startsWith("cp:")) {
        const rawId = note.asset_id.replace(/^cp:/, "");
        const cp = cpProblems.find(
          (p) => p.id === rawId || p.id === note.asset_id || p.problem_name === rawId
        );
        if (cp) {
          return {
            title: cp.problem_name,
            href: "/cp/newbie-to-expert",
            icon: <Trophy size={14} />,
            iconColor: "bg-blue-500/10 text-blue-500",
            typeLabel: `CP Problem (${cp.difficulty})`,
          };
        }
        return {
          title: "CP Sheet Problem",
          href: "/cp/newbie-to-expert",
          icon: <Trophy size={14} />,
          iconColor: "bg-blue-500/10 text-blue-500",
          typeLabel: "CP Problem",
        };
      }

      // 2. Standard Practice Problem
      const problem = problems.find(
        (p) => p.id === note.asset_id || p.slug === note.asset_id
      );
      if (problem) {
        return {
          title: problem.title,
          href: problem.slug ? `/problem/${problem.slug}` : "/practice",
          icon: <Dumbbell size={14} />,
          iconColor: "bg-brand-500/10 text-brand-500",
          typeLabel: "Problem",
        };
      }

      return {
        title: "Practice Problem",
        href: "/practice",
        icon: <Dumbbell size={14} />,
        iconColor: "bg-brand-500/10 text-brand-500",
        typeLabel: "Problem",
      };
    }
    if (note.asset_type === "video") {
      // 1. Check Live Class Recording
      const liveClass = liveClasses.find((lc) => lc.id === note.asset_id);
      if (liveClass) {
        return {
          title: liveClass.class_name,
          href: `/live-sessions/${liveClass.id}`,
          icon: <Video size={14} />,
          iconColor: "bg-rose-500/10 text-rose-500",
          typeLabel: "Live Class Recording",
        };
      }

      // 2. Course Lecture Video
      const video = videos.find((v) => v.id === note.asset_id);
      if (video) {
        return {
          title: video.title,
          href: video.course_slug ? `/learn/${video.course_slug}` : "/learn",
          icon: <Video size={14} />,
          iconColor: "bg-blue-500/10 text-blue-500",
          typeLabel: "Course Lecture",
        };
      }

      return {
        title: "Video Recording",
        href: "/live-sessions",
        icon: <Video size={14} />,
        iconColor: "bg-rose-500/10 text-rose-500",
        typeLabel: "Video",
      };
    }
    if (note.asset_type === "article") {
      const article = articles.find((a) => a.id === note.asset_id);
      return {
        title: article?.title || "Article",
        href: "/learn",
        icon: <BookOpen size={14} />,
        iconColor: "bg-purple-500/10 text-purple-500",
        typeLabel: "Article",
      };
    }
    return {
      title: note.asset_id,
      href: "#",
      icon: <BookOpen size={14} />,
      iconColor: "bg-purple-500/10 text-purple-500",
      typeLabel: note.asset_type,
    };
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
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
          title="Notes Require Sign In"
          description="Sign in to access your personal notes and annotations across problems, videos, and articles."
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
          title="Error Loading Notes"
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
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Notebook size={20} />
              </span>
              My Notes
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {counts.all} note{counts.all !== 1 ? "s" : ""} across all
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

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl py-16 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
            <MessageSquareText
              size={32}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              No notes found
            </p>
            <p className="text-xs text-gray-400 max-w-xs">
              Write notes while studying problems, watching videos, or reading
              articles. They will appear here.
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
        <div className="space-y-4">
          {filteredNotes.map((note, idx) => {
            const info = getAssetInfo(note);
            return (
              <motion.div
                key={note.id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-3"
              >
                {/* Note Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${info.iconColor}`}
                    >
                      {info.icon}
                    </div>
                    <Link
                      href={info.href}
                      className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-brand-500 truncate"
                    >
                      {info.title}
                    </Link>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-md shrink-0">
                      {info.typeLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0 ml-3">
                    {formatDate(note.createdAt || note.created_at)}
                  </span>
                </div>

                {/* Note Content */}
                <div className="pl-9">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {note.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
