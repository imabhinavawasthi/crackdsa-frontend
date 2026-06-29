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
      { label: "Arrays", delay: 0, x: 0 },
      { label: "Trees", delay: 0.15, x: 1 },
      { label: "Graphs", delay: 0.3, x: 2 },
      { label: "DP", delay: 0.45, x: 3 },
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
          <div className="relative overflow-hidden rounded-xl border border-brand-500/20 bg-linear-to-br from-brand-50/80 to-indigo-50/60 dark:from-brand-950/30 dark:to-indigo-950/20 px-5 py-4 shadow-sm shadow-brand-500/5 backdrop-blur-sm transition-all hover:shadow-md hover:shadow-brand-500/10 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/8 dark:bg-brand-500/15 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-500/15 transition-colors duration-700" />

            <div className="relative z-10 flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {roadmapNodes.map((node, i) => (
                  <React.Fragment key={node.label}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: node.delay + 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
                      className="relative flex flex-col items-center"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-indigo-500 text-white shadow-sm shadow-brand-500/20">
                        {i === 0 && <Code2 size={14} />}
                        {i === 1 && <Layers size={14} />}
                        {i === 2 && <Compass size={14} />}
                        {i === 3 && <Brain size={14} />}
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">{node.label}</span>
                    </motion.div>
                    {i < roadmapNodes.length - 1 && (
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: node.delay + 0.5, duration: 0.3 }}
                        className="w-5 h-0.5 rounded-full bg-linear-to-r from-brand-400 to-indigo-400 mb-4 origin-left"
                      />
                    )}
                  </React.Fragment>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ delay: 1, duration: 2, repeat: Infinity }}
                  className="flex items-center gap-0.5 mb-4 ml-1"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-white/60 dark:bg-brand-500/10 backdrop-blur-sm px-2 py-1 text-[9px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 border border-white/80 dark:border-brand-500/20">
                  <Sparkles size={10} className="animate-pulse" />
                  AI-Powered
                </div>
                <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">Create Your Custom Roadmap</h3>
                <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                  AI builds a personalized path based on your skills, goals & target companies.
                </p>
              </div>

              <div className="relative inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/15 transition-all group-hover:bg-brand-500 group-hover:-translate-y-0.5">
                <Compass size={13} /> Generate
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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
                  <Activity size={12} className="animate-pulse" /> Active Path
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
