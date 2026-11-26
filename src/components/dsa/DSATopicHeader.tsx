"use client";

import React from "react";
import { Clock } from "lucide-react";
import { DSATopicModule, getTopicGradient } from "@/config/dsa-catalog";
import { TopicIcon } from "@/components/common/TopicIcon";

interface DSATopicHeaderProps {
  module: DSATopicModule;
  sectionStats?: {
    videosCount: number;
    problemsCount: number;
    itemsCount: number;
  } | null;
  isUpcoming?: boolean;
}

export function DSATopicHeader({
  module,
  sectionStats,
  isUpcoming,
}: DSATopicHeaderProps) {
  const gradient = getTopicGradient(module);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gradient-to-br ${gradient} p-5 sm:p-6 text-white shadow-lg`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
            {module.subtitle || module.categoryLabel}
          </span>

          {isUpcoming && (
            <span className="rounded-full bg-amber-400 text-gray-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Clock size={11} /> Upcoming Topic
            </span>
          )}
        </div>

        {/* Title & Topic Icon */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-xs">
            <TopicIcon topicName={module.title} size={22} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {module.title}
          </h1>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed max-w-2xl">
          {module.description}
        </p>

        {/* Inline Metrics Bar */}
        <div className="pt-3 flex items-center gap-5 border-t border-white/20 text-xs">
          <div>
            <span className="font-black text-white">{sectionStats?.videosCount ?? 0}</span>{" "}
            <span className="text-white/80 font-medium">Videos</span>
          </div>
          <div className="h-3 w-px bg-white/25" />
          <div>
            <span className="font-black text-white">{sectionStats?.problemsCount ?? 0}</span>{" "}
            <span className="text-white/80 font-medium">Problems</span>
          </div>
          <div className="h-3 w-px bg-white/25" />
          <div>
            <span className="font-black text-white">{sectionStats?.itemsCount ?? 0}</span>{" "}
            <span className="text-white/80 font-medium">Total Items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
