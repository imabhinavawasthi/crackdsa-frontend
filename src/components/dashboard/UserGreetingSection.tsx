"use client";

import React from "react";
import { Crown, Zap, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/animations";
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
  dailyProblem,
}: UserGreetingSectionProps) {
  const isGuest = firstName === "Welcome to crackDSA";
  const greetingText = getGreeting();

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/70 backdrop-blur-2xl p-5 sm:p-6 shadow-xs"
    >
      {/* Subtle ambient glow backdrop */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gradient-to-br from-brand-500/10 via-indigo-500/5 to-purple-500/10 dark:from-brand-500/15 dark:to-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Column: Greeting Badge, Title & Subtitle */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">

            {isPro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-xs">
                <Crown size={10} /> PRO
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
            {isGuest ? (
              <span>
                Welcome to{" "}
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  crackDSA
                </span>
              </span>
            ) : (
              <span>
                {greetingText},{" "}
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </span>
            )}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
            {isPro
              ? "Welcome back to your premium workspace."
              : isGuest
              ? "Your interview prep journey starts here."
              : "Let's practice, learn and grow."}
          </p>
        </div>

        {/* Right Column: Balanced Today's Problem Card */}
        {dailyProblem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="shrink-0"
          >
            <Link
              href={`/problem/${dailyProblem.slug}`}
              target={dailyProblem.problem_url ? "_blank" : undefined}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-2xl border border-brand-200/60 dark:border-brand-500/20 bg-brand-50/40 dark:bg-brand-500/5 backdrop-blur-xl p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-brand-300/80 dark:hover:border-brand-500/30 hover:-translate-y-0.5 transition-all duration-300 min-w-[240px] sm:min-w-[270px]">
                <div className="flex items-center gap-3">
                  {/* Lightning Icon Box */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white shadow-xs shadow-brand-500/20 group-hover:scale-105 transition-transform">
                    <Zap size={18} />
                  </div>

                  {/* Problem Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        Today&apos;s Problem
                      </span>
                      <span
                        className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                          dailyProblem.difficulty === "Easy"
                            ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                            : dailyProblem.difficulty === "Medium"
                            ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                            : "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                        }`}
                      >
                        {dailyProblem.difficulty}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {dailyProblem.title}
                    </p>

                    <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500">
                      <span>{dailyProblem.platform || "Daily Challenge"}</span>
                      <span className="flex items-center gap-0.5 text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                        Solve <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
