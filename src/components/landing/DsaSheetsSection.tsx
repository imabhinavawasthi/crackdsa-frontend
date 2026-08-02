"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Layers, CheckCircle } from "lucide-react";
import Link from "next/link";
import { LANDING_CONFIG } from "@/config/landing.config";

export default function DsaSheetsSection() {
  const { dsaSheets } = LANDING_CONFIG;

  return (
    <section className="py-24 px-5 sm:px-8 relative overflow-hidden bg-gray-950 text-white border-t border-white/5">
      {/* Glow Orbs */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest"
          >
            <FileText size={14} />
            <span>{dsaSheets.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white"
          >
            {dsaSheets.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed"
          >
            {dsaSheets.subtitle}
          </motion.p>
        </div>

        {/* DSA Sheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dsaSheets.sheets.map((sheet, idx) => (
            <motion.div
              key={sheet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-[2rem] p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${sheet.badgeColor}`}>
                    {sheet.level}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {sheet.count}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {sheet.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  {sheet.desc}
                </p>
              </div>

              <div className="pt-8 mt-6 border-t border-white/5">
                <Link
                  href={`/dsa-sheet/${sheet.id}`}
                  className="flex items-center justify-between text-xs font-extrabold text-purple-400 group-hover:text-white transition-colors"
                >
                  <span>Solve Sheet</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href={dsaSheets.ctaHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white hover:underline transition-all"
          >
            <span>{dsaSheets.ctaText}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
