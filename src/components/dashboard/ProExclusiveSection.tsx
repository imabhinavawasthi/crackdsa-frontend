"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, MessageSquare, Video, Users } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/utils/animations";

export function ProExclusiveSection() {
  const proExclusiveTools = [
    {
      title: "1:1 Mentorship",
      description: "Schedule sessions with experienced engineers",
      icon: Users,
      href: "/pro/personalized",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      title: "Priority Support",
      description: "Get quick assistance from our technical staff",
      icon: MessageSquare,
      href: "/support",
      gradient: "from-rose-400 to-pink-600",
    },
    {
      title: "Live Classes",
      description: "Interactive sessions with expert instructors",
      icon: Video,
      href: "/live-sessions",
      gradient: "from-emerald-400 to-teal-600",
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {proExclusiveTools.map((tool) => (
          <motion.div key={tool.title} variants={fadeInUp}>
            <Link href={tool.href} className="block group">
              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${tool.gradient} text-white shadow-md mb-3`}>
                  <tool.icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tool.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
