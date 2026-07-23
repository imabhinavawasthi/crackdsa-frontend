"use client";

import React from "react";
import { Crown, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/utils/animations";
import { getGreeting } from "@/utils/greeting";
import { DetailedProblem } from "@/types/dsa-sheet";

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

interface UserGreetingSectionProps {
  firstName: string;
  isPro: boolean;
  stats?: StatItem[];
  dailyProblem?: DetailedProblem | null;
}

export function UserGreetingSection({
  firstName,
  isPro,
  stats,
  dailyProblem,
}: UserGreetingSectionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            {getGreeting()}, {firstName}.
          </h1>
          {isPro && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-amber-500/30">
              <Crown size={12} /> PRO
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {isPro ? "Welcome back to your premium workspace." : "Welcome back, let's practice, learn and grow."}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide items-stretch"
      >
        {/* {stats && stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={scaleIn}
            className="flex min-w-27.5 items-center gap-3 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{stat.label}</p>
              <p className="text-lg font-black leading-none text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))} */}

        {dailyProblem && (
          <motion.div variants={scaleIn}>
            <Link
              href={`/problem/${dailyProblem.slug}`}
              target={dailyProblem.problem_url ? "_blank" : undefined}
              className="flex items-center gap-3 rounded-2xl border border-brand-200/60 dark:border-brand-500/15 bg-brand-50/60 dark:bg-brand-500/5 backdrop-blur-sm pl-3 pr-4 py-3 shadow-sm hover:shadow-md hover:border-brand-300/80 dark:hover:border-brand-500/25 transition-all group min-w-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-indigo-500 text-white shadow-sm">
                <Zap size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-brand-500 dark:text-brand-400">Today&apos;s Problem</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 truncate">{dailyProblem.title}</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                dailyProblem.difficulty === "Easy" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" :
                dailyProblem.difficulty === "Medium" ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" :
                "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
              }`}>
                {dailyProblem.difficulty}
              </span>
              <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
