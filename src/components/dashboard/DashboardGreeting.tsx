"use client";

import React from "react";

interface DashboardGreetingProps {
  firstName: string;
}

export default function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-900/40 bg-gradient-to-r from-[#070D1E] via-[#0B1530] to-[#12224A] text-white p-6 sm:p-8 lg:p-9 shadow-lg shadow-blue-950/25 min-h-[160px] sm:min-h-[175px] flex flex-col justify-center">
      
      {/* ─── AMBIENT NIGHT SKY STARS (Full Background) ─────────────── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 1000 200" fill="none" className="w-full h-full opacity-80" preserveAspectRatio="none">
          <circle cx="60" cy="30" r="1.2" fill="#93C5FD" opacity="0.6" />
          <circle cx="180" cy="20" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="340" cy="40" r="1.2" fill="#60A5FA" opacity="0.5" />
          <circle cx="480" cy="25" r="1" fill="#BFDBFE" opacity="0.7" />
          <circle cx="680" cy="30" r="1.2" fill="#FFFFFF" opacity="0.5" />
          <circle cx="820" cy="45" r="1" fill="#93C5FD" opacity="0.7" />
          <circle cx="940" cy="20" r="1.2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>

      {/* ─── STYLIZED MOUNTAIN PEAK ARTWORK WITH SUMMIT FLAG (Always 100% Visible) ─── */}
      <div className="absolute right-4 sm:right-16 md:right-28 lg:right-36 xl:right-56 bottom-0 h-full w-[260px] sm:w-[340px] md:w-[420px] pointer-events-none select-none z-0">
        <svg
          viewBox="0 0 440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          className="w-full h-full"
        >
          {/* Distant Mountain Layer (Navy / Midnight) */}
          <polygon
            points="20,180 130,90 240,180"
            fill="#0F244C"
            opacity="0.65"
          />
          <polygon
            points="200,180 320,85 430,180"
            fill="#132B5B"
            opacity="0.75"
          />

          {/* Midground Mountain Layer */}
          <polygon
            points="80,180 180,68 300,180"
            fill="#1E3A8A"
            opacity="0.8"
          />
          <polygon
            points="180,68 300,180 245,180"
            fill="#172554"
            opacity="0.9"
          />

          {/* Primary Sharp Peak Facets (The Summit) */}
          {/* Left lit facet */}
          <polygon
            points="130,180 220,52 270,180"
            fill="#2563EB"
            opacity="0.85"
          />
          {/* Center ridge facet */}
          <polygon
            points="220,52 270,180 236,180"
            fill="#1D4ED8"
            opacity="0.95"
          />
          {/* Right shadow facet */}
          <polygon
            points="220,52 236,180 360,180"
            fill="#1E40AF"
            opacity="0.88"
          />
          {/* Ridge Highlights */}
          <polygon
            points="220,52 242,115 232,180"
            fill="#3B82F6"
            opacity="0.7"
          />
          <polygon
            points="220,52 229,90 220,135"
            fill="#60A5FA"
            opacity="0.5"
          />

          {/* Summit Flagpole (Always prominent & unclipped) */}
          <line
            x1="220"
            y1="52"
            x2="220"
            y2="14"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* White Waving Summit Flag */}
          <polygon
            points="220,16 264,25 220,34"
            fill="#FFFFFF"
          />

          {/* Glowing Beacon Atop Summit */}
          <circle cx="220" cy="14" r="3.5" fill="#93C5FD" opacity="0.95" />
          <circle cx="220" cy="14" r="8" fill="#60A5FA" opacity="0.4" />
        </svg>
      </div>

      {/* ─── CONTENT LAYER ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Greeting & Description */}
        <div className="space-y-1.5 max-w-xl">
          <p className="text-lg sm:text-xl font-bold text-slate-300">
            Welcome back,
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/80 font-medium leading-relaxed max-w-md pt-0.5">
            Keep learning, keep practicing, and get closer to your goals.
          </p>
        </div>

        {/* Right: Floating Quote on the Sky */}
        <div className="md:text-right shrink-0 max-w-xs pt-1 sm:pt-0">
          <p className="text-xs sm:text-sm font-semibold italic text-blue-100/90 leading-relaxed">
            &ldquo; Small consistent steps lead to big results. &rdquo;
          </p>
          <span className="block mt-1 text-[11px] font-bold uppercase tracking-wider text-blue-300/80">
            — CrackDSA
          </span>
        </div>
      </div>
    </div>
  );
}
