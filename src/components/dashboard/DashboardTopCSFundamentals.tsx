"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronRight, 
  Cpu, 
  Boxes, 
  Database, 
  Network, 
  FileText
} from "lucide-react";
import { CS_FUNDAMENTALS_TOPICS } from "@/config/cs-fundamentals.config";

function getTopicVisual(slug: string, title: string) {
  const s = `${slug} ${title}`.toLowerCase();

  if (s.includes("operating-system") || s.includes("os")) {
    return {
      icon: Cpu,
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20 dark:border-blue-500/30",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-800",
      hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      highlights: "Processes • Deadlocks • Memory",
    };
  }
  if (s.includes("oops") || s.includes("object oriented")) {
    return {
      icon: Boxes,
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20 dark:border-purple-500/30",
      hoverBorder: "hover:border-purple-300 dark:hover:border-purple-800",
      hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      highlights: "4 Pillars • SOLID • Patterns",
    };
  }
  if (s.includes("dbms") || s.includes("database")) {
    return {
      icon: Database,
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-800",
      hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      highlights: "ACID • Indexing • SQL",
    };
  }
  if (s.includes("network") || s.includes("cn")) {
    return {
      icon: Network,
      bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/20 dark:border-cyan-500/30",
      hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-800",
      hoverText: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
      highlights: "TCP/IP • DNS • OSI Layer",
    };
  }

  return {
    icon: FileText,
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20 dark:border-amber-500/30",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-800",
    hoverText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    highlights: "Key Interview Revision",
  };
}

export default function DashboardTopCSFundamentals() {
  const topics = CS_FUNDAMENTALS_TOPICS.slice(0, 3);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between h-full group/card">
      {/* Ambient micro-glow */}
      <div className="absolute -top-12 -right-12 size-32 rounded-full bg-emerald-500/5 dark:bg-emerald-400/5 blur-2xl pointer-events-none" />

      <div>
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cpu size={15} />
            </div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
              CS Fundamentals
            </h2>
          </div>

          <Link
            href="/cs-fundamentals"
            className="group inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── 2x2 Square Cards Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3">
          {topics.map((topic) => {
            const visual = getTopicVisual(topic.slug, topic.title);
            const IconComponent = visual.icon;

            return (
              <Link
                key={topic.slug}
                href={topic.href}
                className={`group flex flex-col justify-between p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800/90 ${visual.hoverBorder} hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer`}
              >
                {/* Top: Icon + Short Badge */}
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div className={`flex size-8 sm:size-9 items-center justify-center rounded-xl border ${visual.bg} ${visual.text} ${visual.border} shrink-0 group-hover:scale-105 transition-transform shadow-2xs`}>
                    <IconComponent size={17} />
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 shadow-2xs">
                    {topic.shortName}
                  </span>
                </div>

                {/* Middle: Title & Highlights */}
                <div className="space-y-0.5">
                  <h3 className={`text-xs sm:text-[13px] font-bold text-gray-900 dark:text-gray-100 ${visual.hoverText} transition-colors line-clamp-1`}>
                    {topic.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {visual.highlights}
                  </p>
                </div>

                {/* Bottom: Notes Link Action */}
                <div className="mt-2.5 pt-2 border-t border-gray-100/90 dark:border-gray-800/60 flex items-center justify-between text-[10px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <span>{topic.status === "ready" ? "Read Notes" : "Interview Notes"}</span>
                  <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
