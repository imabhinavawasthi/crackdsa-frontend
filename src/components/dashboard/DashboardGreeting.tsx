"use client";

import React from "react";
import Image from "next/image";

interface DashboardGreetingProps {
  firstName: string;
}

export default function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-100/90 dark:border-blue-900/40 bg-gradient-to-r from-[#EFF6FF] via-[#E1EEFE] to-[#EFF6FF] dark:from-[#070D1E] dark:via-[#0B1530] dark:to-[#12224A] text-gray-900 dark:text-white p-6 sm:p-8 lg:p-9 shadow-sm shadow-blue-500/5 dark:shadow-lg dark:shadow-blue-950/25 min-h-[165px] sm:min-h-[185px] flex flex-col justify-center transition-colors">
      
      {/* ─── CSS KEYFRAME ANIMATIONS FOR SOARING BIRDS ──────────────── */}
      <style>{`
        @keyframes birdGlideA {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          30% {
            transform: translate3d(14px, -6px, 0) rotate(-2deg) scale(1.02);
          }
          70% {
            transform: translate3d(7px, 4px, 0) rotate(2deg) scale(0.98);
          }
        }
        @keyframes birdGlideB {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          40% {
            transform: translate3d(-12px, -5px, 0) rotate(-3deg);
          }
          80% {
            transform: translate3d(6px, 3px, 0) rotate(2deg);
          }
        }
        @keyframes birdGlideC {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(10px, -3px, 0);
          }
        }
        .anim-bird-a {
          animation: birdGlideA 12s ease-in-out infinite;
          will-change: transform;
        }
        .anim-bird-b {
          animation: birdGlideB 15s ease-in-out infinite;
          will-change: transform;
        }
        .anim-bird-c {
          animation: birdGlideC 18s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-bird-a, .anim-bird-b, .anim-bird-c {
            animation: none !important;
          }
        }
      `}</style>

      {/* ─── AMBIENT NIGHT SKY STARS (Only in dark mode) ─────────────── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden opacity-0 dark:opacity-80 transition-opacity">
        <svg viewBox="0 0 1000 200" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <circle cx="60" cy="30" r="1.2" fill="#93C5FD" opacity="0.6" />
          <circle cx="180" cy="20" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="340" cy="40" r="1.2" fill="#60A5FA" opacity="0.5" />
          <circle cx="480" cy="25" r="1" fill="#BFDBFE" opacity="0.7" />
          <circle cx="680" cy="30" r="1.2" fill="#FFFFFF" opacity="0.5" />
          <circle cx="820" cy="45" r="1" fill="#93C5FD" opacity="0.7" />
          <circle cx="940" cy="20" r="1.2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>

      {/* ─── LIGHT THEME: NATURAL MOUNTAIN & CLOUDS ILLUSTRATION ───────── */}
      <div className="block dark:hidden absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-12 md:right-24 lg:right-32 xl:right-48 bottom-0 h-full w-[310px] sm:w-[370px] md:w-[430px] pointer-events-none select-none z-0">
        <div className="relative w-full h-full flex items-end justify-center">
          {/* Birds positioned relative to mountain in the open sky to the left of the peak */}
          <div className="absolute top-4 left-[28%] anim-bird-b z-10">
            <svg viewBox="0 0 32 16" fill="currentColor" className="w-4 sm:w-5 h-auto text-blue-800/55 drop-shadow-2xs">
              <path d="M1 8 C6 2 12 1 16 5 C20 1 26 2 31 8 C24 6 19 7 16 11 C13 7 8 6 1 8 Z" />
            </svg>
          </div>
          <div className="absolute top-7 left-[38%] anim-bird-a z-10">
            <svg viewBox="0 0 32 16" fill="currentColor" className="w-5 sm:w-6 h-auto text-blue-900/65 drop-shadow-2xs">
              <path d="M1 8 C6 2 12 1 16 5 C20 1 26 2 31 8 C24 6 19 7 16 11 C13 7 8 6 1 8 Z" />
            </svg>
          </div>
          <div className="absolute top-9 left-[16%] anim-bird-c z-10">
            <svg viewBox="0 0 32 16" fill="currentColor" className="w-3 sm:w-3.5 h-auto text-blue-700/45">
              <path d="M1 8 C6 2 12 1 16 5 C20 1 26 2 31 8 C24 6 19 7 16 11 C13 7 8 6 1 8 Z" />
            </svg>
          </div>

          <Image
            src="/images/dashboard/mountain-smooth.png"
            alt="Mountain Summit Peak with Clouds"
            width={660}
            height={304}
            className="w-full h-auto max-h-full object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* ─── DARK THEME: VECTOR SUMMIT ARTWORK WITH WHITE FLAG ───────── */}
      <div className="hidden dark:block absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-12 md:right-24 lg:right-32 xl:right-48 bottom-0 h-full w-[290px] sm:w-[360px] md:w-[420px] pointer-events-none select-none z-0">
        {/* Dark theme soaring birds */}
        <div className="absolute top-4 left-[28%] anim-bird-b z-10">
          <svg viewBox="0 0 32 16" fill="currentColor" className="w-4 sm:w-5 h-auto text-blue-300/50 drop-shadow-2xs">
            <path d="M1 8 C6 2 12 1 16 5 C20 1 26 2 31 8 C24 6 19 7 16 11 C13 7 8 6 1 8 Z" />
          </svg>
        </div>
        <div className="absolute top-7 left-[38%] anim-bird-a z-10">
          <svg viewBox="0 0 32 16" fill="currentColor" className="w-5 sm:w-6 h-auto text-blue-200/60 drop-shadow-2xs">
            <path d="M1 8 C6 2 12 1 16 5 C20 1 26 2 31 8 C24 6 19 7 16 11 C13 7 8 6 1 8 Z" />
          </svg>
        </div>
        <div className="absolute top-9 left-[16%] anim-bird-c z-10">
          <svg viewBox="0 0 32 16" fill="currentColor" className="w-3 sm:w-3.5 h-auto text-blue-300/40">
            <path d="M1 8 C6 2 12 1 16 5 C20 1 26 2 31 8 C24 6 19 7 16 11 C13 7 8 6 1 8 Z" />
          </svg>
        </div>

        <svg
          viewBox="0 0 440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          className="w-full h-full"
        >
          {/* Distant Mountain Layer */}
          <polygon
            points="20,180 130,90 240,180"
            fill="#0F244C"
            opacity="0.85"
          />
          <polygon
            points="200,180 320,85 430,180"
            fill="#132B5B"
            opacity="0.9"
          />

          {/* Midground Mountain Layer */}
          <polygon
            points="80,180 180,68 300,180"
            fill="#1E3A8A"
            opacity="0.9"
          />
          <polygon
            points="180,68 300,180 245,180"
            fill="#172554"
            opacity="0.95"
          />

          {/* Primary Sharp Peak Facets (The Summit) */}
          <polygon
            points="130,180 220,52 270,180"
            fill="#2563EB"
            opacity="0.95"
          />
          <polygon
            points="220,52 270,180 236,180"
            fill="#1D4ED8"
            opacity="0.95"
          />
          <polygon
            points="220,52 236,180 360,180"
            fill="#1E40AF"
            opacity="0.95"
          />
          <polygon
            points="220,52 242,115 232,180"
            fill="#3B82F6"
            opacity="0.8"
          />
          <polygon
            points="220,52 229,90 220,135"
            fill="#60A5FA"
            opacity="0.6"
          />

          {/* Summit Flagpole */}
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
          <circle cx="220" cy="14" r="8" fill="#60A5FA" opacity="0.3" />
        </svg>
      </div>

      {/* ─── CONTENT LAYER ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Greeting & Description */}
        <div className="space-y-1.5 max-w-xl">
          <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
            Welcome back,
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0A1629] dark:text-white leading-tight">
            {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-200/80 font-medium leading-relaxed max-w-md pt-0.5">
            Keep learning, keep practicing, and get closer to your goals.
          </p>
        </div>

        {/* Right: Floating Quote on the Sky */}
        <div className="md:text-right shrink-0 max-w-xs pt-1 sm:pt-0">
          <p className="text-xs sm:text-sm font-semibold italic text-[#0F244C] dark:text-blue-100/90 leading-relaxed">
            &ldquo;Small consistent steps lead to big results.&rdquo;
          </p>
          <span className="block mt-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300/80">
            — CRACKDSA
          </span>
        </div>
      </div>
    </div>
  );
}
