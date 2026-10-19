'use client';

import { BookOpen, Layers, Target, TrendingUp } from 'lucide-react';
import type { CourseSummary } from '@/types/course';
import { stripHtml } from './courseDetailUtils';

interface AboutThisCourseProps {
  course: CourseSummary;
}

export default function AboutThisCourse({ course }: AboutThisCourseProps) {
  const cleanTitle = course.title.replace(/\[.*?\]/, '').trim();
  const description = stripHtml(course.description);

  // If DSA, use specific title, otherwise format dynamically
  const heading = cleanTitle.toLowerCase().includes('dsa') || cleanTitle.toLowerCase().includes('data structure')
    ? 'A complete DSA program from fundamentals to interview-ready'
    : `A complete ${cleanTitle} program from fundamentals to interview-ready`;

  const highlights = [
    {
      icon: BookOpen,
      title: 'Structured Learning Path',
      subtitle: 'From basics to advanced topics',
    },
    {
      icon: Target,
      title: 'Interview Focused',
      subtitle: 'Curated content for product and service based companies',
    },
    {
      icon: Layers,
      title: 'Concepts + Practice',
      subtitle: 'Learn concepts and solve problems side by side',
    },
    {
      icon: TrendingUp,
      title: 'Build Confidence',
      subtitle: 'Master patterns and improve problem solving skills',
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xs transition-colors">
      {/* Eyebrow Pill */}
      <div className="mb-3">
        <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          ABOUT THIS COURSE
        </span>
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
        {heading}
      </h2>

      {/* Course Description */}
      <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
        {description}
      </p>

      {/* 4 Feature Highlights */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex flex-col">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Weekly Classes Banner */}
      <div className="mt-7 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mt-0.5 sm:mt-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                Live Weekly Classes Included with Course
              </h4>
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Free Included
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              Every week, join live interactive problem-solving breakdowns, interview pattern masterclasses, and dedicated 1-on-1 doubt clearing sessions directly with Abhinav Awasthi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
