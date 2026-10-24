"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  CircleDot, 
  ShieldCheck, 
  TrendingUp, 
  PlayCircle,
  Code2,
  Play
} from "lucide-react";

export default function DSASheetLibraryHero() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* ─── Top Back Navigation ────────────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* ─── Hero Content & Floating Mockup Grid ────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-12">
        {/* Left: Heading, Description & Feature Badges */}
        <div className="space-y-5 max-w-2xl">
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              DSA Sheets <span className="text-blue-600 dark:text-blue-500">Library</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
              Organised problem sheets with tracking, solutions, and video editorials — everything you need for your DSA and tech interview preparation.
            </p>
          </div>

          {/* 3 Value Pillars */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            {/* 1. Curated by Experts */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-50 dark:ring-blue-950/40">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  Curated by Experts
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  High quality problems
                </p>
              </div>
            </div>

            {/* 2. Track Your Progress */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-50 dark:ring-emerald-950/40">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  Track Your Progress
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Stay consistent
                </p>
              </div>
            </div>

            {/* 3. Video Editorials */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/25 ring-4 ring-purple-50 dark:ring-purple-950/40">
                <PlayCircle size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  Video Editorials
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Learn from solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Floating Isometric 3D Mockup Preview */}
        <div className="relative shrink-0 w-full lg:w-auto flex justify-center lg:justify-end pt-4 lg:pt-0">
          <div className="relative w-[300px] sm:w-[340px] h-[210px] sm:h-[230px]">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl -z-10 pointer-events-none" />

            {/* Tilted Window in Background */}
            <div className="absolute right-0 top-1 w-[220px] sm:w-[250px] h-[190px] sm:h-[210px] rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-100/70 dark:from-gray-800 dark:to-gray-900 border border-blue-200/60 dark:border-gray-700 shadow-xl rotate-[4deg] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200/50 dark:border-gray-700/60">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-red-400" />
                  <div className="size-2 rounded-full bg-amber-400" />
                  <div className="size-2 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                  <Code2 size={11} /> editorial
                </div>
              </div>

              {/* Video play icon in center */}
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="size-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/35">
                  <Play size={18} fill="white" className="translate-x-0.5" />
                </div>
                <div className="w-24 h-1.5 bg-blue-200/60 dark:bg-gray-700 rounded-full" />
                <div className="w-16 h-1 bg-blue-200/40 dark:bg-gray-700/60 rounded-full" />
              </div>

              <div className="space-y-1.5">
                <div className="w-full h-1.5 bg-blue-200/60 dark:bg-gray-700 rounded-full" />
                <div className="w-3/4 h-1.5 bg-blue-200/40 dark:bg-gray-700/60 rounded-full" />
              </div>
            </div>

            {/* Foreground Floating White Progress Tracker Card */}
            <div className="absolute left-0 top-3 w-[220px] sm:w-[245px] rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-2xl p-4 space-y-3.5 rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
              {/* Item 1: Two Pointers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Two Pointers
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">12/15 solved</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[80%]" />
                </div>
              </div>

              {/* Item 2: Binary Search */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle size={15} className="text-gray-300 dark:text-gray-600 shrink-0" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Binary Search
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">0/20 solved</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gray-200 dark:bg-gray-700 h-full rounded-full w-0" />
                </div>
              </div>

              {/* Item 3: Dynamic Programming */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDot size={15} className="text-blue-500 shrink-0" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Dynamic Programming
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">5/25 solved</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
