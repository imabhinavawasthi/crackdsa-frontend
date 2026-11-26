'use client';

import { Code2, FileText, GraduationCap } from 'lucide-react';
import type { CourseSummary } from '@/types/course';
import { toStringList } from './courseDetailUtils';

interface CoursePrerequisitesProps {
  course: CourseSummary;
}

const PREREQUISITE_ICONS = [Code2, FileText, GraduationCap];

export default function CoursePrerequisites({ course }: CoursePrerequisitesProps) {
  const rawPrerequisites = toStringList(course.metadata?.prerequisites);
  if (rawPrerequisites.length === 0) return null;

  // Format each prerequisite into { title, subtitle }
  const formattedItems = rawPrerequisites.map((item, index) => {
    // If the text contains parentheses e.g. "Basic programming knowledge in any language (C++, Java, Python, JavaScript, etc.)"
    const parenMatch = item.match(/^(.*?)\s*\((.*?)\)$/);
    if (parenMatch) {
      let mainText = parenMatch[1].trim();
      let subText = `In any language (${parenMatch[2].trim()})`;
      if (mainText.toLowerCase().includes('basic programming knowledge')) {
        mainText = 'Basic programming knowledge';
      }
      return {
        title: mainText,
        subtitle: subText,
        icon: PREREQUISITE_ICONS[index % PREREQUISITE_ICONS.length],
      };
    }

    if (item.toLowerCase().includes('familiarity with variables')) {
      return {
        title: item.replace(/,\s*and\s*/, ' and '),
        subtitle: 'Comfortable with basic programming constructs',
        icon: FileText,
      };
    }

    if (item.toLowerCase().includes('no prior dsa') || item.toLowerCase().includes('no prior knowledge')) {
      return {
        title: item,
        subtitle: 'We start from the basics and build up gradually',
        icon: GraduationCap,
      };
    }

    return {
      title: item,
      subtitle: 'Recommended foundation for this course',
      icon: PREREQUISITE_ICONS[index % PREREQUISITE_ICONS.length],
    };
  });

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xs transition-colors">
      {/* Eyebrow Pill */}
      <div className="mb-3">
        <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          PREREQUISITES
        </span>
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
        What you should know before starting
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        This course is beginner friendly, but a basic understanding of programming fundamentals will help you follow the content comfortably.
      </p>

      {/* List of Prerequisite Cards */}
      <div className="mt-6 space-y-3.5">
        {formattedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/50 p-4 transition-colors"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
