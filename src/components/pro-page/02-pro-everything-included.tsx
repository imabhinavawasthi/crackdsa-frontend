"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Crown,
  BookOpen,
  Zap,
  Users,
  Trophy,
  LayoutGrid,
  PlayCircle,
  Clock,
  Radio,
  UserCheck,
  FileText,
  BarChart3,
  FileCode,
  ArrowRight,
  Disc,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";

export function ProEverythingIncluded() {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 dark:from-[#070b12] dark:via-[#090f19] dark:to-[#070b12] border-y border-blue-100/60 dark:border-gray-800/80"
    >
      {/* Background Subtle Doodle Wave Vectors */}
      <div className="absolute top-12 left-10 w-32 h-16 pointer-events-none opacity-20 dark:opacity-10 hidden md:block">
        <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" className="text-blue-500 w-full h-full">
          <path d="M0 20 Q 25 0, 50 20 T 100 20" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-16 right-12 w-32 h-16 pointer-events-none opacity-20 dark:opacity-10 hidden md:block">
        <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" className="text-blue-500 w-full h-full">
          <path d="M0 20 Q 25 35, 50 20 T 100 20" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION HEADER                                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Crown Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/70 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>ONE SUBSCRIPTION • FULL ACCESS</span>
          </div>

          {/* Big Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Everything Included in{" "}
            <span className="text-blue-600 dark:text-blue-400">CrackDSA Pro</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-2xl mx-auto">
            A complete, structured ecosystem designed to take you from foundational problem-solving
            to cracking technical interviews at top tech companies.
          </p>

          {/* 4 Feature Pills in a row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Learn from scratch to advanced</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Practice with curated problem sheets</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
              <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Learn from expert mentors</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Prepare for real interviews</span>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ROW 1: TWO LARGE CARDS (DSA Master Course & Live Classes)     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* ─────────────────────────── CARD 1: DSA MASTER COURSE ─── */}
          <div className="relative rounded-[28px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            {/* Floating Top-Right Tilted Badge */}
            <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center rotate-12 shadow-sm pointer-events-none">
              <BookOpen className="w-4 h-4" />
            </div>

            <div className="space-y-6">
              {/* Top Row: Pill Badge + Lecture Count */}
              <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Flagship Course
                </span>
                <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">
                  200+ Lectures • Explained from Basics
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  DSA Master Course
                </h3>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Structured Curriculum from Foundations to Advanced
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                  Comprehensive zero-to-advanced curriculum covering complexity analysis, arrays,
                  trees, graphs, dynamic programming and more with detailed explanations and clean
                  code implementations.
                </p>
              </div>

              {/* 3 Metric Stats */}
              <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-medium text-gray-600 dark:text-gray-300 border-y border-gray-100 dark:border-gray-800/80 py-3">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-blue-500" />
                  <span>22 Sections</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-blue-500" />
                  <span>206+ Videos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Lifetime Access</span>
                </div>
              </div>

              {/* Split Content: Topics (Left) + Floating Course Curriculum (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start pt-1">
                {/* 6 Topic Pills */}
                <div className="md:col-span-7 space-y-2">
                  {[
                    "Foundations & Math",
                    "Arrays, Strings & Two Pointers",
                    "Trees, BST & Binary Lifting",
                    "Graphs & Advanced Graph Algorithms",
                    "Dynamic Programming",
                    "Greedy, Heaps & System Design Basics",
                  ].map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-2xs"
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black shrink-0">
                        D
                      </div>
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>

                {/* Floating "Course Curriculum" Card */}
                <div className="md:col-span-5 rounded-2xl border border-blue-100 dark:border-gray-800 bg-white dark:bg-[#111928] p-3.5 shadow-md space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 pb-1 border-b border-gray-100 dark:border-gray-800">
                    Course Curriculum
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {[
                      { name: "Time Complexity", count: "5 videos" },
                      { name: "Recursion", count: "13 videos" },
                      { name: "Arrays", count: "14 videos" },
                      { name: "Strings", count: "8 videos" },
                      { name: "Searching", count: "10 videos" },
                      { name: "Sorting", count: "9 videos" },
                    ].map((mod, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Disc className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                            {mod.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono shrink-0 pl-1">
                          {mod.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Language Icons + Open Curriculum Button */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800/80 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-xs">
                    C++
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-900 p-0.5 flex items-center justify-center shadow-xs">
                    <Image
                      src="/logos/java.svg.png"
                      alt="Java"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-900 p-0.5 flex items-center justify-center shadow-xs">
                    <Image
                      src="/logos/python.svg.png"
                      alt="Python"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  C++, Java & Python solutions included
                </span>
              </div>

              <Link
                href="/course/dsa"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all text-center"
              >
                <span>Open Course Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ─────────────────────────── CARD 2: LIVE PROBLEM-SOLVING CLASSES ─── */}
          <div className="relative rounded-[28px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            {/* Floating Top-Right Tilted Badge */}
            <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center rotate-12 shadow-sm pointer-events-none">
              <Radio className="w-4 h-4" />
            </div>

            <div className="space-y-6">
              {/* Top Row: Pill Badge + Live Mentorship */}
              <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  Weekly Live Sessions
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                  Live Mentorship
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  Live Problem-Solving Classes
                </h3>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Interactive Sessions with Abhinav Awasthi
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                  Deconstruct challenging interview problems live. Focus on building intuition from
                  scratch, identifying key patterns, discussing trade-offs, and writing bug-free
                  code.
                </p>
              </div>

              {/* Split Content: Session Format (Left) + Video Preview Frame (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-1">
                {/* Session Format Pills */}
                <div className="md:col-span-6 space-y-2.5">
                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Session Format
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Concept Building", "Live Problem Solving", "Q&A and Doubt Clearing", "Session Recordings"].map(
                      (pill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          {pill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Simulated Live Window & Chat Graphics */}
                <div className="md:col-span-6 relative pt-2">
                  {/* Mock IDE Window */}
                  <div className="rounded-2xl bg-gray-900 text-gray-300 border border-gray-800 p-3 shadow-lg relative overflow-hidden">
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5 pb-2 border-b border-gray-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="text-[9px] font-mono text-gray-500 ml-2">live_solve.cpp</span>
                    </div>
                    {/* Code Lines Mock */}
                    <div className="pt-2 space-y-1 font-mono text-[9px] text-gray-400 leading-tight">
                      <p className="text-purple-400">class Solution &#123;</p>
                      <p className="pl-2 text-blue-400">public:</p>
                      <p className="pl-3 text-emerald-400">int maxProfit(vector&lt;int&gt;&amp; p) &#123;</p>
                      <p className="pl-5 text-gray-400">int minP = p[0], ans = 0;</p>
                      <p className="pl-5 text-gray-500">// live intuition walkthrough</p>
                      <p className="pl-3">&#125;</p>
                      <p>&#125;;</p>
                    </div>

                    {/* Abhinav Live Video Stream PIP */}
                    <div className="absolute top-8 right-2.5 w-20 h-20 rounded-xl overflow-hidden border-2 border-brand-500/80 shadow-md bg-gray-800">
                      <Image
                        src="/pictures/abhinav.jpeg"
                        alt="Abhinav Awasthi Live"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-red-600 text-white text-[8px] font-black uppercase flex items-center gap-0.5 shadow-xs">
                        <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                        Live
                      </div>
                    </div>
                  </div>

                  {/* Floating "Live Discussion" Card */}
                  <div className="absolute -bottom-3 -right-2 bg-white dark:bg-[#111928] border border-gray-200 dark:border-gray-700/80 rounded-xl p-2.5 shadow-xl w-36 space-y-1.5 pointer-events-none hidden sm:block">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700 dark:text-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live Discussion
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5" />
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Lead Mentor Info + View Schedule Button */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800/80 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                  <Image
                    src="/pictures/abhinav.jpeg"
                    alt="Abhinav Awasthi"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                    Abhinav Awasthi
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
                    Lead Mentor
                  </p>
                </div>
              </div>

              <Link
                href="/live-sessions"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/80 active:scale-95 text-gray-900 dark:text-white font-bold text-xs transition-colors"
              >
                <span>View Live Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ROW 2: THREE BALANCED CARDS                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* ─────────────────────────── CARD 3: PREMIUM PROBLEM SHEETS ─── */}
          <div className="relative rounded-[28px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
            {/* Floating Top-Right Tilted Badge */}
            <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rotate-12 shadow-sm pointer-events-none">
              <FileText className="w-4 h-4" />
            </div>

            <div className="space-y-5">
              {/* Badge */}
              <div className="pr-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Practice Sheets
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Premium Problem Sheets
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Curated &amp; Structured for Maximum Practice
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                  Newbie to Expert CP Sheet, topic-wise sheets, and company-wise curated problem lists
                  with video editorials and solutions.
                </p>
              </div>

              {/* Pills & Mini Graphic Preview */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  {["Newbie to Expert Sheet", "Topic-wise Sheets", "Company-wise Sheets", "Video Solutions"].map(
                    (item, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-[11px] font-medium text-gray-700 dark:text-gray-300 text-center truncate"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>

                {/* Floating Preview Card: Newbie to Expert CP Sheet */}
                <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/70 dark:bg-[#111928] p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Newbie to Expert CP Sheet</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      3/175 solved
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="w-[12%] h-full bg-emerald-500 rounded-full" />
                  </div>
                  {/* Micro list */}
                  <div className="space-y-1 text-[10px] text-gray-600 dark:text-gray-400 pt-0.5">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Arrays
                      </span>
                      <span className="font-mono text-gray-400">0/20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Binary Search
                      </span>
                      <span className="font-mono text-gray-400">0/15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Dynamic Programming
                      </span>
                      <span className="font-mono text-gray-400">0/25</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800/80 mt-6">
              <Link
                href="/dsa-sheets"
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 text-gray-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Explore Problem Sheets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ─────────────────────────── CARD 4: POST-CONTEST EDITORIALS ─── */}
          <div className="relative rounded-[28px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
            {/* Floating Top-Right Tilted Badge */}
            <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center rotate-12 shadow-sm pointer-events-none">
              <BarChart3 className="w-4 h-4" />
            </div>

            <div className="space-y-5">
              {/* Badge */}
              <div className="pr-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  <Trophy className="w-3.5 h-3.5 text-purple-600" />
                  Contest Editorials
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Post-Contest Editorials
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Detailed Solutions &amp; Thought Process
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                  Structured video and written editorials for Codeforces, LeetCode, AtCoder and more.
                  Learn multiple approaches, optimise your solutions, and level up your contest skills.
                </p>
              </div>

              {/* 4 Bullets + Platform Rows Graphic */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Video Editorials
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Alternate Approaches
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Complexity Analysis
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Code Submissions
                  </div>
                </div>

                {/* Platform Card List */}
                <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/70 dark:bg-[#111928] p-3 space-y-1.5">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logos/codeforces.svg"
                        alt="Codeforces"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                        Codeforces
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">Div 2 &amp; Div 3</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logos/leetcode.png"
                        alt="LeetCode"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                        LeetCode
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">Weekly &amp; Biweekly</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-blue-600 text-white text-[8px] font-black flex items-center justify-center">
                        A
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                        AtCoder
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">ABC Contests</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logos/codechef.png"
                        alt="CodeChef"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                        CodeChef
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">Starters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800/80 mt-6">
              <Link
                href="/contests"
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 text-gray-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Browse Editorials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ─────────────────────────── CARD 5: CORE CS FUNDAMENTALS & NOTES ─── */}
          <div className="relative rounded-[28px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
            {/* Floating Top-Right Tilted Badge */}
            <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center rotate-12 shadow-sm pointer-events-none">
              <FileCode className="w-4 h-4" />
            </div>

            <div className="space-y-5">
              {/* Badge */}
              <div className="pr-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <FileCode className="w-3.5 h-3.5 text-amber-600" />
                  CS Fundamentals
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Core CS Fundamentals &amp; Notes
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  High-Yield Notes for Technical Interviews
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                  Curated revision notes, system design overviews, and high-frequency interview
                  questions for Operating Systems, DBMS, Computer Networks, and OOPs.
                </p>
              </div>

              {/* 4 Bullets + Operating Systems Preview Graphic */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Operating Systems
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    DBMS &amp; SQL
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Computer Networks
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    OOPs &amp; System Design
                  </div>
                </div>

                {/* Operating Systems Notes Card Preview */}
                <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-50/70 dark:bg-[#111928] p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 pb-1 border-b border-gray-200/60 dark:border-gray-700/60">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Operating Systems Notes</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-white dark:hover:bg-gray-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Process &amp; Thread Management</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-white dark:hover:bg-gray-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>CPU Scheduling Algorithms</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-white dark:hover:bg-gray-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Memory Management &amp; Paging</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-white dark:hover:bg-gray-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Synchronization &amp; Semaphores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800/80 mt-6">
              <Link
                href="/cs-fundamentals"
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 text-gray-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Explore CS Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}