"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Code2, ArrowRight } from "lucide-react";
import { DSASheet } from "@/types/dsa-sheet";

// ─── Company Logos for CompanyWise Sheet ────────────────────────────────────────
function GoogleLogo({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Google">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  );
}

function AmazonLogo({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 448 512" aria-label="Amazon">
      <path fill="currentColor" d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5c0 109.5 138.3 114 183.5 43.2c6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32C140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5c40.7-.1 35.5 29.8 35.5 69.1m0 86.8c0 80-84.2 68-84.2 17.2c0-47.2 50.5-56.7 84.2-57.8z"/>
      <path fill="#FF9900" d="m393.2 413c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12m39.8 2.2c-6.5 15.8-16 26.8-21.2 31c-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2c-10.8 1-13 2-14-.3c-2.3-5.7 21.7-15.5 37.5-17.5c15.7-1.8 41-.8 46 5.7c3.7 5.1 0 27.1-6.5 43.1"/>
    </svg>
  );
}

function MicrosoftLogo({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Microsoft" fill="none">
      <rect x="2" y="2" width="9.5" height="9.5" rx="1.5" fill="#F25022"/>
      <rect x="12.5" y="2" width="9.5" height="9.5" rx="1.5" fill="#7FBA00"/>
      <rect x="2" y="12.5" width="9.5" height="9.5" rx="1.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="1.5" fill="#FFB900"/>
    </svg>
  );
}

function MetaLogo({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0467DF" aria-label="Meta">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>
    </svg>
  );
}

// ─── 3D High-Fidelity Themed Artwork Graphics ──────────────────────────────────
function GraphNodesGraphic() {
  return (
    <svg className="size-20 drop-shadow-md" viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="nodeBlue1" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </radialGradient>
        <radialGradient id="nodeBlue2" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="60%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>
        <radialGradient id="nodeBlue3" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E40AF" />
        </radialGradient>
      </defs>
      {/* Connection Arcs */}
      <line x1="26" y1="64" x2="62" y2="38" stroke="#38BDF8" strokeWidth="3" opacity="0.8" />
      <line x1="62" y1="38" x2="80" y2="72" stroke="#60A5FA" strokeWidth="2.5" opacity="0.8" />
      <line x1="26" y1="64" x2="80" y2="72" stroke="#0284C7" strokeWidth="2" opacity="0.5" strokeDasharray="4 3" />
      <line x1="42" y1="24" x2="62" y2="38" stroke="#38BDF8" strokeWidth="2" opacity="0.6" />
      {/* Node 1 */}
      <circle cx="42" cy="24" r="6" fill="url(#nodeBlue1)" stroke="#E0F2FE" strokeWidth="1.5" />
      {/* Node 2 */}
      <circle cx="26" cy="64" r="9.5" fill="url(#nodeBlue3)" stroke="#BAE6FD" strokeWidth="2" />
      {/* Node 3 (Main glowing sphere) */}
      <circle cx="62" cy="38" r="13" fill="url(#nodeBlue2)" stroke="#FFFFFF" strokeWidth="2.5" />
      <ellipse cx="58" cy="33" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 58 33)" />
      {/* Node 4 */}
      <circle cx="80" cy="72" r="7.5" fill="url(#nodeBlue1)" stroke="#BAE6FD" strokeWidth="1.5" />
    </svg>
  );
}

function PodiumFlagGraphic() {
  return (
    <svg className="size-20 drop-shadow-md" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="stepGreen1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="stepGreen2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="stepGreen3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="flagGreen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* 3D Stepped Blocks */}
      <rect x="18" y="65" width="62" height="18" rx="4" fill="url(#stepGreen3)" />
      <rect x="18" y="65" width="62" height="6" rx="3" fill="#059669" opacity="0.8" />
      <rect x="32" y="48" width="48" height="18" rx="4" fill="url(#stepGreen2)" />
      <rect x="32" y="48" width="48" height="6" rx="3" fill="#10B981" opacity="0.8" />
      <rect x="48" y="31" width="32" height="18" rx="4" fill="url(#stepGreen1)" />
      <rect x="48" y="31" width="32" height="5" rx="2" fill="#6EE7B7" opacity="0.9" />
      {/* Flagpole */}
      <line x1="56" y1="31" x2="56" y2="10" stroke="#F0FDF4" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="56" cy="10" r="2.5" fill="#FCD34D" />
      {/* Waving Flag */}
      <path d="M56 12 C64 9 70 16 78 13 L78 26 C70 29 64 22 56 25 Z" fill="url(#flagGreen)" />
    </svg>
  );
}

