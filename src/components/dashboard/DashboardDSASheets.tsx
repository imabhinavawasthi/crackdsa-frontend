"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  Layers, 
  Building2, 
  BarChart3,
  CheckCircle2
} from "lucide-react";

interface DashboardDSASheetsProps {
  cpSolvedCount: number;
  cpTotalCount?: number;
}

export default function DashboardDSASheets({
  cpSolvedCount,
  cpTotalCount = 175,
}: DashboardDSASheetsProps) {
  const percent = cpTotalCount > 0 
    ? Math.min(Math.round((cpSolvedCount / cpTotalCount) * 100), 100) 
    : 0;

  return (
    <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs transition-colors flex flex-col justify-between h-full">
      <div>
        {/* ─── Header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" />
            <span>DSA Sheets</span>
          </h2>
          <Link
            href="/dsa-sheet"
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── Featured Sheet: Newbie to Expert CP Sheet ─────────────── */}
        <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 dark:from-gray-800 dark:via-gray-800/90 dark:to-blue-950/40 p-5 space-y-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  Newbie to Expert CP Sheet
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Curated by Abhinav Awasthi (ICPC AIR 57)
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold shrink-0">
              {cpTotalCount} problems
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            Hand-picked Codeforces problems with video editorials, solutions, and progress tracking.
          </p>

          {/* Progress Bar & Counter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {cpSolvedCount} / {cpTotalCount} solved
              </span>
              <span className="text-blue-600 dark:text-blue-400">{percent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${Math.max(percent, 2)}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <Link
              href="/cp/newbie-to-expert"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all"
            >
              <span>Continue Solving</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ─── Secondary Quick Links ──────────────────────────────────── */}
        <div className="mt-4 space-y-2">
          <Link
            href="/practice/topics"
            className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-blue-50/60 dark:hover:bg-gray-800/90 hover:border-blue-300/80 dark:hover:border-blue-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <Layers size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Topic-wise Practice Sheets
                </p>
                <p className="text-[10px] text-gray-400">Solve problems grouped by pattern</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/practice/companies"
            className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-blue-50/60 dark:hover:bg-gray-800/90 hover:border-blue-300/80 dark:hover:border-blue-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Building2 size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Company-wise Sheets
                </p>
                <p className="text-[10px] text-gray-400">Amazon, Google, Microsoft &amp; Uber interview loops</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
