"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Video, GraduationCap, Compass, FileText, LockOpen } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/animations";

export function ProExclusiveSection() {
  const proExclusiveTools = [
    {
      title: "Live Classes & Masterclasses",
      description: "Interactive learning with live problem solving sessions and cohorts.",
      icon: Video,
      href: "/live-sessions",
      gradient: "from-emerald-400 to-teal-600",
    },
    {
      title: "All Premium Courses",
      description: "Explore all cohorts and self-paced video lessons in full detail.",
      icon: GraduationCap,
      href: "/courses",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "AI Roadmap Builder",
      description: "Generate highly customized roadmap plans and track your progress.",
      icon: Compass,
      href: "/roadmap",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Handbooks & Resources",
      description: "Access pattern handbooks, reference cheat sheets, and lecture notes.",
      icon: FileText,
      href: "/resources",
      gradient: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-amber-400 to-orange-500">
          <Crown size={14} className="text-white" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Pro Tools</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {proExclusiveTools.map((tool) => (
          <motion.div key={tool.title} variants={fadeInUp}>
            <Link href={tool.href} className="block group h-full">
              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl p-8 h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] hover:-translate-y-1.5 hover:border-amber-500/30">
                
                {/* Glowing ambient light background */}
                <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 dark:opacity-15 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon container with shadow */}
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <tool.icon size={26} />
                    </div>
                    <span className="rounded-full bg-emerald-100/80 dark:bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                      <LockOpen size={10} className="inline mr-1 -mt-0.5" /> Unlocked
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow line-clamp-3 font-medium">
                    {tool.description}
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
