"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { platformFeatures } from "@/config/dashboard";
import { fadeInUp, staggerContainer } from "@/utils/animations";

interface FeatureShowcaseSectionProps {
  isLoggedIn: boolean;
}

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
              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl p-8 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.1)] hover:-translate-y-1.5 hover:border-violet-500/30">
                
                {/* Glowing ambient light background */}
                <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 dark:opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none`} />
                <div className={`absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 blur-3xl transition-opacity duration-700 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon container with shadow and scale animation */}
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-[0_8px_20px_-4px_rgba(99,102,241,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon size={26} />
                    </div>
                    {feature.badge && (
                      <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider border ${
                        feature.badge === "AI"
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                          : feature.badge === "Popular"
                          ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-500/20"
                          : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3 font-medium">
                    {feature.description}
                  </p>

                  {/* Action Button with Slide/Fill Animation */}
                  <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-white/5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white shadow-xs group-hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
                    <span>{isLoggedIn ? "Continue learning" : "Explore Feature"}</span>
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
