"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export interface DashboardListItem {
  id: string;
  href: string;
  title: string;
  subtitle?: ReactNode;
  icon: ReactNode;
  iconBgClass?: string;
  iconBorderClass?: string;
  rightElement?: ReactNode;
  bottomElement?: ReactNode;
  hoverBorderClass?: string;
  hoverTextClass?: string;
}

export interface DashboardListCardProps {
  title: string;
  headerIcon: ReactNode;
  headerIconClass?: string;
  viewAllHref: string;
  viewAllLabel?: string;
  items: DashboardListItem[];
  loading?: boolean;
  emptyText?: string;
  ambientGlowClass?: string;
}

export default function DashboardListCard({
  title,
  headerIcon,
  headerIconClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  viewAllHref,
  viewAllLabel = "View all",
  items,
  loading = false,
  emptyText = "No items available.",
  ambientGlowClass,
}: DashboardListCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between h-full group/card">
      {ambientGlowClass && (
        <div className={`absolute -top-12 -right-12 size-32 rounded-full ${ambientGlowClass} blur-2xl pointer-events-none`} />
      )}

      <div>
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className={`flex size-7 items-center justify-center rounded-lg ${headerIconClass}`}>
              {headerIcon}
            </div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── List of Items ─────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 animate-pulse"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
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
            {items.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">
                {emptyText}
              </p>
            ) : (
              items.map((item) => {
                const hoverBorder = item.hoverBorderClass || "hover:border-blue-200 dark:hover:border-blue-900/50";
                const hoverText = item.hoverTextClass || "group-hover:text-blue-600 dark:group-hover:text-blue-400";

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group flex flex-col p-3 sm:p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800/90 ${hoverBorder} hover:shadow-xs transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className={`flex size-9 sm:size-10 items-center justify-center rounded-xl border ${item.iconBgClass || "bg-blue-500/10 text-blue-600 dark:text-blue-400"} ${item.iconBorderClass || "border-blue-500/20"} shrink-0 group-hover:scale-105 transition-transform`}>
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className={`text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 truncate ${hoverText} transition-colors`}>
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.rightElement}
                        <ChevronRight
                          size={14}
                          className={`text-gray-400 ${hoverText} group-hover:translate-x-0.5 transition-all`}
                        />
                      </div>
                    </div>

                    {item.bottomElement && (
                      <div className="w-full">
                        {item.bottomElement}
                      </div>
                    )}
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
