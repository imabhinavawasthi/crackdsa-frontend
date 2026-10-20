"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Trophy } from "lucide-react";
import { ContestSummary } from "@/types/contest";
import { PlatformLogo } from "@/components/contests/PlatformLogo";

interface DashboardEditorialsProps {
  contests: ContestSummary[];
}

export default function DashboardEditorials({ contests }: DashboardEditorialsProps) {
  const displayContests = contests.slice(0, 4);

  return (
    <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs transition-colors flex flex-col justify-between h-full">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span>Recent Contest Editorials</span>
          </h2>
          <Link
            href="/contests/editorials"
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── List of Contests ───────────────────────────────────────── */}
        <div className="space-y-2.5">
          {displayContests.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No contest editorials available.</p>
          ) : (
            displayContests.map((c) => {
              const platformCapitalized = c.platform.charAt(0).toUpperCase() + c.platform.slice(1);
              const contestUrl = `/contests/editorials/${c.platform}/${c.id}`;

              return (
                <Link
                  key={c.id}
                  href={contestUrl}
                  className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-blue-50/60 dark:hover:bg-gray-800/90 hover:border-blue-300/80 dark:hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <PlatformLogo platform={c.platform} size={28} className="shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {c.contest}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        {platformCapitalized} • {c.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700/80 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-2xs group-hover:border-blue-300 dark:group-hover:border-blue-600/50 transition-colors">
                      {c.total_problems} problems
                    </span>
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
