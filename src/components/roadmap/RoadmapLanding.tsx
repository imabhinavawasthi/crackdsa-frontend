"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Target, BookOpen, Flame, Sparkles } from "lucide-react";
import Button from "@/components/ui/button/Button";
import RoadmapProcessAnimation from "@/components/roadmap/RoadmapProcessAnimation";
import { scaleIn, staggerContainer } from "@/utils/animations";

export default function RoadmapLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 max-w-5xl mx-auto py-16 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-gradient-to-b from-brand-500/10 via-indigo-500/5 to-transparent rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero title */}
      <motion.h1 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
        className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-955 dark:text-white mb-6 tracking-tight leading-[1.1]"
      >
        One size <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600">
          fits nobody.
          <svg className="absolute w-full h-4 -bottom-1 left-0 text-brand-500/30" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mb-12 leading-relaxed"
      >
        Study plans shouldn't be copy-pasted. <b className="text-gray-900 dark:text-white">Why follow a generic DSA track?</b> Generate an adaptive, custom curriculum built exclusively around your strengths, weaknesses, timeline, and goals.
      </motion.p>

      {/* Animation Visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.28, duration: 0.7 }}
        className="w-full relative z-10 mb-14"
      >
        <RoadmapProcessAnimation />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-4 mb-20"
      >
        {isLoggedIn ? (
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none" />
            <Button 
              className="relative bg-brand-600 hover:bg-brand-700 text-white rounded-full px-12 py-5 h-auto text-lg font-bold shadow-2xl transition-transform active:scale-98" 
              onClick={() => router.push("/roadmap/onboarding")}
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              Generate Custom Roadmap
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Link href="/login?redirect=/roadmap" className="relative group">
              <div className="absolute -inset-1 bg-brand-500/25 rounded-full blur opacity-50 group-hover:opacity-80 transition duration-300 pointer-events-none" />
              <Button className="relative bg-gray-950 hover:bg-gray-900 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 rounded-full px-10 py-4 h-auto text-base font-bold shadow-xl">
                Sign In to Create Roadmap
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              Tailored AI features reserved for CrackDSA users
            </p>
          </div>
        )}
      </motion.div>

      {/* Core Value Props */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
      >
        <motion.div variants={scaleIn} className="p-8 rounded-3xl bg-white/80 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800/80 shadow-sm backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-6 shadow-sm border border-blue-100/50 dark:border-blue-500/10 group-hover:scale-110 transition-transform duration-300">
            <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2.5">Target Focused</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
            Difficulty and problem distributions are customized specifically whether you target FAANG, fast-paced startups, or services.
          </p>
        </motion.div>

        <motion.div variants={scaleIn} className="p-8 rounded-3xl bg-white/80 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800/80 shadow-sm backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center mb-6 shadow-sm border border-brand-100/50 dark:border-brand-500/10 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2.5">Adaptive Engine</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
            Our algorithm schedules more practice for weak topics and skips concepts you've already verified you understand.
          </p>
        </motion.div>

        <motion.div variants={scaleIn} className="p-8 rounded-3xl bg-white/80 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800/80 shadow-sm backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-6 shadow-sm border border-purple-100/50 dark:border-purple-500/10 group-hover:scale-110 transition-transform duration-300">
            <Flame className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2.5">Perfectly Paced</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
            Whether you prepare in 4 weeks or 6 months, visual syllabus items distribute dynamically to fit your exact availability.
          </p>
        </motion.div>
      </motion.div>

    </div>
  );
}
