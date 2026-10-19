"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Layers, ArrowRight } from "lucide-react";
import { ContestSummary } from "@/types/contest";
import { PlatformLogo } from "./PlatformLogo";

interface ContestCardProps {
  contest: ContestSummary;
}

export function ContestCard({ contest }: ContestCardProps) {
  const platformName = contest.platform.charAt(0).toUpperCase() + contest.platform.slice(1);
  const detailUrl = `/contests/editorials/${encodeURIComponent(contest.platform)}/${encodeURIComponent(
    contest.id.split("-").slice(1).join("-")
  )}`;

  return (
    <Link
      href={detailUrl}
      className="group block rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-4 sm:p-5 shadow-2xs hover:shadow-lg hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200 select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Official Platform Logo & Contest Title */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <PlatformLogo platform={contest.platform} size={36} />

          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {contest.contest}
            </h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              {platformName}
            </p>
          </div>
        </div>

        {/* Right: Date, Problem Count & Action Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{contest.date || "Recent"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-gray-400" />
              <span>{contest.total_problems} problems</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xs group-hover:gap-2">
            <span>View Editorials</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
