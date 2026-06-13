import React from "react";
import { motion } from "framer-motion";
import { Trash2, Layers, Play } from "lucide-react";
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
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
          Paused Study Tracks
        </h2>
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-md">
          Activating a track will pause your current one safely.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roadmaps.map((roadmap) => (
          <motion.div 
            key={roadmap.id} 
            variants={hoverCard}
            whileHover="hover"
            className="flex flex-col p-6 rounded-[1.5rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20 relative overflow-hidden group transition-all opacity-80 hover:opacity-100 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700"
          >
            <div className="flex justify-between items-start gap-4 mb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-[9px] font-black uppercase tracking-wider">
                  {roadmap.user_input?.target_role || "SDE"}
                </div>
                <h3 className="text-base font-bold text-gray-955 dark:text-white line-clamp-1">
                  {roadmap.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold block">
                  Target: {roadmap.user_input?.target_company_tier || "Tier 1"} Tier
                </p>
              </div>
              
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this roadmap? This action is permanent.")) {
                    onDelete(roadmap.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                title="Delete Roadmap"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Layers size={14} className="text-gray-400" />
                {roadmap.structure?.phases?.length || 0} Phases
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                className="font-bold text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-500/20 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl flex items-center gap-1.5 h-9"
                onClick={() => onActivate(roadmap.id)}
              >
                <Play size={12} className="fill-current" /> Set Active
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
