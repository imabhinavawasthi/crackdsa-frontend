"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gem, CheckCircle2, Crown, ArrowRight } from "lucide-react";
import { fadeInUp } from "@/utils/animations";

interface UpgradeBannerProps {
  isLoggedIn: boolean;
  title?: string;
  description?: string;
}

export function UpgradeBanner({ isLoggedIn, title, description }: UpgradeBannerProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-amber-300/30 dark:border-amber-500/15">
        <div className="absolute inset-0 bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Gem size={26} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {title || (isLoggedIn ? "Upgrade to Pro" : "Start with Pro")}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed font-medium">
                {description || "Unlock live masterclasses, doubt sessions, premium roadmaps, and all pro courses."}
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                {["Weekly Doubt Sessions", "Live Classes", "Premium Roadmaps", "All Courses"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <CheckCircle2 size={12} className="text-amber-500" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={isLoggedIn ? "/checkout/pro" : "/pro"}
            className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
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
