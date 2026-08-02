"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video, Code2, Layers, Clock } from "lucide-react";
import { scaleIn, staggerContainer } from "@/utils/animations";

interface DSATopicStatsBarProps {
  stats: {
    videosCount: number;
    problemsCount: number;
    itemsCount: number;
    articlesCount: number;
  } | null;
}

export function DSATopicStatsBar({ stats }: DSATopicStatsBarProps) {
  if (!stats) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Total Learning Assets */}
      <motion.div
        variants={scaleIn}
        className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] p-4 flex items-center gap-3.5 shadow-2xs"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <Layers size={20} />
        </div>
        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
            {stats.itemsCount}
          </p>
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
            Total Assets
          </p>
        </div>
      </motion.div>

      {/* 2. Video Lectures */}
      <motion.div
        variants={scaleIn}
        className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] p-4 flex items-center gap-3.5 shadow-2xs"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Video size={20} />
        </div>
        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
            {stats.videosCount}
          </p>
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
            Video Lectures
          </p>
        </div>
      </motion.div>

      {/* 3. Coding Problems */}
      <motion.div
        variants={scaleIn}
        className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] p-4 flex items-center gap-3.5 shadow-2xs"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Code2 size={20} />
        </div>
        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
            {stats.problemsCount}
          </p>
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
            Coding Problems
          </p>
        </div>
      </motion.div>

      {/* 4. Estimated Time */}
      <motion.div
        variants={scaleIn}
        className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] p-4 flex items-center gap-3.5 shadow-2xs"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
            ~{Math.max(1, Math.round(stats.itemsCount * 0.4))} hrs
          </p>
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
            Est. Study Time
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
