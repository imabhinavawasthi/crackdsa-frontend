"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Code2,
  Cpu,
  Database,
  Network,
  Layers,
  Terminal
} from "lucide-react";
import { CS_FUNDAMENTALS_TOPICS } from "@/config/cs-fundamentals.config";

export default function CSFundamentalsPage() {
  const topics = CS_FUNDAMENTALS_TOPICS;

  return (
    <div className="space-y-10 pb-16">
      {/* ─── 1. HERO HEADER ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 p-8 sm:p-12 text-center shadow-xs">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 size-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            CS <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:via-brand-500 dark:to-indigo-400">Fundamentals</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Programming interview-specific resources.
          </p>
        </div>
      </section>

      {/* ─── 2. CS FUNDAMENTALS 6-TOPIC GRID ─────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              CORE CURRICULUM
            </span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Select a Subject to Study
            </h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline-block">
            6 Specialized Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const isReady = topic.status === "ready";
            return (
              <Link
                key={topic.slug}
                href={topic.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:-translate-y-1"
              >
                {/* Card Image Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={topic.image}
                    alt={topic.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 right-3">
                    {isReady ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-xs">
                        <CheckCircle2 size={11} className="stroke-[3]" />
                        PDF Notes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/90 text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-xs">
                        <Clock size={11} />
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center justify-between group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      <span>{topic.title}</span>
                      <ArrowRight size={18} className="shrink-0 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {topic.description}
                    </p>
                  </div>

                  {/* Highlights Pill */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-600 dark:text-brand-400 group-hover:underline">
                      {isReady ? "View Notes →" : "Preview →"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 3. VALUE PROPOSITIONS / HIGHLIGHTS ─────────────────────── */}
      <section className="rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40 p-6 sm:p-10">
        <div className="max-w-2xl mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            WHY THESE NOTES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Curated Specifically for Technical Interview Rounds
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Most college textbooks are 800+ pages of academic theory. Our notes cut straight to what FAANG and product unicorn interviewers actually test.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cpu size={18} />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">High-Yield Summaries</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Every major theorem, state diagram, and architecture summarized concisely for rapid revision.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Database size={18} />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Real Loop Questions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Contains frequently asked oral questions from Amazon, Zeta, LinkedIn, and Google rounds.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers size={18} />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Visual Memory Aids</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Clear visual diagrams for paging, memory fragmentation, 2PL locking, and ACID isolation levels.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">By Top Engineers</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Created and vetted by Abhinav Awasthi (SDE-2 @ Zeta, Ex-LinkedIn, ICPC AIR 57).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
