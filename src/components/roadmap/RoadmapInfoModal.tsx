import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Briefcase, Clock, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { RoadmapUserInput } from "./types";
import Button from "../ui/button/Button";

interface RoadmapInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInput?: RoadmapUserInput;
}

export default function RoadmapInfoModal({ isOpen, onClose, userInput }: RoadmapInfoModalProps) {
  if (!userInput) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="relative p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors z-10"
                >
                  <X size={20} />
                </button>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-brand-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Roadmap Configuration
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      The parameters used by AI to generate this curriculum
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Core Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                      <Briefcase size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Target Role</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {userInput.target_role}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {userInput.experience_level} • {userInput.target_company_tier}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Pacing</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {userInput.time_per_week_hours} Hrs / Week
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      For {userInput.duration_weeks} weeks total
                    </p>
                  </div>
                </div>

                {/* Topics Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Strong Topics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={18} />
                      <h3 className="font-bold">Strong Concepts</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userInput.strong_topics?.length > 0 ? (
                        userInput.strong_topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-sm font-medium">
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">None specified</span>
                      )}
                    </div>
                  </div>

                  {/* Weak Topics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertTriangle size={18} />
                      <h3 className="font-bold">Focus Areas</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userInput.weak_topics?.length > 0 ? (
                        userInput.weak_topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-sm font-medium">
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">None specified</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/80 flex justify-end">
                <Button onClick={onClose} variant="outline" className="px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
