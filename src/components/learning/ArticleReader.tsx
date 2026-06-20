"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { BookOpen, Clock, Calendar, CheckSquare, Sparkles } from "lucide-react";

interface ArticleDetail {
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  publishedDate: string;
  content: string;
}

const ARTICLE_DATABASE: Record<string, ArticleDetail> = {
  "analysis-of-algorithms-big-o": {
    title: "Analysis of Algorithms & Big-O Notation",
    subtitle: "Revision guide on evaluating algorithmic time complexity and standard SDE scaling rules.",
    category: "Complexity Analysis",
    readTime: "8 min read",
    publishedDate: "May 25, 2026",
    content: `
      <p class="leading-relaxed mb-6">In SDE interviews, writing working code is only 50% of the battle. The other 50% is demonstrating that you understand exactly how your code scales. This is measured via <strong>Time and Space Complexity Analysis</strong>.</p>
      
      <div class="my-8 p-5 bg-brand-500/5 dark:bg-brand-500/10 rounded-2xl border-l-4 border-brand-500">
        <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
          <Sparkles size={15} className="text-brand-500" />
          <span>Core Concept: What is Big-O?</span>
        </h4>
        <p class="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          Big-O notation describes the upper bound of execution time or memory capacity as the input size <code>N</code> scales towards infinity. It represents the worst-case scenario.
        </p>
      </div>

      <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight">The 3 Asymptotic Notations</h3>
      <ul class="list-decimal pl-6 space-y-4 text-sm mb-8 font-medium">
        <li><strong>Big-O (O)</strong>: Represents the <strong>worst-case</strong> upper bound limit. (Most critical for SDE screens).</li>
        <li><strong>Big-Omega (Ω)</strong>: Represents the <strong>best-case</strong> lower bound limit.</li>
        <li><strong>Big-Theta (Θ)</strong>: Represents the <strong>average-case</strong> or tight bound of scaling.</li>
      </ul>

      <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight">Standard Complexity Rankings (Fast to Slow)</h3>
      <div class="overflow-x-auto my-6 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 font-bold">
              <th class="p-3.5">Notation</th>
              <th class="p-3.5">Name</th>
              <th class="p-3.5">Scaling Behavior</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
            <tr>
              <td class="p-3.5 font-mono text-brand-500">O(1)</td>
              <td class="p-3.5">Constant</td>
              <td class="p-3.5 text-gray-500">Independent of input size. Direct math calculations.</td>
            </tr>
            <tr>
              <td class="p-3.5 font-mono text-brand-500">O(log N)</td>
              <td class="p-3.5">Logarithmic</td>
              <td class="p-3.5 text-gray-500">Halves search bounds on each step (e.g., Binary Search).</td>
            </tr>
            <tr>
              <td class="p-3.5 font-mono text-brand-500">O(N)</td>
              <td class="p-3.5">Linear</td>
              <td class="p-3.5 text-gray-500">Scales proportionally with inputs (e.g., single loops).</td>
            </tr>
            <tr>
              <td class="p-3.5 font-mono text-brand-500">O(N log N)</td>
              <td class="p-3.5">Linearithmic</td>
              <td class="p-3.5 text-gray-500">Optimized sorting schemes (e.g., Merge Sort, Quick Sort).</td>
            </tr>
            <tr>
              <td class="p-3.5 font-mono text-brand-500">O(N²)</td>
              <td class="p-3.5">Quadratic</td>
              <td class="p-3.5 text-gray-500">Nested iterations across bounds (e.g., Bubble Sort).</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  "sliding-window-guide": {
    title: "Sliding Window Core Patterns & Guidelines",
    subtitle: "A detailed manual on mastering fixed and dynamic size sliding window iterations.",
    category: "Algorithm Strategy",
    readTime: "12 min read",
    publishedDate: "May 28, 2026",
    content: `
      <p class="leading-relaxed mb-6">The <strong>Sliding Window Pattern</strong> is a powerful optimization strategy used to convert quadratic time algorithms <code>O(N²)</code> into efficient linear solutions <code>O(N)</code> for array or string processing.</p>
      
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight">When should you use Sliding Window?</h3>
      <p class="leading-relaxed mb-6">Look for these distinct signatures in problem prompts:</p>
      <ul class="list-disc pl-6 space-y-3.5 text-sm mb-8 font-medium">
        <li>The input is a linear sequence (Array, String, or LinkedList).</li>
        <li>The problem asks for contiguous elements (Subarrays, Substrings, or Sublists).</li>
        <li>You need to find a maximum, minimum, longest, or shortest subarray matching a condition.</li>
      </ul>

      <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight">The Two Core Subtypes</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
        <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10">
          <h4 class="font-bold text-sm text-gray-900 dark:text-white mb-2">1. Fixed Window Size</h4>
          <p class="text-xs text-gray-500 leading-relaxed">
            The window boundaries are hardcoded to size <code>K</code>. Expand right until size <code>K</code>, then shift both boundaries left and right simultaneously to evaluate subsequent sets.
          </p>
        </div>
        <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10">
          <h4 class="font-bold text-sm text-gray-900 dark:text-white mb-2">2. Dynamic Window Size</h4>
          <p class="text-xs text-gray-500 leading-relaxed">
            The size changes dynamically. Move the <code>right</code> pointer to expand. If condition violations occur, move the <code>left</code> pointer forward until conditions are satisfied again.
          </p>
        </div>
      </div>
    `
  },
  "sde-cheat-sheet": {
    title: "Ultimate SDE Interview Prep Cheat Sheet",
    subtitle: "Your step-by-step technical handbook for acing coding interview screens.",
    category: "Interview Strategies",
    readTime: "15 min read",
    publishedDate: "May 30, 2026",
    content: `
      <p class="leading-relaxed mb-6">Preparing for high-profile software engineering screens can feel overwhelming. This cheat sheet organizes the critical checkpoints you should follow in the final 24 hours before your technical interview.</p>
      
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight">The 4-Step Live Interview Blueprint</h3>
      
      <div class="space-y-4 my-8">
        <div class="flex gap-4 items-start">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs">1</div>
          <div>
            <h4 class="text-sm font-bold text-gray-950 dark:text-white leading-none">Clarify Requirements</h4>
            <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">Never write code immediately. Ask about negative values, empty arrays, sizes, limits, or duplicates to establish proper test conditions.</p>
          </div>
        </div>
        
        <div class="flex gap-4 items-start">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs">2</div>
          <div>
            <h4 class="text-sm font-bold text-gray-950 dark:text-white leading-none">Discuss Approaches First</h4>
            <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">Propose a brute-force approach, identify the bottleneck, and outline optimization tactics (e.g. hashing, sorting, or pointer loops).</p>
          </div>
        </div>

        <div class="flex gap-4 items-start">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs">3</div>
          <div>
            <h4 class="text-sm font-bold text-gray-950 dark:text-white leading-none">Dry Run with Test Cases</h4>
            <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">Trace code line by line with a small test input. Identify index bounds issues, empty states, or arithmetic problems visually.</p>
          </div>
        </div>

        <div class="flex gap-4 items-start">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs">4</div>
          <div>
            <h4 class="text-sm font-bold text-gray-950 dark:text-white leading-none">Formulate Complexity Out Loud</h4>
            <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">Clearly state the resulting Big-O complexity for both time and space. Highlight stack sizing if recursion is utilized.</p>
          </div>
        </div>
      </div>
    `
  }
};

interface ArticleReaderProps {
  slug: string;
  articleData?: any;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
    },
  },
};

const headerChildVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.4 },
  },
};

const ArticleReader: React.FC<ArticleReaderProps> = ({ slug, articleData }) => {
  const [readProgress, setReadProgress] = useState(0);

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      setReadProgress(Math.min((scrollPosition / docHeight) * 100, 100));
    }
  }, [scrollPosition]);

  // If articleData is missing, render error layout (No Mock Data Fallback!)
  if (!articleData) {
    return (
      <div className="w-full min-h-[350px] rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10">
          <BookOpen size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-red-600">Conceptual Article Not Found</h4>
          <p className="text-xs text-red-500/80 mt-1 font-semibold max-w-md">
            The specifications for this article are not available in the database. Check your syllabus details or try again.
          </p>
        </div>
      </div>
    );
  }

  // Construct article details from dynamic data
  const article = {
    title: articleData.title || "Untitled Article",
    subtitle: articleData.subtitle || "",
    category: articleData.category || "General",
    readTime: articleData.read_time_minutes ? `${articleData.read_time_minutes} min read` : "5 min read",
    publishedDate: articleData.published_at 
      ? new Date(articleData.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : (articleData.created_at ? new Date(articleData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"),
    content: articleData.description || ""
  };

  return (
    <motion.article
      className="relative w-full rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-10 shadow-sm overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Reading Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100/50 dark:bg-gray-800/50 z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 rounded-r-full"
          style={{ width: `${readProgress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Article Header Metadata */}
      <motion.div
        className="space-y-4.5 border-b border-gray-100 dark:border-gray-800/80 pb-7"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-3" variants={headerChildVariants}>
          <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 overflow-hidden group">
            {/* Shimmer overlay */}
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* Ambient glow */}
            <span className="absolute inset-0 rounded-lg shadow-[0_0_12px_rgba(var(--brand-rgb,99,102,241),0.3)] opacity-60" />
            <BookOpen size={11} className="relative z-10" />
            <span className="relative z-10">{article.category}</span>
          </span>
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3.5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight"
          variants={headerChildVariants}
        >
          {article.title}
        </motion.h1>

        <motion.p
          className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-medium"
          variants={headerChildVariants}
        >
          {article.subtitle}
        </motion.p>

        {/* Read times and calendar - glassmorphism pills */}
        <motion.div
          className="flex flex-wrap items-center gap-3 pt-1.5"
          variants={headerChildVariants}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/40 shadow-sm">
            <Clock size={13} />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/40 shadow-sm">
            <Calendar size={13} />
            <span>{article.publishedDate}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Article HTML Content */}
      <motion.div
        className="mt-8 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      />

    </motion.article>
  );
};

export default ArticleReader;
