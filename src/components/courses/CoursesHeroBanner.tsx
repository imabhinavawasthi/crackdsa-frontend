"use client";

import React from "react";
import { Play, FileCode, BookOpen } from "lucide-react";

export function CoursesHeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-[#060E2E] text-white border border-blue-900/40 shadow-xl">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left: Content */}
        <div className="flex-1 max-w-2xl space-y-3.5 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs bg-blue-500" />
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
              COURSES
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-[1.2]">
            Learn with structured, hands-on courses.
          </h1>

          <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
            From DSA fundamentals to advanced topics, build strong problem solving skills with our in-depth courses, examples, and practice problems.
          </p>
        </div>

        {/* Right: Glass Cards Artwork & Connected Floating Badges */}
        <div className="relative w-full lg:w-auto shrink-0 flex items-center justify-center lg:justify-end pr-2 lg:pr-6">
          <div className="relative flex items-center gap-6 sm:gap-10">
            {/* Stacked Glass Cards with </> code symbol */}
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 flex items-center justify-center">
              {/* Back card 1 */}
              <div className="absolute w-28 h-22 sm:w-34 sm:h-26 rounded-2xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-xs -rotate-12 -translate-x-4 -translate-y-1" />
              
              {/* Back card 2 */}
              <div className="absolute w-30 h-24 sm:w-36 sm:h-28 rounded-2xl bg-blue-500/15 border border-blue-400/30 backdrop-blur-xs -rotate-6 -translate-x-2" />
              
              {/* Main front card */}
              <div className="relative z-10 w-32 h-26 sm:w-40 sm:h-30 rounded-2xl bg-gradient-to-br from-blue-900/60 to-blue-950/80 border border-blue-400/50 backdrop-blur-md shadow-2xl shadow-blue-950 flex items-center justify-center">
                <span className="font-mono text-2xl sm:text-3xl font-black text-blue-400 tracking-wider drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] select-none">
                  &lt;/&gt;
                </span>
              </div>
            </div>

            {/* Connecting Dotted Curves (SVG) */}
            <svg
              className="hidden sm:block absolute left-36 lg:left-40 top-1/2 -translate-y-1/2 w-16 h-28 pointer-events-none text-blue-500/40"
              viewBox="0 0 60 110"
              fill="none"
            >
              <path
                d="M 0 55 C 30 55, 30 15, 60 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M 0 55 C 30 55, 30 55, 60 55"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M 0 55 C 30 55, 30 95, 60 95"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Floating Pills Column */}
            <div className="flex flex-col gap-2.5 sm:gap-3 z-20">
              {/* 1. Video Lessons */}
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0C1A4A]/90 border border-blue-400/30 backdrop-blur-md shadow-md shadow-black/40 text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Play size={11} className="fill-white translate-x-0.5" />
                </span>
                <span>Video Lessons</span>
              </div>

              {/* 2. Practice Problems */}
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0C1A4A]/90 border border-blue-400/30 backdrop-blur-md shadow-md shadow-black/40 text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <FileCode size={12} className="text-white" />
                </span>
                <span>Practice Problems</span>
              </div>

              {/* 3. Notes & Resources */}
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0C1A4A]/90 border border-blue-400/30 backdrop-blur-md shadow-md shadow-black/40 text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <BookOpen size={12} className="text-white" />
                </span>
                <span>Notes &amp; Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
