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
  Sparkles
} from "lucide-react";
import { LiveClass } from "@/types/live-class";

interface DashboardLiveClassesProps {
  upcomingClass: LiveClass | null;
  lastClass: LiveClass | null;
  loading?: boolean;
}

export default function DashboardLiveClasses({
  upcomingClass,
  lastClass,
  loading = false,
}: DashboardLiveClassesProps) {
  const abhinavAvatar = "https://assets.leetcode.com/users/abhinavawasthi/avatar_1717828974.png";

  const formatClassTime = (epoch?: number | null) => {
    if (!epoch) return null;
    const d = new Date(epoch * 1000);
    return {
      dateStr: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
      timeStr: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  };

  // Determine active class to show: Live Now > Upcoming > Last Class
  const isLive = upcomingClass?.status === "live";
  const isUpcoming = Boolean(upcomingClass && upcomingClass.status !== "live");
  const isLast = !upcomingClass && Boolean(lastClass);
  const activeClass = upcomingClass || lastClass;
  const activeTime = formatClassTime(activeClass?.class_time_epoch);
  const classDetailUrl = activeClass?.id ? `/live-classes/${activeClass.id}` : "/live-classes";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all flex flex-col justify-between h-full p-5 sm:p-6 select-none ${
        isLive
          ? "border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-white to-rose-50/40 dark:from-rose-950/30 dark:via-gray-900 dark:to-gray-900 shadow-sm shadow-rose-500/5"
          : "border-gray-200/90 dark:border-gray-800 bg-gradient-to-br from-blue-500/5 via-white to-indigo-500/5 dark:from-blue-950/20 dark:via-gray-900 dark:to-gray-900 shadow-xs"
      }`}
    >
      {/* Ambient background micro-glow */}
      <div
        className={`absolute -top-12 -right-12 size-36 rounded-full blur-2xl pointer-events-none ${
          isLive ? "bg-rose-500/15" : "bg-blue-500/10 dark:bg-blue-400/10"
        }`}
      />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-2">
            <div
              className={`flex size-7 items-center justify-center rounded-lg ${
                isLive
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }`}
            >
              {isLive ? <Radio size={15} className="animate-pulse" /> : <Video size={15} />}
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
          /* Loading Skeleton */
          <div className="space-y-3.5 py-1 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-xl bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ) : activeClass ? (
          /* Active Class Content */
          <div className="space-y-3.5">
            {/* Status Badge & Duration */}
            <div className="flex items-center justify-between gap-2">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs shadow-rose-500/30 animate-pulse">
                  <span className="size-1.5 rounded-full bg-white" />
                  Live Now
                </span>
              ) : isUpcoming ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  <span className="size-1.5 rounded-full bg-blue-500" />
                  Upcoming Session
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Latest Recording
                </span>
              )}

              {activeClass.class_duration && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100/90 dark:bg-gray-800/90 text-[11px] font-bold text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">
                  <Clock size={11} className="text-gray-400" />
                  <span>{activeClass.class_duration}m</span>
                </span>
              )}
            </div>

            {/* Media Icon & Title Row */}
            <div className="flex items-start gap-3">
              <div
                className={`relative flex size-11 items-center justify-center rounded-xl shrink-0 overflow-hidden shadow-xs border ${
                  isLive
                    ? "bg-gradient-to-br from-rose-500 to-red-600 text-white border-rose-400/40 shadow-rose-500/20"
                    : isLast
                    ? "bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-indigo-900/40 dark:border-indigo-800/40"
                    : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-500/30 shadow-blue-500/20"
                }`}
              >
                {isLive ? (
                  <Radio size={20} className="animate-pulse" />
                ) : isLast ? (
                  <Play size={18} className="fill-white ml-0.5 text-white" />
                ) : (
                  <Video size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link href={classDetailUrl} className="group block">
                  <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {activeClass.class_name}
                  </h3>
                </Link>
                {activeClass.class_topic && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    {activeClass.class_topic.replace(/-/g, " ")}
                  </span>
                )}
              </div>
            </div>

            {/* Schedule & Mentor info */}
            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              {activeTime && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar size={12} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{activeTime.dateStr}, {activeTime.timeStr}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <div className="relative size-5 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                  <Image
                    src={abhinavAvatar}
                    alt="Mentor"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {activeClass.instructor_name || "Abhinav Awasthi"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - Minimal */
          <div className="py-4 text-center space-y-2">
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

      {/* ─── Action Button ──────────────────────────────────────────── */}
      <div className="relative z-10 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80">
        {loading ? (
          <div className="h-9 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : isLive ? (
          <Link
            href={activeClass?.class_link || classDetailUrl}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black shadow-md shadow-rose-600/25 hover:shadow-rose-600/35 transition-all cursor-pointer"
          >
            <Radio size={14} className="animate-pulse" />
            <span>Join Live Session Now</span>
          </Link>
        ) : isUpcoming ? (
          <Link
            href={classDetailUrl}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>View Session Details</span>
            <ArrowRight size={13} />
          </Link>
        ) : isLast ? (
          <Link
            href={classDetailUrl}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Play size={12} className="fill-current text-blue-500" />
            <span>Watch Class Recording</span>
          </Link>
        ) : (
          <Link
            href="/live-classes"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Browse All Sessions</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
