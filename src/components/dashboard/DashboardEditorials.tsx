"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Trophy } from "lucide-react";
import { ContestSummary } from "@/types/contest";
import { PlatformLogo } from "@/components/contests/PlatformLogo";

interface DashboardEditorialsProps {
  contests: ContestSummary[];
  loading?: boolean;
}

export default function DashboardEditorials({
  contests,
  loading = false,
}: DashboardEditorialsProps) {
  const displayContests = contests.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-xs transition-colors flex flex-col justify-between h-full">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span>Contest Editorials</span>
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
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 animate-pulse"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-7 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="space-y-1.5 min-w-0">
                    <div className="h-3.5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayContests.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">
                No contest editorials available.
              </p>
            ) : (
              displayContests.map((c) => {
                const platformCapitalized =
                  c.platform.charAt(0).toUpperCase() + c.platform.slice(1);
                const contestUrl = `/contests/editorials/${c.platform}/${c.id}`;

                return (
                  <Link
                    key={c.id}
                    href={contestUrl}
                    className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-blue-50/60 dark:hover:bg-gray-800/90 hover:border-blue-300/80 dark:hover:border-blue-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                      <PlatformLogo platform={c.platform} size={26} className="shrink-0" />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {c.contest}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                          {platformCapitalized} • {c.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700/80 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-2xs group-hover:border-blue-300 dark:group-hover:border-blue-600/50 transition-colors">
                        {c.total_problems}
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
