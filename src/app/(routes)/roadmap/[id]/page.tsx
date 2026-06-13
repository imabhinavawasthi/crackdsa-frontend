"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Info,
  Pencil,
  Check,
  X,
  Trophy
} from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import Button from "@/components/ui/button/Button";
import { RoadmapDBRecord } from "@/components/roadmap/types";
import RoadmapInfoModal from "@/components/roadmap/RoadmapInfoModal";
import { fetchRoadmapByIdApi } from "@/api/roadmap";

import { getOverallProgress, getCurrentTopic } from "@/utils/roadmapUtils";
import RoadmapStatsBar from "@/components/roadmap/RoadmapStatsBar";
import PhaseTimeline from "@/components/roadmap/PhaseTimeline";

export default function RoadmapDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { renameRoadmap } = useRoadmap();
  
  const roadmapId = params?.id as string;
  const [targetRoadmap, setTargetRoadmap] = useState<RoadmapDBRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and Edit states
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState("");

  useEffect(() => {
    async function fetchRoadmap() {
      if (!isLoggedIn || !roadmapId) return;
      try {
        setIsLoading(true);
        const data = await fetchRoadmapByIdApi(roadmapId);
        setTargetRoadmap(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoggedIn) {
      fetchRoadmap();
    }
  }, [isLoggedIn, roadmapId]);

  // Memoize heavy calculations to prevent redundant looping
  const phases = useMemo(() => targetRoadmap?.structure?.phases || [], [targetRoadmap?.structure?.phases]);
  const overall = useMemo(() => getOverallProgress(phases), [phases]);
  const currentTopic = useMemo(() => getCurrentTopic(phases), [phases]);
  const currentItem = useMemo(() => currentTopic?.items.find((p) => p.status === "current"), [currentTopic]);

  if (isAuthLoading || (isLoggedIn && isLoading)) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto px-4 pb-16 pt-6 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8"></div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="space-y-3 w-full sm:w-1/3">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-32"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl sm:col-span-2 lg:col-span-1"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="space-y-6 mt-12">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/3"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    router.replace("/login?redirect=/roadmap");
    return null;
  }

  if (!targetRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Roadmap not found</h2>
        <p className="text-gray-500 dark:text-gray-400">The roadmap you're looking for doesn't exist or you don't have access.</p>
        <Link href="/roadmap" className="mt-4 inline-block">
          <Button>
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 pb-16">
      <div className="pt-6">
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link href="/roadmap" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Roadmaps
          </Link>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-800 dark:text-white">{targetRoadmap.title || "Details"}</span>
        </nav>
      </div>

      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={editTitleValue}
                  onChange={(e) => setEditTitleValue(e.target.value)}
                  className="text-2xl font-bold bg-white dark:bg-gray-800 border border-brand-500 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editTitleValue.trim()) {
                      renameRoadmap(roadmapId, editTitleValue.trim());
                      setTargetRoadmap(prev => prev ? { ...prev, title: editTitleValue.trim() } : prev);
                      setIsEditingTitle(false);
                    }
                    if (e.key === "Escape") {
                      setIsEditingTitle(false);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (editTitleValue.trim()) {
                      renameRoadmap(roadmapId, editTitleValue.trim());
                      setTargetRoadmap(prev => prev ? { ...prev, title: editTitleValue.trim() } : prev);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                >
                  <Check size={18} />
                </button>
                <button 
                  onClick={() => setIsEditingTitle(false)}
                  className="p-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3 group">
                {targetRoadmap.title || "My Roadmap"}
                <button 
                  onClick={() => {
                    setEditTitleValue(targetRoadmap.title || "My Roadmap");
                    setIsEditingTitle(true);
                  }}
                  className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Rename Roadmap"
                >
                  <Pencil size={16} />
                </button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs rounded-full shadow-sm ml-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" 
                  onClick={() => setIsInfoModalOpen(true)}
                >
                  <Info className="w-3.5 h-3.5 mr-1.5" />
                  Roadmap Parameters
                </Button>
              </h1>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your personalized path to cracking DSA interviews
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400 dark:text-gray-550 font-medium">Overall Progress</span>
          <span className="font-bold text-gray-800 dark:text-white">
            {overall.done}/{overall.total} items
          </span>
        </div>
      </motion.div>

      {/* ─── Stats Bar ─── */}
      <RoadmapStatsBar 
        overall={overall} 
        currentTopic={currentTopic} 
        targetRoadmap={targetRoadmap} 
      />

      {/* ─── Continue Where You Left Off ─── */}
      {currentTopic && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl border border-brand-200 dark:border-brand-500/20 bg-gradient-to-r from-brand-50 via-white to-brand-50/50 dark:from-brand-500/5 dark:via-gray-800 dark:to-brand-500/5 p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="flex-shrink-0 w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30"
              >
                <BookOpen size={24} className="text-white" />
              </motion.div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                  Continue where you left off
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-white mt-0.5">
                  {currentItem?.title ?? currentTopic.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-555 mt-0.5 font-bold">
                  {currentTopic.title} •{" "}
                  {currentItem?.type === "problem" 
                    ? `${currentItem.difficulty || "Coding"} Problem`
                    : currentItem?.type 
                    ? currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)
                    : ""}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 cursor-pointer"
            >
              Continue
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ─── Phase Timeline ─── */}
      <PhaseTimeline phases={phases} />

      {/* ─── Bottom CTA ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-center py-8"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-500 dark:text-gray-400"
        >
          <Trophy size={16} className="text-amber-500" />
          <span>Complete all {overall.total} items to master your goal!</span>
        </motion.div>
      </motion.div>

      <RoadmapInfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
        userInput={targetRoadmap.user_input} 
      />
    </div>
  );
}
