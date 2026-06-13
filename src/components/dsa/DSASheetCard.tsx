import React from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell, Clock, Hash, FileCode2 } from "lucide-react";
import { DSASheet } from "@/types/dsa-sheet";

// Helper to count total problems in a sheet
function getProblemCount(sheet: DSASheet): number {
  if (!sheet.sheet_json || !sheet.sheet_json.topics) return 0;
  return sheet.sheet_json.topics.reduce((acc, topic) => {
    const topicProblems = topic.steps.reduce((acc2, step) => {
      return acc2 + (step.problems ? step.problems.length : 0);
    }, 0);
    return acc + topicProblems;
  }, 0);
}

// Format duration
function formatDuration(hours?: number): string {
  if (!hours) return "Flexible";
  if (hours < 24) return `${hours} Hours`;
  return `${Math.round(hours / 24)} Days`;
}

interface DSASheetCardProps {
  sheet: DSASheet;
}

export default function DSASheetCard({ sheet }: DSASheetCardProps) {
  return (
    <Link 
      href={`/dsa-sheet/${sheet.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0c0a1a]/80 backdrop-blur-2xl p-8 transition-all duration-500 hover:border-violet-500/50 hover:shadow-[0_8px_40px_rgb(139,92,246,0.12)] hover:-translate-y-1.5"
    >
      {/* Subtle Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Glowing orb effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <h3 className="relative z-10 flex items-center gap-2 text-2xl font-bold tracking-tight text-violet-600 dark:text-violet-400 transition-all duration-500">
        <FileCode2 size={22} className="text-violet-500/80 dark:text-violet-400/80 shrink-0" />
        <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-500 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-300 transition-all duration-500">
          {sheet.title}
        </span>
      </h3>
      
      <p className="relative z-10 mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3 font-medium">
        {sheet.description || "A comprehensive collection of data structures and algorithm problems to master your coding skills."}
      </p>

      {/* Tags */}
      {sheet.tags && sheet.tags.length > 0 && (
        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {sheet.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              <Hash size={10} />
              {tag}
            </span>
          ))}
          {sheet.tags.length > 3 && (
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              +{sheet.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-500/20 dark:group-hover:text-violet-400 transition-colors">
            <Dumbbell size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{getProblemCount(sheet)}</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Problems</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-500/20 dark:group-hover:text-violet-400 transition-colors">
            <Clock size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatDuration(sheet.estimated_hours)}</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Duration</span>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 py-3.5 text-sm font-bold text-violet-600 dark:text-violet-400 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-500 dark:group-hover:text-white shadow-sm group-hover:shadow-[0_4px_20px_rgb(139,92,246,0.3)]">
        <span>Start Practice</span>
        <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </Link>
  );
}
