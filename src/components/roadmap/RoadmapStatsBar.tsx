import React from "react";
import { motion } from "framer-motion";
import { Target, Flame, Star } from "lucide-react";
import ProgressRing from "@/components/roadmap/ProgressRing";
import { RoadmapDBRecord, Topic } from "@/components/roadmap/types";
import { scaleIn, staggerContainer } from "@/utils/animations";

interface RoadmapStatsBarProps {
  overall: { total: number; done: number; percent: number };
  currentTopic: Topic | null;
  targetRoadmap: RoadmapDBRecord | null;
}

export default function RoadmapStatsBar({ overall, currentTopic, targetRoadmap }: RoadmapStatsBarProps) {
  // Calculate current topic progress
  const getTopicProgress = (topic: Topic) => {
    const total = topic.items.length;
    const done = topic.items.filter((p) => p.status === "completed").length;
    return { total, done };
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* Overall Progress Card */}
      <motion.div
        variants={scaleIn}
        className="sm:col-span-2 lg:col-span-1 relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5"
      >
        <div className="flex items-center gap-4">
          <ProgressRing percent={overall.percent} />
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              {overall.percent}%
            </motion.p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Completion
            </p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-2xl" />
      </motion.div>

      {/* Current Topic */}
      <motion.div
        variants={scaleIn}
        className="relative overflow-hidden rounded-2xl border border-brand-200 dark:border-brand-500/30 bg-gradient-to-br from-brand-50 to-white dark:from-brand-500/5 dark:to-gray-800/50 p-5"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center"
          >
            <Target size={20} className="text-brand-500" />
          </motion.div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-555 uppercase tracking-wider font-semibold">
              Now Studying
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5 truncate">
              {currentTopic?.title ?? "-"}
            </p>
            <p className="text-xs text-brand-500 dark:text-brand-400 mt-0.5 font-bold">
              {currentTopic
                ? `${getTopicProgress(currentTopic).done}/${getTopicProgress(currentTopic).total} done`
                : "All caught up!"}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-brand-500/5 rounded-full blur-xl" />
      </motion.div>

      {/* Streak */}
      <motion.div
        variants={scaleIn}
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center"
          >
            <Flame size={20} className="text-amber-500" />
          </motion.div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-555 uppercase tracking-wider font-semibold">
              Habit
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
              Keep going!
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-555 mt-0.5">
              Practice daily
            </p>
          </div>
        </div>
      </motion.div>

      {/* Problems Today / Pacing */}
      <motion.div
        variants={scaleIn}
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <Star size={20} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-555 uppercase tracking-wider font-semibold">
              Pacing
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
              {targetRoadmap?.user_input?.time_per_week_hours} hrs/week
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-555 mt-0.5">
              Duration: {targetRoadmap?.user_input?.duration_weeks} weeks
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
