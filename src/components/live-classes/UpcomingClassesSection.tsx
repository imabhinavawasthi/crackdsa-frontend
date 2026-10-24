"use client";

import React from "react";
import Link from "next/link";
import { 
  Radio, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  CalendarPlus, 
  User, 
  Sparkles,
  Video,
  Lock
} from "lucide-react";
import { LiveClass } from "@/types/live-class";
import { formatClassDateTime, createGoogleCalendarUrl } from "./calendarUtils";

interface UpcomingClassesSectionProps {
  upcomingClasses: LiveClass[];
  onScrollToCatalog?: () => void;
}

function formatDuration(mins?: number | null): string {
  if (!mins || mins <= 0) return "60 mins";
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (hours > 0 && remaining > 0) return `${hours}h ${remaining}m`;
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${mins} mins`;
}

export function UpcomingClassesSection({
  upcomingClasses,
  onScrollToCatalog,
}: UpcomingClassesSectionProps) {
  const hasUpcoming = upcomingClasses && upcomingClasses.length > 0;

  return (
    <section className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Radio size={16} className={hasUpcoming ? "animate-pulse" : ""} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Upcoming &amp; Live Classes
              {hasUpcoming && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                  {upcomingClasses.length} Scheduled
                </span>
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Cards or Empty Banner */}
      {hasUpcoming ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingClasses.map((item) => {
            const isLive = item.status === "live";
            const { dateLabel, timeRangeLabel } = formatClassDateTime(
              item.class_time_epoch ?? undefined,
              item.class_duration ?? 60
            );
            const calUrl = createGoogleCalendarUrl(
              item.class_name,
              item.class_time_epoch ?? undefined,
              item.class_duration ?? 60,
              item.class_name,
              item.class_link || "CrackDSA Live"
            );

            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 p-5 shadow-2xs hover:shadow-xs hover:border-blue-400/50 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                        <Clock size={11} />
                        UPCOMING
                      </span>
                    )}

                    {item.visibility === "free" ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        FREE
                      </span>
                    ) : item.is_locked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-200/50">
                        <Lock size={10} />
                        PRO
                      </span>
                    ) : null}

                    {item.class_topic && (
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                        {item.class_topic}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(item.class_duration)}
                  </span>
                </div>

                {/* Class Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {item.class_name}
                  </h3>
                  {item.instructor_name && (
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1.5">
                      <User size={13} className="text-slate-400" />
                      <span>{item.instructor_name}</span>
                    </p>
                  )}
                </div>

                {/* Time & Date bar */}
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/50 rounded-xl px-3.5 py-2.5">
                  <Calendar size={14} className="text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{dateLabel}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span>{timeRangeLabel}</span>
                </div>

                {/* Subtopic tags if any */}
                {item.class_subtopics && item.class_subtopics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.class_subtopics.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.class_subtopics.length > 3 && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        +{item.class_subtopics.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-gray-800">
                  {isLive && item.class_link ? (
                    <a
                      href={item.class_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
                    >
                      <Video size={14} />
                      <span>Join Live Class</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <a
                      href={calUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 transition-colors"
                    >
                      <CalendarPlus size={13} />
                      <span>Add to Calendar</span>
                    </a>
                  )}

                  <Link
                    href={`/live-sessions/${item.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Announcement */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 via-white to-blue-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20 border border-slate-200/90 dark:border-gray-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                No Live Sessions Scheduled Right Now
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Live interactive coding masterclasses, contest reviews, and doubt clearing sessions are announced weekly.
              </p>
            </div>

            {onScrollToCatalog && (
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 transition-colors cursor-pointer"
              >
                <span>Browse All Recorded Lectures</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
