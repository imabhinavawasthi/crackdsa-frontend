"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, CheckCircle2 } from "lucide-react";
import { Topic, RoadmapItem } from "./types";
import { TopicIcon } from "@/components/common/TopicIcon";
import RoadmapItemRow from "./RoadmapItemRow";

interface TopicCardProps {
  topic: Topic;
  index: number;
  onItemAction?: (item: RoadmapItem) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function getTopicProgress(topic: Topic) {
  const total = topic.items.length;
  const done = topic.items.filter((p) => p.status === "completed").length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

const cardColors = [
  { bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-brand-100 dark:bg-brand-500/20", text: "text-brand-600 dark:text-brand-400" },
  { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-rose-100 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-400" },
];

export default function TopicCard({ topic, index, onItemAction }: TopicCardProps) {
  const [isOpen, setIsOpen] = useState(topic.status === "in-progress");
  const progress = getTopicProgress(topic);
  const color = cardColors[index % cardColors.length];

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className={`rounded-2xl border transition-all duration-300 ${
        topic.status === "in-progress"
          ? "border-brand-200 dark:border-brand-500/30 shadow-lg shadow-brand-500/5"
          : topic.status === "completed"
          ? "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          : "border-gray-100 dark:border-gray-800 opacity-75"
      } bg-white dark:bg-gray-800/50`}
    >
      {/* Topic Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
      >
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
            topic.status === "locked"
              ? "bg-gray-100 dark:bg-gray-700/50"
              : topic.iconBg || color.bg
          }`}
        >
          <TopicIcon
            topicName={topic.title}
            iconName={typeof topic.icon === "string" ? topic.icon : undefined}
            size={20}
            className={
              topic.status === "locked"
                ? "text-gray-400 dark:text-gray-500"
                : topic.iconColor || color.text
            }
          />
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-[15px] ${
                topic.status === "locked"
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-800 dark:text-white"
              }`}
            >
              {topic.title}
            </h3>
            {topic.status === "in-progress" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-[11px] font-bold rounded-full uppercase tracking-wider"
              >
                <Zap size={10} className="fill-current" />
                Current
              </motion.span>
            )}
            {topic.status === "completed" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[11px] font-bold rounded-full uppercase tracking-wider">
                <CheckCircle2 size={10} />
                Done
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
            {topic.description}
          </p>
        </div>

        {/* Progress */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
            {progress.done}/{progress.total}
          </span>

          {/* Mini Progress Bar */}
          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className={`h-full rounded-full ${
                topic.status === "completed"
                  ? "bg-emerald-500"
                  : topic.status === "in-progress"
                  ? "bg-brand-500"
                  : "bg-gray-200 dark:bg-gray-600"
              }`}
            />
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
              <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 space-y-1.5">
                {topic.items.map((item, i) => (
                  <RoadmapItemRow key={item.id} item={item} index={i} onAction={onItemAction} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
