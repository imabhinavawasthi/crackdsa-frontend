"use client";

import React, { useMemo, useEffect, useState } from "react";
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
  CheckCircle2,
  Crown,
  Loader2,
  Activity,
  GraduationCap,
  Video,
  MessageSquare,
  ChevronRight,
  Lock,
  Mic,
  Brain,
  Code2,
  ArrowUpRight,
  Gem,
  LogIn,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { fetchActiveRoadmapApi } from "@/api/roadmap";
import { fetchUserAssetStates } from "@/api/user";
import { fetchSheetProblems, fetchSheets } from "@/api/sheets";
import { RoadmapDBRecord } from "@/components/roadmap/types";
import { useActiveStreak } from "@/hooks/useActiveStreak";
import { DetailedProblem } from "@/types/dsa-sheet";

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const platformFeatures = [
  {
    title: "AI-Powered Roadmap",
    description: "Get a personalized learning path engineered by AI, tailored to your target companies and skill level.",
    icon: Compass,
    href: "/roadmap",
    gradient: "from-blue-500 to-indigo-600",
    glowColor: "blue",
    badge: "AI",
  },
  {
    title: "DSA Sheets",
    description: "Curated problem sets organized by patterns. Track progress and master every concept systematically.",
    icon: LayoutDashboard,
    href: "/dsa-sheet",
    gradient: "from-brand-500 to-brand-700",
    glowColor: "brand",
    badge: "Popular",
  },
  {
    title: "Courses & Masterclasses",
    description: "Expert-led video courses covering DSA, system design, and interview strategies from industry veterans.",
    icon: GraduationCap,
    href: "/courses",
    gradient: "from-purple-500 to-violet-600",
    glowColor: "purple",
    badge: "New",
  },
];

const proFeatures = [
  {
    title: "1:1 Mentorship",
    description: "Personal guidance from engineers at top companies. Get your doubts resolved and career path reviewed.",
    icon: MessageSquare,
    gradient: "from-amber-400 to-orange-500",
    href: "/pro/personalized",
  },
  {
    title: "Mock Interviews",
    description: "Practice with realistic interview simulations. Get detailed feedback on your problem-solving approach.",
    icon: Mic,
    gradient: "from-rose-400 to-pink-600",
    href: "/pro/personalized",
  },
  {
    title: "Live Classes",
    description: "Interactive sessions with expert instructors. Ask questions in real-time and learn alongside peers.",
    icon: Video,
    gradient: "from-emerald-400 to-teal-600",
    href: "/live-sessions",
  },
];

