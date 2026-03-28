"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Play,
  ChevronDown,
  Clock,
  Flame,
  Target,
  Trophy,
  Zap,
  BookOpen,
  ArrowRight,
  Star,
  BarChart3,
  MousePointerClick,
  PanelTop,
  Layers,
  Search,
  Link2,
  GitBranch,
  Share2,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type ProblemStatus = "completed" | "current" | "locked";
type TopicStatus = "completed" | "in-progress" | "locked";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: ProblemStatus;
  timeEstimate: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  status: TopicStatus;
  problems: Problem[];
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

interface Phase {
  id: string;
  title: string;
  subtitle: string;
  topics: Topic[];
  color: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────
const roadmapData: Phase[] = [
  {
    id: "phase-1",
    title: "Foundation",
    subtitle: "Build your problem-solving base",
    color: "emerald",
    topics: [
      {
        id: "arrays",
        title: "Arrays & Hashing",
        description: "Master array manipulation and hash-based lookups",
        status: "completed",
        icon: BarChart3,
        iconColor: "text-violet-500",
        iconBg: "bg-violet-50 dark:bg-violet-500/10",
        problems: [
          { id: "p1", title: "Two Sum", difficulty: "Easy", status: "completed", timeEstimate: "15 min" },
          { id: "p2", title: "Contains Duplicate", difficulty: "Easy", status: "completed", timeEstimate: "10 min" },
          { id: "p3", title: "Valid Anagram", difficulty: "Easy", status: "completed", timeEstimate: "10 min" },
          { id: "p4", title: "Group Anagrams", difficulty: "Medium", status: "completed", timeEstimate: "20 min" },
          { id: "p5", title: "Top K Frequent Elements", difficulty: "Medium", status: "completed", timeEstimate: "25 min" },
        ],
      },
      {
        id: "two-pointers",
        title: "Two Pointers",
        description: "Efficient traversal patterns with dual pointers",
        status: "completed",
        icon: MousePointerClick,
        iconColor: "text-sky-500",
        iconBg: "bg-sky-50 dark:bg-sky-500/10",
        problems: [
          { id: "p6", title: "Valid Palindrome", difficulty: "Easy", status: "completed", timeEstimate: "10 min" },
          { id: "p7", title: "Two Sum II", difficulty: "Medium", status: "completed", timeEstimate: "15 min" },
          { id: "p8", title: "3Sum", difficulty: "Medium", status: "completed", timeEstimate: "25 min" },
          { id: "p9", title: "Container With Most Water", difficulty: "Medium", status: "completed", timeEstimate: "20 min" },
        ],
      },
      {
        id: "sliding-window",
        title: "Sliding Window",
        description: "Optimizing subarray and substring problems",
        status: "in-progress",
        icon: PanelTop,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50 dark:bg-amber-500/10",
        problems: [
          { id: "p10", title: "Best Time to Buy & Sell Stock", difficulty: "Easy", status: "completed", timeEstimate: "15 min" },
          { id: "p11", title: "Longest Substring Without Repeating", difficulty: "Medium", status: "completed", timeEstimate: "20 min" },
          { id: "p12", title: "Longest Repeating Character Replacement", difficulty: "Medium", status: "current", timeEstimate: "25 min" },
          { id: "p13", title: "Minimum Window Substring", difficulty: "Hard", status: "locked", timeEstimate: "35 min" },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    title: "Core Patterns",
    subtitle: "Master the essential DSA paradigms",
    color: "blue",
    topics: [
      {
        id: "stack",
        title: "Stack",
        description: "LIFO-based problem solving and monotonic stacks",
        status: "locked",
        icon: Layers,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50 dark:bg-rose-500/10",
        problems: [
          { id: "p14", title: "Valid Parentheses", difficulty: "Easy", status: "locked", timeEstimate: "10 min" },
          { id: "p15", title: "Min Stack", difficulty: "Medium", status: "locked", timeEstimate: "20 min" },
          { id: "p16", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", status: "locked", timeEstimate: "20 min" },
          { id: "p17", title: "Daily Temperatures", difficulty: "Medium", status: "locked", timeEstimate: "25 min" },
          { id: "p18", title: "Largest Rectangle in Histogram", difficulty: "Hard", status: "locked", timeEstimate: "40 min" },
        ],
      },
      {
        id: "binary-search",
        title: "Binary Search",
        description: "Divide and conquer for sorted data",
        status: "locked",
        icon: Search,
        iconColor: "text-teal-500",
        iconBg: "bg-teal-50 dark:bg-teal-500/10",
        problems: [
          { id: "p19", title: "Binary Search", difficulty: "Easy", status: "locked", timeEstimate: "10 min" },
          { id: "p20", title: "Search a 2D Matrix", difficulty: "Medium", status: "locked", timeEstimate: "20 min" },
          { id: "p21", title: "Koko Eating Bananas", difficulty: "Medium", status: "locked", timeEstimate: "25 min" },
          { id: "p22", title: "Median of Two Sorted Arrays", difficulty: "Hard", status: "locked", timeEstimate: "40 min" },
        ],
      },
      {
        id: "linked-list",
        title: "Linked List",
        description: "Pointer manipulation and cycle detection",
        status: "locked",
        icon: Link2,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
        problems: [
          { id: "p23", title: "Reverse Linked List", difficulty: "Easy", status: "locked", timeEstimate: "15 min" },
          { id: "p24", title: "Merge Two Sorted Lists", difficulty: "Easy", status: "locked", timeEstimate: "15 min" },
          { id: "p25", title: "Linked List Cycle", difficulty: "Easy", status: "locked", timeEstimate: "10 min" },
          { id: "p26", title: "LRU Cache", difficulty: "Medium", status: "locked", timeEstimate: "35 min" },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    title: "Advanced",
    subtitle: "Tackle complex interview patterns",
    color: "purple",
    topics: [
      {
        id: "trees",
        title: "Trees",
        description: "Binary trees, BSTs, and traversal strategies",
        status: "locked",
        icon: GitBranch,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
        problems: [
          { id: "p27", title: "Invert Binary Tree", difficulty: "Easy", status: "locked", timeEstimate: "10 min" },
          { id: "p28", title: "Maximum Depth of Binary Tree", difficulty: "Easy", status: "locked", timeEstimate: "10 min" },
          { id: "p29", title: "Validate BST", difficulty: "Medium", status: "locked", timeEstimate: "25 min" },
          { id: "p30", title: "Binary Tree Level Order Traversal", difficulty: "Medium", status: "locked", timeEstimate: "20 min" },
          { id: "p31", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", status: "locked", timeEstimate: "40 min" },
        ],
      },
      {
        id: "graphs",
        title: "Graphs",
        description: "DFS, BFS, and graph traversal algorithms",
        status: "locked",
        icon: Share2,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-50 dark:bg-orange-500/10",
        problems: [
          { id: "p32", title: "Number of Islands", difficulty: "Medium", status: "locked", timeEstimate: "20 min" },
          { id: "p33", title: "Clone Graph", difficulty: "Medium", status: "locked", timeEstimate: "25 min" },
          { id: "p34", title: "Course Schedule", difficulty: "Medium", status: "locked", timeEstimate: "30 min" },
          { id: "p35", title: "Word Ladder", difficulty: "Hard", status: "locked", timeEstimate: "40 min" },
        ],
      },
      {
        id: "dp",
        title: "Dynamic Programming",
        description: "Optimal substructure and overlapping subproblems",
        status: "locked",
        icon: Puzzle,
        iconColor: "text-pink-500",
        iconBg: "bg-pink-50 dark:bg-pink-500/10",
        problems: [
          { id: "p36", title: "Climbing Stairs", difficulty: "Easy", status: "locked", timeEstimate: "10 min" },
          { id: "p37", title: "House Robber", difficulty: "Medium", status: "locked", timeEstimate: "20 min" },
          { id: "p38", title: "Longest Increasing Subsequence", difficulty: "Medium", status: "locked", timeEstimate: "30 min" },
          { id: "p39", title: "Coin Change", difficulty: "Medium", status: "locked", timeEstimate: "25 min" },
          { id: "p40", title: "Edit Distance", difficulty: "Hard", status: "locked", timeEstimate: "40 min" },
        ],
      },
    ],
  },
];

// ── Helper Functions ─────────────────────────────────────────────────────────
function getPhaseProgress(phase: Phase) {
  const total = phase.topics.reduce((acc, t) => acc + t.problems.length, 0);
  const done = phase.topics.reduce(
    (acc, t) => acc + t.problems.filter((p) => p.status === "completed").length,
    0
  );
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getTopicProgress(topic: Topic) {
  const total = topic.problems.length;
  const done = topic.problems.filter((p) => p.status === "completed").length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getOverallProgress() {
  const total = roadmapData.reduce(
    (acc, phase) => acc + phase.topics.reduce((a, t) => a + t.problems.length, 0),
    0
  );
  const done = roadmapData.reduce(
    (acc, phase) =>
      acc + phase.topics.reduce((a, t) => a + t.problems.filter((p) => p.status === "completed").length, 0),
    0
  );
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getCurrentTopic(): Topic | null {
  for (const phase of roadmapData) {
    for (const topic of phase.topics) {
      if (topic.status === "in-progress") return topic;
    }
  }
  return null;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
  Medium: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
  Hard: "text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
};

const phaseColorMap: Record<string, { gradient: string; ring: string; bg: string; text: string; badge: string; progressBar: string }> = {
  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/20",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    progressBar: "bg-emerald-500",
  },
  blue: {
    gradient: "from-blue-500 to-indigo-500",
    ring: "ring-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    progressBar: "bg-blue-500",
  },
  purple: {
    gradient: "from-purple-500 to-pink-500",
    ring: "ring-purple-500/20",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    progressBar: "bg-purple-500",
  },
};

// ── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// ── Sub Components ───────────────────────────────────────────────────────────

function ProgressRing({
  percent,
  size = 56,
  strokeWidth = 5,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-gray-200 dark:text-gray-700"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        className="text-brand-500"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}

function ProblemRow({ problem, index }: { problem: Problem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group cursor-default ${
        problem.status === "completed"
          ? "bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04]"
          : problem.status === "current"
          ? "bg-brand-50/60 dark:bg-brand-500/5 ring-1 ring-brand-200 dark:ring-brand-500/20"
          : "bg-gray-50/50 dark:bg-white/[0.01] opacity-60"
      }`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {problem.status === "completed" ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : problem.status === "current" ? (
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

      {/* Problem Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            problem.status === "completed"
              ? "text-gray-500 dark:text-gray-400 line-through decoration-gray-300 dark:decoration-gray-600"
              : problem.status === "current"
              ? "text-gray-800 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {problem.title}
        </p>
      </div>

      {/* Difficulty Badge */}
      <span
        className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${difficultyColors[problem.difficulty]}`}
      >
        {problem.difficulty}
      </span>

      {/* Time */}
      <span className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hidden sm:flex">
        <Clock size={12} />
        {problem.timeEstimate}
      </span>

      {/* Action */}
      {problem.status === "current" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-brand-500/25"
        >
          Solve
        </motion.button>
      )}
    </motion.div>
  );
}

function TopicCard({ topic, phaseColor, index }: { topic: Topic; phaseColor: string; index: number }) {
  const [isOpen, setIsOpen] = useState(topic.status === "in-progress");
  const progress = getTopicProgress(topic);
  const Icon = topic.icon;

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
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
      >
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
            topic.status === "locked"
              ? "bg-gray-100 dark:bg-gray-700/50"
              : topic.iconBg
          }`}
        >
          <Icon
            size={20}
            className={
              topic.status === "locked"
                ? "text-gray-400 dark:text-gray-500"
                : topic.iconColor
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

      {/* Problems List */}
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
                {topic.problems.map((problem, i) => (
                  <ProblemRow key={problem.id} problem={problem} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const overall = getOverallProgress();
  const currentTopic = getCurrentTopic();

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Roadmap
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your personalized path to cracking DSA interviews
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400 dark:text-gray-500">Overall</span>
          <span className="font-bold text-gray-800 dark:text-white">
            {overall.done}/{overall.total} problems
          </span>
        </div>
      </motion.div>

      {/* ─── Stats Bar ─── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Overall Progress Card */}
        <motion.div
          variants={scaleIn}
          className="sm:col-span-2 lg:col-span-1 relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5"
        >
          <div className="flex items-center gap-4">
            <ProgressRing percent={overall.percent} />
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-3xl font-bold text-gray-800 dark:text-white"
              >
                {overall.percent}%
              </motion.p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Completion
              </p>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-2xl" />
        </motion.div>

        {/* Current Topic */}
        <motion.div
          variants={scaleIn}
          className="relative overflow-hidden rounded-2xl border border-brand-200 dark:border-brand-500/30 bg-gradient-to-br from-brand-50 to-white dark:from-brand-500/5 dark:to-gray-800/50 p-5"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center"
            >
              <Target size={20} className="text-brand-500" />
            </motion.div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                Now Studying
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5 truncate">
                {currentTopic?.title ?? "—"}
              </p>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-0.5">
                {currentTopic
                  ? `${getTopicProgress(currentTopic).done}/${getTopicProgress(currentTopic).total} done`
                  : "All caught up!"}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-brand-500/5 rounded-full blur-xl" />
        </motion.div>

        {/* Streak */}
        <motion.div
          variants={scaleIn}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center"
            >
              <Flame size={20} className="text-amber-500" />
            </motion.div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                Streak
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
                7 days
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Keep it going!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Problems Today */}
        <motion.div
          variants={scaleIn}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Star size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                Today
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
                2 solved
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Goal: 3/day
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

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
                  {currentTopic.problems.find((p) => p.status === "current")?.title ?? currentTopic.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {currentTopic.title} •{" "}
                  {currentTopic.problems.find((p) => p.status === "current")?.difficulty ?? ""}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
            >
              Continue
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ─── Phase Timeline ─── */}
      <div className="space-y-10">
        {roadmapData.map((phase, phaseIndex) => {
          const progress = getPhaseProgress(phase);
          const colors = phaseColorMap[phase.color];
          const isActive = phase.topics.some((t) => t.status === "in-progress");
          const isCompleted = phase.topics.every((t) => t.status === "completed");

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + phaseIndex * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Phase connector line */}
              {phaseIndex < roadmapData.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.6 + phaseIndex * 0.15, duration: 0.8, ease: "easeOut" }}
                  style={{ transformOrigin: "top" }}
                  className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 hidden lg:block"
                />
              )}

              {/* Phase Header */}
              <div className="flex items-center gap-4 mb-6">
                {/* Phase number badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + phaseIndex * 0.15, type: "spring", stiffness: 200, damping: 18 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${colors.gradient} shadow-lg ${
                    isActive ? "shadow-brand-500/30 ring-4 " + colors.ring : ""
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={22} /> : phaseIndex + 1}
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                      {phase.title}
                    </h2>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                      {progress.done}/{progress.total}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 text-xs font-semibold text-brand-500"
                      >
                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                        In Progress
                      </motion.span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                    {phase.subtitle}
                  </p>
                </div>

                {/* Phase Progress Bar */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percent}%` }}
                      transition={{ delay: 0.5 + phaseIndex * 0.15, duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${colors.progressBar}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right">
                    {progress.percent}%
                  </span>
                </div>
              </div>

              {/* Topics Grid */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3 lg:ml-14"
              >
                {phase.topics.map((topic, topicIndex) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    phaseColor={phase.color}
                    index={topicIndex}
                  />
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

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
          <span>Complete all {overall.total} problems to master DSA!</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
