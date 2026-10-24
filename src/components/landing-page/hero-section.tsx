"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  Video,
  Check,
  Users,
  Star,
  ExternalLink,
} from "lucide-react";
import { HERO_SOCIAL_LOGOS } from "@/config/pro-logos";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function HeroSection() {
  const metricCards = [
    {
      platform: "Active Learners",
      stat: "50,000+",
      subtext: "From 100+ Colleges & 20+ Countries",
      handle: "Global Reach",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      accentGlow: "group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10",
    },
    {
      platform: "DSA Master Lectures",
      stat: "300+ Lectures",
      subtext: "Whiteboards & Hands-On Coding",
      handle: "Interview Focused",
      icon: YoutubeIcon,
      color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
      accentGlow: "group-hover:border-red-500/50 group-hover:shadow-red-500/10",
    },
    {
      platform: "Editorial Solutions",
      stat: "500+ Problems",
      subtext: "Codeforces, LeetCode & CodeChef POTD",
      handle: "Contest Upsolving",
      icon: Code2,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
      accentGlow: "group-hover:border-blue-500/50 group-hover:shadow-blue-500/10",
    },
    {
      platform: "Student Rating",
      stat: "4.9 / 5.0 ★",
      subtext: "Based on 1,500+ Verified Reviews",
      handle: "Top Rated SDE Resource",
      icon: Star,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      accentGlow: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10",
    },
  ];

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 md:py-16 overflow-hidden">
      {/* ── 1. Tech Blueprint Grid Pattern (Full Span, Coding75 Benchmark) ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#3b82f625_1px,transparent_1px),linear-gradient(to_bottom,#3b82f625_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      {/* ── 2. Aurora Horizon Arc, Concentric Orbital Rings & Ambient Flares ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Luminous Horizon Arc */}
        <div className="absolute -top-[280px] sm:-top-[360px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[450px] sm:h-[550px] rounded-[100%] border-t-2 border-brand-500/35 dark:border-brand-400/50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)]" />
        <div className="absolute -top-[278px] sm:-top-[358px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[450px] sm:h-[550px] rounded-[100%] border-t border-indigo-400/30 dark:border-indigo-300/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)] blur-[2px]" />

        {/* Top Overhead Aurora Light Beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-b from-brand-500/25 via-indigo-600/15 to-transparent rounded-full blur-[90px] animate-pulse duration-[8000ms]" />

        {/* Concentric Orbital Rings */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-brand-500/15 dark:border-brand-400/20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,white,transparent)]" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full border border-indigo-500/15 dark:border-indigo-400/15 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,white,transparent)]" />

        {/* Atmospheric Side Bloom Orbs */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-brand-500/15 dark:bg-brand-500/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 -left-32 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[130px]" />
      </div>

      {/* Floating Algorithmic Badges (Hidden on mobile) */}
      {/* <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 border border-brand-500/30 dark:border-brand-500/40 backdrop-blur-md shadow-lg text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400 absolute top-24 left-8 pointer-events-none animate-bounce duration-[4000ms]">
        <span>🔵 Live Classes / Doubts Session</span>
      </div>
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 border border-indigo-500/30 dark:border-indigo-500/40 backdrop-blur-md shadow-lg text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 absolute top-36 right-8 pointer-events-none animate-bounce duration-[5000ms]">
        <span>🚀 Complete DSA Course</span>
      </div>
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 border border-emerald-500/30 dark:border-emerald-500/40 backdrop-blur-md shadow-lg text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 absolute bottom-36 left-8 pointer-events-none animate-bounce duration-[6000ms]">
        <span>🎯 Target: Google, Amazon, Uber</span>
      </div> */}

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 my-auto">
        {/* ── Headline & Pitch ──────────────────────────────────────── */}
        <div className="space-y-4 max-w-4xl mx-auto">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-gray-900 dark:text-white">
            Everything You Need to{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 dark:from-brand-400 dark:via-indigo-400 dark:to-violet-400">
              Crack Tech Interviews &amp; Placements
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master Data Structures &amp; Algorithms, Competitive Programming, and CS Fundamentals with battle-tested problem sheets, daily contest editorials, and weekly live mentorship cohorts.
          </p>
        </div>

        {/* ── Action Buttons CTA Row ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-brand-500/25 hover:shadow-2xl hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <Code2 className="w-4 h-4 text-brand-100" />
            <span>Start Learning for Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/pro"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden"
          >
            <Sparkles className="w-4 h-4 text-amber-100 group-hover:rotate-12 transition-transform" />
            <span>Explore CrackDSA Pro</span>
          </Link>

          <Link
            href="/dsa-sheets"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/80 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Browse Problem Sheets</span>
          </Link>
        </div>

        {/* ── Value Assurance Row ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-600 dark:text-gray-400 pt-1">
          <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
            <Check className="w-3.5 h-3.5 text-brand-500" />
            <span>Complete DSA Course</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
            <Check className="w-3.5 h-3.5 text-brand-500" />
            <span>Interview Practice Sheets</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
            <Check className="w-3.5 h-3.5 text-brand-500" />
            <span>Regular Contest Editorials</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
            <Check className="w-3.5 h-3.5 text-brand-500" />
            <span>CS Fundamentals</span>
          </span>
          <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
            <Check className="w-3.5 h-3.5 text-amber-500" />
            <span>Less than ₹10/day on Pro</span>
          </span>
        </div>

        {/* ── Platform Metrics Component (Integrated in Hero with Same Background) ── */}
        <div className="pt-8 sm:pt-12 space-y-10 max-w-5xl mx-auto">
          {/* 4 Glassmorphic Reach Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {metricCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`group relative p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg shadow-gray-200/30 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left ${card.accentGlow}`}
                >
                  <div className="flex items-center justify-between pb-3">
                    <div className={`p-2 rounded-xl border ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                      {card.handle}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tight">
                      {card.stat}
                    </p>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {card.platform}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                      {card.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Placement Companies Header & Marquee */}
          <div className="pt-2 text-center space-y-4">
            <p className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
              Students &amp; Mentors Work Across Global Product Companies
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
              {HERO_SOCIAL_LOGOS.map((logo: any) =>
                logo.logoDarkUrl ? (
                  <React.Fragment key={logo.id}>
                    <img
                      src={logo.logoUrl}
                      alt={logo.alt}
                      className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                        logo.themeClass || ""
                      } object-contain dark:hidden`}
                    />
                    <img
                      src={logo.logoDarkUrl}
                      alt={logo.alt}
                      className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                        logo.themeClass || ""
                      } object-contain hidden dark:inline-block`}
                    />
                  </React.Fragment>
                ) : (
                  <img
                    key={logo.id}
                    src={logo.logoUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain`}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
