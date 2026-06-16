import React from "react";
import { motion } from "framer-motion";
import { Trash2, Layers, Play, Target, Clock, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { RoadmapDBRecord } from "@/components/roadmap/types";
import { fadeInUp, hoverCard } from "@/utils/animations";

interface PausedRoadmapListProps {
  roadmaps: RoadmapDBRecord[];
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
}

export default function PausedRoadmapList({ roadmaps, onDelete, onActivate }: PausedRoadmapListProps) {
  if (roadmaps.length === 0) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6 pt-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Archived & Paused Tracks
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500" />
            Activating a paused track will safely suspend your current one.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roadmaps.map((roadmap) => (
          <motion.div 
            key={roadmap.id} 
            variants={hoverCard}
            whileHover="hover"
            className="group flex flex-col p-6 rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 relative overflow-hidden transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 backdrop-blur-sm"
          >
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    <Target size={10} />
                    {roadmap.user_input?.target_company_tier || "Tier 1"} Target
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-brand-500 transition-colors">
                  {roadmap.title}
                </h3>
              </div>
              
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to permanently delete this roadmap? This action cannot be undone.")) {
                    onDelete(roadmap.id);
                  }
                }}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0 shadow-sm"
                title="Delete Roadmap"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
               <div className="flex items-center gap-2.5">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                   <Clock size={14} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Duration</span>
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{roadmap.user_input?.duration_weeks || 12} Weeks</span>
                 </div>
               </div>
               <div className="flex items-center gap-2.5">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                   <Layers size={14} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Structure</span>
                   <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{roadmap.structure?.phases?.length || 0} Phases</span>
                 </div>
               </div>
            </div>

            <div className="mt-auto pt-5 border-t border-gray-100 dark:border-gray-800/80 relative z-10 flex justify-end">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto font-black text-sm text-brand-600 dark:text-brand-400 border-2 border-brand-200 dark:border-brand-500/20 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:border-brand-300 dark:hover:border-brand-500/40 rounded-xl flex items-center justify-center gap-2 h-12 transition-all"
                onClick={() => onActivate(roadmap.id)}
              >
                <Play size={16} className="fill-current" /> Activate This Track
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
