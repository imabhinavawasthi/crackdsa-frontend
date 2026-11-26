"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Video,
  BookOpen,
  Code2,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { staggerContainer } from "@/utils/animations";
import { TopicIcon } from "@/components/common/TopicIcon";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAssetStates, updateUserAssetState } from "@/api/user";

export interface PhaseItemData {
  id: string;
  title: string;
  type: "video" | "article" | "problem" | string;
  status?: "completed" | "current" | "active" | "available" | "locked" | string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  timeEstimate?: string;
  isFree?: boolean;
  assetId?: string;
  slug?: string;
  href?: string;
}

export interface ChapterData {
  id: string;
  title: string;
  description?: string;
  items: PhaseItemData[];
}

export interface TopicPhaseData {
  id: string;
  title: string;
  subtitle?: string;
  color?: string;
  chapters: ChapterData[];
}

export interface UnifiedPhaseTimelineProps {
  topicPhase: TopicPhaseData;
  onItemAction?: (item: PhaseItemData) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
  Medium: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
  Hard: "text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
};

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

/**
 * Item Row Component with User Asset State Toggles (Done / Revision / Pending)
 */
export function UnifiedItemRow({
  item,
  index,
  isCurrentActiveItem,
  userStatus = "pending",
  onStatusChange,
  onAction,
}: {
  item: PhaseItemData;
  index: number;
  isCurrentActiveItem: boolean;
  userStatus?: "pending" | "done" | "revision";
  onStatusChange?: (newStatus: "pending" | "done" | "revision") => void;
  onAction?: (item: PhaseItemData) => void;
}) {
  const isCompleted = userStatus === "done";
  const isRevision = userStatus === "revision";

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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    if (isCompleted) {
      onStatusChange("pending");
    } else {
      onStatusChange("done");
    }
  };

  const handleRevisionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    if (isRevision) {
      onStatusChange("pending");
    } else {
      onStatusChange("revision");
    }
  };

  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onAction && onAction(item)}
      className="flex-shrink-0 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-brand-500/25 cursor-pointer flex items-center gap-1"
    >
      <span>{getActionLabel()}</span>
      <ExternalLink size={12} />
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group cursor-default ${
        isCompleted
          ? "bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20"
          : isRevision
          ? "bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20"
          : isCurrentActiveItem
          ? "bg-brand-50/60 dark:bg-brand-500/5 ring-1 ring-brand-200 dark:ring-brand-500/20"
          : "bg-gray-50/50 dark:bg-white/[0.01]"
      }`}
    >
      {/* Interactive Checkbox / Status Indicator */}
      <button
        onClick={handleCheckboxClick}
        title={isCompleted ? "Mark as Pending" : "Mark as Done"}
        className="flex-shrink-0 cursor-pointer focus:outline-none transition-transform hover:scale-110"
      >
        {isCompleted ? (
          <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-500/10" />
        ) : isRevision ? (
          <RotateCcw size={18} className="text-amber-500" />
        ) : isCurrentActiveItem ? (
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Play size={18} className="text-brand-500 fill-brand-500" />
            </motion.div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full animate-ping" />
          </div>
        ) : item.status === "locked" ? (
          <Lock size={18} className="text-gray-300 dark:text-gray-600" />
        ) : (
          <CheckCircle2 size={19} className="text-gray-300 hover:text-emerald-500 transition-colors" />
        )}
      </button>

      {/* Type Identifier Icon */}
      <div className="flex-shrink-0 select-none opacity-80 group-hover:opacity-100 transition-opacity">
        {renderTypeIcon()}
      </div>

      {/* Item Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isCompleted
              ? "text-gray-500 dark:text-gray-400 line-through decoration-emerald-500/50"
              : isRevision
              ? "text-amber-700 dark:text-amber-300 font-semibold"
              : isCurrentActiveItem
              ? "text-gray-900 dark:text-white font-bold"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {item.title}
        </p>
      </div>

      {/* Revision Toggle Pill */}
      <button
        onClick={handleRevisionToggle}
        title={isRevision ? "Remove Revision Tag" : "Mark for Revision"}
        className={`flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
          isRevision
            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 shadow-xs"
            : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
        }`}
      >
        <RotateCcw size={10} />
        <span>{isRevision ? "Revision" : "Revise"}</span>
      </button>

      {/* Difficulty Badge */}
      {item.difficulty && difficultyColors[item.difficulty] && (
        <span
          className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block ${
            difficultyColors[item.difficulty]
          }`}
        >
          {item.difficulty}
        </span>
      )}

      {/* Time Estimate (filters out mock 1:00:00 labels) */}
      {item.timeEstimate && item.timeEstimate !== "1:00:00" && !item.timeEstimate.includes("1:00:00") && (
        <span className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hidden sm:flex">
          <Clock size={12} />
          {item.timeEstimate}
        </span>
      )}

      {/* Action Button */}
      {item.href ? (
        <Link href={item.href} target="_blank">
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </motion.div>
  );
}

/**
 * Inner Accordion Card Component for a Section/Chapter
 */
