"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronRight,
  GraduationCap, 
  Play, 
  Star,
  Terminal,
  FileCheck2,
  Video,
  Layers,
  Infinity as InfinityIcon
} from "lucide-react";

interface DashboardContinueLearningProps {
  isLoggedIn: boolean;
  isEnrolledInDSA: boolean;
  completedLessonsCount: number;
  totalLessonsCount?: number;
  cpSolvedCount?: number;
  cpTotalCount?: number;
}

export default function DashboardContinueLearning({
  isLoggedIn,
  isEnrolledInDSA,
  completedLessonsCount,
  totalLessonsCount = 206,
}: DashboardContinueLearningProps) {
  const dsaProgressPercent = totalLessonsCount > 0 
    ? Math.min(Math.round((completedLessonsCount / totalLessonsCount) * 100), 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* ─── Section Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <GraduationCap size={20} className="text-blue-600 dark:text-blue-400" />
          <span>Continue Learning</span>
        </h2>

        <Link
          href="/courses"
          className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>View all courses</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ─── 2 Hero Cards: Flagship DSA & 1:1 Mock Interview ────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        
        {/* ══════════════════════════════════════════════════════════════
            CARD 1: DATA STRUCTURES & ALGORITHMS [BEGINNER TO ADVANCED]
            ══════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-900/50 bg-[#071126] text-white p-6 sm:p-7 shadow-xl shadow-blue-950/40 flex flex-col justify-between">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-0" />
          
          <div className="relative z-10 space-y-4">

            {/* Content & Illustration Split Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Left Column: Title (Clean, no mentor details, no big subtitle) */}
              <div className="sm:col-span-7 space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Data Structures &amp; <span className="text-blue-400">Algorithms Course</span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Video Lectures • Problem Solving • Articles • Notes
                </p>
              </div>

              {/* Right Column: 3D Isometric Coding Laptop Illustration */}
              <div className="sm:col-span-5 flex items-center justify-center pointer-events-none select-none py-1">
                <svg
                  viewBox="0 0 240 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full max-w-[190px] h-auto drop-shadow-2xl"
                >
                  {/* Base Glow */}
                  <ellipse cx="120" cy="140" rx="90" ry="25" fill="#1D4ED8" opacity="0.3" filter="blur(14px)" />

                  {/* Isometric Laptop Base */}
                  <polygon points="40,135 120,165 200,135 120,105" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                  <polygon points="40,135 120,165 120,172 40,142" fill="#090E17" />
                  <polygon points="120,165 200,135 200,142 120,172" fill="#020617" />

                  {/* Keyboard trackpad */}
                  <polygon points="105,145 135,155 135,158 105,148" fill="#1E293B" opacity="0.6" />

                  {/* Laptop Screen */}
                  <polygon points="55,60 145,60 145,125 55,125" fill="#0B132B" stroke="#2563EB" strokeWidth="2.5" />
                  <polygon points="58,63 142,63 142,122 58,122" fill="#070D1E" />

                  {/* Screen Glow */}
                  <rect x="62" y="67" width="76" height="51" rx="4" fill="#1D4ED8" opacity="0.18" />

                  {/* Code Brackets on Screen */}
                  <path
                    d="M86 85 L76 92 L86 99 M114 85 L124 92 L114 99 M103 82 L97 102"
                    stroke="#60A5FA"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Floating 3D Node 1: Tree / Graph */}
                  <g transform="translate(155, 30)">
                    <rect width="38" height="38" rx="10" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1.5" />
                    <circle cx="19" cy="12" r="3" fill="#93C5FD" />
                    <circle cx="11" cy="26" r="3" fill="#93C5FD" />
                    <circle cx="27" cy="26" r="3" fill="#93C5FD" />
                    <line x1="19" y1="12" x2="11" y2="26" stroke="#93C5FD" strokeWidth="1.5" />
                    <line x1="19" y1="12" x2="27" y2="26" stroke="#93C5FD" strokeWidth="1.5" />
                  </g>

                  {/* Floating 3D Node 2: Database / Server */}
                  <g transform="translate(170, 78)">
                    <rect width="36" height="36" rx="9" fill="#312E81" stroke="#6366F1" strokeWidth="1.5" />
                    <rect x="9" y="10" width="18" height="4" rx="2" fill="#A5B4FC" />
                    <rect x="9" y="16" width="18" height="4" rx="2" fill="#A5B4FC" />
                    <rect x="9" y="22" width="18" height="4" rx="2" fill="#A5B4FC" />
                  </g>

                  {/* Floating 3D Node 3: Analytics / Chart */}
                  <g transform="translate(152, 122)">
                    <rect width="36" height="36" rx="9" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
                    <rect x="9" y="21" width="4" height="7" rx="1" fill="#FDE68A" />
                    <rect x="16" y="16" width="4" height="12" rx="1" fill="#FDE68A" />
                    <rect x="23" y="11" width="4" height="17" rx="1" fill="#FDE68A" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer: Overall Completion Well + Action Button */}
          <div className="relative z-10 mt-5 pt-3 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">
            {/* Progress Well */}
            <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Course Progress</span>
                <span className="text-blue-400 font-black">{dsaProgressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(dsaProgressPercent, 5)}%` }}
                />
              </div>

              {/* Meta stats */}
              <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-300 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <Play size={11} className="fill-blue-400 text-blue-400" />
                  <span>206 Videos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={11} className="text-blue-400" />
                  <span>22 Sections</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <InfinityIcon size={12} className="text-blue-400" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <Link
              href={isEnrolledInDSA ? "/courses/dsa/learn" : "/course/dsa"}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all cursor-pointer"
            >
              <span>{isEnrolledInDSA ? "Continue Learning" : "Explore Course"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            CARD 2: 1:1 MOCK DSA INTERVIEW
            ══════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-900/50 bg-[#061817] text-white p-6 sm:p-7 shadow-xl shadow-emerald-950/40 flex flex-col justify-between">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 space-y-4">

            {/* Content & Illustration Split Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Left Column: Title (Clean, no mentor details, no big subtitle) */}
              <div className="sm:col-span-7 space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  1:1 Mock DSA <span className="text-emerald-400">Interview</span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Have an interview coming? What if you could practice with a real interviewer and get feedback on your performance?
                </p>
              </div>

              {/* Right Column: 1:1 Video Interview Scene Vector Illustration */}
              <div className="sm:col-span-5 flex items-center justify-center pointer-events-none select-none py-1">
                <svg
                  viewBox="0 0 240 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full max-w-[190px] h-auto drop-shadow-2xl"
                >
                  {/* Base Glow */}
                  <ellipse cx="140" cy="140" rx="80" ry="22" fill="#059669" opacity="0.3" filter="blur(14px)" />

                  {/* Desktop Monitor on Desk (Background) */}
                  <rect x="90" y="45" width="130" height="90" rx="8" fill="#022C22" stroke="#059669" strokeWidth="2" />
                  <rect x="95" y="50" width="120" height="80" rx="6" fill="#064E3B" opacity="0.9" />

                  {/* Monitor Stand */}
                  <rect x="148" y="135" width="14" height="20" fill="#0F172A" />
                  <ellipse cx="155" cy="155" rx="30" ry="6" fill="#1E293B" />

                  {/* Video Call Avatar inside Monitor */}
                  <circle cx="155" cy="80" r="16" fill="#A7F3D0" />
                  <path d="M135 115 C135 98, 175 98, 175 115 Z" fill="#6EE7B7" />

                  {/* Speech Bubble Icon */}
                  <g transform="translate(68, 40)">
                    <rect width="28" height="20" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
                    <circle cx="9" cy="10" r="1.5" fill="#94A3B8" />
                    <circle cx="14" cy="10" r="1.5" fill="#94A3B8" />
                    <circle cx="19" cy="10" r="1.5" fill="#94A3B8" />
                  </g>

                  {/* Candidate Silhouette at Laptop (Foreground Left) */}
                  <circle cx="65" cy="105" r="14" fill="#1E293B" />
                  <path d="M42 165 C42 128, 88 128, 88 165 Z" fill="#0F172A" />

                  {/* Candidate Laptop on Desk */}
                  <polygon points="70,140 115,140 105,155 60,155" fill="#334155" />
                  <polygon points="90,122 118,122 115,140 87,140" fill="#022C22" stroke="#10B981" strokeWidth="1" />
                </svg>
              </div>
            </div>

          </div>

          {/* Bottom Card Footer: Pricing + Action Button */}
          <div className="relative z-10 mt-5 pt-3 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">₹ 1,999</span>
              <span className="text-xs text-slate-400 font-medium">/ 60 mins</span>
            </div>

            <Link
              href="/mock-interviews"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/35 transition-all cursor-pointer"
            >
              <span>Book 1:1 Session</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
