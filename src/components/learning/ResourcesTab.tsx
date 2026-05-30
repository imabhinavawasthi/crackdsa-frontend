"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, FileCode, FileText, ExternalLink, Dumbbell, BookOpen, Link2 } from "lucide-react";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface RelatedProblem {
  title: string;
  url: string;
  platform: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface RelatedArticle {
  title: string;
  slug: string;
}

interface ResourceDownload {
  name: string;
  size?: string;
  url: string;
  description: string;
}

interface CodeLink {
  name: string;
  url: string;
  description: string;
}

interface LectureResources {
  relatedProblems?: RelatedProblem[];
  relatedArticles?: RelatedArticle[];
  downloads?: ResourceDownload[];
  codeLinks?: CodeLink[];
}

const LECTURE_RESOURCES_DATABASE: Record<string, LectureResources> = {
  "item-1": {
    relatedProblems: [
      { title: "Reverse an Array", url: "https://leetcode.com/problems/reverse-string/", platform: "LeetCode", difficulty: "Easy" },
      { title: "Find Minimum and Maximum in Array", url: "https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1", platform: "GFG", difficulty: "Easy" }
    ],
    relatedArticles: [
      { title: "Analysis of Algorithms & Big-O notation", slug: "analysis-of-algorithms-big-o" },
      { title: "Why Efficiency Matters", slug: "introduction/why-efficiency-matters" }
    ],
    downloads: [
      { name: "Language Basics & Stack Memory Allocation PDF Slides", size: "2.4 MB", url: "#", description: "Visual slides representing stack execution frames, pointers, references, and static memory arrays." },
      { name: "C++ vs Java Memory Management Reference Guide", size: "920 KB", url: "#", description: "Reference guide comparing garbage collection internals in Java vs pointers allocation in C++." }
    ],
    codeLinks: [
      { name: "GitHub: DSA Core Languages Starter Template", url: "https://github.com", description: "Starter template repository with complete boilerplate code for arrays, sorting, and structural unit tests." }
    ]
  },
  "item-5": {
    relatedProblems: [
      { title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", platform: "LeetCode", difficulty: "Easy" },
      { title: "Two Sum II - Input Array Is Sorted", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", platform: "LeetCode", difficulty: "Medium" }
    ],
    relatedArticles: [
      { title: "Ultimate SDE Interview Prep Cheat Sheet", slug: "sde-cheat-sheet" }
    ],
    downloads: [
      { name: "Two Pointers Iteration Blueprint Manual", size: "1.2 MB", url: "#", description: "Complete checklist illustrating low/high bounds, middle boundaries, and binary searches pointers patterns." }
    ],
    codeLinks: [
      { name: "GitHub: Two Pointer Iteration Patterns Boilerplate", url: "https://github.com", description: "Optimized boilerplate templates for two-pointer traversals." }
    ]
  },
  "item-9": {
    relatedProblems: [
      { title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", platform: "LeetCode", difficulty: "Easy" },
      { title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", platform: "LeetCode", difficulty: "Easy" }
    ],
    relatedArticles: [
      { title: "Dynamic Tree Traversals Overview", slug: "introduction/dsa-roadmap" }
    ],
    downloads: [
      { name: "DFS vs BFS Traversals PDF Handouts", size: "2.1 MB", url: "#", description: "Trace tree preorder, inorder, and postorder nodes traversal steps." }
    ],
    codeLinks: [
      { name: "GitHub: Tree Operations C++/Java Boilerplate", url: "https://github.com", description: "Starter templates for binary tree building and pointer swaps." }
    ]
  },
  "item-12": {
    relatedProblems: [
      { title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", platform: "LeetCode", difficulty: "Easy" },
      { title: "Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number/", platform: "LeetCode", difficulty: "Easy" }
    ],
    relatedArticles: [
      { title: "Amortized Complexity Analysis Guide", slug: "introduction/amortized-analysis" }
    ],
    downloads: [
      { name: "Dynamic Programming Memoization vs Tabulation Handouts", size: "3.0 MB", url: "#", description: "Trace recursion trees to optimize overlapping subproblems." }
    ],
    codeLinks: [
      { name: "GitHub: DP Memoization vs Tabulation Boilerplate", url: "https://github.com", description: "Complete iterative bottom-up templates." }
    ]
  }
};

// Animation variants
const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 28 },
  },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 340, damping: 26 },
  },
};

