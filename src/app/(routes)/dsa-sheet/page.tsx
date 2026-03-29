"use client";

import React from "react";
import { 
  Sparkles, 
  BookOpen, 
  Zap, 
  Dumbbell, 
  Clock,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DSASheetsPage() {
  const categories = [
    {
      id: "curated",
      name: "Top Curated Sheets",
      description: "Proven collections used by thousands to crack top tier companies.",
      sheets: [
        {
          title: "CrackDSA 75",
          description: "A compact list of 75 essential problems for quick preparation.",
          problems: 75,
          difficulty: "Mixed",
          slug: "crackdsa-75",
          isNew: false,
          pro: false
        },
        {
          title: "Strivers A2Z Sheet",
          description: "Comprehensive sheet covering everything from basics to advanced.",
          problems: 450,
          difficulty: "All Levels",
          slug: "strivers-a2z",
          isNew: false,
          pro: false
        },
        {
          title: "Love Babbar 450",
          description: "The classic collection of 450 questions for complete mastery.",
          problems: 450,
          difficulty: "Moderate",
          slug: "love-babbar-450",
          isNew: false,
          pro: false
        }
      ]
    },
    {
      id: "specialized",
      name: "Specialized Sprints",
      description: "Focused tracks for specific goals or timelines.",
      sheets: [
        {
          title: "Pattern Mastery",
          description: "Learn to solve 15+ recurring DSA patterns efficiently.",
          problems: 120,
          difficulty: "Intermediate",
          slug: "pattern-mastery",
          isNew: true,
          pro: true
        },
        {
          title: "30-Day Sprint",
          description: "Optimized for candidates with interviews in less than a month.",
          problems: 90,
          difficulty: "Intense",
          slug: "30-day-sprint",
          isNew: false,
          pro: true
        },
        {
          title: "DSA Kickstart",
          description: "Absolute basics for university students and freshers.",
          problems: 50,
          difficulty: "Beginner",
          slug: "kickstart",
          isNew: false,
          pro: false
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-brand-500 font-bold text-sm tracking-wider uppercase mb-3"
          >
            <BookOpen size={16} />
            <span>Learning Collections</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            DSA Sheets <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Library</span>
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Choose from our highly curated problem sets designed to help you master patterns and crack tech interviews.
          </p>
        </div>

        {/* Search/Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search sheets..."
              className="h-11 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Categories */}
      {categories.map((category, catIdx) => (
        <section key={category.id} className="space-y-6">
          <div className="px-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {category.name}
              {catIdx === 0 && <Sparkles size={16} className="text-orange-400" />}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.sheets.map((sheet, idx) => (
              <motion.div
                key={sheet.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  href={`/dsa-sheet/${sheet.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/5 dark:border-gray-800 dark:bg-gray-900/50"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                      <Zap size={22} />
                    </div>
                    <div className="flex gap-2">
                      {sheet.isNew && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-500/10">
                          New
                        </span>
                      )}
                      {sheet.pro && (
                        <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
                    {sheet.description}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <Dumbbell size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">{sheet.problems} Probs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">{sheet.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-900 transition-all group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                    <span>Start Practice</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* Footer Suggestion */}
      <div className="rounded-3xl bg-gray-50 p-10 text-center dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800">
         <h3 className="text-xl font-bold text-gray-900 dark:text-white">Didn&apos;t find what you&apos;re looking for?</h3>
         <p className="mt-2 text-gray-500 dark:text-gray-400">We&apos;re constantly adding new sheets based on community feedback.</p>
         <button className="mt-6 font-bold text-brand-500 hover:text-brand-600 transition-colors">Suggest a New Sheet →</button>
      </div>
    </div>
  );
}
