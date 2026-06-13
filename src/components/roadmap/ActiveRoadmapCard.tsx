import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Award, Calendar, Clock, Layers, ArrowRight } from "lucide-react";
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
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Syllabus
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900/40 shadow-2xl shadow-brand-500/5 hover:shadow-brand-500/10 transition-shadow duration-300">
        {/* Edge decorative border gradient */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-b from-brand-500 via-indigo-500 to-purple-600" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="pl-6.5 p-8 sm:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50/80 dark:bg-brand-500/10 backdrop-blur-sm text-brand-600 dark:text-brand-400 rounded-lg text-[10px] font-black uppercase tracking-wider border border-brand-100 dark:border-brand-500/20">
                <Target size={12} />
                {roadmap.user_input?.target_role || "Software Engineer"}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 dark:bg-amber-500/10 backdrop-blur-sm text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-100 dark:border-amber-500/20">
                <Award size={12} />
                {roadmap.user_input?.target_company_tier || "Tier 1"}
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-gray-955 dark:text-white leading-tight tracking-tight">
              {roadmap.title}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 pt-1 text-xs">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                  <Calendar size={14} />
                </div>
                <span>{roadmap.user_input?.duration_weeks || 12} Weeks</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                  <Clock size={14} />
                </div>
                <span>{roadmap.user_input?.time_per_week_hours || 10} Hrs/week</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold col-span-2 sm:col-span-1">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                  <Layers size={14} />
                </div>
                <span>{roadmap.structure?.phases?.length || 0} Phase Nodes</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 self-stretch flex items-end lg:items-center">
            <Link 
              href={`/roadmap/${roadmap.id}`}
              className="group w-full lg:w-auto inline-flex items-center justify-center bg-gray-950 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-50 dark:text-gray-950 text-white px-8 py-4 text-base font-bold rounded-2xl shadow-xl transition-all hover:shadow-brand-500/10 active:scale-98"
            >
              Resume Journey
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
