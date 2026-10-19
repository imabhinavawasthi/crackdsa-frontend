'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Expand, 
  Maximize2, 
  Minimize2, 
  Play, 
  PlayCircle 
} from 'lucide-react';
import type { CourseSection, CourseSectionItem } from '@/types/course';
import FreeVideoPreviewDialog from './FreeVideoPreviewDialog';

interface CourseCurriculumProps {
  curriculum: CourseSection[];
}

export default function CourseCurriculum({ curriculum }: CourseCurriculumProps) {
  // Default to first section open as seen in mockup
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(curriculum[0] ? [curriculum[0].id] : [])
  );
  const [previewItem, setPreviewItem] = useState<CourseSectionItem | null>(null);

  if (curriculum.length === 0) return null;

  const allOpen = openSections.size === curriculum.length;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(curriculum.map((s) => s.id)));
    }
  };

  // Calculate total videos across all sections
  const totalVideos = curriculum.reduce((acc, sec) => {
    const items = [
      ...(sec.items ?? []),
      ...(sec.subsections ?? []).flatMap((sub) => sub.items ?? []),
    ];
    return acc + items.filter((i) => i.type === 'video').length;
  }, 0);

  // Helper to get stats for each section
  const getSectionStats = (section: CourseSection) => {
    const items = [
      ...(section.items ?? []),
      ...(section.subsections ?? []).flatMap((sub) => sub.items ?? []),
    ];
    const videoItems = items.filter((i) => i.type === 'video');
    const count = videoItems.length || items.length;

    let totalMinutes = 0;
    items.forEach((item) => {
      if (item.duration_label) {
        const minMatch = item.duration_label.match(/(\d+)\s*min/i);
        if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
        const hrMatch = item.duration_label.match(/(\d+)\s*hr/i);
        if (hrMatch) totalMinutes += parseInt(hrMatch[1], 10) * 60;
      }
    });

    let durationText = '';
    if (totalMinutes >= 60) {
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      durationText = mins > 0 ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`;
    } else if (totalMinutes > 0) {
      durationText = `${totalMinutes} mins`;
    } else {
      durationText = `${count * 8} mins`;
    }

    return { count, durationText };
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            COURSE CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            {curriculum.length} sections • {totalVideos} videos
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            A structured and progressive curriculum to help you master Data Structures and Algorithms from scratch.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-xs"
        >
          {allOpen ? (
            <>
              <Minimize2 className="size-3.5" />
              <span>Collapse all</span>
            </>
          ) : (
            <>
              <Maximize2 className="size-3.5" />
              <span>Expand all</span>
            </>
          )}
        </button>
      </div>

      {/* Curriculum Section Accordions */}
      <div className="mt-6 divide-y divide-gray-100 dark:divide-gray-800/80">
        {curriculum.map((section, idx) => {
          const isOpen = openSections.has(section.id);
          const { count, durationText } = getSectionStats(section);
          const allItems = [
            ...(section.items ?? []),
            ...(section.subsections ?? []).flatMap((sub) => sub.items ?? []),
          ];

          return (
            <div key={section.id} className="py-3.5 first:pt-0 last:pb-0">
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="group flex w-full items-center justify-between gap-3 text-left transition-colors p-1.5 -mx-1.5 rounded-xl hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-colors ${
                      isOpen
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {section.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {count} videos • {durationText}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-gray-400 dark:text-gray-500 transition-transform" />
                  ) : (
                    <ChevronDown className="size-4 text-gray-400 dark:text-gray-500 transition-transform" />
                  )}
                </div>
              </button>

              {/* Accordion Content with Timeline */}
              {isOpen && allItems.length > 0 && (
                <div className="mt-2 ml-3.5 sm:ml-4 border-l-2 border-gray-200 dark:border-gray-800 pl-5 sm:pl-6 py-2 space-y-3.5">
                  {allItems.map((item, itemIdx) => {
                    const isFirstOrFree = item.is_free;
                    return (
                      <div
                        key={item.id}
                        onClick={() => item.is_free && setPreviewItem(item)}
                        className={`group/item flex items-center justify-between gap-3 rounded-lg py-1.5 px-2 -mx-2 transition-colors ${
                          item.is_free
                            ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                            : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isFirstOrFree ? (
                            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                              <Play className="size-2.5 fill-current translate-x-0.2" />
                            </div>
                          ) : (
                            <PlayCircle className="size-5 shrink-0 text-gray-400 dark:text-gray-500" />
                          )}

                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate">
                            {item.title}
                          </span>

                          {item.is_free && (
                            <span className="rounded bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                              Free
                            </span>
                          )}
                        </div>

                        {item.duration_label && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                            <Clock className="size-3.5" />
                            <span>{item.duration_label}</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FreeVideoPreviewDialog item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
}
