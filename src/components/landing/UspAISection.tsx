"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/config/landing.config";

export default function UspAISection() {
  const { uspAI } = LANDING_CONFIG;

  return (
    <section className="py-24 px-5 sm:px-8 relative overflow-hidden bg-gray-950 text-white border-t border-white/5">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest"
          >
            <Brain size={14} />
            <span>{uspAI.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white"
          >
            {uspAI.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed"
          >
            {uspAI.subtitle}
          </motion.p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {uspAI.features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[2rem] p-7 bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Action CTA Banner */}
        <div className="mt-16 text-center">
          <Link
            href="/roadmap/onboarding"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-brand-500 to-purple-600 text-white text-sm font-extrabold shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
          >
            <Sparkles size={16} />
            <span>Generate Your AI Roadmap Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