function ChapterAccordionCard({
  chapter,
  chapterIndex,
  firstActiveItemId,
  userStates,
  onStatusChange,
  onItemAction,
}: {
  chapter: ChapterData;
  chapterIndex: number;
  firstActiveItemId?: string;
  userStates: Record<string, "pending" | "done" | "revision">;
  onStatusChange: (item: PhaseItemData, newStatus: "pending" | "done" | "revision") => void;
  onItemAction?: (item: PhaseItemData) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const color = cardColors[chapterIndex % cardColors.length];
  const items = chapter.items || [];
  const completedCount = items.filter((i) => {
    const key = i.assetId || i.id;
    return userStates[key] === "done";
  }).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: chapterIndex * 0.08, duration: 0.4 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-2xs hover:border-brand-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Chapter Accordion Header */}
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
          <TopicIcon topicName={chapter.title} size={20} className={color.text} />
        </motion.div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[15px] text-gray-800 dark:text-white">
              {chapter.title}
            </h3>
          </div>
          {chapter.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {chapter.description}
            </p>
          )}
        </div>

        {/* Count & Progress Bar */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
            {completedCount}/{items.length} items
          </span>

          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-gray-400 dark:text-gray-500" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content */}
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
                {items.length > 0 ? (
                  items.map((item, itemIdx) => {
                    const key = item.assetId || item.id;
                    const status = userStates[key] || "pending";
                    return (
                      <UnifiedItemRow
                        key={item.id || itemIdx}
                        item={item}
                        index={itemIdx}
                        isCurrentActiveItem={item.id === firstActiveItemId}
                        userStatus={status}
                        onStatusChange={(newStatus) => onStatusChange(item, newStatus)}
                        onAction={onItemAction}
                      />
                    );
                  })
                ) : (
                  <p className="py-4 text-center text-xs font-medium text-gray-400">
                    No items listed for this section yet.
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

/**
 * Universal Unified Phase Timeline Component.
 * - Integrates real Supabase user asset states (Done / Revision / Pending).
 * - Renders top "Continue where you left off" active learning banner.
 * - Topic rendered as Phase 1 with dynamic live progress counts.
 * - Subsections rendered as inner expandable accordion cards.
 */
export default function UnifiedPhaseTimeline({
  topicPhase,
  onItemAction,
}: UnifiedPhaseTimelineProps) {
  const { isLoggedIn } = useAuth();
  const [userStates, setUserStates] = useState<Record<string, "pending" | "done" | "revision">>({});

  // Fetch authenticated user asset states on mount
  useEffect(() => {
    async function loadUserStates() {
      if (!isLoggedIn) return;
      try {
        const states = await fetchUserAssetStates();
        const stateMap: Record<string, "pending" | "done" | "revision"> = {};
        states.forEach((s) => {
          if (s.asset_id) {
            stateMap[s.asset_id] = s.status || "pending";
          }
        });
        setUserStates(stateMap);
      } catch (err) {
        console.warn("Unable to fetch user asset states:", err);
      }
    }
    loadUserStates();
  }, [isLoggedIn]);

  const handleStatusChange = async (item: PhaseItemData, newStatus: "pending" | "done" | "revision") => {
    const key = item.assetId || item.id;
    const assetType = (item.type === "video" || item.type === "article" ? item.type : "problem") as "video" | "article" | "problem";

    // Optimistic UI state update
    setUserStates((prev) => ({ ...prev, [key]: newStatus }));

    if (isLoggedIn && key) {
      try {
        await updateUserAssetState(assetType, key, { status: newStatus });
      } catch (err) {
        console.error(`Failed to persist asset state for ${key}:`, err);
      }
    }
  };

  if (!topicPhase) return null;

  // Flatten items to find active learning item & calculate dynamic counts
  const allItems: PhaseItemData[] = topicPhase.chapters.flatMap((c) => c.items);
  const activeItem =
    allItems.find((i) => {
      const key = i.assetId || i.id;
      return userStates[key] !== "done";
    }) || allItems[0];

  const activeChapter = topicPhase.chapters.find((c) =>
    c.items.some((i) => i.id === activeItem?.id)
  );

  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => {
    const key = i.assetId || i.id;
    return userStates[key] === "done";
  }).length;
  const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* ─── 1. Continue Where You Left Off Banner (matching roadmap/id) ─── */}
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
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
                  {activeItem.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-bold">
                  {activeChapter?.title || topicPhase.title} •{" "}
                  {activeItem.type === "problem"
                    ? `${activeItem.difficulty || "Coding"} Problem`
                    : activeItem.type.charAt(0).toUpperCase() + activeItem.type.slice(1)}
                </p>
              </div>
            </div>

            {activeItem.href ? (
              <Link href={activeItem.href} target={activeItem.type === "problem" ? "_blank" : undefined}>
                <motion.button
                  whileHover={{ scale: 1.04, x: 2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04, x: 2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onItemAction && onItemAction(activeItem)}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── 2. Topic Rendered as Phase 1 ─── */}
      <div className="relative">
        {/* Phase Timeline Connector Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-brand-500/30 to-gray-200 dark:to-gray-800 hidden lg:block"
        />

        {/* Phase Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 18 }}
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br from-brand-500 to-indigo-500 shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/20"
          >
            {completedItems > 0 && completedItems === totalItems ? (
              <CheckCircle2 size={22} />
            ) : (
              1
            )}
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {topicPhase.title} Phase
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                {completedItems}/{totalItems} items
              </span>
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 text-xs font-semibold text-brand-500"
              >
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                In Progress
              </motion.span>
            </div>
            {topicPhase.subtitle && (
              <p className="text-sm text-gray-400 dark:text-gray-555 mt-0.5">
                {topicPhase.subtitle}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right font-mono">
              {overallPercent}%
            </span>
          </div>
        </div>

        {/* ─── 3. Sections/Chapters as Accordion Cards inside Phase ─── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3 lg:ml-14"
        >
          {topicPhase.chapters.map((chapter, index) => (
            <ChapterAccordionCard
              key={chapter.id || index}
              chapter={chapter}
              chapterIndex={index}
              firstActiveItemId={activeItem?.id}
              userStates={userStates}
              onStatusChange={handleStatusChange}
              onItemAction={onItemAction}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
