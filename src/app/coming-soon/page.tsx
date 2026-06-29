"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Code, Cpu, Orbit } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between bg-gray-950 text-white overflow-hidden font-sans select-none px-4 py-8">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Top Header/Logo */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 shadow-lg shadow-brand-500/25">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            crack<span className="text-brand-400">DSA</span>
          </span>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-3xl text-center my-12">
        {/* Animated Feature Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.2 
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute text-brand-500/40"
            >
              <Orbit className="h-14 w-14" />
            </motion.div>
            <Cpu className="h-8 w-8 text-brand-400 relative z-10" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent px-2"
        >
          We are building something that is <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            never done before in DSA
          </span>
        </motion.h1>

        {/* Subtitle / Descriptive Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl mb-8 px-4"
        >
          Stay Tuned. Your personalized DSA platform is coming to revolutionize how you master algorithms.
        </motion.p>

        {/* Dynamic Waiting Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center gap-3.5"
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-bounce" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Coming Soon...
          </span>
        </motion.div>
      </main>

      {/* Footer credits */}
      <footer className="relative z-10 w-full text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-sm text-gray-600 font-medium"
        >
          &copy; {new Date().getFullYear()} crackDSA. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
}