function RocketGraphic() {
  return (
    <svg className="size-20 drop-shadow-md -rotate-12" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="rocketFin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="rocketFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      {/* Flame */}
      <path d="M26 62 C20 70 18 84 18 84 C18 84 32 82 40 76 Z" fill="url(#rocketFlame)" />
      <path d="M25 64 C22 70 21 78 21 78 C21 78 29 77 34 73 Z" fill="#FEF08A" />
      {/* Fins */}
      <path d="M30 46 L18 52 L22 62 L36 58 Z" fill="url(#rocketFin)" />
      <path d="M46 62 L50 74 L60 76 L54 64 Z" fill="url(#rocketFin)" />
      {/* Fuselage */}
      <path d="M64 18 C50 20 36 32 30 48 L44 62 C60 56 72 42 74 28 C74 18 69 16 64 18 Z" fill="url(#rocketBody)" />
      <path d="M68 21 C72 26 73 32 71 38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Window */}
      <circle cx="54" cy="38" r="6" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="52" cy="36" r="2" fill="#BAE6FD" />
      {/* Nozzle */}
      <polygon points="32,53 26,62 38,65 39,58" fill="#4B5563" />
    </svg>
  );
}

function BuildingGraphic() {
  return (
    <svg className="size-20 drop-shadow-md" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="towerPurple1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="60%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="towerPurple2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="60%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
      </defs>
      {/* Left Tower */}
      <rect x="22" y="38" width="24" height="46" rx="4" fill="url(#towerPurple1)" />
      <rect x="22" y="38" width="24" height="4" rx="2" fill="#DDD6FE" opacity="0.6" />
      {/* Right Tower */}
      <rect x="50" y="24" width="26" height="60" rx="4" fill="url(#towerPurple2)" />
      <rect x="50" y="24" width="26" height="4" rx="2" fill="#F3E8FF" opacity="0.8" />
      {/* Spire */}
      <line x1="63" y1="24" x2="63" y2="12" stroke="#E9D5FF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="63" cy="11" r="2.5" fill="#F43F5E" />
      {/* Windows */}
      <circle cx="28" cy="48" r="1.8" fill="#F5F3FF" opacity="0.9" />
      <circle cx="38" cy="48" r="1.8" fill="#F5F3FF" opacity="0.9" />
      <circle cx="28" cy="57" r="1.8" fill="#F5F3FF" opacity="0.9" />
      <circle cx="38" cy="57" r="1.8" fill="#F5F3FF" opacity="0.9" />
      <circle cx="28" cy="66" r="1.8" fill="#F5F3FF" opacity="0.9" />
      <circle cx="38" cy="66" r="1.8" fill="#F5F3FF" opacity="0.9" />
      <circle cx="57" cy="34" r="2" fill="#FFFFFF" />
      <circle cx="67" cy="34" r="2" fill="#FFFFFF" />
      <circle cx="57" cy="44" r="2" fill="#FFFFFF" />
      <circle cx="67" cy="44" r="2" fill="#FFFFFF" />
      <circle cx="57" cy="54" r="2" fill="#FFFFFF" />
      <circle cx="67" cy="54" r="2" fill="#FFFFFF" />
      <circle cx="57" cy="64" r="2" fill="#FFFFFF" />
      <circle cx="67" cy="64" r="2" fill="#FFFFFF" />
    </svg>
  );
}

