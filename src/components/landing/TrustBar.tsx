"use client";

import React from "react";
import { TRUST_COMPANIES } from "@/constants/landing";
import { Reveal } from "./Reveal";
import { Building2, Sparkles } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="relative py-12 bg-white dark:bg-[#080C14] border-y border-gray-200/80 dark:border-gray-800/80 transition-colors duration-300 select-none">
      <Reveal className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col items-center gap-6">
          
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
            <Sparkles size={12} className="text-brand-500" />
            <span>Alumni &amp; Mentors Placed At Top Companies</span>
          </div>

          {/* Company Badges Grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-1">
            {TRUST_COMPANIES.map((company) => (
              <div
                key={company}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-default"
              >
                <Building2 size={15} className="text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {company}
                </span>
              </div>
            ))}
          </div>

        </div>
      </Reveal>
    </section>
  );
}
