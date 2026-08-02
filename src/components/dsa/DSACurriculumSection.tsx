"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { CourseSection, CourseSubsection } from "@/types/course";
import { DSACurriculumItemRow } from "./DSACurriculumItemRow";

interface DSACurriculumSectionProps {
  subsections: CourseSubsection[];
  rootItems?: CourseSection["items"];
}

export function DSACurriculumSection({
  subsections,
  rootItems,
}: DSACurriculumSectionProps) {
  const [openSubsections, setOpenSubsections] = useState<Record<string, boolean>>({});

  const toggleSubsection = (id: string) => {
    setOpenSubsections((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen size={18} className="text-brand-500" /> Topic Curriculum & Learning Assets
        </h2>
      </div>

      {/* Root Overview Items (if any) */}
      {rootItems && rootItems.length > 0 && (
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Overview & Getting Started
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {rootItems.map((item, idx) => (
              <DSACurriculumItemRow key={item.id || idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Subsections Accordion List */}
      {subsections.map((sub, index) => {
        const subId = sub.id || index.toString();
        const isOpen = openSubsections[subId] ?? true;

        return (
          <div
            key={subId}
            className="overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121722] shadow-xs transition-all"
          >
            {/* Subsection Header */}
            <button
              onClick={() => toggleSubsection(subId)}
              className="w-full p-4 flex items-center justify-between bg-gray-50/70 dark:bg-gray-900/40 hover:bg-gray-100/60 dark:hover:bg-gray-900/80 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-black">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {sub.title}
                  </h3>
                  {sub.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                      {sub.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  {sub.items?.length || 0} items
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* Subsection Items List */}
            {isOpen && (
              <div className="p-4 divide-y divide-gray-100 dark:divide-gray-800/80">
                {sub.items && sub.items.length > 0 ? (
                  sub.items.map((item, itemIdx) => (
                    <DSACurriculumItemRow
                      key={item.id || itemIdx}
                      item={item}
                      index={itemIdx}
                    />
                  ))
                ) : (
                  <p className="py-3 text-center text-xs font-medium text-gray-400">
                    No items in this chapter yet.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
