"use client";

import React, { useState } from "react";
import { ExternalLink, ChevronDown, Lightbulb, Tag, Building2 } from "lucide-react";
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

interface SectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function SectionHeader({ icon, label, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        {icon}
        <span className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
          {count}
        </span>
      )}
    </div>
  );
}

interface HintCardProps {
  hint: string;
  index: number;
  hintKey: string;
}

function HintCard({ hint, index, hintKey }: HintCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <button
        id={hintKey}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-left cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-warning-100 dark:bg-warning-500/15 text-warning-600 dark:text-warning-400 flex items-center justify-center text-[10px] font-extrabold border border-warning-200 dark:border-warning-500/20 shrink-0">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
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
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3.5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
              <div className="flex gap-2.5">
                <Lightbulb
                  size={14}
                  className="text-warning-500 shrink-0 mt-0.5"
                />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
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
  const hasFooterSection = hasTopicTags || hasCompanyTags || hasHints;

  return (
    <div className="w-full space-y-5 mx-5">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} size="md" />
          {problem.platform && (
            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {problem.platform}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
          {problem.title}
        </h2>

        {/* Solve button */}
        {problem.problemUrl && (
          <a
            href={problem.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
          >
            <span>Solve on {problem.platform || "Platform"}</span>
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 dark:border-gray-800" />

      {/* ── Description ────────────────────────────────────────────────────── */}
      <div
        className="problem-description text-sm sm:text-[14px] text-gray-700 dark:text-gray-300 leading-7"
        dangerouslySetInnerHTML={{ __html: problem.description }}
      />

      {/* ── Tags & Hints ────────────────────────────────────────────────────── */}
      {hasFooterSection && (
        <div className="space-y-5 pt-4 border-t border-gray-200 dark:border-gray-800">

          {/* Topic Tags */}
          {hasTopicTags && (
            <div>
              <SectionHeader
                icon={<Tag size={12} />}
                label="Topics"
                count={problem.topicTags!.length}
              />
              <div className="flex flex-wrap gap-1.5">
                {problem.topicTags!.map((tag) => (
                  <TagPill
                    key={tag}
                    label={formatTag(tag)}
                    href={`/practice/topics/${slugify(tag)}`}
                    variant="topic"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Company Tags */}
          {hasCompanyTags && (
            <div>
              <SectionHeader
                icon={<Building2 size={12} />}
                label="Companies"
                count={problem.companyTags!.length}
              />
              <div className="flex flex-wrap gap-1.5">
                {problem.companyTags!.map((tag) => (
                  <TagPill
                    key={tag}
                    label={formatTag(tag)}
                    href={`/practice/companies/${slugify(tag)}`}
                    variant="company"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hints */}
          {hasHints && (
            <div>
              <SectionHeader
                icon={<Lightbulb size={12} />}
                label="Hints"
                count={problem.hints!.length}
              />
              <div className="space-y-2">
                {problem.hints!.map((hint, i) => (
                  <HintCard
                    key={`${slug}-hint-${i}`}
                    hintKey={`${slug}-hint-${i}`}
                    hint={hint}
                    index={i}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ProblemStatement;
