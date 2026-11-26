"use client";

import React from "react";
import { BookOpen, RefreshCw, Sparkles, Crown } from "lucide-react";
import { CourseSummary } from "@/types/course";
import { CourseCard } from "./CourseCard";

interface CoursesGridProps {
  courses: CourseSummary[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onResetFilters: () => void;
}

export function CoursesGrid({
  courses,
  loading,
  error,
  onRetry,
  onResetFilters,
}: CoursesGridProps) {
  // Loading skeleton state
  if (loading) {
    return (
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="flex flex-col h-full rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-[16/9] bg-slate-100 dark:bg-slate-800" />
                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="w-5/6 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                    <div className="w-4/6 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                  <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />
                  <div className="flex gap-3">
                    <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 px-6 text-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Unable to Load Courses
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
          We encountered an issue retrieving real courses from the API. Please try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="py-16 px-6 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          No Courses Found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
          No courses matched your current filter.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] transition-colors cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    );
  }

  // Separate courses into Free and Paid / Premium
  const freeCourses = courses.filter((c) => (c.price ?? 0) <= 0);
  const paidCourses = courses.filter((c) => (c.price ?? 0) > 0);

  // If one of the categories has no items, render a single grid cleanly
  const hasBothSections = freeCourses.length > 0 && paidCourses.length > 0;

  return (
    <div className="space-y-12">
      {/* 1. Free Courses Section */}
      {freeCourses.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Free Courses
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {freeCourses.length}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Completely free community courses with in-depth curriculum and self-paced learning
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeCourses.map((course) => (
              <CourseCard
                key={course.id || course.slug}
                course={course}
                isFeatured={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. Paid / Premium Courses Section */}
      {paidCourses.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Crown size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Premium Courses
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    {paidCourses.length}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive structured programs with extensive problem collections and interview preparation
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paidCourses.map((course, idx) => {
              const isDsa = (course.slug || "").includes("data-structure") || (course.slug || "").includes("dsa");
              const isFeatured = isDsa && idx === 0;

              return (
                <CourseCard
                  key={course.id || course.slug}
                  course={course}
                  isFeatured={isFeatured}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
