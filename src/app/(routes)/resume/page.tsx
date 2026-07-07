"use client";

import React from "react";
import { Sparkles, FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeBuilderPage() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 overflow-hidden select-none">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[450px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl text-center space-y-8 md:space-y-10">
        
        {/* Animated Feature Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-violet-600 to-indigo-650 text-white shadow-2xl shadow-violet-500/20">
            <FileText size={36} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500"></span>
            </span>
          </div>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/5 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs font-black uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" />
            Under Development
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            AI-Powered Resume Builder
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            We are engineering a state-of-the-art personalized resume generator. 
            It will dynamically align your academic projects, coding achievements, and 
            CrackDSA progress metrics into a highly optimized, ATS-compliant format.
          </p>
        </motion.div>

        {/* Dynamic Fallback Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 md:p-8 rounded-[2rem] border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0D111C]/65 backdrop-blur-2xl shadow-xl max-w-2xl mx-auto space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              Need a Resume Right Away?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              While we finish building the AI creator, you can build a premium, ATS-ready resume 
              instantly on our sister platform, Coding75.
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="http://coding75.com/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 group text-sm cursor-pointer"
            >
              <span>Use Coding75 Resume Builder</span>
              <ExternalLink size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
