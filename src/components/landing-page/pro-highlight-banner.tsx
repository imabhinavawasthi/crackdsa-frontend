"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Video,
  Radio,
  HelpCircle,
  BookOpen,
  Briefcase,
  Zap,
  CheckCircle2,
  Users,
  ShieldCheck,
  Calendar,
  Check,
  Star,
  Clock,
  Layers,
} from "lucide-react";

export function ProHighlightBanner() {
  const proOfferings = [
    {
      icon: Video,
      title: "150+ DSA Master Video Lectures",
      desc: "Complete video curriculum from foundational math & recursion to advanced segment trees and Tree DP. Includes whiteboard proofs and C++, Python & Java implementations.",
      tag: "Self-Paced & HD",
      color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/15",
    },
    {
      icon: Radio,
      title: "Weekly Live Weekend Classes",
      desc: "Every weekend live interactive deep-dives on high-yield patterns (DP, Binary Search on Answer, Monotonic Stack, Graphs) conducted by Abhinav Awasthi.",
      tag: "Live Interactive",
      color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/15",
    },
    {
      icon: HelpCircle,
      title: "Weekly Live 1:1 Doubt Resolution",
      desc: "Dedicated weekly doubt solving sessions with mentors so you never stay stuck on complex algorithmic edge cases or debugging tricky bugs.",
      tag: "Direct Mentorship",
      color: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15",
    },
    {
      icon: BookOpen,
      title: "CS Fundamentals Notes",
      desc: "High-frequency interview revision notes for Operating Systems, DBMS & SQL queries, Computer Networks.",
      tag: "Interview Ready",
      color: "text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15",
    },
    {
      icon: Zap,
      title: "Full Competitive Programming Catalog",
      desc: "Complete access to contest editorials and upsolving for Codeforces Div. 2/3, LeetCode Weekly rounds, CodeChef Starters, and rating growth roadmaps.",
      tag: "1600+ CP Track",
      color: "text-violet-500 bg-violet-500/10 dark:bg-violet-500/15",
    },
    {
      icon: Briefcase,
      title: "Curated Job Opportunities & Hiring Drops",
      desc: "Daily verified off-campus hiring drives, test links, and internship openings across tier-1 product companies and high-growth tech startups.",
      tag: "Off-Campus Alerts",
      color: "text-rose-500 bg-rose-500/10 dark:bg-rose-500/15",
    },
  ];

  const planHighlights = [
    {
      name: "Monthly Pro",
      price: "₹799",
      period: "/ month",
      daily: "₹26 / day",
      desc: "Flexible sprint for immediate upcoming technical interviews.",
      badge: "Flexible Commitment",
      highlight: false,
    },
    {
      name: "2-Year Pro Pass",
      price: "₹5,999",
      period: "for 2 full years",
      daily: "< ₹8 / day",
      desc: "Complete college preparation access. Continuous live classes and placement drops.",
      badge: "🚀 Most Popular • Save ₹10,000",
      highlight: true,
    },
    {
      name: "Lifetime Pass",
      price: "₹9,999",
      period: "one-time payment",
      daily: "Pay once, learn forever",
      desc: "Permanent unrestricted access to all future batches, updates, and masterclasses.",
      badge: "👑 Ultimate Career Pass",
      highlight: false,
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Outer Border Glow Frame */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-amber-500/40 via-orange-500/30 to-blue-500/40 shadow-2xl overflow-hidden">
        
        {/* Main Card Surface */}
        <div className="rounded-[22px] bg-white dark:bg-gray-950 p-6 sm:p-10 lg:p-12 space-y-12 relative overflow-hidden transition-colors duration-300">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* ── 1. Top Section: Header & Instructor Card ──────────────── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl">

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                Everything You Need to Break into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                  Product Based Companies
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                One all-inclusive pass designed to take you from foundational DSA to cracking 20+ LPA technical offers. Live weekend classes, complete structured video library, real-time doubt clearing, and interview-ready CS fundamentals notes.
              </p>
            </div>

            {/* Lead Mentor Card */}
            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md shrink-0 shadow-sm">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 shadow-md shrink-0">
                <Image src="/pictures/abhinav.jpeg" alt="Abhinav Awasthi" fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    Lead Mentor
                  </span>
                </div>
                <p className="text-base font-black text-gray-900 dark:text-white">Abhinav Awasthi</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Founder @ CrackDSA &bull; SDE 2 @ Zeta &bull; Ex-LinkedIn
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Cracked offers from Amazon, Zscaler
                </p>
              </div>
            </div>
          </div>

          {/* ── 2. What Pro Offers: 6-Card Grid ─────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                What You Get with CrackDSA Pro
              </h3>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                No extra upsells &bull; 100% all-inclusive
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {proOfferings.map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-gray-50/60 dark:bg-gray-900/40 space-y-3 hover:border-amber-500/40 hover:bg-white dark:hover:bg-gray-900 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${perk.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gray-200/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {perk.tag}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-gray-900 dark:text-white">{perk.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{perk.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>


          {/* ── 4. Bottom Trust Badges & Action Strip ───────────────────── */}
          <div className="pt-6 border-t border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>HD Class Recordings Included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No Predatory ISAs</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/live-sessions"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-red-500" />
                <span>Live Class Schedule</span>
              </Link>

              <Link
                href="/pro"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-100" />
                <span>Unlock CrackDSA Pro Access</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
