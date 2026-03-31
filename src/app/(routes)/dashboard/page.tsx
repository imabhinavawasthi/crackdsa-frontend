"use client";

import React from "react";
import { 
  Sparkles, 
  Compass, 
  Zap, 
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Building2,
  Layers,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const resourceCategories = [
    {
      title: "Core Learning",
      items: [
        { name: "AI Roadmap", href: "/roadmap", icon: <Compass size={18} className="text-blue-500" />, badge: "AI Powered", pro: false },
        { name: "DSA Sheets", href: "/dsa-sheet", icon: <LayoutDashboard size={18} className="text-brand-500" />, badge: "75+ Probs", pro: false },
        { name: "Masterclasses", href: "/masterclasses", icon: <BookOpen size={18} className="text-purple-500" />, pro: true }
      ]
    },
    {
      title: "Practice & Mastery",
      items: [
        { name: "Topic Practice", href: "/practice/topics", icon: <Layers size={18} className="text-emerald-500" />, pro: false },
        { name: "Company Specific", href: "/practice/companies", icon: <Building2 size={18} className="text-orange-500" />, pro: true },
        { name: "Problem Arena", href: "/practice", icon: <Zap size={18} className="text-yellow-500" />, badge: "2k+", pro: false }
      ]
    },
    {
      title: "Career & Tools",
      items: [
        { name: "Resume Builder", href: "/resume", icon: <FileText size={18} className="text-rose-500" />, pro: false },
        { name: "1-on-1 Mentorship", href: "/personalized", icon: <Sparkles size={18} className="text-blue-400" />, badge: "Premium", pro: true },
        { name: "Community", href: "/community", icon: <Users size={18} className="text-indigo-400" />, pro: false }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-4 px-4 sm:px-6">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Explore Resources
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
          All the features, practice tools, and career findings available in CrackDSA.
        </p>
      </div>

      {/* 2. Compact Resource Navigation (Grid of lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {resourceCategories.map((category, idx) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 + (idx * 0.1) }}
            className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 px-1 tracking-tight">
              {category.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              {category.items.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-[14px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors text-[15px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <span className="hidden sm:inline-block rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        {item.badge}
                      </span>
                    )}
                    {item.pro && (
                      <span className="rounded-lg bg-brand-500 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-sm shadow-brand-500/20">
                        Pro
                      </span>
                    )}
                    <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
