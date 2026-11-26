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
import LoginRequired from "@/components/common/LoginRequired";
import ErrorState from "@/components/common/ErrorState";
import { fetchUserNotes, UserNoteItem } from "@/api/user";

type AssetType = "all" | "problem" | "video" | "article";

export default function NotesPage() {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<UserNoteItem[]>([]);
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
        // Single unified call: backend directly resolves all parent metadata
        const data = await fetchUserNotes();
        setNotes(data || []);
      } catch (err) {
        console.error("Error loading notes:", err);
        setError("Unable to sync your notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  const filteredNotes = useMemo(() => {
    if (filterType === "all") return notes;
    return notes.filter((n) => n.asset_type === filterType);
  }, [notes, filterType]);

  const counts = useMemo(() => {
    return {
      all: notes.length,
      problem: notes.filter((n) => n.asset_type === "problem").length,
      video: notes.filter((n) => n.asset_type === "video").length,
      article: notes.filter((n) => n.asset_type === "article").length,
    };
  }, [notes]);

  const getVisuals = (note: UserNoteItem) => {
    if (note.asset_type === "problem") {
      const isCp = note.asset_id.startsWith("cp:");
      return {
        icon: isCp ? <Trophy size={14} /> : <Dumbbell size={14} />,
        iconColor: isCp ? "bg-blue-500/10 text-blue-500" : "bg-brand-500/10 text-brand-500",
        typeLabel: note.subtitle || "Problem",
      };
    }
    if (note.asset_type === "video") {
      return {
        icon: <Video size={14} />,
        iconColor: "bg-blue-500/10 text-blue-500",
        typeLabel: note.subtitle || "Video",
      };
    }
    return {
      icon: <BookOpen size={14} />,
      iconColor: "bg-purple-500/10 text-purple-500",
      typeLabel: note.subtitle || "Article",
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
              {counts.all} note{counts.all !== 1 ? "s" : ""} across all categories
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
              Write notes while studying problems, watching videos, or reading articles. They will appear here.
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
            const visuals = getVisuals(note);
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
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${visuals.iconColor}`}
                    >
                      {visuals.icon}
                    </div>
                    <Link
                      href={note.href}
                      className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-brand-500 truncate"
                    >
                      {note.title}
                    </Link>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-md shrink-0">
                      {visuals.typeLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0 ml-3">
                    {formatDate(note.created_at)}
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
