"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Database,
  Network,
  Server,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { BEYOND_DSA_CONFIG } from "@/config/pro-page-config";

export function ProBeyondDsa() {
  return (
    <section
      id="cs-fundamentals"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-blue-50/30 dark:from-[#070b12] dark:via-[#090f19] dark:to-[#070b12] border-y border-blue-100/60 dark:border-gray-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{BEYOND_DSA_CONFIG.sectionTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {BEYOND_DSA_CONFIG.title}
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {BEYOND_DSA_CONFIG.subtitle}
          </p>
        </div>

        {/* 4 CS Fundamentals Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {BEYOND_DSA_CONFIG.csFundamentals.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-[24px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 hover:border-blue-300 dark:hover:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 font-mono">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {item.subject}
                  </h3>

                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    {item.topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80">
                  <Link
                    href="/cs-fundamentals"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                  >
                    <span>Read Notes &amp; PYQs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Banner CTA */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black">
              40+ In-Depth CS Engineering Revision Notes &amp; Cheat Sheets
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Curated for tech interviews at Google, Microsoft, Amazon, and top startups. Covering high-yield theory, diagrams, and common interview questions.
            </p>
          </div>
          <Link
            href="/cs-fundamentals"
            className="px-6 py-3 rounded-2xl bg-white text-gray-950 font-black text-xs sm:text-sm shadow-md hover:bg-gray-100 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Explore All CS Notes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}