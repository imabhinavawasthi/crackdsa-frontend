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
              <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm p-6 h-full transition-all hover:shadow-xl hover:-translate-y-1 hover:border-gray-300/80 dark:hover:border-gray-700/80">
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-linear-to-br ${feature.gradient} opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${feature.gradient} text-white shadow-lg`}>
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
