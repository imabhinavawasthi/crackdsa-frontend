'use client';

import { ChevronDown, ChevronRight, Clock, Code2, FileText, PlayCircle, Video } from 'lucide-react';
import { useState } from 'react';

import type { CourseSection, CourseSectionItem } from '@/types/course';

import FreeVideoPreviewDialog from './FreeVideoPreviewDialog';

const ITEM_ICONS = { video: Video, problem: Code2, article: FileText } as const;

const countType = (sections: CourseSection[], type: CourseSectionItem['type']) =>
  sections
    .flatMap((section) => [...(section.items ?? []), ...(section.subsections ?? []).flatMap((sub) => sub.items ?? [])])
    .filter((item) => item.type === type).length;

const SectionCounts = ({ sections, className = '' }: { sections: CourseSection[]; className?: string }) => {
  const videos = countType(sections, 'video');
  const problems = countType(sections, 'problem');
  return (
    <span className={`flex shrink-0 items-center gap-3 text-gray-500 ${className}`}>
      {videos > 0 && (
        <span className="flex items-center gap-1">
          <Video className="size-3.5" /> {videos} {videos === 1 ? 'video' : 'videos'}
        </span>
      )}
      {problems > 0 && (
        <span className="flex items-center gap-1">
          <Code2 className="size-3.5" /> {problems} {problems === 1 ? 'problem' : 'problems'}
        </span>
      )}
    </span>
  );
};

const LessonRow = ({ item, onPreview }: { item: CourseSectionItem; onPreview: (item: CourseSectionItem) => void }) => {
  const Icon = ITEM_ICONS[item.type] ?? Video;
  const canPreview = item.is_free && item.type === 'video';
  return (
    <li className="flex items-center justify-between gap-4 border-t border-gray-100 py-3 pl-12 pr-4 text-sm text-gray-600">
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="size-4 shrink-0 text-brand-500" />
        <span className="truncate">{item.title}</span>
        {item.is_free && (
          <span className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-600">Free</span>
        )}
        {canPreview && (
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            <PlayCircle className="size-3.5" /> Preview
          </button>
        )}
      </span>
      {item.duration_label && (
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-gray-500">
          <Clock className="size-3.5" /> {item.duration_label}
        </span>
      )}
    </li>
  );
};

const CourseCurriculum = ({ curriculum }: { curriculum: CourseSection[] }) => {
  const [open, setOpen] = useState<Set<string>>(() => new Set(curriculum[0] ? [curriculum[0].id] : []));

  const [previewItem, setPreviewItem] = useState<CourseSectionItem | null>(null);

  if (curriculum.length === 0) return null;

  const allOpen = open.size === curriculum.length;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Course curriculum</h2>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{curriculum.length} sections</span>
          <SectionCounts sections={curriculum} className="text-sm" />
        </div>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(curriculum.map((s) => s.id)))}
          className="text-xs font-semibold text-brand-600 hover:underline"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {curriculum.map((section) => {
          const isOpen = open.has(section.id);
          const Chevron = isOpen ? ChevronDown : ChevronRight;
          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-gray-50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                  <Chevron className="size-4 text-brand-500" />
                  {section.title}
                </span>
                <SectionCounts sections={[section]} className="text-xs" />
              </button>

              {isOpen && (
                <div>
                  {section.items && section.items.length > 0 && (
                    <ul>{section.items.map((item) => <LessonRow key={item.id} item={item} onPreview={setPreviewItem} />)}</ul>
                  )}
                  {(section.subsections ?? []).map((sub) => (
                    <div key={sub.id}>
                      <p className="border-t border-gray-100 bg-gray-50 py-2 pl-12 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {sub.title}
                      </p>
                      <ul>{(sub.items ?? []).map((item) => <LessonRow key={item.id} item={item} onPreview={setPreviewItem} />)}</ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FreeVideoPreviewDialog item={previewItem} onClose={() => setPreviewItem(null)} />
    </section>
  );
};

export default CourseCurriculum;
