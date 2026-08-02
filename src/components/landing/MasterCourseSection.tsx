"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/config/landing.config";

export default function MasterCourseSection() {
  const { masterCourse } = LANDING_CONFIG;

  return (
    <section className="py-24 px-5 sm:px-8 relative overflow-hidden bg-gray-950 text-white border-t border-white/5">
      {/* Ambient Backlight */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-black uppercase tracking-widest"
          >
            <GraduationCap size={14} />
            <span>{masterCourse.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white"
          >
            {masterCourse.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed"
          >
            {masterCourse.subtitle}
          </motion.p>
        </div>

        {/* Big Glass Showcase Card */}
        <div className="rounded-[2.5rem] p-8 sm:p-12 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            
            {/* Highlights List */}
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Complete Master Track
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                One Definitive Program for <span className="text-brand-400">Zero-to-Hero</span> Mastery.
              </h3>

              <div className="space-y-4 pt-2">
                {masterCourse.highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <Link
                  href={masterCourse.ctaHref}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(70,95,255,0.3)] hover:scale-105 transition-all"
                >
                  <Sparkles size={16} />
                  <span>{masterCourse.ctaText}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Visual Feature Card */}
            <div className="relative rounded-2xl p-6 bg-gray-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400">Course Status</span>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    DSA Master Course 2026 Edition
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-400">
                  Comprehensive
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-gray-300 font-medium">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Arrays, Strings & Two Pointers</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Trees, Graphs & Advanced Backtracking</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Dynamic Programming Pattern Mastery</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span>Live Doubts & Weekly Mock Interviews</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
