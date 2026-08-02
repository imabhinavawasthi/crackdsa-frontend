"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  FileText,
  Sparkles,
  Code2,
  Layers,
  Compass,
  Brain,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/animations";

/* ── Learn DSA ─────────────────────────────────────────────────────────── */

function LearnDSACard() {
  return (
    <motion.div variants={fadeInUp}>
      <Link href="/dsa" className="block group h-full">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-200/50 dark:border-brand-500/12 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl p-7 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(70,95,255,0.12)] hover:-translate-y-1.5 hover:border-brand-400/40 dark:hover:border-brand-500/25">
          {/* Dual ambient glows */}
          <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-gradient-to-br from-brand-500 via-indigo-500 to-violet-600 opacity-[0.07] dark:opacity-[0.12] blur-3xl group-hover:scale-[1.6] group-hover:opacity-[0.12] dark:group-hover:opacity-[0.22] transition-all duration-700 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-brand-500 opacity-0 group-hover:opacity-[0.07] dark:group-hover:opacity-[0.12] blur-3xl transition-all duration-700 pointer-events-none" />

          {/* Dot grid texture */}
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-500 to-violet-600 text-white shadow-[0_8px_24px_-4px_rgba(70,95,255,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <GraduationCap size={26} />
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider border bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200/60 dark:border-brand-500/20">
                Course
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-snug">
              Learn DSA
            </h3>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
              Structured course from fundamentals to advanced patterns with video lectures & hands-on practice.
            </p>

            {/* Mini stats */}
            <div className="flex gap-3 mt-auto pt-5">
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100/80 dark:border-white/5 px-2.5 py-1.5">
                <span className="text-sm font-black text-gray-900 dark:text-white">100+</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Videos</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100/80 dark:border-white/5 px-2.5 py-1.5">
                <span className="text-sm font-black text-gray-900 dark:text-white">150+</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Problems</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:via-indigo-500 group-hover:to-violet-600 group-hover:text-white shadow-xs group-hover:shadow-[0_6px_24px_rgba(70,95,255,0.25)]">
              Start Learning <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── DSA Sheets ────────────────────────────────────────────────────────── */

function DSASheetsCard() {
  return (
    <motion.div variants={fadeInUp}>
      <Link href="/dsa-sheet" className="block group h-full">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-purple-200/50 dark:border-purple-500/12 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl p-7 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.12)] hover:-translate-y-1.5 hover:border-purple-400/40 dark:hover:border-purple-500/25">
          <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 opacity-[0.07] dark:opacity-[0.12] blur-3xl group-hover:scale-[1.6] group-hover:opacity-[0.12] dark:group-hover:opacity-[0.22] transition-all duration-700 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 opacity-0 group-hover:opacity-[0.07] dark:group-hover:opacity-[0.12] blur-3xl transition-all duration-700 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 text-white shadow-[0_8px_24px_-4px_rgba(139,92,246,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <FileText size={26} />
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider border bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-500/20">
                New
              </span>
            </div>

            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-snug">
              Structured DSA Sheets
            </h3>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
              Curated problem sheets organized by patterns — track progress, revise, and master every topic.
            </p>

            <div className="flex gap-3 mt-auto pt-5">
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100/80 dark:border-white/5 px-2.5 py-1.5">
                <span className="text-sm font-black text-gray-900 dark:text-white">3+</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sheets</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100/80 dark:border-white/5 px-2.5 py-1.5">
                <span className="text-sm font-black text-gray-900 dark:text-white">400+</span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Problems</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:via-purple-500 group-hover:to-fuchsia-600 group-hover:text-white shadow-xs group-hover:shadow-[0_6px_24px_rgba(139,92,246,0.25)]">
              Explore Sheets <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── AI Roadmap CTA ────────────────────────────────────────────────────── */

const roadmapNodes = [
  { label: "Arrays", icon: Code2, delay: 0 },
  { label: "Trees", icon: Layers, delay: 0.1 },
  { label: "Graphs", icon: Compass, delay: 0.2 },
  { label: "DP", icon: Brain, delay: 0.3 },
];

function AIRoadmapCard() {
  return (
    <motion.div variants={fadeInUp} className="md:col-span-2">
      <Link href="/roadmap" className="block group">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-200/50 dark:border-emerald-500/12 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl px-7 py-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] hover:-translate-y-1 hover:border-emerald-400/40 dark:hover:border-emerald-500/25">
          {/* Ambient glows */}
          <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-[0.07] dark:opacity-[0.12] blur-3xl group-hover:scale-[1.6] group-hover:opacity-[0.12] dark:group-hover:opacity-[0.22] transition-all duration-700 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-[0.07] dark:group-hover:opacity-[0.12] blur-3xl transition-all duration-700 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10 flex items-center gap-6">
            {/* Icon with orbiting sparkle */}
            <div className="relative shrink-0">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-[0_8px_24px_-4px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Sparkles size={26} />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1.5 pointer-events-none"
              >
                <span className="absolute -top-0.5 left-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-300 opacity-70" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  AI Personalised Roadmap
                </h3>
                <span className="rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20 flex items-center gap-1">
                  <Sparkles size={8} className="animate-pulse" /> AI
                </span>
              </div>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium max-w-lg">
                Tell us your target companies, timeline & skill level — AI builds a custom roadmap with daily plans and adaptive tracking.
              </p>
            </div>

            {/* Topic nodes — visible sm+ */}
            <div className="hidden lg:flex items-center shrink-0 gap-0.5">
              {roadmapNodes.map((node, i) => (
                <React.Fragment key={node.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: node.delay + 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
                      <node.icon size={15} />
                    </div>
                    <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 mt-1 whitespace-nowrap">{node.label}</span>
                  </motion.div>
                  {i < roadmapNodes.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: node.delay + 0.5, duration: 0.3 }}
                      className="w-4 h-px rounded-full bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-500/40 dark:to-teal-500/40 mb-4 origin-left"
                    />
                  )}
                </React.Fragment>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="flex items-center gap-0.5 mb-4 ml-1"
              >
                <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
                <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
                <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
              </motion.div>
            </div>

            {/* Arrow */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:via-teal-500 group-hover:to-cyan-600 group-hover:text-white group-hover:shadow-sm">
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Combined Section ──────────────────────────────────────────────────── */

export function HeroFeaturesSection() {
  return (
    <motion.section initial="hidden" animate="visible" variants={staggerContainer}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LearnDSACard />
        <DSASheetsCard />
        <AIRoadmapCard />
      </div>
    </motion.section>
  );
}
