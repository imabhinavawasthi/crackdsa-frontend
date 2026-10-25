"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  ChevronDown,
  Lightbulb,
  Tag,
  Building2,
  Code2,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProblemDetail } from "@/types/practice";
import { formatTag, slugify } from "@/utils/string";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import TagPill from "@/components/ui/TagPill";

interface ProblemStatementProps {
  problem: ProblemDetail;
  slug: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface HintCardProps {
  hint: string;
  index: number;
}

function HintCard({ hint, index }: HintCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900/80 shadow-2xs transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors text-left cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-extrabold border border-amber-500/20 shrink-0 font-mono">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Hint {index + 1}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3.5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
              <div className="flex gap-2.5">
                <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  {hint}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ProblemStatement ─────────────────────────────────────────────────────────

const ProblemStatement: React.FC<ProblemStatementProps> = ({ problem, slug }) => {
  const hasTopicTags = (problem.topicTags?.length ?? 0) > 0;
  const hasCompanyTags = (problem.companyTags?.length ?? 0) > 0;
  const hasHints = (problem.hints?.length ?? 0) > 0;

  const platformLower = (problem.platform || "").toLowerCase();
  const isLeetCode = platformLower.includes("leetcode") || !problem.platform || platformLower === "internal";
  const isCodeforces = platformLower.includes("codeforces") || platformLower === "cf";
  const isCodechef = platformLower.includes("codechef") || platformLower === "cc";
  const isGfg = platformLower.includes("geeksforgeeks") || platformLower === "gfg";

  const externalUrl =
    problem.problemUrl ||
    (isLeetCode ? `https://leetcode.com/problems/${slug}/` : null);

  return (
    <div className="w-full space-y-6">
      {/* ── Header Area ──────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} size="md" />

          {/* Platform Badge */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {isLeetCode ? (
              <Image
                src="/logos/leetcode.png"
                alt="LeetCode"
                width={12}
                height={12}
                className="w-3.5 h-3.5 object-contain"
              />
            ) : null}
            <span>{isLeetCode ? "LeetCode" : problem.platform || "Platform"}</span>
          </span>

          <span className="text-gray-300 dark:text-gray-700">·</span>

          {/* Estimated Time */}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <Clock size={12} />
            <span>
              {problem.difficulty === "Easy"
                ? "10–15 mins"
                : problem.difficulty === "Hard"
                ? "30–45 mins"
                : "20–25 mins"}
            </span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
          {problem.title}
        </h1>

        {/* Tags & Companies (Directly visible, no closed accordions) */}
        {(hasTopicTags || hasCompanyTags) && (
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Topic Tags */}
            {hasTopicTags && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1 flex items-center gap-1">
                  <Tag size={11} />
                  <span>Topics:</span>
                </span>
                {problem.topicTags!.map((tag) => (
                  <TagPill
                    key={tag}
                    label={formatTag(tag)}
                    href={`/practice/topics/${slugify(tag)}`}
                    variant="topic"
                  />
                ))}
              </div>
            )}

            {/* Company Tags */}
            {hasCompanyTags && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1 flex items-center gap-1">
                  <Building2 size={11} />
                  <span>Companies:</span>
                </span>
                {problem.companyTags!.map((tag) => (
                  <TagPill
                    key={tag}
                    label={formatTag(tag)}
                    href={`/practice/companies/${slugify(tag)}`}
                    variant="company"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Primary Action Bar ────────────────────────────────────────────── */}
      {externalUrl && (
        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
          <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            {isLeetCode ? (
              <Image
                src="/logos/leetcode.png"
                alt="LeetCode"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <Code2 size={20} className="text-amber-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
              Solve this problem on {isLeetCode ? "LeetCode" : problem.platform || "Platform"}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              Submit and test your solution with official test cases
            </p>
          </div>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all shadow-sm shadow-amber-500/20 shrink-0"
          >
            <span>Solve Now</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {/* ── Problem Statement Content (Open by default) ───────────────────── */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <FileText size={16} className="text-brand-500" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Problem Description
          </h2>
        </div>

        {problem.description ? (
          <div
            className="problem-description text-[13.5px] sm:text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed font-sans max-w-none"
            dangerouslySetInnerHTML={{ __html: problem.description }}
          />
        ) : (
          <div className="py-6 text-center space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Detailed statement text is not cached locally. Click below to view the official specification and test cases on {isLeetCode ? "LeetCode" : "the platform"}.
            </p>
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
              >
                <span>Open {problem.title} on {isLeetCode ? "LeetCode" : "Platform"}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Hints Section ─────────────────────────────────────────────────── */}
      {hasHints && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-2 pb-1">
            <Lightbulb size={15} className="text-amber-500" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Hints ({problem.hints!.length})
            </h3>
          </div>
          <div className="space-y-2">
            {problem.hints!.map((hint, idx) => (
              <HintCard key={idx} hint={hint} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* ── Disclaimer Footer ─────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-between">
        <span>Curated for structured interview preparation by crackDSA.</span>
        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline inline-flex items-center gap-1"
          >
            <span>Original source</span>
            <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ProblemStatement;
