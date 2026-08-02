"use client";

import React from "react";
import {
  Loader2,
  Code2,
  Layers,
  Compass,
  Brain,
  Sparkles,
  ArrowRight,
  Activity,
  Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/animations";
import { RoadmapDBRecord } from "@/components/roadmap/types";

interface ActiveRoadmapSectionProps {
  isLoading: boolean;
  activeRoadmap: RoadmapDBRecord | null;
  isLoggedIn: boolean;
  isPro: boolean;
}

export function ActiveRoadmapSection({
  isLoading,
  activeRoadmap,
  isLoggedIn,
  isPro,
}: ActiveRoadmapSectionProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-8 min-h-40 shadow-sm">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (!activeRoadmap) {
    const roadmapNodes = [
      { label: "Arrays", icon: Code2, delay: 0 },
      { label: "Trees", icon: Layers, delay: 0.12 },
      { label: "Graphs", icon: Compass, delay: 0.24 },
      { label: "DP", icon: Brain, delay: 0.36 },
    ];

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <Link href="/roadmap" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/50 dark:border-emerald-500/12 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl px-6 py-5 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(16,185,129,0.12)] hover:-translate-y-1 hover:border-emerald-400/40 dark:hover:border-emerald-500/25">

            {/* Ambient glow orbs */}
            <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-[0.06] dark:opacity-[0.1] blur-3xl group-hover:scale-150 group-hover:opacity-[0.12] dark:group-hover:opacity-[0.2] transition-all duration-700 pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.1] blur-3xl transition-all duration-700 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-5">
              {/* Compass icon with orbiting sparkle */}
              <div className="relative shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-[0_6px_16px_-3px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:rotate-2 transition-all duration-500">
                  <Sparkles size={22} />
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
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                    AI Personalised Roadmap
                  </h3>
                  <span className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20 flex items-center gap-1">
                    <Sparkles size={8} className="animate-pulse" /> AI
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  AI builds a personalized path based on your skills, goals & target companies.
                </p>
              </div>

              {/* Animated topic nodes with connecting lines — visible on sm+ */}
              <div className="hidden sm:flex items-center shrink-0">
                {roadmapNodes.map((node, i) => (
                  <React.Fragment key={node.label}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: node.delay + 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
                      className="relative flex flex-col items-center"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
                        <node.icon size={14} />
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:via-teal-500 group-hover:to-cyan-600 group-hover:text-white group-hover:shadow-sm">
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  const currentPhase = activeRoadmap.structure?.phases?.[0];
  const totalTopics = activeRoadmap.structure?.phases?.reduce((acc, p) => acc + (p.topics?.length || 0), 0) || 0;
  const completedTopics = activeRoadmap.structure?.phases?.reduce(
    (acc, p) => acc + (p.topics?.filter((t) => t.status === "completed")?.length || 0),
    0
  ) || 0;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/roadmap/${activeRoadmap.id}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/50 p-5 sm:p-6 shadow-md border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/10 transition-colors duration-500" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 border border-emerald-100 dark:border-emerald-500/20">
                  <Activity size={12} className="animate-pulse" /> Active Roadmap
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight line-clamp-1">
                  {activeRoadmap.title}
                </h2>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2 max-w-md leading-relaxed">
                  {currentPhase?.subtitle || "Resume your personalized curriculum."}
                </p>
              </div>
              <div className="relative inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gray-950 dark:bg-white px-5 py-2.5 text-sm font-bold text-white dark:text-gray-950 shadow-md transition-all group-hover:bg-gray-800 dark:group-hover:bg-gray-100 group-hover:-translate-y-0.5">
                Resume Path <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {isPro && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Overall Progress
                  </span>
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    {progressPercent}% · {completedTopics}/{totalTopics} topics
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
                  />
                </div>
                {currentPhase && (
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Target size={13} className="text-brand-500" />
                      Current: <span className="text-gray-900 dark:text-white">{currentPhase.title}</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span>{currentPhase.topics?.length || 0} topics</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
