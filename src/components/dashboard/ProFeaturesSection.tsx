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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {proFeatures.map((feature) => (
          <motion.div key={feature.title} variants={fadeInUp}>
            <Link href={feature.href} className="block group h-full">
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/40 dark:border-amber-500/10 bg-linear-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 backdrop-blur-sm p-6 h-full transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 hover:border-amber-300/60 dark:hover:border-amber-500/20">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} text-white shadow-md`}>
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
