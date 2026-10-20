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
  Sparkles,
  CalendarX
} from "lucide-react";
import { LiveClass } from "@/types/live-class";

interface DashboardLiveClassesProps {
  upcomingClass: LiveClass | null;
  lastClass: LiveClass | null;
}

export default function DashboardLiveClasses({
  upcomingClass,
  lastClass,
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

  const nextTime = formatClassTime(upcomingClass?.class_time_epoch);
  const lastTime = formatClassTime(lastClass?.class_time_epoch);

  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between h-7 shrink-0">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Video size={20} className="text-blue-600 dark:text-blue-400" />
          <span>Live Classes &amp; Mentorship</span>
        </h2>
        <Link
          href="/live-classes"
          className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>View all</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* ─── 1. NEXT LIVE CLASS CARD ─────────────────────────────────── */}
        <div className="h-full rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs flex flex-col justify-between transition-colors">
          {upcomingClass ? (
            // REAL UPCOMING CLASS EXISTS
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Next Live Class
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  upcomingClass.status === "live"
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60"
                }`}>
                  <span className={`size-1.5 rounded-full ${upcomingClass.status === "live" ? "bg-white" : "bg-blue-500"}`} />
                  {upcomingClass.status === "live" ? "Live Now" : "Live Soon"}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-snug">
                  {upcomingClass.class_name}
                </h3>
                {upcomingClass.class_topic && (
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    Topic: {upcomingClass.class_topic.replace(/-/g, " ")} • Interactive live session with Abhinav Awasthi.
                  </p>
                )}
              </div>

              {nextTime && (
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>{nextTime.dateStr}, {nextTime.timeStr}</span>
                  </div>
                  {upcomingClass.class_duration && (
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                      <Clock size={14} />
                      <span>{upcomingClass.class_duration} mins</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // NO UPCOMING CLASS (Real Empty State - NO Mock Data)
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Next Live Class
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  Schedule
                </span>
              </div>

              <div className="py-2 space-y-1.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 mb-2">
                  <CalendarX size={18} />
                </div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  No Upcoming Live Class
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                  There are currently no live classes scheduled. Explore past live class recordings or check back soon for upcoming sessions.
                </p>
              </div>
            </div>
          )}

          {/* Next Class Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative size-7 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <Image
                  src={abhinavAvatar}
                  alt="Abhinav Awasthi"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {upcomingClass?.instructor_name || "Abhinav Awasthi"}
                </p>
                <p className="text-[10px] text-gray-400 truncate">Lead Mentor</p>
              </div>
            </div>

            <Link
              href="/live-classes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0"
            >
              <span>{upcomingClass ? "Class Details" : "View Past Classes"}</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* ─── 2. LAST LIVE CLASS CARD ─────────────────────────────────── */}
        <div className="h-full rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Last Live Class
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                Completed
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Video Thumbnail with Play Button */}
              <div className="relative size-16 sm:size-18 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-indigo-950 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-800 shadow-xs">
                <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs">
                  <Play size={14} className="fill-white ml-0.5" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug truncate">
                  {lastClass?.class_name || "Live Class Recording"}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {lastClass?.class_topic ? `Topic: ${lastClass.class_topic.replace(/-/g, " ")}` : "Live problem solving and pattern breakdown"}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>{lastTime ? lastTime.dateStr : "Recorded Session"}</span>
                  <span>•</span>
                  <span>{lastClass?.class_duration ? `${lastClass.class_duration}m` : "60m"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Mentor & Watch Recording Button (NAVIGATES TO LIVE CLASSES PAGE) */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative size-7 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <Image
                  src={abhinavAvatar}
                  alt="Abhinav Awasthi"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {lastClass?.instructor_name || "Abhinav Awasthi"}
              </p>
            </div>

            {/* Navigates directly to /live-classes (internal page), NOT external recording link directly */}
            <Link
              href="/live-classes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors shadow-2xs"
            >
              <Play size={12} className="fill-current text-blue-600 dark:text-blue-400" />
              <span>Watch Recording</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
