"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  ArrowRight,
  Zap,
  ShoppingCart,
  Crown,
  Infinity as InfinityIcon,
  PlayCircle,
  Users,
  Star,
  BarChart3,
  Clock,
  Rocket,
} from "lucide-react";
import { WHY_PRO_CONFIG } from "@/config/pro-page-config";

export function ProWhyValue() {
  return (
    <section
      id="why-pro"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#070b12] dark:via-[#090f19] dark:to-[#070b12] border-y border-blue-100/60 dark:border-gray-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION HEADER                                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Top Unbeatable Value Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{WHY_PRO_CONFIG.sectionTag}</span>
          </div>

          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Why <span className="text-blue-600 dark:text-blue-500">CrackDSA Pro?</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {WHY_PRO_CONFIG.subtitle}
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MAIN COMPARISON CONTAINER: LEFT (SEPARATELY) vs RIGHT (PRO)  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Center Floating Arrow (Desktop) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 shadow-xl text-blue-600 dark:text-blue-400 hidden lg:flex items-center justify-center z-20 pointer-events-none">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* ─────────────────────────── LEFT CARD: BUYING SEPARATELY ─── */}
            <div className="rounded-[28px] border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-gray-500/5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {WHY_PRO_CONFIG.standalone.tag}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {WHY_PRO_CONFIG.standalone.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                    {WHY_PRO_CONFIG.standalone.subtitle}
                  </p>
                </div>
              </div>

              {/* 5 Standalone Items */}
              <div className="space-y-3">
                {WHY_PRO_CONFIG.standalone.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 sm:p-3.5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm sm:text-base font-black font-mono text-gray-900 dark:text-white shrink-0">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Summary Box */}
              <div className="rounded-2xl bg-gray-50/90 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 p-4 sm:p-5 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                  Total Cost If Purchased Separately
                </span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                  ₹{WHY_PRO_CONFIG.standalone.totalPrice.toLocaleString("en-IN")}+
                </span>
              </div>
            </div>

            {/* ─────────────────────────── RIGHT CARD: CRACKDSA PRO ─── */}
            <div className="rounded-[28px] border-2 border-blue-200 dark:border-blue-500/30 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-amber-500 flex items-center justify-center shadow-xs">
                    <Crown className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    <span>Save {WHY_PRO_CONFIG.savingsPercent}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {WHY_PRO_CONFIG.proPass.tag}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {WHY_PRO_CONFIG.proPass.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                    {WHY_PRO_CONFIG.proPass.subtitle}
                  </p>
                </div>
              </div>

              {/* Inner Dark Offer Banner (2-Year Pass) */}
              <div className="rounded-2xl bg-[#0a1628] text-white p-5 sm:p-6 relative overflow-hidden border border-blue-900/60 shadow-inner flex items-center justify-between gap-4">
                {/* Subtle Radial Blue Glow */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-3xl pointer-events-none rounded-full" />

                <div className="space-y-1 relative z-10">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-blue-300 uppercase font-semibold">
                    {WHY_PRO_CONFIG.proPass.planBadge}
                  </span>
                  <p className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                    ₹{WHY_PRO_CONFIG.proPass.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs font-medium text-gray-300 pt-0.5">
                    {WHY_PRO_CONFIG.proPass.durationText}{" "}
                    <span className="text-amber-400 font-bold">
                      ({WHY_PRO_CONFIG.proPass.perDayText})
                    </span>
                  </p>
                </div>

                {/* 3D Illuminated Pedestal with Golden Crown Illustration */}
                <div className="relative z-10 shrink-0 hidden sm:flex items-center justify-center w-28 h-28">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative flex flex-col items-center">
                    {/* Floating Glowing Crown */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 border border-amber-300 -mb-2 z-10">
                      <Crown className="w-7 h-7 text-white fill-white drop-shadow-md" />
                    </div>
                    {/* Glowing Hexagonal Pedestal */}
                    <div className="w-20 h-8 rounded-xl bg-gradient-to-b from-blue-600/80 to-blue-900/90 border border-blue-400/50 shadow-lg shadow-blue-500/50 transform perspective-500 rotate-x-30 flex items-center justify-center">
                      <div className="w-16 h-4 bg-blue-400/30 rounded-lg blur-xs" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Checkpoints */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                {WHY_PRO_CONFIG.proPass.checkpoints.map((pt, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                href="#pricing"
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Unlock Everything in Pro</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Footer Micro Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 text-center">
                <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <InfinityIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Full Access</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <PlayCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>Regular Updates</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Active Community</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <Star className="w-3.5 h-3.5 text-blue-500" />
                  <span>Best Value</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* BOTTOM BENEFIT STRIP: "MORE THAN JUST A SUBSCRIPTION"         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6 pt-4">
          {/* Centered Divider Tag */}
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200/80 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-[#070b12] px-4 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                MORE THAN JUST A SUBSCRIPTION
              </span>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {WHY_PRO_CONFIG.bottomBenefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {b.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {b.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}