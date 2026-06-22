"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Clock, BrainCircuit, AlertCircle } from "lucide-react";

export default function RoadmapProcessAnimation() {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 mb-16 rounded-3xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-indigo-500/5" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 gap-12 md:gap-4">
        
        {/* Left: Inputs */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Target</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">FAANG / Tier 1</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Pacing</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">10 hours / week</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Weakness</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Dynamic Programming</p>
            </div>
          </motion.div>
        </div>

        {/* Middle: AI Engine */}
        <div className="flex-shrink-0 relative w-full md:w-auto flex justify-center py-8 md:py-0">
          {/* Animated connections (Hidden on mobile for simplicity) */}
          <svg className="absolute hidden md:block w-32 h-32 left-[-80px] top-1/2 -translate-y-1/2 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              d="M0,20 C40,20 60,50 100,50 M0,50 C40,50 60,50 100,50 M0,80 C40,80 60,50 100,50" 
              fill="none" 
              stroke="currentColor" 
              className="text-brand-500/20"
              strokeWidth="2" 
            />
            <motion.path 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              d="M0,20 C40,20 60,50 100,50 M0,50 C40,50 60,50 100,50 M0,80 C40,80 60,50 100,50" 
              fill="none" 
              stroke="currentColor" 
              className="text-brand-500"
              strokeWidth="2" 
            />
          </svg>

          <svg className="absolute hidden md:block w-32 h-32 right-[-80px] top-1/2 -translate-y-1/2 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              d="M0,50 C40,50 60,20 100,20 M0,50 C40,50 60,50 100,50 M0,50 C40,50 60,80 100,80" 
              fill="none" 
              stroke="currentColor" 
              className="text-indigo-500/20"
              strokeWidth="2" 
            />
            <motion.path 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              d="M0,50 C40,50 60,20 100,20 M0,50 C40,50 60,50 100,50 M0,50 C40,50 60,80 100,80" 
              fill="none" 
              stroke="currentColor" 
              className="text-indigo-500"
              strokeWidth="2" 
            />
          </svg>

          <motion.div 
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0)", "0 0 40px 10px rgba(99, 102, 241, 0.3)", "0 0 0 0 rgba(99, 102, 241, 0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-brand-500/30"
          >
            <BrainCircuit className="w-12 h-12 text-white" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/30"
            />
          </motion.div>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-3 w-full md:w-1/3">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-brand-500 border-y border-r border-gray-100 dark:border-gray-700"
          >
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Week 1: Array Patterns</p>
              <div className="mt-1.5 flex gap-1">
                <span className="w-1/3 h-1.5 rounded-full bg-emerald-400" />
                <span className="w-1/3 h-1.5 rounded-full bg-emerald-400" />
                <span className="w-1/3 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-indigo-500 border-y border-r border-gray-100 dark:border-gray-700"
          >
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Week 2-3: Master DP</p>
              <div className="mt-1.5 flex gap-1">
                <span className="w-1/4 h-1.5 rounded-full bg-brand-500" />
                <span className="w-1/4 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                <span className="w-1/4 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                <span className="w-1/4 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-purple-500 border-y border-r border-gray-100 dark:border-gray-700 opacity-60"
          >
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Week 4: Mock Interviews</p>
              <div className="mt-1.5 flex gap-1">
                <span className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
