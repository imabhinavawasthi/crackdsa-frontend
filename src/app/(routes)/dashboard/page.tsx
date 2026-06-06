"use client";

import React, { useMemo } from "react";
import {
  Sparkles,
  Compass,
  Zap,
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Building2,
  Layers,
  ArrowRight,
  Target,
  Flame,
  Brain,
  CheckCircle2,
  Timer,
  TrendingUp,
  Rocket,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const resourceCategories = [
  {
    title: "Core Learning",
    accent: "from-blue-500/20 to-indigo-500/5",
    items: [
      { name: "AI Roadmap", href: "/roadmap", icon: Compass, iconClass: "text-blue-400", badge: "AI Powered", pro: false },
      { name: "DSA Sheets", href: "/dsa-sheet", icon: LayoutDashboard, iconClass: "text-brand-400", badge: "75+ Probs", pro: false },
      { name: "Masterclasses", href: "/masterclasses", icon: BookOpen, iconClass: "text-purple-400", pro: true },
    ],
  },
  {
    title: "Practice & Mastery",
    accent: "from-emerald-500/20 to-teal-500/5",
    items: [
      { name: "Topic Practice", href: "/practice/topics", icon: Layers, iconClass: "text-emerald-400", pro: false },
      { name: "Company Specific", href: "/practice/companies", icon: Building2, iconClass: "text-orange-400", pro: true },
      { name: "Problem Arena", href: "/practice", icon: Zap, iconClass: "text-yellow-400", badge: "2k+", pro: false },
    ],
  },
  {
    title: "Career & Tools",
    accent: "from-rose-500/20 to-pink-500/5",
    items: [
      { name: "Resume Builder", href: "/resume", icon: FileText, iconClass: "text-rose-400", pro: false },
      { name: "1-on-1 Mentorship", href: "/personalized", icon: Sparkles, iconClass: "text-sky-400", badge: "Premium", pro: true },
      { name: "Community", href: "/community", icon: Users, iconClass: "text-indigo-400", pro: false },
    ],
  },
];

const quickLaunch = [
  {
    title: "AI Roadmap",
    description: "Your personalized interview prep path, powered by adaptive sequencing.",
    href: "/roadmap",
    icon: Compass,
    gradient: "from-blue-500/30 via-indigo-500/20 to-transparent",
    glow: "shadow-blue-500/20",
    cta: "Launch Roadmap",
  },
  {
    title: "DSA Sheets",
    description: "Curated problem sets from CrackDSA 75 to company-specific grinds.",
    href: "/dsa-sheet",
    icon: Target,
    gradient: "from-brand-500/30 via-violet-500/20 to-transparent",
    glow: "shadow-brand-500/25",
    cta: "Open Sheets",
  },
  {
    title: "Practice Arena",
    description: "Topic drills, timed sessions, and pattern mastery in one place.",
    href: "/practice",
    icon: Zap,
    gradient: "from-amber-500/30 via-orange-500/20 to-transparent",
    glow: "shadow-amber-500/20",
    cta: "Start Drilling",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Explorer";

  const stats = useMemo(
    () => [
      { label: "Problems Solved", value: "0", sub: "Start your first today", icon: CheckCircle2, tone: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
      { label: "Active Streak", value: "0", sub: "Days in a row", icon: Flame, tone: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
      { label: "Hours Practiced", value: "0.0", sub: "This week", icon: Timer, tone: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
      { label: "Readiness", value: "-", sub: "Complete roadmap to unlock", icon: TrendingUp, tone: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    ],
    []
  );

  return (
    <div className="relative mx-auto max-w-7xl space-y-8 overflow-hidden pb-20 pt-2">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(70,95,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(70,95,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        <motion.div
          animate={{ x: [0, 24, -16, 0], y: [0, -20, 12, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-500/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 24, 0], y: [0, 16, -24, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="absolute -right-16 top-32 h-64 w-64 rounded-full bg-blue-light-500/10 blur-[100px]"
        />
      </div>

      {/* Hero command center */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] border border-gray-200/80 bg-gray-950 px-6 py-8 shadow-2xl shadow-brand-500/10 dark:border-white/10 sm:px-8 sm:py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-indigo-600/10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.04]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-dashed border-white/[0.05]"
        />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-brand-500/20 blur-[80px]" />

        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-center">
          <div className="space-y-5 xl:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/20 bg-brand-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
              <Sparkles size={10} />
              Command Center
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                {getGreeting()},{" "}
                <span className="bg-gradient-to-r from-brand-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </h1>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-400 sm:text-base">
                Your interview prep hub is online. Pick up where you left off or launch a focused session - every problem solved moves the needle.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/roadmap"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-gray-950 shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <Rocket size={16} />
                <span>Resume My Path</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/progress"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <Brain size={16} className="text-brand-300" />
                View Analytics
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">
                  Today&apos;s Focus
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-400/20 bg-brand-500/15 text-brand-300">
                  <Target size={14} />
                </div>
              </div>
              <p className="text-sm font-bold text-white">Arrays & Hashing</p>
              <p className="mt-1 text-xs text-gray-500">Recommended from your roadmap phase 1</p>
              <Link
                href="/roadmap"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-300 transition-colors hover:text-white"
              >
                Start session <ChevronRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Weekly Momentum
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/15 text-emerald-300">
                  <TrendingUp size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-white">0</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">problems this week</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "8%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats strip */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + idx * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-xl hover:shadow-brand-500/5 dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.bg}`}>
                <stat.icon size={18} className={stat.tone} />
              </div>
            </div>
            <div className="relative mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-gray-500">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Quick launch bento */}
      <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.14 }} className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              Quick Launch
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Jump straight into high-impact prep modes.
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden items-center gap-1 text-sm font-bold text-brand-500 transition-colors hover:text-brand-600 sm:inline-flex"
          >
            Browse courses <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {quickLaunch.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + idx * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={item.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gray-950 p-6 shadow-lg ${item.glow} transition-all hover:border-white/15 dark:border-gray-800`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-transform group-hover:scale-125" />

                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur-sm">
                  <item.icon size={22} />
                </div>

                <div className="relative z-10 mt-5 flex flex-1 flex-col">
                  <h3 className="text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/90 transition-colors group-hover:text-brand-300">
                    {item.cta}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Resource explorer */}
      <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Explore the Ecosystem
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Every tool, sheet, and practice surface available on CrackDSA.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 pt-1 lg:grid-cols-3">
          {resourceCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 + idx * 0.08 }}
              className="relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/70"
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${category.accent} to-transparent`} />

              <h3 className="relative mb-5 text-lg font-black tracking-tight text-gray-900 dark:text-white">
                {category.title}
              </h3>

              <div className="relative flex flex-col gap-2.5">
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-gray-50/80 p-3.5 transition-all hover:border-gray-200 hover:bg-white hover:shadow-md dark:bg-gray-800/30 dark:hover:border-gray-700 dark:hover:bg-gray-800/80"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-gray-100 bg-white shadow-sm transition-transform group-hover:scale-105 dark:border-gray-700 dark:bg-gray-900">
                        <item.icon size={18} className={item.iconClass} />
                      </div>
                      <span className="text-[15px] font-bold text-gray-700 transition-colors group-hover:text-brand-500 dark:text-gray-200 dark:group-hover:text-brand-400">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="hidden rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 sm:inline-block dark:bg-gray-800 dark:text-gray-400">
                          {item.badge}
                        </span>
                      )}
                      {item.pro && (
                        <span className="rounded-lg bg-brand-500 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-brand-500/20">
                          Pro
                        </span>
                      )}
                      <PlayCircle
                        size={16}
                        className="text-gray-300 transition-all group-hover:text-brand-500 dark:text-gray-600"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
