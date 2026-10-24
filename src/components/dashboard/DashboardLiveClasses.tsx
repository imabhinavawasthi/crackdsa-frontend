"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Play, 
  Video, 
  Radio,
  CalendarX,
  Sparkles,
  Lock
} from "lucide-react";
import { LiveClass } from "@/types/live-class";

interface DashboardLiveClassesProps {
  featuredClass?: LiveClass | null;
  upcomingClass?: LiveClass | null;
  lastClass?: LiveClass | null;
  loading?: boolean;
}

export default function DashboardLiveClasses({
  featuredClass,
  upcomingClass,
  lastClass,
  loading = false,
}: DashboardLiveClassesProps) {
  const abhinavAvatar = "https://assets.leetcode.com/users/abhinavawasthi/avatar_1717828974.png";

  const formatClassTime = (epoch?: number | null) => {
    if (!epoch) return null;
    const d = new Date(epoch * 1000);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const dateStr = isToday ? "Today" : d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
    
    return { dateStr, timeStr };
  };

  // Determine active class: prefer featuredClass, fallback to upcoming or last
  const activeClass = featuredClass !== undefined ? featuredClass : (upcomingClass || lastClass);
  const isLive = activeClass?.status === "live";
  const isUpcoming = Boolean(activeClass && activeClass.status === "upcoming");
  const isLast = Boolean(activeClass && activeClass.status === "completed");
  const isLocked = Boolean(activeClass?.is_locked);
  const isFree = activeClass?.visibility === "free";
  const activeTime = formatClassTime(activeClass?.class_time_epoch);
  const classDetailUrl = activeClass?.id ? `/live-classes/${activeClass.id}` : "/live-classes";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between h-full select-none group/card">
      {/* Ambient background micro-glow */}
      <div className="absolute -top-12 -right-12 size-36 rounded-full bg-rose-500/5 dark:bg-rose-400/5 blur-2xl pointer-events-none" />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Video size={15} />
            </div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
              Live Classes
            </h2>
          </div>

          <Link
            href="/live-classes"
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── Body ───────────────────────────────────────────────────── */}
        {loading ? (
          <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ) : activeClass ? (
          /* Active Class Inner Card matching reference design */
          <div className="p-4 rounded-xl border border-gray-100/90 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 space-y-3">
            {/* Top row: Status pill & duration */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                    <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                    LIVE NOW
                  </span>
                ) : isUpcoming ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    <span className="size-2 rounded-full bg-blue-500" />
                    Upcoming
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Latest Recording
                  </span>
                )}

                {isFree ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Free
                  </span>
                ) : isLocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Lock size={10} />
                    Pro
                  </span>
                ) : null}
              </div>

              {activeClass.class_duration && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 text-[11px] font-semibold text-gray-600 dark:text-gray-300 shadow-2xs">
                  {activeClass.class_duration} min
                </span>
              )}
            </div>

            {/* Title & Topic */}
            <div>
              <Link href={classDetailUrl} className="group/title block">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-1">
                  {activeClass.class_name}
                </h3>
              </Link>
              {activeClass.class_topic && (
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5 truncate">
                  {activeClass.class_topic.replace(/-/g, " ")}
                </p>
              )}
            </div>

            {/* Date & Mentor */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200/50 dark:border-gray-700/50 text-xs">
              {activeTime && (
                <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                  <Calendar size={13} className="shrink-0" />
                  <span>{activeTime.dateStr}, {activeTime.timeStr}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                <div className="relative size-5 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                  <Image
                    src={abhinavAvatar}
                    alt="Mentor"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="truncate max-w-[120px]">
                  {activeClass.instructor_name || "Abhinav Awasthi"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="py-6 text-center space-y-2">
            <div className="size-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
              <CalendarX size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              No Live Class Scheduled
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              New mentorship sessions are announced regularly.
            </p>
          </div>
        )}
      </div>

      {/* ─── Primary Action Button matching reference design ─────────── */}
      <div className="pt-3.5 mt-3.5 border-t border-gray-100 dark:border-gray-800/80">
        {loading ? (
          <div className="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ) : isLocked ? (
          <Link
            href="/pro"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Lock size={14} />
            <span>Unlock Live Class with Pro</span>
            <Sparkles size={14} className="text-amber-100" />
          </Link>
        ) : isLive ? (
          <Link
            href={activeClass?.class_link || classDetailUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Play size={14} className="fill-white" />
            <span>Join Live Class</span>
          </Link>
        ) : isUpcoming ? (
          <Link
            href={classDetailUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Play size={14} className="fill-white" />
            <span>Join Live Class</span>
          </Link>
        ) : isLast ? (
          <Link
            href={classDetailUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Play size={14} className="fill-white" />
            <span>Watch Class Recording</span>
          </Link>
        ) : (
          <Link
            href="/live-classes"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>Browse All Sessions</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
