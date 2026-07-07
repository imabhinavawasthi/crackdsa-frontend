"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ChevronRight, Lock } from "lucide-react";
import { proFeatures } from "@/config/dashboard";
import { fadeInUp, staggerContainer } from "@/utils/animations";

export function ProFeaturesSection({ isPro }: { isPro: boolean }) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {proFeatures.map((feature) => (
          <motion.div key={feature.title} variants={fadeInUp}>
            <Link href={feature.href} className="block group h-full">
              <div className="relative overflow-hidden rounded-[2rem] border border-amber-200/50 dark:border-amber-500/10 bg-linear-to-br from-amber-50/40 to-orange-50/20 dark:from-[#1E1711]/65 dark:to-[#17110C]/40 backdrop-blur-2xl p-8 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] hover:-translate-y-1.5 hover:border-amber-500/30">
                
                {/* Glowing ambient light background */}
                <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 dark:opacity-15 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon container with shadow */}
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon size={26} />
                    </div>
                    <span className="rounded-full bg-amber-100/80 dark:bg-amber-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                      <Lock size={10} className="inline mr-1 -mt-0.5" /> Pro
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3 font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
