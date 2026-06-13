import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Phase } from "@/components/roadmap/types";
import TopicCard from "@/components/roadmap/TopicCard";
import { getPhaseProgress, phaseColorMap } from "@/utils/roadmapUtils";
import { staggerContainer } from "@/utils/animations";

interface PhaseTimelineProps {
  phases: Phase[];
}

export default function PhaseTimeline({ phases }: PhaseTimelineProps) {
  return (
    <div className="space-y-10">
      {phases.map((phase, phaseIndex) => {
        const progress = getPhaseProgress(phase);
        const colors = phaseColorMap[phase.color] || phaseColorMap["blue"]; // fallback
        const isActive = phase.topics.some(
          (t) => t.status === "in-progress" || t.items.some((i) => i.status === "current")
        );
        const isCompleted = phase.topics.every(
          (t) => t.status === "completed" || t.items.every((i) => i.status === "completed")
        );

        return (
          <div key={phase.id} className="relative">
            {/* Phase connector line */}
            {phaseIndex < phases.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.6 + phaseIndex * 0.15, duration: 0.8, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 hidden lg:block"
              />
            )}

            {/* Phase Header */}
            <div className="flex items-center gap-4 mb-6">
              {/* Phase number badge */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + phaseIndex * 0.15, type: "spring", stiffness: 200, damping: 18 }}
                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${colors.gradient} shadow-lg ${
                  isActive ? "shadow-brand-500/30 ring-4 " + colors.ring : ""
                }`}
              >
                {isCompleted ? <CheckCircle2 size={22} /> : phaseIndex + 1}
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {phase.title}
                  </h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                    {progress.done}/{progress.total}
                  </span>
                  {isActive && !isCompleted && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-xs font-semibold text-brand-500"
                    >
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                      In Progress
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-555 mt-0.5">
                  {phase.subtitle}
                </p>
              </div>

              {/* Phase Progress Bar */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ delay: 0.5 + phaseIndex * 0.15, duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${colors.progressBar}`}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right font-mono">
                  {progress.percent}%
                </span>
              </div>
            </div>

            {/* Topics Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3 lg:ml-14"
            >
              {phase.topics.map((topic, topicIndex) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  index={topicIndex}
                />
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
