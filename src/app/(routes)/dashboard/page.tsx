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
  Timer,
  TrendingUp,
  Crown,
  PlayCircle,
  Loader2,
  PlusCircle,
  Activity
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { fetchActiveRoadmapApi } from "@/api/roadmap";
import { fetchUserAssetStates } from "@/api/user";
import { RoadmapDBRecord } from "@/components/roadmap/types";

const ecosystemCategories = [
  {
    title: "Core Learning",
    items: [
      { name: "AI Roadmap", href: "/roadmap", icon: Compass, badge: "Core", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
      { name: "DSA Sheets", href: "/dsa-sheet", icon: LayoutDashboard, badge: "Popular", color: "text-brand-500", bg: "bg-brand-50 dark:bg-brand-500/10" },
      { name: "Masterclasses", href: "/masterclasses", icon: BookOpen, badge: "Pro", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
    ]
  },
  {
    title: "Practice & Mastery",
    items: [
      { name: "Topic Practice", href: "/practice/topics", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
      { name: "Company Tags", href: "/practice/companies", icon: Building2, badge: "Pro", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
      { name: "Problem Arena", href: "/practice", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
    ]
  },
  {
    title: "Career Tools",
    items: [
      { name: "Resume Builder", href: "/resume", icon: FileText, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
      { name: "1-on-1 Mentorship", href: "/personalized", icon: Sparkles, badge: "Pro", color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
      { name: "Community", href: "/community", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    ]
  }
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
  const isPro = false; // Replace with actual user PRO check logic later

  // Data States
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapDBRecord | null>(null);
  const [problemsSolved, setProblemsSolved] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const [roadmap, assetStates] = await Promise.all([
          fetchActiveRoadmapApi().catch(() => null),
          fetchUserAssetStates().catch(() => [])
        ]);
        
        setActiveRoadmap(roadmap);
        
        const solvedCount = assetStates.filter(
          (asset: any) => asset.asset_type === "problem" && asset.status === "done"
        ).length;
        setProblemsSolved(solvedCount);

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
      { label: "Solved", value: isLoading ? "-" : problemsSolved.toString(), icon: CheckCircle2, color: "text-emerald-500" },
      { label: "Streak", value: "-", icon: Flame, color: "text-orange-500" }, // Placeholder until backend streak engine
      { label: "Hours", value: "-", icon: Timer, color: "text-sky-500" }, // Placeholder
      { label: "Readiness", value: "-", icon: TrendingUp, color: "text-violet-500" },
    ],
    [isLoading, problemsSolved]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12 pt-6 px-4">
      
      {/* Top Header & Compact Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Welcome back to your workspace.
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-[120px] items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 px-4 py-3 shadow-sm">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{stat.label}</p>
                <p className="text-lg font-black leading-none text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Action & Promo Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Primary Action (Roadmap Logic) */}
        {isLoading ? (
          <div className="lg:col-span-2 flex items-center justify-center rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1219] p-8 shadow-sm min-h-[160px]">
            <Loader2 className="animate-spin text-brand-500" size={32} />
          </div>
        ) : !activeRoadmap ? (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="lg:col-span-2 relative overflow-hidden rounded-[2rem] border border-brand-500/20 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-900/10 dark:to-indigo-900/10 p-8 sm:p-10 shadow-2xl shadow-brand-500/5 group cursor-pointer"
          >
            {/* Animated background glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-500/20 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 group-hover:bg-indigo-500/20 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/60 dark:bg-brand-500/10 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4 border border-white dark:border-brand-500/20 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  No Active Path
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create Your Curriculum</h2>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                  Our AI will engineer a personalized roadmap tailored to your exact skills and target companies.
                </p>
              </div>
              <Link
                href="/roadmap"
                className="group/btn relative inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand-500/20 transition-all hover:bg-brand-500 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
                <PlusCircle size={20} /> Generate Now
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900/40 p-8 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-transparent dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all group"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/10 transition-colors duration-500" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-100 dark:border-emerald-500/20">
                  <Activity size={14} className="animate-pulse" /> Active Phase
                </div>
                {/* Dynamically extract the first phase or just show the roadmap title */}
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight line-clamp-1">
                  {activeRoadmap.structure?.phases?.[0]?.title || activeRoadmap.title}
                </h2>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 max-w-sm leading-relaxed">
                  {activeRoadmap.structure?.phases?.[0]?.subtitle || "Resume your personalized curriculum."}
                </p>
              </div>
              <Link
                href={`/roadmap/${activeRoadmap.id}`}
                className="group/btn relative inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gray-950 dark:bg-white px-8 py-4 text-base font-bold text-white dark:text-gray-950 shadow-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-100 hover:-translate-y-1"
              >
                Resume Path <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* PRO Promo Card */}
        {!isPro && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#1a1405] dark:to-[#120a00] p-6 sm:p-8 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <Crown size={24} className="text-amber-500 mb-3" />
                <h3 className="text-lg font-black text-amber-900 dark:text-amber-500">Unlock CrackDSA PRO</h3>
                <p className="mt-1.5 text-xs font-medium text-amber-800/80 dark:text-amber-200/60 leading-relaxed mb-5">
                  Get full access to company-specific tags, expert masterclasses, and priority mentorship.
                </p>
              </div>
              <Link
                href="/checkout/pro"
                className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Ecosystem Categories */}
      <div className="space-y-8 pt-4">
        {ecosystemCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-1">{category.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-3 transition-colors hover:border-brand-500/30 hover:bg-brand-50/50 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                        {item.badge}
                      </span>
                    )}
                    <PlayCircle size={14} className="text-gray-300 dark:text-gray-700 transition-colors group-hover:text-brand-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
