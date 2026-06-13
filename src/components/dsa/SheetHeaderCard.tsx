import React, { useState } from "react";
import { DSASheet } from "@/types/dsa-sheet";
import { BookOpen, Layers, Clock } from "lucide-react";

interface SheetHeaderCardProps {
  sheet: DSASheet;
  totalProblems: number;
  totalTopics: number;
  children?: React.ReactNode;
}

export const SheetHeaderCard: React.FC<SheetHeaderCardProps> = ({
  sheet,
  totalProblems,
  totalTopics,
  children,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="relative -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-6 overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 dark:from-brand-700 dark:via-brand-600 dark:to-brand-500">
      {/* Decorative mesh */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.04]" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/[0.04]" />

      <div className="relative z-10 px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Title + description */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {sheet.level && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                  {sheet.level}
                </span>
              )}
              {sheet.tags &&
                sheet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">
              {sheet.title || "DSA Learning Sheet"}
            </h1>
            <div className="relative max-w-2xl">
              <p
                className={`text-white/70 text-sm transition-all duration-300 ${
                  !isDescriptionExpanded ? "line-clamp-2" : ""
                }`}
              >
                {sheet.description ||
                  "A structured roadmap guiding you step-by-step through essential DSA patterns."}
              </p>
              {sheet.description && sheet.description.length > 120 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-white/90 text-xs font-semibold mt-1 hover:underline transition-all"
                >
                  {isDescriptionExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1 text-white/50 text-xs">
              <BookOpen size={13} />
              <span className="font-semibold text-white/90">{totalTopics}</span> topics
              <span className="mx-1">·</span>
              <Layers size={13} />
              <span className="font-semibold text-white/90">{totalProblems}</span> problems
              {sheet.estimated_hours && (
                <>
                  <span className="mx-1">·</span>
                  <Clock size={13} />
                  <span className="font-semibold text-white/90">~{sheet.estimated_hours}h</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="flex md:hidden items-center gap-3 mt-4 text-[11px] text-white/50">
          <span>
            <span className="font-semibold text-white/90">{totalTopics}</span> Topics
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-white/90">{totalProblems}</span> Problems
          </span>
          {sheet.estimated_hours && (
            <>
              <span>·</span>
              <span>~{sheet.estimated_hours}h</span>
            </>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};
