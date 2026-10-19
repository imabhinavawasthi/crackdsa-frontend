"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Play,
  Code2, 
  Network, 
  Cpu,
  Trophy,
  Video
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

/**
 * Topic Artwork Background for classes without custom thumbnails
 */
function ThemedCardBackground({ topic, className = "" }: { topic?: string | null; className?: string }) {
  const t = (topic || "").toLowerCase();

  // 1. CS Fundamentals (Emerald / Dark Green)
  if (t.includes("cs") || t.includes("os") || t.includes("dbms") || t.includes("network")) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-[#031710] via-[#06241a] to-[#010a07] overflow-hidden ${className}`}>
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/30 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
        
        {/* Subtle Watermark Graphic */}
        <div className="absolute right-4 bottom-3 text-emerald-400/[0.08] pointer-events-none group-hover:text-emerald-400/[0.15] group-hover:scale-105 transition-all duration-500">
          <Cpu size={110} strokeWidth={1.2} />
        </div>
      </div>
    );
  }

  // 2. System Design / Architecture (Cyan / Cobalt Blue)
  if (t.includes("system") || t.includes("design") || t.includes("architecture") || t.includes("cloud")) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-[#051529] via-[#082243] to-[#020b14] overflow-hidden ${className}`}>
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-sky-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/30 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf815_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
        
        {/* Subtle Watermark Graphic */}
        <div className="absolute right-4 bottom-3 text-sky-400/[0.08] pointer-events-none group-hover:text-sky-400/[0.15] group-hover:scale-105 transition-all duration-500">
          <Network size={110} strokeWidth={1.2} />
        </div>
      </div>
    );
  }

  // 3. Competitive Programming (Violet / Magenta)
  if (t.includes("competitive") || t.includes("contest") || t.includes("codeforces") || t.includes("leetcode")) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-[#160627] via-[#240b3f] to-[#0a0212] overflow-hidden ${className}`}>
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#a855f715_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
        
        {/* Subtle Watermark Graphic */}
        <div className="absolute right-4 bottom-3 text-purple-400/[0.08] pointer-events-none group-hover:text-purple-400/[0.15] group-hover:scale-105 transition-all duration-500">
          <Trophy size={110} strokeWidth={1.2} />
        </div>
      </div>
    );
  }

  // 4. Default / DSA (Royal Sapphire & Indigo)
  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-[#050D2E] via-[#091745] to-[#030718] overflow-hidden ${className}`}>
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/25 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/35 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
      
      {/* Subtle Watermark Graphic */}
      <div className="absolute right-4 bottom-3 text-blue-400/[0.08] pointer-events-none group-hover:text-blue-400/[0.15] group-hover:scale-105 transition-all duration-500">
        <Code2 size={110} strokeWidth={1.2} />
      </div>
    </div>
  );
}

export function LiveClassCard({ classItem }: LiveClassCardProps) {
  const [imageError, setImageError] = useState(false);
  const { dateLabel, badgeDateLabel } = formatClassDateTime(
    classItem.class_time_epoch ?? undefined,
    classItem.class_duration ?? 60
  );

  const detailUrl = `/live-sessions/${classItem.id}`;
  const isLive = classItem.status === "live";
  const isUpcoming = classItem.status === "upcoming";
  const subtopics = classItem.class_subtopics || [];

  const rawImageUrl = classItem.thumbnail_url || classItem.class_image;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-slate-200/90 dark:border-gray-800 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/40 transition-all duration-300">
      <Link href={detailUrl} className="block">
        {/* 1. Square-ish Top Media Banner */}
        <div className="relative aspect-[16/10] w-full overflow-hidden p-4 flex flex-col justify-between select-none">
          {/* Custom image or dynamic themed vector background */}
          {rawImageUrl && !imageError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rawImageUrl}
                alt={classItem.class_name}
                onError={() => setImageError(true)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/45" />
            </>
          ) : (
            <ThemedCardBackground topic={classItem.class_topic} />
          )}

          {/* Centered Optical Play Button (reveals & expands on hover) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white/95 text-blue-600 shadow-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              <Play fill="currentColor" size={24} className="translate-x-0.5" />
            </div>
          </div>

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

          {/* Floating Bottom Info (Date & Duration) */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10">
              <Calendar size={11} className="text-blue-400" />
              <span>{badgeDateLabel}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10">
              <Clock size={11} className="text-blue-400" />
              <span>{formatDurationMinutes(classItem.class_duration)}</span>
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
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-gray-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-2xs group/btn"
        >
          <Video size={13} className="text-blue-500 group-hover/btn:text-white transition-colors" />
          <span>Watch Recording &amp; Notes</span>
          <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
