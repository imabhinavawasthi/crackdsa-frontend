"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Video,
  BookOpen,
  Code2,
} from "lucide-react";
import { RoadmapItem } from "./types";

interface RoadmapItemRowProps {
  item: RoadmapItem;
  index: number;
  onAction?: (item: RoadmapItem) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
  Medium: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
  Hard: "text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
};

export default function RoadmapItemRow({ item, index, onAction }: RoadmapItemRowProps) {
  // Determine prefix icon for item type (video, article, problem)
  const renderTypeIcon = () => {
    switch (item.type) {
      case "video":
        return <Video size={14} className="text-red-500 dark:text-red-400" />;
      case "article":
        return <BookOpen size={14} className="text-emerald-500 dark:text-emerald-400" />;
      case "problem":
      default:
        return <Code2 size={14} className="text-blue-500 dark:text-blue-400" />;
    }
  };

  // Determine button text based on item type
  const getActionLabel = () => {
    switch (item.type) {
      case "video":
        return "Watch";
      case "article":
        return "Read";
      case "problem":
      default:
        return "Solve";
    }
  };

  const isCompleted = item.status === "completed";
  const isCurrent = item.status === "current";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group cursor-default ${
        isCompleted
          ? "bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04]"
          : isCurrent
          ? "bg-brand-50/60 dark:bg-brand-500/5 ring-1 ring-brand-200 dark:ring-brand-500/20"
          : "bg-gray-50/50 dark:bg-white/[0.01] opacity-60"
      }`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : isCurrent ? (
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Play size={18} className="text-brand-500 fill-brand-500" />
            </motion.div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full animate-ping" />
          </div>
        ) : (
          <Lock size={18} className="text-gray-300 dark:text-gray-600" />
        )}
      </div>

      {/* Type Identifier Icon */}
      <div className="flex-shrink-0 select-none opacity-80 group-hover:opacity-100 transition-opacity">
        {renderTypeIcon()}
      </div>

      {/* Item Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isCompleted
              ? "text-gray-500 dark:text-gray-400 line-through decoration-gray-300 dark:decoration-gray-600"
              : isCurrent
              ? "text-gray-800 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {item.title}
        </p>
      </div>

      {/* Difficulty Badge (optional/problems only) */}
      {item.difficulty && (
        <span
          className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${difficultyColors[item.difficulty]}`}
        >
          {item.difficulty}
        </span>
      )}

      {/* Time Estimate */}
      <span className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hidden sm:flex">
        <Clock size={12} />
        {item.timeEstimate}
      </span>

      {/* Action Button */}
      {isCurrent && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction && onAction(item)}
          className="flex-shrink-0 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-brand-500/25 cursor-pointer"
        >
          {getActionLabel()}
        </motion.button>
      )}
    </motion.div>
  );
}
