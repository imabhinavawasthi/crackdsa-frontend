import React from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell, Clock, Hash, FileCode2, BookOpen } from "lucide-react";
import { DSASheet } from "@/types/dsa-sheet";
import AspectFallbackImage from "@/components/common/AspectFallbackImage";

// Helper to count total problems in a sheet
function getProblemCount(sheet: DSASheet): number {
  if (sheet.total_problems !== undefined) return sheet.total_problems;
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

// Helper to count total topics in a sheet
function getTopicCount(sheet: DSASheet): number {
  if (sheet.total_topics !== undefined) return sheet.total_topics;
  if (!sheet.sheet_json || !sheet.sheet_json.topics) return 0;
  return sheet.sheet_json.topics.length;
}

interface DSASheetCardProps {
  sheet: DSASheet;
}

export default function DSASheetCard({ sheet }: DSASheetCardProps) {
  return (
    <Link 
      href={`/dsa-sheet/${sheet.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0c0a1a]/80 backdrop-blur-2xl p-0 transition-all duration-500 hover:border-violet-500/50 hover:shadow-[0_8px_40px_rgb(139,92,246,0.12)] hover:-translate-y-1.5"
    >
      {/* Top Image Banner with dynamic color fallback */}
      <div className="relative">
        <AspectFallbackImage
          localSrc={`/images/${sheet.id}.png`}
          alt={sheet.title}
          title={sheet.title}
          subtitle={`${sheet.level || "mixed"} • ${getProblemCount(sheet)} problems`}
        />
        <div className="absolute top-3 left-3 z-10">
          <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white border border-white/20 capitalize">
            {sheet.level || "mixed"}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-500">
          <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-500 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-300 transition-all duration-500">
            {sheet.title}
          </span>
        </h3>
        
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3 font-medium">
          {sheet.description || "A comprehensive collection of data structures and algorithm problems to master your coding skills."}
        </p>

        {/* Tags */}
        {sheet.tags && sheet.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
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
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-5">
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
              <BookOpen size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{getTopicCount(sheet)}</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Topics</span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 py-3.5 text-sm font-bold text-violet-600 dark:text-violet-400 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-500 dark:group-hover:text-white shadow-sm group-hover:shadow-[0_4px_20px_rgb(139,92,246,0.3)]">
          <span>Start Practice</span>
          <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}
