"use client";

import React from "react";
import { Video, HelpCircle, FileCode, CheckCircle2 } from "lucide-react";

export function LiveClassesHeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-[#060E2E] text-white border border-blue-900/40 shadow-xl">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Content */}
        <div className="flex-1 max-w-2xl space-y-3 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs bg-blue-500" />
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
              LIVE CLASSES
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-[1.2]">
            Learn Live with Top Mentors
          </h1>

          <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
            Interactive live sessions, doubt clearing, contest discussions and real-time problem solving.
          </p>
        </div>

        {/* Right: Glass Card & Connected Feature Badges */}
        <div className="relative w-full lg:w-auto shrink-0 flex items-center justify-center lg:justify-end">
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Glowing Live Camera Stacked Glass Card */}
            <div className="relative w-28 h-24 sm:w-32 sm:h-28 flex items-center justify-center">
              <div className="absolute w-24 h-20 rounded-2xl bg-blue-500/15 border border-blue-400/30 -rotate-6 -translate-x-2" />
              <div className="relative z-10 w-26 h-22 rounded-2xl bg-gradient-to-br from-blue-900/70 to-blue-950/90 border border-blue-400/50 shadow-2xl flex items-center justify-center">
                <Video size={30} className="text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              </div>
            </div>

            {/* Connecting Dotted Curves (SVG) */}
            <svg
              className="hidden sm:block w-12 h-24 pointer-events-none text-blue-500/40"
              viewBox="0 0 50 100"
              fill="none"
            >
              <path
                d="M 0 50 C 25 50, 25 15, 50 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M 0 50 C 25 50, 25 50, 50 50"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M 0 50 C 25 50, 25 85, 50 85"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Floating Pills Column */}
            <div className="flex flex-col gap-2 z-20">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C1A4A]/90 border border-blue-400/30 backdrop-blur-md shadow-md text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={12} className="text-white" />
                </span>
                <span>Live Problem Solving</span>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C1A4A]/90 border border-blue-400/30 backdrop-blur-md shadow-md text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                  <HelpCircle size={12} className="text-white" />
                </span>
                <span>Ask Doubts in Real Time</span>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C1A4A]/90 border border-blue-400/30 backdrop-blur-md shadow-md text-xs font-semibold text-white whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                  <FileCode size={12} className="text-white" />
                </span>
                <span>Recorded Archives &amp; Notes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
