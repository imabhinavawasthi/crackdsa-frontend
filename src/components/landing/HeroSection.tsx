"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { HERO_STATS, HERO_ROTATING_WORDS, HERO_VIDEO_ID } from "@/constants/landing";

/* ─── Rotating Word ───────────────────────────────────────────────────────── */

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block w-[4.5em] text-left align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={HERO_ROTATING_WORDS[index]}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-0 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-brand-500"
        >
          {HERO_ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">
        {HERO_ROTATING_WORDS.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  );
}

/* ─── Hero Section ────────────────────────────────────────────────────────── */

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-gray-950"
    >
      {/* ── Premium Background Effects ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[140px] opacity-60"
        />
        <motion.div
          animate={{
            x: [0, -60, 60, 0],
            y: [0, 60, -60, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[15%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50"
        />
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] opacity-40"
        />

        {/* Sophisticated Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Premium Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-3 p-[1px] rounded-full bg-gradient-to-r from-brand-500/30 via-indigo-500/30 to-purple-500/30">
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gray-950/90 backdrop-blur-md text-xs font-semibold text-gray-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  First AI Driven DSA Platform
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm"
            >
              Stop grinding.
              <br />
              Start learning with
              <br />
              <RotatingWord />
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg sm:text-xl text-gray-400 max-w-lg leading-relaxed font-medium"
            >
              AI-personalised roadmaps, pattern-first curriculum, and curated
              DSA sheets — everything you need to crack your dream company.
            </motion.p>

            {/* Premium CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-gray-950 font-black text-sm transition-all hover:bg-gray-100 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 active:scale-[0.98] overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Start Learning Free
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/pro"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-white/10 hover:border-brand-500/50 hover:bg-brand-500/10 text-white font-bold text-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/20 active:scale-[0.98]"
              >
                <Sparkles
                  size={18}
                  className="text-amber-400 transition-transform group-hover:scale-110 group-hover:rotate-12"
                />
                Explore PRO
              </Link>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex items-center gap-10 pt-6 border-t border-white/[0.06] mt-2"
            >
              {HERO_STATS.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-3xl font-black bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    {stat.bold}
                  </span>
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Premium YouTube Embed ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.94 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative lg:ml-8 perspective-1000"
          >
            {/* Glowing Aura */}
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-indigo-500/20 to-purple-500/30 blur-3xl opacity-60 mix-blend-screen animate-pulse-slow" />
            
            {/* Glass Container */}
            <div className="relative rounded-3xl p-2 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] shadow-2xl shadow-black/50 transform-gpu hover:rotate-1 hover:scale-[1.02] transition-all duration-500">
              {/* Top Bar for Mac-like aesthetic */}
              <div className="flex gap-2 items-center px-4 py-3 border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-inner" />
              </div>
              
              <div className="relative rounded-b-2xl rounded-t-sm overflow-hidden bg-gray-950">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                    title="CrackDSA Introduction"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll hint ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
      >
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Scroll to explore</div>
        <div className="w-5 h-8 rounded-full border-2 border-gray-700/50 flex items-start justify-center p-1 bg-gray-950/50 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(var(--brand-400),0.8)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
