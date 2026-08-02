"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DSATopicModule } from "@/config/dsa-catalog";
import { fadeInUp } from "@/utils/animations";

interface DSAModuleCardProps {
  module: DSATopicModule;
}

export function DSAModuleCard({ module }: DSAModuleCardProps) {
  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/learn/dsa/${module.slug}`} className="block group h-full">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl p-6 h-full flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:-translate-y-1.5 hover:border-brand-400/40 dark:hover:border-brand-500/25">
          {/* Ambient card glow */}
          <div
            className={`absolute -right-20 -top-20 w-44 h-44 rounded-full bg-gradient-to-br ${module.gradient} opacity-[0.08] dark:opacity-[0.14] blur-3xl group-hover:scale-150 group-hover:opacity-[0.16] dark:group-hover:opacity-[0.24] transition-all duration-700 pointer-events-none`}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header: Icon + Difficulty Badge */}
            <div className="flex items-start justify-between mb-5">
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${module.gradient} text-white shadow-[0_8px_20px_-4px_rgba(99,102,241,0.35)] group-hover:scale-110 group-hover:rotate-2 transition-all duration-500`}
              >
                <module.icon size={24} />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider border ${module.difficultyClass}`}>
                  {module.difficulty}
                </span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {module.categoryLabel}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
              {module.title}
            </h3>
            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-3">
              {module.description}
            </p>

            {/* Key Topics Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {module.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-gray-100/80 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/5"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Footer Row: Lessons Count + Start CTA */}
            <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100/80 dark:border-white/5">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                {module.lessonCount ?? module.chaptersCount} Chapters • {module.problemCount ?? module.itemsCount} Items
              </span>
              <div className="flex items-center gap-1 text-xs font-extrabold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                <span>Start</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
