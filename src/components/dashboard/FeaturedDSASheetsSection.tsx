"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutDashboard, ChevronRight, ArrowRight } from "lucide-react";
import { featuredDSASheets } from "@/config/dashboard";
import { fadeInUp, staggerContainer } from "@/utils/animations";

export function FeaturedDSASheetsSection() {
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
                <div className={`relative w-full h-32 bg-linear-to-br ${sheet.color} overflow-hidden`}>
                  <Image
                    src={sheet.image}
                    alt={sheet.title}
                    fill
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
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
