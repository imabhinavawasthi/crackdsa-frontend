"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Compass, 
  Layers, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Terminal,
  ArrowLeft
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  description: string;
  status: "active" | "upcoming";
  categoryCount?: number;
  articleCount?: number;
  iconName: string;
  badge?: string;
}

const TRACKS: Track[] = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master problem-solving using linear scans, binary trees, dynamic programming, and advanced graphs. Crack high-volume FAANG coding tests.",
    status: "active",
    categoryCount: 8,
    articleCount: 45,
    iconName: "LayoutDashboard",
    badge: "Most Popular"
  },
  {
    id: "system-design",
    title: "System Design (HLD & LLD)",
    description: "Learn load balancing, horizontal vs vertical scaling, API gateways, database sharding, and clean OOP designs for massive scale.",
    status: "upcoming",
    iconName: "Layers"
  },
  {
    id: "os",
    title: "Operating Systems",
    description: "Understand multithreading, concurrency patterns, virtual memory allocation, CPU scheduling, and process deadlocks.",
    status: "upcoming",
    iconName: "Compass"
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    description: "Deep dive into ACID transactions, indexing internals (B-Trees), SQL query optimization, concurrency protocols, and NoSQL engines.",
    status: "upcoming",
    iconName: "Building2"
  },
  {
    id: "networks",
    title: "Computer Networks",
    description: "Master TCP/IP handshakes, DNS routing, HTTP headers, socket connections, and encryption mechanics behind HTTPS security.",
    status: "upcoming",
    iconName: "Sparkles"
  }
];

export default function LearnCatalogPage() {
  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutDashboard":
        return <Terminal size={22} className="text-brand-500" />;
      case "Layers":
        return <Layers size={22} className="text-emerald-500" />;
      case "Compass":
        return <Compass size={22} className="text-blue-500" />;
      case "Building2":
        return <Building2 size={22} className="text-orange-500" />;
      default:
        return <Sparkles size={22} className="text-purple-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-8 px-4 sm:px-6">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={13} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10 w-fit">
          <Sparkles size={10} className="animate-pulse" />
          <span>CrackDSA Learning Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Master Core Engineering Core Topics
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-2">
          Structured developer documentations, curated coding sheets, and visual algorithm guides designed to make you an elite problem solver.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {TRACKS.map((track, idx) => {
          const isActive = track.status === "active";
          
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`flex flex-col justify-between rounded-3xl border p-6.5 bg-white dark:bg-gray-900 transition-all ${
                isActive
                  ? "border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700"
                  : "border-gray-100 dark:border-gray-850/40 opacity-75 dark:opacity-60 bg-gray-50/50 dark:bg-gray-900/40"
              }`}
            >
              <div className="space-y-5">
                {/* Track Icon and Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700 shadow-inner">
                    {getTrackIcon(track.iconName)}
                  </div>
                  
                  {isActive ? (
                    track.badge && (
                      <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider border border-brand-500/10">
                        {track.badge}
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      <Lock size={8} />
                      <span>Coming Soon</span>
                    </span>
                  )}
                </div>

                {/* Text Title and Descriptions */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    {track.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    {track.description}
                  </p>
                </div>
              </div>

              {/* Action Trigger Card Footer */}
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                {isActive ? (
                  <Link
                    href={`/learn/${track.id}`}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-brand-500 hover:text-white dark:bg-gray-850 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all"
                  >
                    <span>Start Learning</span>
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/20 text-gray-400 dark:text-gray-600 text-xs font-bold select-none">
                    <span>Curriculum Locked</span>
                    <Lock size={12} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
