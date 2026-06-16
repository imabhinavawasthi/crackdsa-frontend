import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Award, Calendar, Clock, Layers, ArrowRight, Zap } from "lucide-react";
import { RoadmapDBRecord } from "@/components/roadmap/types";
import { fadeInUp } from "@/utils/animations";

interface ActiveRoadmapCardProps {
  roadmap: RoadmapDBRecord;
}

export default function ActiveRoadmapCard({ roadmap }: ActiveRoadmapCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="relative group"
    >
      {/* Background ambient glow that strengthens on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-brand-500 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
          </span>
          Current Active Track
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-300 z-10">
        {/* Decorative dynamic orb inside card */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand-500/30 transition-colors duration-700" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="pl-6.5 p-8 sm:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
          <div className="space-y-6 max-w-2xl flex-1">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-black uppercase tracking-widest border border-brand-200 dark:border-brand-500/20 shadow-sm">
                <Target size={14} className="opacity-80" />
                {roadmap.user_input?.target_role || "Software Engineer"}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <Award size={14} className="opacity-80" />
                {roadmap.user_input?.target_company_tier || "Tier 1"} Target
              </div>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 leading-tight tracking-tight">
              {roadmap.title}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-inner">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Timeline</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{roadmap.user_input?.duration_weeks || 12} Weeks</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-inner">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Commitment</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{roadmap.user_input?.time_per_week_hours || 10} Hrs/wk</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner">
                  <Layers size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-brand-500">Structure</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{roadmap.structure?.phases?.length || 0} Modules</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 self-stretch flex items-end lg:items-center">
            <Link 
              href={`/roadmap/${roadmap.id}`}
              className="relative group/btn w-full lg:w-auto inline-flex items-center justify-center bg-gray-900 hover:bg-gray-950 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 px-8 py-5 text-lg font-black rounded-2xl shadow-xl transition-all hover:shadow-brand-500/20 hover:-translate-y-1"
            >
              <Zap size={20} className="mr-2 text-amber-400 dark:text-amber-500" />
              Resume Journey
              <ArrowRight size={20} className="ml-3 group-hover/btn:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
