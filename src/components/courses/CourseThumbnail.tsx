"use client";

import React, { useState } from "react";
import { CourseSummary } from "@/types/course";

interface CourseThumbnailProps {
  course: CourseSummary;
  className?: string;
}

export function CourseThumbnail({ course, className = "" }: CourseThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = course.metadata?.thumbnail_url;

  // Real thumbnail image if provided
  if (thumbnailUrl && !imageError) {
    return (
      <div className={`relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={`${course.title} thumbnail`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  const slug = (course.slug || "").toLowerCase();
  const category = (course.category || "").toLowerCase();
  const title = (course.title || "").toLowerCase();

  // 1. Python course
  if (slug.includes("python") || title.includes("python")) {
    return (
      <div className={`relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#0a0f24] via-[#09122c] to-[#040714] flex items-center justify-center select-none ${className}`}>
        <div className="absolute w-36 h-36 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute w-28 h-28 bg-yellow-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 110 110" className="w-full h-full" fill="none">
            <path
              d="M 54.5 10 C 27.2 10 28.9 21.8 28.9 21.8 L 29.0 34.1 L 55.4 34.1 L 55.4 37.8 L 18.5 37.8 C 18.5 37.8 10 36.8 10 64.1 C 10 91.4 17.4 89.9 17.4 89.9 L 24.8 89.9 L 24.8 79.5 C 24.8 79.5 24.4 67.2 36.9 67.2 L 63.1 67.2 C 63.1 67.2 74.9 67.6 74.9 55.8 L 74.9 23.3 C 74.9 23.3 76.5 10 54.5 10 Z"
              fill="#3776AB"
            />
            <circle cx="38.5" cy="20.5" r="3.8" fill="#FFFFFF" />
            <path
              d="M 55.5 100 C 82.8 100 81.1 88.2 81.1 88.2 L 81.0 75.9 L 54.6 75.9 L 54.6 72.2 L 91.5 72.2 C 91.5 72.2 100 73.2 100 45.9 C 100 18.6 92.6 20.1 92.6 20.1 L 85.2 20.1 L 85.2 30.5 C 85.2 30.5 85.6 42.8 73.1 42.8 L 46.9 42.8 C 46.9 42.8 35.1 42.4 35.1 54.2 L 35.1 86.7 C 35.1 86.7 33.5 100 55.5 100 Z"
              fill="#FFD438"
            />
            <circle cx="71.5" cy="89.5" r="3.8" fill="#1e3a5f" />
          </svg>
        </div>
      </div>
    );
  }

  // 2. CS Fundamentals / OS / OOPs
  if (slug.includes("cs") || slug.includes("os") || slug.includes("oops") || category.includes("interview-prep")) {
    return (
      <div className={`relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#051c14] via-[#061710] to-[#020907] flex items-center justify-center select-none ${className}`}>
        <div className="absolute w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_20px_rgba(16,185,129,0.5)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400" fill="none">
            <rect
              x="18"
              y="18"
              width="64"
              height="46"
              rx="8"
              stroke="#10B981"
              strokeWidth="4"
              fill="#06281e"
              fillOpacity="0.6"
            />
            <rect
              x="26"
              y="26"
              width="48"
              height="30"
              rx="4"
              stroke="#34D399"
              strokeWidth="2.5"
              fill="#08382b"
              fillOpacity="0.4"
            />
            <path
              d="M 50 64 L 50 76"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 36 78 L 64 78"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="32"
              y1="41"
              x2="44"
              y2="41"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  // 3. System Design
  if (slug.includes("system-design") || title.includes("system design") || category.includes("system-design")) {
    return (
      <div className={`relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#07162e] via-[#051125] to-[#020712] flex items-center justify-center select-none ${className}`}>
        <div className="absolute w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_20px_rgba(59,130,246,0.5)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400" fill="none">
            <rect
              x="41"
              y="18"
              width="18"
              height="18"
              rx="4"
              stroke="#38BDF8"
              strokeWidth="3.5"
              fill="#0c2340"
            />
            <line x1="50" y1="36" x2="50" y2="50" stroke="#38BDF8" strokeWidth="3" />
            <line x1="22" y1="50" x2="78" y2="50" stroke="#38BDF8" strokeWidth="3" />
            <line x1="22" y1="50" x2="22" y2="62" stroke="#38BDF8" strokeWidth="3" />
            <line x1="50" y1="50" x2="50" y2="62" stroke="#38BDF8" strokeWidth="3" />
            <line x1="78" y1="50" x2="78" y2="62" stroke="#38BDF8" strokeWidth="3" />
            <rect x="13" y="62" width="18" height="18" rx="4" stroke="#38BDF8" strokeWidth="3.5" fill="#0c2340" />
            <rect x="41" y="62" width="18" height="18" rx="4" stroke="#38BDF8" strokeWidth="3.5" fill="#0c2340" />
            <rect x="69" y="62" width="18" height="18" rx="4" stroke="#38BDF8" strokeWidth="3.5" fill="#0c2340" />
          </svg>
        </div>
      </div>
    );
  }

  // 4. Default / DSA Courses
  return (
    <div className={`relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#0c132c] via-[#09153a] to-[#040817] flex items-center justify-center select-none ${className}`}>
      <div className="absolute w-44 h-44 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-24 h-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <rect
            x="20"
            y="25"
            width="46"
            height="18"
            rx="6"
            transform="rotate(-40 43 34)"
            fill="#1E40AF"
            fillOpacity="0.4"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <rect
            x="36"
            y="48"
            width="38"
            height="16"
            rx="6"
            transform="rotate(-40 55 56)"
            fill="#1D4ED8"
            fillOpacity="0.5"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <rect
            x="22"
            y="42"
            width="48"
            height="22"
            rx="8"
            transform="rotate(-40 46 53)"
            fill="#2563EB"
            stroke="#93C5FD"
            strokeWidth="2.5"
            filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))"
          />
          <circle cx="74" cy="28" r="4" fill="#60A5FA" filter="drop-shadow(0 0 6px #60A5FA)" />
          <circle cx="24" cy="70" r="3" fill="#3B82F6" filter="drop-shadow(0 0 5px #3B82F6)" />
        </svg>
      </div>
    </div>
  );
}
