import React from "react";
import Link from "next/link";
import { ChevronRight, Clock, Hash } from "lucide-react";
import { DSASheet } from "@/types/dsa-sheet";
import { SheetThumbnailArtwork } from "./SheetThumbnailArtwork";

// Format duration
function formatDuration(hours?: number): string {
  if (!hours) return "Flexible Pace";
  if (hours < 24) return `${hours} Hours`;
  return `${Math.round(hours / 24)} Days Pacing`;
}

interface DSASheetCardProps {
  sheet: DSASheet;
}

export default function DSASheetCard({ sheet }: DSASheetCardProps) {
  const cardHref =
    sheet.id === "newbie-to-expert-cp" || sheet.id === "newbie-to-expert"
      ? "/cp/newbie-to-expert"
      : `/dsa-sheet/${sheet.id}`;

  return (
    <Link 
      href={cardHref}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs transition-all duration-300 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 select-none"
    >
      {/* 1. Top Themed Artwork Banner with Decent Background, Title, and Details */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100 dark:border-gray-800/80">
        <SheetThumbnailArtwork sheet={sheet} />
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-normal">
            {sheet.description || "Comprehensive collection of data structures and algorithm problems curated to master your technical interviews."}
          </p>

          {/* Tags */}
          {sheet.tags && sheet.tags.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              {sheet.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                  <Hash size={10} className="text-slate-400" />
                  {tag}
                </span>
              ))}
              {sheet.tags.length > 3 && (
                <span className="text-[10px] font-semibold text-slate-400">
                  +{sheet.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 3. Footer Stats & CTA Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock size={12} className="text-slate-400" />
              <span>{formatDuration(sheet.estimated_hours)}</span>
            </span>

            <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
              Interactive Tracker
            </span>
          </div>

          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white transition-all duration-200 shadow-2xs">
            <span>Start Practice</span>
            <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