function LayersGraphic() {
  return (
    <svg className="size-20 drop-shadow-md" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="layerTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="60%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="layerMid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="60%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
        <linearGradient id="layerBot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="60%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
      </defs>
      {/* Bottom Layer */}
      <polygon points="50,68 76,55 50,42 24,55" fill="url(#layerBot)" />
      <polygon points="50,68 76,55 76,60 50,73" fill="#881337" />
      <polygon points="50,68 24,55 24,60 50,73" fill="#4C0519" />
      {/* Middle Layer */}
      <polygon points="50,54 76,41 50,28 24,41" fill="url(#layerMid)" />
      <polygon points="50,54 76,41 76,46 50,59" fill="#9F1239" />
      <polygon points="50,54 24,41 24,46 50,59" fill="#881337" />
      {/* Top Layer */}
      <polygon points="50,40 76,27 50,14 24,27" fill="url(#layerTop)" />
      <polygon points="50,40 76,27 76,32 50,45" fill="#BE123C" />
      <polygon points="50,40 24,27 24,32 50,45" fill="#9F1239" />
      <line x1="50" y1="16" x2="74" y2="28" stroke="#FFE4E6" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}

function TrophyGraphic() {
  return (
    <svg className="size-20 drop-shadow-md" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="40%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <linearGradient id="trophyCup" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="40%" stopColor="#67E8F9" />
          <stop offset="70%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      {/* Cup Body */}
      <path d="M30 24 H70 V42 C70 54 60 62 50 62 C40 62 30 54 30 42 Z" fill="url(#trophyCup)" />
      <ellipse cx="50" cy="24" rx="20" ry="3.5" fill="#CFFAFE" />
      <path d="M42 27 C42 36 44 48 48 54" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      {/* Handles */}
      <path d="M30 28 H20 C16 28 14 31 14 35 C14 44 22 50 30 50" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M70 28 H80 C84 28 86 31 86 35 C86 44 78 50 70 50" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
      {/* Stem */}
      <rect x="45" y="62" width="10" height="12" fill="#0891B2" />
      {/* Base */}
      <path d="M34 74 H66 L70 82 H30 Z" fill="url(#trophyGold)" />
      <rect x="30" y="82" width="40" height="4" rx="2" fill="#155E75" />
      {/* Star */}
      <path d="M50 36 L52 42 L58 42 L53 46 L55 52 L50 48 L45 52 L47 46 L42 42 L48 42 Z" fill="#FFFFFF" />
    </svg>
  );
}

// ─── Theme Config by Sheet ──────────────────────────────────────────────────────
interface SheetTheme {
  headerBg: string;
  badge1: string;
  badge2: string;
  graphic: React.ReactNode;
  btnClass: string;
}

function getSheetTheme(idOrSlug: string, title: string): SheetTheme {
  const t = `${idOrSlug} ${title}`.toLowerCase();

  if (t.includes("pattern")) {
    return {
      headerBg: "bg-gradient-to-r from-[#0d1b3e] via-[#102a5c] to-[#13326f]",
      badge1: "PATTERN BASED",
      badge2: "INTERMEDIATE",
      graphic: <GraphNodesGraphic />,
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25",
    };
  }

  if (t.includes("0 to hero") || t.includes("hero")) {
    return {
      headerBg: "bg-gradient-to-r from-[#042f2e] via-[#064e3b] to-[#047857]",
      badge1: "COMPREHENSIVE",
      badge2: "BEGINNER",
      graphic: <PodiumFlagGraphic />,
      btnClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/60",
    };
  }

  if (t.includes("sprint") || t.includes("75") || t.includes("revision")) {
    return {
      headerBg: "bg-gradient-to-r from-[#451a03] via-[#78350f] to-[#92400e]",
      badge1: "INTERVIEW SPRINT",
      badge2: "INTERMEDIATE",
      graphic: <RocketGraphic />,
      btnClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/60 dark:border-amber-800/60",
    };
  }

  if (t.includes("company")) {
    return {
      headerBg: "bg-gradient-to-r from-[#2e1065] via-[#3b0764] to-[#4c1d95]",
      badge1: "COMPANY WISE",
      badge2: "ALL LEVELS",
      graphic: <BuildingGraphic />,
      btnClass: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200/60 dark:border-purple-800/60",
    };
  }

  if (t.includes("topic")) {
    return {
      headerBg: "bg-gradient-to-r from-[#4c0519] via-[#831843] to-[#9f1239]",
      badge1: "TOPIC WISE",
      badge2: "BEGINNER",
      graphic: <LayersGraphic />,
      btnClass: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-800/60",
    };
  }

  return {
    headerBg: "bg-gradient-to-r from-[#083344] via-[#0e7490] to-[#0369a1]",
    badge1: "CONTEST PREP",
    badge2: "INTERMEDIATE",
    graphic: <TrophyGraphic />,
    btnClass: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 border border-cyan-200/60 dark:border-cyan-800/60",
  };
}

export interface DSASheetCardProps {
  sheet: DSASheet | {
    id: string;
    title: string;
    description: string;
    total_topics?: number;
    total_problems?: number;
    tags?: string[];
    href?: string;
    level?: string;
  };
}

export default function DSASheetCard({ sheet }: DSASheetCardProps) {
  const theme = getSheetTheme(sheet.id, sheet.title);

  const href = (sheet as any).href || (
    sheet.id === "newbie-to-expert-cp" || sheet.id === "newbie-to-expert"
      ? "/cp/newbie-to-expert"
      : sheet.id === "company-wise-sheet"
      ? "/practice/companies"
      : sheet.id === "topic-wise-sheet"
      ? "/practice/topics"
      : `/dsa-sheet/${sheet.id}`
  );

  const isCompanyWise = sheet.id.toLowerCase().includes("company") || sheet.title.toLowerCase().includes("company");

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 select-none"
    >
      {/* ─── 1. TOP THEMED BANNER WITH NOTCH & 3D ARTWORK ──────────────────── */}
      <div className={`relative h-28 sm:h-32 w-full p-4 overflow-hidden ${theme.headerBg} flex items-start justify-between`}>
        {/* Left Badges */}
        <div className="flex flex-wrap items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/15 text-white backdrop-blur-md border border-white/20">
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
            {theme.badge1}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/25 text-white/90 backdrop-blur-md border border-white/10">
            {theme.badge2}
          </span>
        </div>

        {/* Notch cutout pocket */}
        <div className="absolute right-0 bottom-0 w-28 h-20 bg-white dark:bg-gray-900 rounded-tl-3xl z-0 transition-colors" />

        {/* 3D Graphic sitting in notch pocket */}
        <div className="absolute right-2 -bottom-1 z-10 transition-transform duration-300 group-hover:scale-105">
          {theme.graphic}
        </div>
      </div>

      {/* ─── 2. CARD BODY ─────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {sheet.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-normal">
            {sheet.description || "Curated problems to build foundational and advanced problem solving skills."}
          </p>

          {/* Topics & Problems Row with upgraded badge styling */}
          <div className="flex items-center gap-2.5 pt-1 text-xs font-bold">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100/80 dark:border-blue-900/40">
              <BookOpen size={13.5} className="text-blue-600 dark:text-blue-400" />
              <span>{sheet.total_topics || 12} Topics</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/80 dark:border-indigo-900/40">
              <Code2 size={13.5} className="text-indigo-600 dark:text-indigo-400" />
              <span>{sheet.total_problems || 150} Problems</span>
            </div>
          </div>

          {/* Tags or Company Badges */}
          <div className="pt-1.5">
            {isCompanyWise ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                  <GoogleLogo className="size-3.5" /> Google
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                  <AmazonLogo className="size-3.5 text-gray-900 dark:text-white" /> Amazon
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                  <MicrosoftLogo className="size-3.5" /> Microsoft
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                  <MetaLogo className="size-3.5" /> Meta
                </span>
              </div>
            ) : sheet.tags && sheet.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {sheet.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/80 px-2.5 py-1 rounded-lg"
                  >
                    # {tag}
                  </span>
                ))}
                {sheet.tags.length > 2 && (
                  <span className="text-[11px] font-semibold text-gray-400">
                    + more
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* ─── 3. CTA BUTTON ───────────────────────────────────────────────── */}
        <div className="pt-2">
          <div
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${theme.btnClass}`}
          >
            <span>Start Practice</span>
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
