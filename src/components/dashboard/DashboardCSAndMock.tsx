"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  FileText, 
  CheckCircle2, 
  Layers,
  Sparkles,
  FileCheck
} from "lucide-react";

export default function DashboardCSAndMock() {
  return (
    <div className="flex flex-col gap-6 justify-between h-full">
      {/* ─── 1. CS FUNDAMENTALS CARD ─────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs transition-colors flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-blue-600 dark:text-blue-400" />
              <span>CS Fundamentals</span>
            </h2>
            <Link
              href="/cs-fundamentals"
              className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>View all</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shrink-0">
              <Code2 size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Computer Science Fundamentals
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                Master Operating Systems, Database Management Systems (DBMS), and Computer Networks interview-specific notes and cheatsheets.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 size={11} className="stroke-[3]" />
            Interview Focused Notes
          </span>

          <Link
            href="/cs-fundamentals"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all"
          >
            <span>Check Notes</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ─── 2. RESUME BUILDER CARD ──────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs transition-colors flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText size={18} className="text-violet-600 dark:text-violet-400" />
              <span>Resume Builder</span>
            </h2>
            <Link
              href="/resume"
              className="group inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              <span>Build resume</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/60 shrink-0">
              <FileCheck size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                ATS-Friendly Tech Resume Builder
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                Craft high-impact software engineering resumes with battle-tested FAANG templates, impactful bullet suggestions, and ATS keyword matching.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[10px] font-bold border border-violet-200/60 dark:border-violet-800/60">
              <Sparkles size={11} className="text-violet-500" />
              ATS Optimized
            </span>
            <span className="hidden sm:inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-medium">
              Free Templates
            </span>
          </div>

          <Link
            href="/resume"
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all"
          >
            <span>Create Resume</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
