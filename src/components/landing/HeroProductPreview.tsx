"use client";

import { useState } from "react";
import { Target, CheckCircle2, Zap, Building2 } from "lucide-react";

export default function HeroProductPreview() {
  const [activeTab, setActiveTab] = useState<"roadmap" | "sheets" | "companies">("roadmap");

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#0E131F] shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300">
      
      {/* Top Window Bar & Nav Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80 dark:bg-gray-700/60" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80 dark:bg-gray-700/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/80 dark:bg-gray-700/60" />
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center bg-gray-200/60 dark:bg-gray-900 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === "roadmap"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setActiveTab("sheets")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === "sheets"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Sheets
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeTab === "companies"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Companies
          </button>
        </div>
      </div>

      {/* Application Content Body */}
      <div className="p-6 space-y-5">
        
        {activeTab === "roadmap" && (
          <>
            {/* Header Info */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                  <Target size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Goal: Amazon SDE-1</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">6 Weeks Prep Plan</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                Active Plan
              </span>
            </div>

            {/* Progress Step Items */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">Sliding Window Pattern</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">12 Problems Solved</div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Complete</span>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-50/80 dark:bg-brand-500/10 border border-brand-200/80 dark:border-brand-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-brand-600 dark:text-brand-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">Two Pointers &amp; Binary Search</div>
                    <div className="text-[10px] text-brand-600 dark:text-brand-300">8 Problems Remaining</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">In Progress</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-200/40 dark:border-gray-800/60 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-400 dark:border-gray-600 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dynamic Programming Patterns</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">Upcoming Module</div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Locked</span>
              </div>
            </div>

            {/* Progress Bar Footer */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-medium mb-2">
                <span className="text-gray-500 dark:text-gray-400">Interview Readiness</span>
                <span className="text-gray-900 dark:text-white font-bold">88%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full w-[88%]" />
              </div>
            </div>
          </>
        )}

        {activeTab === "sheets" && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">CrackDSA 75 Sheet</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">75 Essential Interview Problems</div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 rounded">
                75 Solved
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Pattern Mastery Sheet</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">120 Pattern-First Problems</div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded">
                120 Problems
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">SDE Ultimate Sheet</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">250 Complete SDE Prep</div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded">
                250 Problems
              </span>
            </div>
          </div>
        )}

        {activeTab === "companies" && (
          <div className="space-y-3">
            {["Google", "Amazon", "Microsoft", "Meta"].map((comp) => (
              <div key={comp} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 size={16} className="text-gray-500 dark:text-gray-400" />
                  <div className="text-xs font-bold text-gray-900 dark:text-white">{comp} Question Set</div>
                </div>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">View Questions</span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
