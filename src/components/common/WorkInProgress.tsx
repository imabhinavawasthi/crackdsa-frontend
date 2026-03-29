"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer, Sparkles, MoveRight, LayoutDashboard, Construction } from "lucide-react";
import Link from "next/link";

interface WorkInProgressProps {
  title: string;
}

export default function WorkInProgress({ title }: WorkInProgressProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-200/20 dark:bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl text-center z-10"
      >
        {/* Animated Icon Wrapper */}
        <div className="relative inline-block mb-8">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="w-24 h-24 sm:w-28 sm:h-28 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-2xl shadow-brand-500/10 flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
            <Construction className="w-10 h-10 sm:w-12 sm:h-12 text-brand-500" />
            
            {/* Corner Sparkles */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-3 right-3"
            >
              <Sparkles size={14} className="text-brand-300" />
            </motion.div>
          </motion.div>
          
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="absolute -bottom-2 -right-4 bg-brand-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border-2 border-white dark:border-gray-900"
          >
            Coming Soon
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Developing <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{title}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            We&apos;re currently crafting this experience to be perfect for your DSA journey. Stay tuned for something amazing!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-7 py-3.5 rounded-xl font-semibold shadow-xl shadow-gray-900/10 dark:shadow-white/5 transition-all hover:shadow-2xl hover:shadow-gray-900/20 dark:hover:shadow-white/10"
            >
              <LayoutDashboard size={18} />
              <span>Back to Dashboard</span>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ backgroundColor: "rgba(70, 95, 255, 0.05)" }}
            className="flex items-center justify-center gap-2 text-brand-600 font-semibold px-7 py-3.5 rounded-xl border border-brand-200 dark:border-brand-500/20 transition-all hover:border-brand-300"
          >
            <span>Notify Me</span>
            <MoveRight size={18} className="translate-y-[0.5px]" />
          </motion.button>
        </div>

        {/* Progress Minimalist */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-center gap-8">
           <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">85%</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Design</span>
           </div>
           <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
           <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">40%</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Build</span>
           </div>
           <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
           <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Planning</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Status</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
