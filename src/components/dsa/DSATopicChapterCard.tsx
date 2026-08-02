"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";
import { CourseSubsection } from "@/types/course";
import { DSACurriculumItemRow } from "./DSACurriculumItemRow";
import { TopicIcon } from "@/components/common/TopicIcon";

interface DSATopicChapterCardProps {
  subsection: CourseSubsection;
  index: number;
}

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const cardColors = [
  { bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-brand-100 dark:bg-brand-500/20", text: "text-brand-600 dark:text-brand-400" },
  { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-rose-100 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-400" },
];

export function DSATopicChapterCard({ subsection, index }: DSATopicChapterCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const color = cardColors[index % cardColors.length];
  const items = subsection.items || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-2xs hover:border-brand-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Topic / Chapter Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
      >
        {/* Topic Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${color.bg}`}
        >
          <TopicIcon
            topicName={subsection.title}
            size={20}
            className={color.text}
          />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[15px] text-gray-800 dark:text-white">
              {subsection.title}
            </h3>
          </div>
          {subsection.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {subsection.description}
            </p>
          )}
        </div>

        {/* Items Count & Progress Bar */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>

          {/* Mini Progress Bar */}
          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full rounded-full bg-brand-500 w-full" />
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-gray-400 dark:text-gray-500" />
          </motion.div>
        </div>
      </button>

      {/* Items List */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-1.5">
              <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 space-y-1">
                {items.length > 0 ? (
                  items.map((item, itemIdx) => (
                    <DSACurriculumItemRow
                      key={item.id || itemIdx}
                      item={item}
                      index={itemIdx}
                    />
                  ))
                ) : (
                  <p className="py-4 text-center text-xs font-medium text-gray-400">
                    No items listed for this chapter yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
