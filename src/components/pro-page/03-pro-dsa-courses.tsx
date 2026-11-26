"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Video,
  CheckCircle2,
  Code2,
  Layers,
  Sparkles,
  ChevronRight,
  Terminal,
  Play,
  ArrowRight,
  GraduationCap,
  Clock,
} from "lucide-react";
import { STRUCTURED_COURSES_CONFIG } from "@/config/pro-page-config";

export function ProDsaCourses() {
  const [selectedModule, setSelectedModule] = useState(0);
  const [codeLang, setCodeLang] = useState<"cpp" | "python" | "java">("cpp");

  const sampleCodes = {
    cpp: `// Binary Search on Answer Space: O(N log(max - min))
long long low = 1, high = 1e14, optimalAns = high;
while (low <= high) {
    long long mid = low + (high - low) / 2;
    if (isFeasibleAllocation(mid, pages, k)) {
        optimalAns = mid;
        high = mid - 1; // Minimize maximum allocated pages
    } else {
        low = mid + 1;
    }
}
return optimalAns;`,
    python: `# Binary Search on Answer Space: O(N log(max - min))
low, high = 1, 10**14
optimal_ans = high
while low <= high:
    mid = (low + high) // 2
    if is_feasible_allocation(mid, pages, k):
        optimal_ans = mid
        high = mid - 1  # Minimize maximum
    else:
        low = mid + 1
return optimal_ans`,
    java: `// Binary Search on Answer Space: O(N log(max - min))
long low = 1, high = (long) 1e14, optimalAns = high;
while (low <= high) {
    long mid = low + (high - low) / 2;
    if (isFeasibleAllocation(mid, pages, k)) {
        optimalAns = mid;
        high = mid - 1; // Minimize maximum
    } else {
        low = mid + 1;
    }
}
return optimalAns;`,
  };

  return (
    <section id="courses" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{STRUCTURED_COURSES_CONFIG.sectionTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {STRUCTURED_COURSES_CONFIG.title}
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {STRUCTURED_COURSES_CONFIG.subtitle}
          </p>
        </div>

        {/* Flagship Course Hero Showcase */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl border border-brand-500/30 bg-gradient-to-b from-white via-white to-brand-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-brand-950/20 shadow-2xl space-y-8">
          
          {/* Top Banner Info */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200/80 dark:border-gray-800">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 text-xs font-black uppercase tracking-wider">
                {STRUCTURED_COURSES_CONFIG.flagshipCourse.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {STRUCTURED_COURSES_CONFIG.flagshipCourse.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                Taught by <strong className="text-gray-900 dark:text-white">{STRUCTURED_COURSES_CONFIG.flagshipCourse.instructor}</strong> ({STRUCTURED_COURSES_CONFIG.flagshipCourse.instructorRole})
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0">
              {STRUCTURED_COURSES_CONFIG.flagshipCourse.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/60 text-center"
                >
                  <p className="text-lg sm:text-xl font-black text-brand-600 dark:text-brand-400 font-mono">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Curriculum Explorer Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Module List Navigator */}
            <div className="lg:col-span-5 space-y-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1 pb-1">
                Curriculum Core Modules
              </p>
              {STRUCTURED_COURSES_CONFIG.flagshipCourse.modules.map((mod, idx) => (
                <button
                  key={mod.index}
                  type="button"
                  onClick={() => setSelectedModule(idx)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    selectedModule === idx
                      ? "bg-brand-500/10 border-brand-500/40 text-brand-900 dark:text-white shadow-md"
                      : "bg-white/60 dark:bg-gray-800/50 border-gray-200/80 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {mod.index}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold leading-tight">
                        {mod.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                        {mod.duration}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-brand-500 transition-transform ${
                      selectedModule === idx ? "translate-x-1" : "opacity-40"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Right: Selected Module Details & Interactive Code Preview */}
            <div className="lg:col-span-7 space-y-4">
              {/* Selected Module Detail Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {STRUCTURED_COURSES_CONFIG.flagshipCourse.modules[selectedModule].highlight}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {STRUCTURED_COURSES_CONFIG.flagshipCourse.modules[selectedModule].duration}
                  </span>
                </div>

                <h4 className="text-lg font-black text-gray-900 dark:text-white">
                  {STRUCTURED_COURSES_CONFIG.flagshipCourse.modules[selectedModule].name}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {STRUCTURED_COURSES_CONFIG.flagshipCourse.modules[selectedModule].topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Preview Box */}
              <div className="rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden text-left shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="text-xs font-mono text-gray-400 ml-2">
                      BinarySearchOptimization.{codeLang === "cpp" ? "cpp" : codeLang === "python" ? "py" : "java"}
                    </span>
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-gray-800">
                    {(["cpp", "python", "java"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setCodeLang(lang)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all ${
                          codeLang === lang
                            ? "bg-brand-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
                  <pre>{sampleCodes[codeLang]}</pre>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Other Specialized Courses Grid */}
        <div className="space-y-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
            More Specialized Courses Included with Pro
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STRUCTURED_COURSES_CONFIG.otherCourses.map((c) => (
              <div
                key={c.id}
                className="group p-6 rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:border-brand-500/50 hover:shadow-xl hover:-translate-y-1 transition-all space-y-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-mono">
                    {c.badge}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {c.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-black text-gray-900 dark:text-white">
                    {c.title}
                  </h4>
                  <p className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                    {c.lectures}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Included in Pro
                  </span>
                  <a
                    href="#pricing"
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  >
                    <span>Enroll</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
