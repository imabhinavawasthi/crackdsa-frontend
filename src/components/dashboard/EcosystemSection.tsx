"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ecosystemLinks } from "@/config/dashboard";
import { fadeInUp, staggerContainer } from "@/utils/animations";

export function EcosystemSection() {
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