interface ResourcesTabProps {
  itemId: string;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ itemId }) => {
  const resources = LECTURE_RESOURCES_DATABASE[itemId] || {
    relatedProblems: [],
    relatedArticles: [],
    downloads: [
      {
        name: "General Study Notes Handout",
        size: "950 KB",
        url: "#",
        description: "Conceptual handout worksheet covering the topics taught in this syllabus section."
      }
    ],
    codeLinks: []
  };

  const hasAnyResources = 
    (resources.relatedProblems && resources.relatedProblems.length > 0) ||
    (resources.relatedArticles && resources.relatedArticles.length > 0) ||
    (resources.downloads && resources.downloads.length > 0) ||
    (resources.codeLinks && resources.codeLinks.length > 0);

  if (!hasAnyResources) {
    return (
      <motion.div
        className="text-center py-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium">No assets or handouts currently attached to this lecture.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8 select-none"
      variants={sectionContainerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* 1. Related Problems Section */}
      {resources.relatedProblems && resources.relatedProblems.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <Dumbbell size={14} className="text-brand-500" />
            <span>Related Coding Problems ({resources.relatedProblems.length})</span>
          </motion.h4>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={cardContainerVariants}
          >
            {resources.relatedProblems.map((prob, idx) => (
              <motion.a
                key={idx}
                href={prob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/20 hover:bg-gray-50 dark:bg-gray-900/10 dark:hover:bg-gray-900/35 hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-[0_0_15px_-5px_rgba(var(--color-brand-500),0.15)] transition-all duration-300 group cursor-pointer"
                variants={cardVariants}
                whileHover={{ y: -2 }}
              >
                <div className="space-y-1 pr-3 truncate">
                  <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                    {prob.title}
                  </h5>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    {prob.platform}
                  </span>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border transition-all duration-300 hover:scale-110 ${
                  prob.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 hover:bg-emerald-500/20 hover:shadow-[0_0_8px_-2px_rgba(16,185,129,0.4)]"
                    : prob.difficulty === "Medium"
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/10 hover:bg-yellow-500/20 hover:shadow-[0_0_8px_-2px_rgba(234,179,8,0.4)]"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10 hover:bg-red-500/20 hover:shadow-[0_0_8px_-2px_rgba(239,68,68,0.4)]"
                }`}>
                  {prob.difficulty}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 2. Related Articles Section */}
      {resources.relatedArticles && resources.relatedArticles.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <BookOpen size={14} className="text-brand-500" />
            <span>Related Conceptual Articles ({resources.relatedArticles.length})</span>
          </motion.h4>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={cardContainerVariants}
          >
            {resources.relatedArticles.map((art, idx) => (
              <motion.div key={idx} variants={cardVariants} whileHover={{ y: -2 }}>
                <Link
                  href={`/learn/dsa/${art.slug}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/20 hover:bg-gray-50 dark:bg-gray-900/10 dark:hover:bg-gray-900/35 hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-[0_0_15px_-5px_rgba(var(--color-brand-500),0.15)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="space-y-1 pr-3 truncate">
                    <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                      {art.title}
                    </h5>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Syllabus Documentation
                    </span>
                  </div>
                  <span className="shrink-0 p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                    <ExternalLink size={10} className="stroke-[2.5]" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 3. Downloads (PDFs, Slides) Section */}
      {resources.downloads && resources.downloads.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <FileText size={14} className="text-brand-500" />
            <span>Downloadable Materials ({resources.downloads.length})</span>
          </motion.h4>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={cardContainerVariants}
          >
            {resources.downloads.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col justify-between p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group hover:shadow-md hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-brand-500/5 transition-all duration-300"
                variants={cardVariants}
                whileHover={{ y: -2 }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10">
                      <FileText size={15} />
                    </div>
                    {item.size && (
                      <span className="text-[9px] font-extrabold text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.size}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug tracking-tight">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-gray-50 dark:border-gray-800/50">
                  <motion.a
                    href={item.url}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 font-bold py-2 text-xs transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download size={11} className="stroke-[2.5]" />
                    <span>Download Handout</span>
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 4. Code Links (GitHub Templates) Section */}
      {resources.codeLinks && resources.codeLinks.length > 0 && (
        <motion.div className="space-y-3.5" variants={sectionVariants}>
          <motion.h4
            className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2"
            variants={headerVariants}
          >
            <FileCode size={14} className="text-brand-500" />
            <span>Starter Templates & Source Code ({resources.codeLinks.length})</span>
          </motion.h4>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={cardContainerVariants}
          >
            {resources.codeLinks.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col justify-between p-4.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group hover:shadow-md hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-brand-500/5 transition-all duration-300"
                variants={cardVariants}
                whileHover={{ y: -2 }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-900/10 dark:border-white/10">
                      <GithubIcon size={15} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug tracking-tight">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-gray-50 dark:border-gray-800/50">
                  <motion.a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 font-bold py-2 text-xs transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Open Code Repository</span>
                    <ExternalLink size={11} className="stroke-[2.5]" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ResourcesTab;
