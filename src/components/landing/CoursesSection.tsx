"use client";

import { Reveal } from "./Reveal";
import { PlayCircle, Code2, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CoursesSection() {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-8 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.02] via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <Reveal>
          <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
            Structured Learning
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Master DSA with Expert-Led Courses
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            From fundamentals to advanced patterns — structured courses designed to make you interview-ready.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <PlayCircle size={16} className="text-brand-400" />
              <span className="text-sm font-medium text-gray-300">Video Lectures</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <Code2 size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">Coding Problems</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-gray-300">Progress Tracking</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-bold px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-base group"
          >
            Browse All Courses
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
