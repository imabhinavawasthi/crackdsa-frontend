"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  X,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { WHY_PRO_CONFIG } from "@/config/pro-page-config";

export function ProWhyValue() {
  return (
    <section id="why-pro" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{WHY_PRO_CONFIG.sectionTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {WHY_PRO_CONFIG.title}
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {WHY_PRO_CONFIG.subtitle}
          </p>
        </div>

        {/* ── Standalone Individual Purchases vs One Pro Subscription ── */}
        <div className="p-6 sm:p-10 rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Itemized Market Value Breakdown
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Buying Resources Separately vs. All-In-One Pro Pass
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm self-start md:self-auto">
              <TrendingDown className="w-4 h-4" />
              <span>Save {WHY_PRO_CONFIG.savingsPercent} with Pro</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Standalone Costs List */}
            <div className="lg:col-span-7 space-y-3">
              {WHY_PRO_CONFIG.standaloneItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-black text-gray-500 dark:text-gray-400 line-through shrink-0">
                    ₹{item.standaloneValue.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: The CrackDSA Pro Contrast Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-brand-950 text-white border border-brand-500/40 shadow-2xl space-y-6 text-center">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
                  Individual Market Value
                </p>
                <p className="text-3xl font-mono font-bold text-gray-500 line-through">
                  ₹{WHY_PRO_CONFIG.totalStandaloneValue.toLocaleString("en-IN")}+
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 space-y-1">
                <p className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                  With CrackDSA 2-Year Pass
                </p>
                <p className="text-4xl sm:text-5xl font-black font-mono text-white">
                  ₹5,999
                </p>
                <p className="text-xs text-amber-400 font-bold">
                  Full 2 Years Access (<strong className="text-white">Less than ₹8/day</strong>)
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-300 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Everything included — zero separate upsells</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant access to 206+ lectures &amp; upcoming live cohorts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Permanent community networking &amp; daily job alerts</span>
                </li>
              </ul>

              <a
                href="#pricing"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all"
              >
                <span>Unlock Everything in Pro</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

        {/* ── Comparison Table: Pro vs Bootcamps vs Generic Platforms ── */}
        <div className="space-y-6 text-left">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Platform Benchmark
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              CrackDSA Pro vs. The Alternatives
            </h3>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-white dark:bg-gray-900 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80">
                  <th className="p-4 sm:p-5 font-black text-gray-900 dark:text-white">Feature</th>
                  <th className="p-4 sm:p-5 font-black text-brand-600 dark:text-brand-400 bg-brand-500/10">
                    CrackDSA Pro 🚀
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-gray-500 dark:text-gray-400">
                    Coding Bootcamps
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-gray-500 dark:text-gray-400">
                    Generic Platforms
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {WHY_PRO_CONFIG.comparisonTable.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors ${
                      row.highlight ? "bg-amber-500/5 font-bold" : ""
                    }`}
                  >
                    <td className="p-4 sm:p-5 font-bold text-gray-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-brand-700 dark:text-brand-300 bg-brand-500/5">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{row.crackdsaPro}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                      {row.bootcamps}
                    </td>
                    <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                      {row.genericPlatforms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
