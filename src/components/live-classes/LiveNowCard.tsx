"use client";

import React from "react";
import { Calendar, Clock, Tag, ArrowRight, User } from "lucide-react";
import { LiveClass } from "@/types/live-class";
import { formatClassDateTime } from "./calendarUtils";

interface LiveNowCardProps {
  classItem: LiveClass;
}

function formatDurationMinutes(mins?: number | null): string {
  if (!mins || mins <= 0) return "60 mins";
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (hours > 0 && remaining > 0) return `${hours}h ${remaining}m`;
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${mins} mins`;
}

export function LiveNowCard({ classItem }: LiveNowCardProps) {
  const { dateLabel, timeRangeLabel } = formatClassDateTime(
    classItem.class_time_epoch ?? undefined,
    classItem.class_duration ?? 60
  );

  const subtopics = classItem.class_subtopics || [];

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-gray-700 transition-all">
      {/* 1. Left Graphic Box */}
      <div className="relative w-full lg:w-72 h-36 rounded-xl bg-gradient-to-br from-[#0b1432] via-[#080f26] to-[#040816] p-4 flex flex-col justify-between overflow-hidden shrink-0 shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

        {/* Top: LIVE NOW Badge */}
        <div className="flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE NOW
          </span>
        </div>

        {/* Bottom Left on thumbnail: Title */}
        <div className="z-10 space-y-0.5">
          <h4 className="text-white font-bold text-sm leading-snug line-clamp-2">
            {classItem.class_name}
          </h4>
          <p className="text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>In Progress</span>
          </p>
        </div>

        {/* Bottom Right Avatar Graphic */}
        <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-blue-500/10 border border-blue-400/20 overflow-hidden flex items-center justify-center pointer-events-none">
          <User size={28} className="text-blue-300/60" />
        </div>
      </div>

      {/* 2. Middle Content & Details */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {classItem.class_name}
          </h3>
        </div>

        {/* Real Subtopics */}
        {subtopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {subtopics.map((subtopic) => (
              <span
                key={subtopic}
                className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40"
              >
                {subtopic}
              </span>
            ))}
          </div>
        )}

        {/* Instructor Name (Real name only) */}
        {classItem.instructor_name && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
              <User size={13} className="text-slate-500" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {classItem.instructor_name}
            </span>
          </div>
        )}

        {/* Real Metadata Row */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {/* Date & Time */}
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-slate-800 dark:text-slate-200 font-bold">{dateLabel}</span>
              <span>•</span>
              <span className="text-slate-500">{timeRangeLabel}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400 shrink-0" />
            <span>{formatDurationMinutes(classItem.class_duration)}</span>
          </div>

          {/* Topic */}
          {classItem.class_topic && (
            <div className="flex items-center gap-1.5">
              <Tag size={13} className="text-slate-400 shrink-0" />
              <span className="uppercase text-[11px] font-bold text-slate-600 dark:text-slate-300">
                {classItem.class_topic}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Action CTA */}
      <div className="w-full lg:w-auto flex items-center justify-end shrink-0">
        <a
          href={classItem.class_link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xs transition-colors cursor-pointer"
        >
          <span>Join Live</span>
          <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}
