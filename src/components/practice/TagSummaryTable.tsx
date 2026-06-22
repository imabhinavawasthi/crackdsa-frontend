"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { TagSummary } from "@/types/practice";
import { formatTag } from "@/utils/string";

interface TagSummaryTableProps {
  /** Rows to display */
  items: TagSummary[];
  /** Base href for row navigation. Row href = basePath + "/" + slug */
  basePath: string;
  /** Column header for the name column */
  nameLabel?: string;
  /** Shown in the empty state when searching */
  searchQuery?: string;
  /** Label for the count column badge (default: "Problems") */
  countLabel?: string;
}

/** Thin progress bar split into easy/medium/hard proportions */
function DifficultyBar({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const total = easy + medium + hard;
  if (total === 0) return null;
  const ep = Math.round((easy / total) * 100);
  const mp = Math.round((medium / total) * 100);
  const hp = 100 - ep - mp;
  return (
    <div className="flex h-1 w-full rounded-full overflow-hidden gap-px">
      <div className="bg-success-500 rounded-l-full" style={{ width: `${ep}%` }} />
      <div className="bg-warning-500" style={{ width: `${mp}%` }} />
      <div className="bg-error-500 rounded-r-full" style={{ width: `${hp}%` }} />
    </div>
  );
}

const TagSummaryTable: React.FC<TagSummaryTableProps> = ({
  items,
  basePath,
  nameLabel = "Name",
  searchQuery = "",
  countLabel = "Problems",
}) => {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="py-20 flex flex-col items-center gap-4 text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Search size={22} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
              No results found
            </p>
            {searchQuery && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Nothing matches{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-400">
                  &quot;{searchQuery}&quot;
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 px-5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 w-8">
                #
              </th>
              <th className="py-3 px-4 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {nameLabel}
              </th>
              <th className="py-3 px-4 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center hidden sm:table-cell w-32">
                {countLabel}
              </th>
              <th className="py-3 px-4 text-[10px] font-extrabold uppercase tracking-widest text-success-600 dark:text-success-400 text-center w-16 hidden md:table-cell">
                Easy
              </th>
              <th className="py-3 px-4 text-[10px] font-extrabold uppercase tracking-widest text-warning-500 dark:text-warning-400 text-center w-16 hidden md:table-cell">
                Med
              </th>
              <th className="py-3 px-4 text-[10px] font-extrabold uppercase tracking-widest text-error-600 dark:text-error-400 text-center w-16 hidden md:table-cell">
                Hard
              </th>
              <th className="py-3 px-4 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 hidden lg:table-cell w-36">
                Difficulty mix
              </th>
              <th className="w-10" />
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, idx) => (
              <tr
                key={item.slug}
                onClick={() => router.push(`${basePath}/${item.slug}`)}
                className="group cursor-pointer border-l-2 border-l-transparent hover:border-l-brand-500 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-150"
              >
                {/* Index */}
                <td className="py-3.5 px-5">
                  <span className="text-[11px] font-bold text-gray-300 dark:text-gray-600 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </td>

                {/* Name */}
                <td className="py-3.5 px-4">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {formatTag(item.name)}
                  </span>
                </td>

                {/* Total count badge */}
                <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-bold text-[11px] border border-brand-100 dark:border-brand-500/20 tabular-nums">
                    {item.count}
                  </span>
                </td>

                {/* Easy */}
                <td className="py-3.5 px-4 text-center hidden md:table-cell">
                  <span className="text-[12px] font-bold text-success-600 dark:text-success-400 tabular-nums">
                    {item.easy_count}
                  </span>
                </td>

                {/* Medium */}
                <td className="py-3.5 px-4 text-center hidden md:table-cell">
                  <span className="text-[12px] font-bold text-warning-500 dark:text-warning-400 tabular-nums">
                    {item.medium_count}
                  </span>
                </td>

                {/* Hard */}
                <td className="py-3.5 px-4 text-center hidden md:table-cell">
                  <span className="text-[12px] font-bold text-error-600 dark:text-error-400 tabular-nums">
                    {item.hard_count}
                  </span>
                </td>

                {/* Progress bar */}
                <td className="py-3.5 px-4 hidden lg:table-cell">
                  <DifficultyBar
                    easy={item.easy_count}
                    medium={item.medium_count}
                    hard={item.hard_count}
                  />
                </td>

                {/* Arrow */}
                <td className="py-3.5 px-4 text-right">
                  <ArrowRight
                    size={14}
                    className="inline text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-200"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagSummaryTable;
