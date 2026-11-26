"use client";

import React, { useState } from "react";
import { 
  Code2, 
  Dumbbell, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Terminal,
  Compass
} from "lucide-react";
import { DSASheet } from "@/types/dsa-sheet";

interface SheetThumbnailArtworkProps {
  sheet: DSASheet | {
    id: string;
    title: string;
    description?: string;
    level?: string;
    tags?: string[];
    total_problems?: number;
    total_topics?: number;
    difficulty?: string;
    problemCount?: number;
    thumbnail_url?: string | null;
    tag?: string;
    sheet_json?: any;
  };
  className?: string;
}

// Helper to count problems safely
function resolveProblemCount(sheet: any): number {
  if (sheet.total_problems && sheet.total_problems > 0) return sheet.total_problems;
  if (sheet.problemCount && sheet.problemCount > 0) return sheet.problemCount;
  if (sheet.sheet_json?.topics) {
    return sheet.sheet_json.topics.reduce((acc: number, topic: any) => {
      const stepProblems = (topic.steps || []).reduce((acc2: number, step: any) => {
        return acc2 + (step.problems ? step.problems.length : 0);
      }, 0);
      return acc + stepProblems;
    }, 0);
  }
  return 75; // sensible default
}

// Helper to count topics safely
function resolveTopicCount(sheet: any): number {
  if (sheet.total_topics && sheet.total_topics > 0) return sheet.total_topics;
  if (sheet.sheet_json?.topics) return sheet.sheet_json.topics.length;
  return 0;
}

export function SheetThumbnailArtwork({ sheet, className = "" }: SheetThumbnailArtworkProps) {
  const [imageError, setImageError] = useState(false);
  const rawImage = (sheet as any).thumbnail_url;

  // If a valid custom image URL is provided and loads successfully
  if (rawImage && !imageError) {
    return (
      <div className={`relative w-full aspect-[16/10] overflow-hidden bg-slate-900 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rawImage}
          alt={sheet.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
      </div>
    );
  }

  const id = (sheet.id || "").toLowerCase();
  const title = (sheet.title || "").toLowerCase();
  const problemCount = resolveProblemCount(sheet);
  const topicCount = resolveTopicCount(sheet);
  const rawLevel = (sheet as any).level || (sheet as any).difficulty || "Intermediate";
  const levelLabel = rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1);

  // Theme configurations for decent, mature backgrounds
  let theme = {
    bgGradient: "from-[#0d1322] via-[#0f172a] to-[#090e1a]",
    accentGlow: "bg-indigo-500/12",
    tagBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
    tagDot: "bg-indigo-400",
    levelBadge: "bg-white/10 text-slate-200 border-white/10",
    tagText: (sheet as any).tag || (sheet.tags && sheet.tags[0]) || "Pattern Based",
    WatermarkIcon: Layers,
    subtitle: "Structured pattern curriculum with handpicked problems",
  };

  if (id.includes("pattern") || title.includes("pattern")) {
    theme = {
      bgGradient: "from-[#0c1222] via-[#0f172a] to-[#080d1a]",
      accentGlow: "bg-indigo-500/15",
      tagBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
      tagDot: "bg-indigo-400",
      levelBadge: "bg-white/10 text-slate-200 border-white/10",
      tagText: (sheet as any).tag || "Pattern Based",
      WatermarkIcon: Layers,
      subtitle: "Learn core algorithmic patterns to solve any problem",
    };
  } else if (id.includes("0-to-hero") || title.includes("hero") || title.includes("0 to hero")) {
    theme = {
      bgGradient: "from-[#091519] via-[#0c1b22] to-[#071015]",
      accentGlow: "bg-teal-500/15",
      tagBg: "bg-teal-500/15 text-teal-300 border-teal-500/25",
      tagDot: "bg-teal-400",
      levelBadge: "bg-white/10 text-slate-200 border-white/10",
      tagText: (sheet as any).tag || "Comprehensive",
      WatermarkIcon: Compass,
      subtitle: "Complete foundation to advanced mastery roadmap",
    };
  } else if (id.includes("sprint") || id.includes("75") || id.includes("crackdsa")) {
    theme = {
      bgGradient: "from-[#18130d] via-[#1c160f] to-[#0d0906]",
      accentGlow: "bg-amber-500/15",
      tagBg: "bg-amber-500/15 text-amber-300 border-amber-500/25",
      tagDot: "bg-amber-400",
      levelBadge: "bg-white/10 text-slate-200 border-white/10",
      tagText: (sheet as any).tag || "Interview Sprint",
      WatermarkIcon: Zap,
      subtitle: "Must-solve interview questions for top product tech companies",
    };
  } else if (id.includes("expert") || id.includes("cp") || id.includes("newbie")) {
    theme = {
      bgGradient: "from-[#091122] via-[#0d162d] to-[#060a16]",
      accentGlow: "bg-blue-500/15",
      tagBg: "bg-blue-500/15 text-blue-300 border-blue-500/25",
      tagDot: "bg-blue-400",
      levelBadge: "bg-white/10 text-slate-200 border-white/10",
      tagText: (sheet as any).tag || "Competitive Prog",
      WatermarkIcon: Terminal,
      subtitle: "Handpicked CP problem set with video editorials & code",
    };
  } else {
    theme = {
      bgGradient: "from-[#0f172a] via-[#111827] to-[#0a0e17]",
      accentGlow: "bg-violet-500/12",
      tagBg: "bg-violet-500/15 text-violet-300 border-violet-500/25",
      tagDot: "bg-violet-400",
      levelBadge: "bg-white/10 text-slate-200 border-white/10",
      tagText: (sheet as any).tag || (sheet.tags && sheet.tags[0]) || "Curated Sheet",
      WatermarkIcon: Code2,
      subtitle: "Curated problem set to ace technical interviews",
    };
  }

  const { WatermarkIcon } = theme;

  return (
    <div
      className={`relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br ${theme.bgGradient} flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}
    >
      {/* 1. Subtle Engineering Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* 2. Soft Ambient Corner Glow (Gentle, Not Loud) */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${theme.accentGlow}`}
      />

      {/* 3. Extremely Subtle Watermark in Background */}
      <div className="absolute right-3.5 -bottom-2 text-white/[0.04] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:text-white/[0.06]">
        <WatermarkIcon size={110} strokeWidth={1.2} />
      </div>

      {/* 4. Top Header Row: Category Tag + Level */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${theme.tagBg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${theme.tagDot} animate-pulse`} />
          {theme.tagText}
        </span>

        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${theme.levelBadge}`}
        >
          {levelLabel}
        </span>
      </div>

      {/* 5. Center Title & Subtitle */}
      <div className="relative z-10 my-auto py-1">
        <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug drop-shadow-xs line-clamp-2">
          {sheet.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-300/80 line-clamp-1 mt-1 font-normal">
          {theme.subtitle}
        </p>
      </div>

      {/* 6. Bottom Info Pills */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-slate-200 bg-black/40 backdrop-blur-md border border-white/10">
          <Dumbbell size={11} className="text-slate-400" />
          <span>{problemCount} Problems</span>
        </span>

        {topicCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-slate-200 bg-black/40 backdrop-blur-md border border-white/10">
            <BookOpen size={11} className="text-slate-400" />
            <span>{topicCount} Topics</span>
          </span>
        )}

        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-amber-300/90 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md ml-auto">
          <Sparkles size={10} className="text-amber-400" />
          <span>Editorials</span>
        </span>
      </div>
    </div>
  );
}
