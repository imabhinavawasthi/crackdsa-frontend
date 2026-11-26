"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Play, FileCode, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { CourseSummary } from "@/types/course";
import { CourseThumbnail } from "./CourseThumbnail";

interface CourseCardProps {
  course: CourseSummary;
  isFeatured?: boolean;
}

/**
 * Strips HTML tags and entities to output clean, readable plain text for card previews.
 */
function cleanDescription(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Formats duration from real course metadata if non-zero.
 */
function formatDuration(meta?: CourseSummary["metadata"]): string | null {
  if (!meta) return null;
  if (meta.duration_hours && meta.duration_hours > 0) {
    return `${meta.duration_hours}h`;
  }
  if (meta.duration_weeks && meta.duration_weeks > 0) {
    return `${meta.duration_weeks}w`;
  }
  return null;
}

/**
 * Normalizes category display label.
 */
function formatCategory(category?: string): string {
  if (!category) return "GENERAL";
  const cat = category.toLowerCase().trim();
  if (cat === "core-dsa" || cat === "dsa") return "DSA";
  if (cat === "interview-prep") return "INTERVIEW PREP";
  if (cat === "programming") return "PROGRAMMING";
  if (cat === "system-design") return "SYSTEM DESIGN";
  return category.toUpperCase();
}

export function CourseCard({ course, isFeatured = false }: CourseCardProps) {
  const isUpcoming = course.status === "upcoming";
  const meta = course.metadata;
  const duration = formatDuration(meta);
  const plainDescription = cleanDescription(course.description);
  const displayCategory = formatCategory(course.category);
  const isCsCategory = displayCategory.includes("INTERVIEW") || displayCategory.includes("CS");

  // Real pricing & discount calculation
  const price = course.price ?? 0;
  const originalPrice = course.original_price ?? 0;
  const hasDiscount = Boolean(originalPrice && price && originalPrice > price);
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Real data-driven badge
  const badgeLabel = isUpcoming
    ? "UPCOMING"
    : course.is_popular
    ? "BESTSELLER"
    : null;

  const isPrimaryAction = course.is_popular || isFeatured;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-gray-700 transition-all duration-200">
      {/* 1. Thumbnail Area with Badges */}
      <div className="relative">
        <CourseThumbnail course={course} />

        {/* Real Badges: Left-pinned */}
        {badgeLabel && (
          <span
            className={`absolute top-3 left-3 text-[10.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs select-none ${
              badgeLabel === "BESTSELLER"
                ? "bg-[#0f172a] text-white shadow-md"
                : "bg-slate-900/80 backdrop-blur-xs text-white"
            }`}
          >
            {badgeLabel}
          </span>
        )}

        {/* Included in Pro Badge: Right-pinned */}
        {course.is_pro && (
          <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs select-none bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1">
            <Crown size={11} className="fill-white" />
            <span>Included in Pro</span>
          </span>
        )}
      </div>

      {/* 2. Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Category Label */}
        <span
          className={`text-[11px] font-black tracking-wider uppercase mb-1.5 ${
            isCsCategory
              ? "text-emerald-500 dark:text-emerald-400"
              : "text-[#2563eb] dark:text-blue-400"
          }`}
        >
          {displayCategory}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3 min-h-[58px] mb-4">
          {plainDescription}
        </p>

        {/* Real Metadata Row - Displays ONLY fields that actually exist */}
        {(Boolean(course.total_videos) || Boolean(course.total_problems) || duration || meta?.access_duration || course.is_pro) && (
          <div className="pt-3.5 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
            {Boolean(course.total_videos && course.total_videos > 0) && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Play size={9} className="fill-slate-500 text-slate-500 translate-x-0.2" />
                </span>
                <span>{course.total_videos} lessons</span>
              </div>
            )}

            {Boolean(course.total_problems && course.total_problems > 0) && (
              <div className="flex items-center gap-1.5">
                <FileCode size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{course.total_problems} problems</span>
              </div>
            )}

            {duration && (
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{duration}</span>
              </div>
            )}

            {(meta?.access_duration || course.is_pro) && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{meta?.access_duration || "Lifetime access"}</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Card Footer: Price & CTA Row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          {/* Real Pricing Section */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              {price === 0 ? (
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  Free
                </span>
              ) : (
                <>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through font-normal">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {hasDiscount && (
                <span className="text-xs font-bold text-[#2563eb] dark:text-blue-400">
                  {discountPercent}% off
                </span>
              )}
              {course.is_pro && (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles size={10} className="shrink-0" />
                  Free with Pro
                </span>
              )}
            </div>
          </div>

          {/* Action CTA */}
          {isUpcoming ? (
            <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 select-none">
              Coming Soon
            </span>
          ) : (
            <Link
              href={`/course/${course.slug}`}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isPrimaryAction
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-xs"
                  : "bg-[#eff6ff] dark:bg-blue-950/40 hover:bg-[#2563eb] text-[#2563eb] hover:text-white dark:text-blue-400 dark:hover:text-white"
              }`}
            >
              <span>View Course</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
