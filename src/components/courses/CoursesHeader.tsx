"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export function CoursesHeader() {
  return (
    <div className="space-y-3 pb-2 border-b border-gray-100 dark:border-gray-800">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-200/60 dark:border-brand-500/20">
        <BookOpen size={12} className="text-brand-500" />
        Curated Programs
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Explore Courses
      </h1>

      <p className="max-w-2xl text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
        Master Data Structures, Algorithms, and technical interview fundamentals through structured, hands-on learning designed to take you from foundational concepts to interview-ready.
      </p>
    </div>
  );
}
