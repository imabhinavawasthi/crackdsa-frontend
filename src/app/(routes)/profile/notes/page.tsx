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
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStoredToken } from "@/functions/auth";
import LoginRequired from "@/components/common/LoginRequired";

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
  const [problems, setProblems] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [userStates, setUserStates] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<AssetType>("all");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const token = getStoredToken();
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const [problemsRes, videosRes, articlesRes, statesRes] = await Promise.all([
          fetch(`${backendUrl}/api/v1/practice-problems`, { headers }),
          fetch(`${backendUrl}/api/v1/video-lectures`, { headers }),
          fetch(`${backendUrl}/api/v1/articles`, { headers }),
          fetch(`${backendUrl}/api/v1/user/assets/states`, { headers }),
        ]);

        if (problemsRes.ok) setProblems(await problemsRes.json());
        if (videosRes.ok) {
          const vData = await videosRes.json();
          setVideos(Array.isArray(vData) ? vData : (vData.items || []));
        }
        if (articlesRes.ok) {
          const aData = await articlesRes.json();
          setArticles(Array.isArray(aData) ? aData : (aData.items || []));
        }
        if (statesRes.ok) {
          setUserStates((await statesRes.json()) || []);
        }
      } catch (err) {
        console.error("Error loading notes:", err);
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
      const problem = problems.find((p) => p.id === note.asset_id);
      return {
        title: problem?.title || "Unknown Problem",
        href: problem?.slug ? `/problem/${problem.slug}` : "#",
        icon: <Dumbbell size={14} />,
        iconColor: "bg-brand-500/10 text-brand-500",
        typeLabel: "Problem",
      };
    }
    if (note.asset_type === "video") {
      const video = videos.find((v) => v.id === note.asset_id);
      return {
        title: video?.title || "Unknown Video",
        href: "#",
        icon: <Video size={14} />,
        iconColor: "bg-blue-500/10 text-blue-500",
        typeLabel: "Video",
      };
    }
    if (note.asset_type === "article") {
      const article = articles.find((a) => a.id === note.asset_id);
      return {
        title: article?.title || "Unknown Article",
        href: "#",
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
