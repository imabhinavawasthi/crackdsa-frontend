"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  BookOpen,
  Code2,
  Lock,
  Clock,
  ExternalLink,
  Play,
  FileText,
} from "lucide-react";
import { CourseSectionItem } from "@/types/course";

interface DSACurriculumItemRowProps {
  item: CourseSectionItem;
  index?: number;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  Medium: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  Hard: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
};

export function DSACurriculumItemRow({ item, index = 0 }: DSACurriculumItemRowProps) {
  const isVideo = item.type === "video";
  const isProblem = item.type === "problem";
  const isArticle = item.type === "article";

  // Type Icon renderer
  const renderTypeIcon = () => {
    if (isVideo) {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Video size={16} />
        </div>
      );
    }
    if (isProblem) {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Code2 size={16} />
        </div>
      );
    }
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
        <FileText size={16} />
      </div>
    );
  };

  // Action Button / Link
  const renderActionCTA = () => {
    if (isProblem) {
      return (
        <Link
          href={`/problem/${item.asset_id}`}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-extrabold hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors shadow-xs"
        >
          <span>Solve</span>
          <ExternalLink size={12} />
        </Link>
      );
    }

    if (isVideo) {
      return (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold transition-colors shadow-xs shadow-brand-500/20 cursor-pointer"
        >
          <Play size={12} />
          <span>Watch</span>
        </motion.button>
      );
    }

    return (
      <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-extrabold hover:bg-brand-500 hover:text-white transition-colors cursor-pointer">
        <BookOpen size={12} />
        <span>Read</span>
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="py-3 flex items-center justify-between gap-4 group hover:bg-gray-50/60 dark:hover:bg-gray-900/30 px-2.5 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {renderTypeIcon()}

        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {item.type}
            </span>

            {item.duration_label && (
              <>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  <Clock size={10} />
                  {item.duration_label}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Difficulty Badge if available */}
        {item.duration_label && difficultyColors[item.duration_label] && (
          <span
            className={`hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
              difficultyColors[item.duration_label]
            }`}
          >
            {item.duration_label}
          </span>
        )}

        {/* Access State Badge */}
        {item.is_free ? (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            Free
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
            <Lock size={9} /> Pro
          </span>
        )}

        {renderActionCTA()}
      </div>
    </motion.div>
  );
}
