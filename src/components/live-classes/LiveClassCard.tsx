"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Code2, 
  Network, 
  Database, 
  FileText
} from "lucide-react";
import { LiveClass } from "@/types/live-class";
import { formatClassDateTime } from "./calendarUtils";

interface LiveClassCardProps {
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

function formatTopicName(topic?: string | null): string {
  if (!topic) return "Masterclass";
  const t = topic.toLowerCase();
  if (t === "dsa") return "DSA";
  if (t === "cs-fundamental") return "CS Fundamentals";
  if (t === "competitive-programming") return "Competitive Programming";
  return t
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function LiveClassCard({ classItem }: LiveClassCardProps) {
  const [imageError, setImageError] = useState(false);
  const { dateLabel, timeRangeLabel, badgeDateLabel } = formatClassDateTime(
    classItem.class_time_epoch ?? undefined,
    classItem.class_duration ?? 60
  );

  const detailUrl = `/live-sessions/${classItem.id}`;
  const isLive = classItem.status === "live";
  const isUpcoming = classItem.status === "upcoming";
  const subtopics = classItem.class_subtopics || [];

  // Determine topic icon
  const nameLower = (classItem.class_name || "").toLowerCase();
  let TopicIcon = Code2;
  if (nameLower.includes("graph") || nameLower.includes("tree") || nameLower.includes("bfs") || nameLower.includes("dfs")) {
    TopicIcon = Network;
  } else if (nameLower.includes("dp") || nameLower.includes("database") || nameLower.includes("array") || nameLower.includes("sliding window")) {
    TopicIcon = Database;
  } else if (nameLower.includes("system design") || nameLower.includes("os") || nameLower.includes("architecture")) {
    TopicIcon = FileText;
  }

  const imageUrl = classItem.thumbnail_url || classItem.class_image;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all duration-300">
      <Link href={detailUrl} className="block">
        {/* 1. Square-ish Top Media Banner */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#060E2E] via-[#0b1740] to-[#040817] p-4 flex flex-col justify-between select-none">
          {/* If custom image or YouTube thumbnail is provided and hasn't errored */}
          {imageUrl && !imageError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={classItem.class_name}
                onError={() => setImageError(true)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
            </>
          ) : (
            /* Premium Generated Card Artwork with Title and Date/Time */
            <>
              {/* Subtle background glow orbs & grid */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-600/25 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/35 transition-all" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-600/20 rounded-full blur-xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Watermark Icon */}
              <div className="absolute right-3 bottom-2 text-white/[0.04] pointer-events-none group-hover:text-white/[0.07] group-hover:scale-110 transition-all duration-500">
                <TopicIcon size={96} />
              </div>

              {/* Center Artwork: Title & Date Preview */}
              <div className="relative z-10 my-auto py-2 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-white line-clamp-2 leading-snug tracking-tight drop-shadow-sm group-hover:text-blue-200 transition-colors">
                  {classItem.class_name}
                </h4>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200">
                  <Calendar size={12} className="text-blue-400 shrink-0" />
                  <span>{badgeDateLabel}</span>
                  <span className="text-white/40">•</span>
                  <span>{timeRangeLabel.split("-")[0]?.trim()}</span>
                </div>
              </div>
            </>
          )}

          {/* Floating Top Header Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            {/* Topic Badge */}
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-2xs">
              {formatTopicName(classItem.class_topic)}
            </span>

            {/* Status Pill */}
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                UPCOMING
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-black uppercase tracking-wider border border-white/10">
                RECORDED
              </span>
            )}
          </div>

          {/* Floating Bottom Info (Duration) */}
          <div className="relative z-10 flex items-center justify-end">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold">
              <Clock size={11} className="text-blue-400" />
              {formatDurationMinutes(classItem.class_duration)}
            </span>
          </div>
        </div>

        {/* 2. Card Body */}
        <div className="p-5 space-y-3.5">
          {/* Lecture Title */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {classItem.class_name}
            </h3>
          </div>

          {/* Subtopics Pills */}
          {subtopics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {subtopics.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
              {subtopics.length > 3 && (
                <span className="text-[10px] font-semibold text-slate-400">
                  +{subtopics.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Instructor & Date Info */}
          <div className="pt-2 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-slate-500">
            {/* Instructor */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                {(classItem.instructor_name || "Lead")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .substring(0, 2)}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {classItem.instructor_name || "Lead Instructor"}
              </span>
            </div>

            {/* Date */}
            <span className="font-medium shrink-0 text-slate-400">
              {dateLabel}
            </span>
          </div>
        </div>
      </Link>

      {/* 3. Bottom Card Action */}
      <div className="px-5 pb-5 pt-0">
        <Link
          href={detailUrl}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-gray-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-2xs"
        >
          <span>View Session &amp; Notes</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
