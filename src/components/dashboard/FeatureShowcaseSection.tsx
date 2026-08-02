"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TvMinimalPlay, Sparkles, Layers } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/animations";

const showcaseFeatures = [
  {
    title: "Live Classes & Sessions",
    description: "Interactive live DSA sessions, doubt clearing, and real-time guidance from top mentors.",
    icon: TvMinimalPlay,
    href: "/live-sessions",
    gradient: "from-rose-500 to-pink-600",
    badge: "Live",
    badgeClass: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  },
  {
    title: "Bootcamps & Masterclasses",
    description: "Intensive skill-building bootcamps and expert-led masterclasses for high-impact interview prep.",
    icon: Sparkles,
    href: "/masterclasses",
    gradient: "from-amber-500 to-orange-600",
    badge: "Featured",
    badgeClass: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  },
  {
    title: "Topic-wise Learning",
    description: "Master individual concepts step-by-step with structured modules across Arrays, Trees, Graphs & DP.",
    icon: Layers,
    href: "/practice/topics",
    gradient: "from-emerald-500 to-teal-600",
    badge: "Popular",
    badgeClass: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  },
];

export function FeatureShowcaseSection({ isLoggedIn }: { isLoggedIn: boolean }) {
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
            Explore Learning Programs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            Accelerate your growth with live sessions, masterclasses, and topic modules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {showcaseFeatures.map((feature) => (
          <motion.div key={feature.title} variants={fadeInUp}>
            <Link href={feature.href} className="block group h-full">
              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl p-8 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.1)] hover:-translate-y-1.5 hover:border-violet-500/30">
                
                {/* Glowing ambient light background */}
                <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 dark:opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none`} />
                <div className={`absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 blur-3xl transition-opacity duration-700 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-[0_8px_20px_-4px_rgba(99,102,241,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon size={26} />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider border ${feature.badgeClass}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3 font-medium">
                    {feature.description}
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-white/5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white shadow-xs group-hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
                    <span>{isLoggedIn ? "Explore" : "View Details"}</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
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
