"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  ArrowRight, 
  Dumbbell, 
  Zap, 
  Timer,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProgressPage() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Learner";

  const featuredSheets = [
    {
      title: "CrackDSA 75",
      description: "Must-do problems for top tech companies.",
      count: 75,
      completed: 0,
      slug: "crackdsa-75",
      color: "blue",
      tag: "Popular"
    },
    {
      title: "Pattern Mastery",
      description: "Master 15+ recurring DSA patterns.",
      count: 120,
      completed: 0,
      slug: "pattern-mastery",
      color: "brand",
      tag: "Best for Prep"
    },
    {
      title: "DSA Kickstart",
      description: "Perfect for beginners starting their journey.",
      count: 50,
      completed: 0,
      slug: "kickstart",
      color: "emerald",
      tag: "Beginner"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Premium Impact Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-6 py-8 shadow-2xl dark:bg-black/40 border border-white/5 mx-auto">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-12 xl:col-span-7 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-400 border border-brand-500/20">
                <Sparkles size={10} />
                <span>Performance Insight</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500">
                Weekly Rank: Top 8%
              </span>
            </motion.div>
            
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.1]">
                Your Journey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-indigo-300">{firstName}!</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                You&apos;ve cleared <span className="text-white font-bold">12 problems</span> this week. <br className="hidden md:block" />
                Your interview readiness is up by <span className="text-emerald-400 font-bold">+18.4%</span> since Monday.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/roadmap"
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-gray-950 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Resume My Path</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
             <motion.div whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-[1.75rem] bg-white/[0.03] p-5 border border-white/5 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Target Met</span>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand-400 transition-colors">Daily Goal Achieved</h4>
                   </div>
                   <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                      <Zap size={14} />
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs text-gray-400">Streak maintained!</span>
                   <button className="rounded-lg bg-brand-500/10 px-3 py-1.5 text-xs font-bold text-brand-400 transition-all hover:bg-brand-500 hover:text-white">
                      Details
                   </button>
                </div>
             </motion.div>

             <motion.div whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-[1.75rem] bg-white/[0.03] p-5 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                         <Dumbbell size={14} />
                      </div>
                      <span className="text-xs font-bold text-white">Level 14</span>
                   </div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase">240 XP to next level</span>
                </div>
                <div className="space-y-2">
                   <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: "0", icon: <CheckCircle2 size={18} className="text-emerald-500" />, color: "emerald" },
          { label: "Active Streak", value: "0 Days", icon: <Zap size={18} className="text-orange-500" />, color: "orange" },
          { label: "Hours Practiced", value: "0.0", icon: <Timer size={18} className="text-blue-500" />, color: "blue" },
          { label: "Skill Level", value: "Beginner", icon: <Dumbbell size={18} className="text-purple-500" />, color: "purple" },
        ].map((stat) => (
          <div key={stat.label} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>{stat.icon}</div>
            </div>
            <div>
               <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{stat.label}</p>
               <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sheet Progress Focus */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sheet Progress</h2>
          <Link href="/dsa-sheet" className="group flex items-center gap-1 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">
            View All Libraries <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSheets.map((sheet) => (
            <Link key={sheet.slug} href={`/dsa-sheet/${sheet.slug}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/5 dark:border-gray-800 dark:bg-gray-900/50">
              <span className="mb-4 inline-block self-start rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 border border-brand-500/10">{sheet.tag}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">{sheet.title}</h3>
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Progress</span>
                  <span className="font-bold text-gray-900 dark:text-white">{sheet.completed} / {sheet.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(sheet.completed / sheet.count) * 100}%` }} className="h-full bg-brand-500 rounded-full" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
