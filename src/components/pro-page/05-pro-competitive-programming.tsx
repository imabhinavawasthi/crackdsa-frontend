"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Terminal,
  Target,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Layers,
  Sparkles,
  Code2,
} from "lucide-react";
import { CP_PRACTICE_CONFIG } from "@/config/pro-page-config";

export function ProCompetitiveProgramming() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tiers = [
    {
      level: "Tier 1: Foundations",
      rating: "800 - 1100",
      problemsCount: "45 Problems",
      topics: ["Implementation & Strings", "Basic Number Theory & Modulo", "Greedy Observation", "Constructive Algorithms"],
      targetOutcome: "Clears Div 2 A & B effortlessly within 15 minutes.",
    },
    {
      level: "Tier 2: Intermediate",
      rating: "1200 - 1400",
      problemsCount: "50 Problems",
      topics: ["Two Pointers & Sliding Window", "Binary Search on Answer Space", "Sorting & Custom Comparators", "Prefix Sums & 2D Math"],
      targetOutcome: "High confidence in FAANG online assessment rounds.",
    },
    {
      level: "Tier 3: Advanced",
      rating: "1500 - 1700",
      problemsCount: "45 Problems",
      topics: ["Tree Traversals & DP on Trees", "Dijkstra & 0-1 BFS", "Knapsack & Submask DP", "Monotonic Deques & Stacks"],
      targetOutcome: "Aces Hard Onsite algorithmic interviews (Uber, Google).",
    },
    {
      level: "Tier 4: Expert CP",
      rating: "1800 - 1900+",
      problemsCount: "35 Problems",
      topics: ["Segment Tree with Lazy Tags", "Fenwick (Binary Indexed) Trees", "Disjoint Set Union (DSU)", "Digit DP & Matrix Exponentiation"],
      targetOutcome: "Candidate Master level problem adaptability & speed.",
    },
  ];

  return (
    <section id="practice" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>{CP_PRACTICE_CONFIG.sectionTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {CP_PRACTICE_CONFIG.title}
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {CP_PRACTICE_CONFIG.subtitle}
          </p>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CP_PRACTICE_CONFIG.features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:border-amber-500/40 hover:shadow-xl hover:-translate-y-1 transition-all space-y-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-mono">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {f.count}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Newbie to Expert Sheet Tier Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                Curated Problem Roadmap
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Newbie to Expert CP Sheet Breakdown (175 Problems)
              </h3>
            </div>

            {/* Tier Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {tiers.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === idx
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {t.level.split(":")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tier Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700/80 pb-3">
              <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white">
                  {tiers[activeTab].level}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Target Rating: <strong className="text-amber-600 dark:text-amber-400 font-mono">{tiers[activeTab].rating}</strong>
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 self-start sm:self-auto">
                {tiers[activeTab].problemsCount} with Video Solutions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tiers[activeTab].topics.map((top, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{top}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-medium">
              🎯 <strong>Outcome:</strong> {tiers[activeTab].targetOutcome}
            </div>
          </div>
        </div>

        {/* Recent Contest Upsolving Showcase */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 font-mono">
              Live Contest Coverage
            </span>
            <Link href="/contests" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1">
              <span>Browse All Contest Editorials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CP_PRACTICE_CONFIG.recentContestsSample.map((round, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    {round.platform}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                    {round.date}
                  </span>
                </div>

                <h4 className="text-sm font-black text-gray-900 dark:text-white">
                  {round.name}
                </h4>

                <div className="space-y-1.5 pt-1">
                  {round.problems.map((prob, i) => (
                    <div
                      key={i}
                      className="text-[11px] p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 flex items-center justify-between"
                    >
                      <span className="truncate">{prob}</span>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Editorial ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
