'use client';

import React from 'react';
import { Star, Quote, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

export interface CourseFeedbackItem {
  name: string;
  role?: string;
  company?: string;
  rating?: number;
  avatar?: string;
  content: string;
}

interface CourseReviewsProps {
  feedbacks?: CourseFeedbackItem[];
  rating?: number;
  reviewsCount?: number;
}

export default function CourseReviews({
  feedbacks = [],
  rating = 4.9,
  reviewsCount,
}: CourseReviewsProps) {
  // If no reviews / feedbacks exist, skip rendering entirely
  if (!feedbacks || feedbacks.length === 0) {
    return null;
  }

  const effectiveCount = reviewsCount || feedbacks.length;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2.5">
            <Sparkles size={12} className="text-amber-500 fill-amber-500" />
            <span>Student Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 dark:text-white tracking-tight">
            Learner Reviews & Placements
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Real feedback from students and working professionals enrolled in this program
          </p>
        </div>

        {/* Aggregated Rating Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-2xs self-start sm:self-auto shrink-0">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} className="fill-amber-500 text-amber-500" />
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-gray-900 dark:text-white font-mono leading-none">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">/ 5.0</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 block leading-none mt-0.5">
              ({effectiveCount.toLocaleString()} ratings)
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {feedbacks.map((fb, idx) => {
          const itemRating = fb.rating || 5;
          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-5 sm:p-6 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all duration-200"
            >
              {/* Background watermark quote */}
              <Quote className="absolute top-4 right-4 size-10 text-gray-100 dark:text-gray-800/60 pointer-events-none group-hover:text-blue-500/10 transition-colors" />

              <div className="space-y-3.5 relative z-10">
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(itemRating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-gray-700 dark:text-gray-300 font-normal">
                  &ldquo;{fb.content}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-3">
                <div className="size-10 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                  {fb.avatar ? (
                    <img
                      src={fb.avatar}
                      alt={fb.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {fb.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {fb.name}
                    </h4>
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                  </div>
                  {(fb.role || fb.company) && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
                      {fb.role}
                      {fb.role && fb.company ? ' • ' : ''}
                      {fb.company && (
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {fb.company}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