const ecosystemLinks = [
  { name: "AI Roadmap", href: "/roadmap", icon: Compass, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "DSA Sheets", href: "/dsa-sheet", icon: LayoutDashboard, color: "text-brand-500", bg: "bg-brand-500/10" },
  { name: "Topic Practice", href: "/practice/topics", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Company Tags", href: "/practice/companies", icon: Building2, color: "text-orange-500", bg: "bg-orange-500/10", pro: true },
  { name: "Problem Arena", href: "/practice", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Masterclasses", href: "/masterclasses", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Resume Builder", href: "/resume", icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Community", href: "/community", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

// ─── Featured DSA Sheets Config ───────────────────────────────────────────────
// Update these with your actual sheet IDs, names, and images in /public/images/sheets/

const featuredDSASheets = [
  {
    id: "crackdsa-revision-sprint",
    title: "CrackDSA Sprint 75",
    description: "The essential 75 problems every candidate must solve. Covers all key patterns.",
    problemCount: 75,
    difficulty: "Mixed" as const,
    image: "/images/sheets/crackdsa-75.png",
    color: "from-brand-500 to-indigo-600",
    tag: "Most Popular",
  },
  {
    id: "0-to-hero-dsa",
    title: "0 to Hero DSA",
    description: "Comprehensive DSA preparation from beginner to advanced concepts.",
    problemCount: 150,
    difficulty: "Mixed" as const,
    image: "/images/sheets/striver-sde.png",
    color: "from-orange-500 to-rose-600",
    tag: "Comprehensive",
  },
  {
    id: "blind-75",
    title: "Blind 75",
    description: "The classic curated set from Blind. Perfect for last-minute interview revision.",
    problemCount: 75,
    difficulty: "Medium" as const,
    image: "/images/sheets/blind-75.png",
    color: "from-emerald-500 to-teal-600",
    tag: "Classic",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Guest Hero ───────────────────────────────────────────────────────────────

function GuestHeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-800/60"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#465fff_0%,#7a5af8_25%,#ee46bc_50%,#fb6514_75%,#465fff_100%)] bg-[length:300%_300%] animate-[gradientShift_8s_ease_infinite] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

      {/* Floating orbs */}
      <div className="absolute top-12 right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-8 left-12 w-32 h-32 rounded-full bg-white/8 blur-2xl animate-[float_8s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-20 text-center max-w-3xl mx-auto">
        <motion.div
          variants={scaleIn}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/90 mb-6 border border-white/20"
        >
          <Sparkles size={14} className="animate-pulse" />
          Your DSA Journey Starts Here
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Crack Your Next <br className="hidden sm:block" />
          <span className="text-white/90">Coding Interview</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed font-medium">
          AI-powered roadmaps, curated DSA sheets, expert courses, and 1:1 mentorship — everything you need to land your dream role.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-xl shadow-black/20 transition-all hover:shadow-2xl hover:-translate-y-0.5 hover:bg-gray-50"
          >
            <LogIn size={18} />
            Get Started Free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/pro"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm px-7 py-4 text-base font-bold text-white border border-white/20 transition-all hover:bg-white/20"
          >
            <Crown size={16} />
            Explore Pro
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

// ─── User Greeting + Stats ────────────────────────────────────────────────────

function UserGreetingSection({
  firstName,
  isPro,
  stats,
  dailyProblem,
}: {
  firstName: string;
  isPro: boolean;
  stats: { label: string; value: string; icon: React.ElementType; color: string }[];
  dailyProblem?: DetailedProblem | null;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            {getGreeting()}, {firstName}.
          </h1>
          {isPro && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-amber-500/30">
              <Crown size={12} /> PRO
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {isPro ? "Welcome back to your premium workspace." : "Welcome back — let's keep building."}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide items-stretch"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={scaleIn}
            className="flex min-w-[110px] items-center gap-3 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{stat.label}</p>
              <p className="text-lg font-black leading-none text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}

        {dailyProblem && (
          <motion.div variants={scaleIn}>
            <Link
              href={dailyProblem.problem_url || `/practice/${dailyProblem.slug}`}
              target={dailyProblem.problem_url ? "_blank" : undefined}
              className="flex items-center gap-3 rounded-2xl border border-brand-200/60 dark:border-brand-500/15 bg-brand-50/60 dark:bg-brand-500/5 backdrop-blur-sm pl-3 pr-4 py-3 shadow-sm hover:shadow-md hover:border-brand-300/80 dark:hover:border-brand-500/25 transition-all group min-w-[200px]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white shadow-sm">
                <Zap size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-brand-500 dark:text-brand-400">Daily Problem</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 truncate">{dailyProblem.title}</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                dailyProblem.difficulty === "Easy" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" :
                dailyProblem.difficulty === "Medium" ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" :
                "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
              }`}>
                {dailyProblem.difficulty}
              </span>
              <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Active Roadmap Card ──────────────────────────────────────────────────────

function ActiveRoadmapSection({
  isLoading,
  activeRoadmap,
  isLoggedIn,
  isPro,
}: {
  isLoading: boolean;
  activeRoadmap: RoadmapDBRecord | null;
  isLoggedIn: boolean;
  isPro: boolean;
}) {
  if (!isLoggedIn) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm p-8 min-h-[160px] shadow-sm">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (!activeRoadmap) {
    const roadmapNodes = [
      { label: "Arrays", delay: 0, x: 0 },
      { label: "Trees", delay: 0.15, x: 1 },
      { label: "Graphs", delay: 0.3, x: 2 },
      { label: "DP", delay: 0.45, x: 3 },
    ];

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <Link href="/roadmap" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-50/80 to-indigo-50/60 dark:from-brand-950/30 dark:to-indigo-950/20 px-6 py-5 shadow-md shadow-brand-500/5 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/8 dark:bg-brand-500/15 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-500/15 transition-colors duration-700" />

            <div className="relative z-10 flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {roadmapNodes.map((node, i) => (
                  <React.Fragment key={node.label}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: node.delay + 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
                      className="relative flex flex-col items-center"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white shadow-sm shadow-brand-500/20">
                        {i === 0 && <Code2 size={14} />}
                        {i === 1 && <Layers size={14} />}
                        {i === 2 && <Compass size={14} />}
                        {i === 3 && <Brain size={14} />}
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">{node.label}</span>
                    </motion.div>
                    {i < roadmapNodes.length - 1 && (
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: node.delay + 0.5, duration: 0.3 }}
                        className="w-5 h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-indigo-400 mb-4 origin-left"
                      />
                    )}
                  </React.Fragment>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ delay: 1, duration: 2, repeat: Infinity }}
                  className="flex items-center gap-0.5 mb-4 ml-1"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-white/60 dark:bg-brand-500/10 backdrop-blur-sm px-2 py-1 text-[9px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2 border border-white/80 dark:border-brand-500/20">
                  <Sparkles size={10} className="animate-pulse" />
                  AI-Powered
                </div>
                <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">Create Your Custom Roadmap</h3>
                <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                  AI builds a personalized path based on your skills, goals & target companies.
                </p>
              </div>

              <div className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/15 transition-all group-hover:bg-brand-500 group-hover:-translate-y-0.5">
                <Compass size={15} /> Generate
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  const currentPhase = activeRoadmap.structure?.phases?.[0];
  const totalTopics = activeRoadmap.structure?.phases?.reduce((acc, p) => acc + (p.topics?.length || 0), 0) || 0;
  const completedTopics = activeRoadmap.structure?.phases?.reduce(
    (acc, p) => acc + (p.topics?.filter((t) => t.status === "completed")?.length || 0),
    0
  ) || 0;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/roadmap/${activeRoadmap.id}`} className="block group">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/50 p-8 sm:p-10 shadow-lg border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/10 transition-colors duration-500" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-100 dark:border-emerald-500/20">
                  <Activity size={14} className="animate-pulse" /> Active Path
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight line-clamp-1">
                  {activeRoadmap.title}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 max-w-md leading-relaxed">
                  {currentPhase?.subtitle || "Resume your personalized curriculum."}
                </p>
              </div>
              <div className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gray-950 dark:bg-white px-8 py-4 text-base font-bold text-white dark:text-gray-950 shadow-xl transition-all group-hover:bg-gray-800 dark:group-hover:bg-gray-100 group-hover:-translate-y-1">
                Resume Path <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {isPro && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Overall Progress
                  </span>
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    {progressPercent}% · {completedTopics}/{totalTopics} topics
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  />
                </div>
                {currentPhase && (
                  <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Target size={13} className="text-brand-500" />
                      Current: <span className="text-gray-900 dark:text-white">{currentPhase.title}</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span>{currentPhase.topics?.length || 0} topics</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Feature Showcase ─────────────────────────────────────────────────────────

function FeatureShowcaseSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {isLoggedIn ? "Continue Learning" : "Everything You Need"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {isLoggedIn ? "Pick up where you left off" : "One platform for your entire interview prep"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {platformFeatures.map((feature) => (
          <motion.div key={feature.title} variants={fadeInUp}>
            <Link href={feature.href} className="block group h-full">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm p-6 h-full transition-all hover:shadow-xl hover:-translate-y-1 hover:border-gray-300/80 dark:hover:border-gray-700/80">
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                      <feature.icon size={22} />
                    </div>
                    {feature.badge && (
                      <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                        feature.badge === "AI"
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : feature.badge === "Popular"
                          ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                          : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{feature.description}</p>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
                    {isLoggedIn ? "Continue" : "Explore"}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Featured DSA Sheets ──────────────────────────────────────────────────────

function FeaturedDSASheetsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={18} className="text-brand-500" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Popular DSA Sheets</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Curated problem sets to ace your interviews</p>
        </div>
        <Link
          href="/dsa-sheet"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          View all <ChevronRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featuredDSASheets.map((sheet) => (
          <motion.div key={sheet.id} variants={fadeInUp}>
            <Link href={`/dsa-sheet/${sheet.id}`} className="block group h-full">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm h-full transition-all hover:shadow-xl hover:-translate-y-1 hover:border-gray-300/80 dark:hover:border-gray-700/80">
                <div className={`relative w-full h-32 bg-gradient-to-br ${sheet.color} overflow-hidden`}>
                  <Image
                    src={sheet.image}
                    alt={sheet.title}
                    fill
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white border border-white/20">
                      {sheet.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="rounded-md bg-black/30 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                      {sheet.problemCount} problems
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">{sheet.title}</h3>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {sheet.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {sheet.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
                    Start Solving <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Pro Features Highlight ───────────────────────────────────────────────────

function ProFeaturesSection({ isPro }: { isPro: boolean }) {
  if (isPro) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown size={18} className="text-amber-500" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Pro Features</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Unlock premium tools to accelerate your prep</p>
        </div>
        <Link
          href="/pro"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          View all <ChevronRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {proFeatures.map((feature) => (
          <motion.div key={feature.title} variants={fadeInUp}>
            <Link href={feature.href} className="block group h-full">
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/40 dark:border-amber-500/10 bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 backdrop-blur-sm p-6 h-full transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 hover:border-amber-300/60 dark:hover:border-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md`}>
                      <feature.icon size={20} />
                    </div>
                    <span className="rounded-md bg-amber-100/80 dark:bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/15">
                      <Lock size={8} className="inline mr-0.5 -mt-px" /> Pro
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{feature.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Enrolled Courses (Pro Only) ──────────────────────────────────────────────

function EnrolledCoursesSection({
  enrolledCourses,
}: {
  enrolledCourses: { course_id: string; course_name: string }[];
}) {
  if (!enrolledCourses || enrolledCourses.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-purple-500" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Your Courses</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Included with your Pro subscription</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          Browse all <ChevronRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolledCourses.map((course, idx) => (
          <motion.div key={course.course_id} variants={fadeInUp}>
            <Link href={`/courses/${course.course_id}`} className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-300/50 dark:hover:border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{course.course_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Crown size={11} className="text-amber-500" />
                      <span className="font-semibold">Included in Pro</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Pro Exclusive Section (for Pro users) ────────────────────────────────────

function ProExclusiveSection() {
  const proExclusiveTools = [
    {
      title: "1:1 Mentorship",
      description: "Schedule sessions with experienced engineers",
      icon: MessageSquare,
      href: "/pro/personalized",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      title: "Mock Interviews",
      description: "Realistic interview practice with feedback",
      icon: Mic,
      href: "/pro/personalized",
      gradient: "from-rose-400 to-pink-600",
    },
    {
      title: "Live Classes",
      description: "Interactive sessions with expert instructors",
      icon: Video,
      href: "/live-sessions",
      gradient: "from-emerald-400 to-teal-600",
    },
    {
      title: "Company Tags",
      description: "Problems tagged by target company",
      icon: Building2,
      href: "/practice/companies",
      gradient: "from-sky-400 to-blue-600",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
          <Crown size={14} className="text-white" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Pro Tools</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {proExclusiveTools.map((tool) => (
          <motion.div key={tool.title} variants={fadeInUp}>
            <Link href={tool.href} className="block group">
              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white shadow-md mb-3`}>
                  <tool.icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tool.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Ecosystem Quick Links ────────────────────────────────────────────────────

function EcosystemSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Quick Access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ecosystemLinks.map((item) => (
          <motion.div key={item.name} variants={fadeInUp}>
            <Link
              href={item.href}
              className="group flex items-center gap-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/40 backdrop-blur-sm p-3 transition-all hover:border-brand-500/30 hover:bg-brand-50/50 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5 hover:shadow-sm"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                <item.icon size={16} />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white truncate">
                {item.name}
              </span>
              {item.pro && (
                <span className="ml-auto rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-gray-500 shrink-0">
                  Pro
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Upgrade CTA Banner ──────────────────────────────────────────────────────

function UpgradeBanner({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-amber-300/30 dark:border-amber-500/15">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Gem size={26} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {isLoggedIn ? "Upgrade to Pro" : "Start with Pro"}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed font-medium">
                Unlock 1:1 mentorship, mock interviews, live classes, company-specific problems, and all premium courses.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                {["1:1 Mentorship", "Mock Interviews", "Live Classes", "All Courses"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <CheckCircle2 size={12} className="text-amber-500" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={isLoggedIn ? "/checkout/pro" : "/pro"}
            className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
          >
            <Crown size={18} />
            {isLoggedIn ? "Upgrade Now" : "Get Pro"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Explorer";
  const isPro = user?.is_pro_active === true;
  const streak = useActiveStreak();

  // Data States
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapDBRecord | null>(null);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [dailyProblem, setDailyProblem] = useState<DetailedProblem | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const [roadmap, assetStates, sheets] = await Promise.all([
          fetchActiveRoadmapApi().catch(() => null),
          fetchUserAssetStates().catch(() => []),
          fetchSheets().catch(() => []),
        ]);

        setActiveRoadmap(roadmap);

        const solvedCount = assetStates.filter(
          (asset: any) => asset.asset_type === "problem" && asset.status === "done"
        ).length;
        setProblemsSolved(solvedCount);

        if (sheets && sheets.length > 0) {
          const firstSheetId = sheets[0].id;
          const problems = await fetchSheetProblems(firstSheetId).catch(() => []);
          if (problems && problems.length > 0) {
            const now = new Date();
            const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
            const index = seed % problems.length;
            setDailyProblem(problems[index]);
          }
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const stats = useMemo(
    () => [
      { label: "Solved", value: isLoading ? "–" : problemsSolved.toString(), icon: CheckCircle2, color: "text-emerald-500" },
      { label: "Streak", value: streak > 0 ? `${streak}d` : "–", icon: Flame, color: "text-orange-500" },
    ],
    [isLoading, problemsSolved, streak]
  );

  // Show loading spinner while auth is resolving
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  // ─── GUEST VIEW (not logged in) ──────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-4 px-4">
        <GuestHeroSection />
        <FeatureShowcaseSection isLoggedIn={false} />
        <FeaturedDSASheetsSection />
        <ProFeaturesSection isPro={false} />
        <EcosystemSection />
        <UpgradeBanner isLoggedIn={false} />
      </div>
    );
  }

  // ─── PRO VIEW ─────────────────────────────────────────────────────────────

  if (isPro) {
    return (
      <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-6 px-4">
        <UserGreetingSection firstName={firstName} isPro stats={stats} dailyProblem={dailyProblem} />
        <ActiveRoadmapSection isLoading={isLoading} activeRoadmap={activeRoadmap} isLoggedIn isPro />
        <EnrolledCoursesSection enrolledCourses={user?.enrolled_courses || []} />
        <ProExclusiveSection />
        <FeatureShowcaseSection isLoggedIn />
        <EcosystemSection />
      </div>
    );
  }

  // ─── FREE USER VIEW ───────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-6 px-4">
      <UserGreetingSection firstName={firstName} isPro={false} stats={stats} dailyProblem={dailyProblem} />
      <ActiveRoadmapSection isLoading={isLoading} activeRoadmap={activeRoadmap} isLoggedIn isPro={false} />
      <FeatureShowcaseSection isLoggedIn />
      <FeaturedDSASheetsSection />
      <ProFeaturesSection isPro={false} />
      <EcosystemSection />
      <UpgradeBanner isLoggedIn />
    </div>
  );
}
