"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  ArrowRight,
  Play,
  Check,
  Sparkles,
  Video,
  Rocket,
  User,
} from "lucide-react";
import { HERO_CONFIG } from "@/config/pro-page-config";
import { HERO_SOCIAL_LOGOS } from "@/config/pro-logos";

export function ProHero() {
  const phrases = HERO_CONFIG.rotatingPhrases || [
    "Crack Interviews.",
    "Dream Tech Offers.",
    "Tier-1 Placements.",
    "FAANG & Startups.",
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [phrases.length]);
  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 sm:py-12 overflow-hidden">
      {/* ── 1. Background Grid & Luminous Aurora Horizon ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-10" />

      {/* Aurora Horizon Arc & Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Horizon Arc */}
        <div className="absolute -top-[280px] sm:-top-[340px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1500px] h-[480px] sm:h-[580px] rounded-[100%] border-t-2 border-brand-500/40 dark:border-brand-400/50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)]" />
        <div className="absolute -top-[278px] sm:-top-[338px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1500px] h-[480px] sm:h-[580px] rounded-[100%] border-t border-indigo-400/30 dark:border-indigo-300/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)] blur-[2px]" />

        {/* Overhead Aurora Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[460px] bg-gradient-to-b from-brand-500/25 via-indigo-600/15 to-transparent rounded-full blur-[100px]" />

        {/* Side Ambient Flares */}
        <div className="absolute top-1/4 -right-28 w-96 h-96 bg-brand-500/15 dark:bg-brand-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 -left-28 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 my-auto">
        
        {/* ── Main Hero Split: Left Content + Right Video Player ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2 sm:pt-4">
          
          {/* ── Left Column: Value Proposition & CTA ── */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Top Eyebrow Pill + Hand-Drawn Note */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider shadow-xs">
                <Rocket className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{HERO_CONFIG.badge}</span>
              </div>

              {/* Hand-drawn scribble arrow indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 italic">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="rotate-6">
                  <path d="M2 14C8 12 14 6 22 2M22 2C18 3 16 5 15 7M22 2C19 6 18 8 18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-sans text-[11px] tracking-tight">{HERO_CONFIG.note}</span>
              </div>
            </div>

            {/* Main Headline with Rotating Highlight Phrase */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.08]">
              {HERO_CONFIG.headlinePrefix} <br />
              {HERO_CONFIG.headlineMiddle} <br />
              <span className="inline-block relative h-[1.18em] overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phrases[phraseIndex]}
                    initial={{ y: 35, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -35, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 dark:from-brand-400 dark:via-indigo-400 dark:to-violet-400 drop-shadow-sm"
                  >
                    {phrases[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              {HERO_CONFIG.subtitle}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href={HERO_CONFIG.primaryCta.href}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 hover:via-indigo-500 hover:to-brand-600 shadow-xl shadow-brand-500/25 hover:shadow-2xl hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{HERO_CONFIG.primaryCta.text}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={HERO_CONFIG.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-white/90 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/80 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-brand-500 text-brand-500" />
                <span>{HERO_CONFIG.secondaryCta.text}</span>
              </a>
            </div>

            {/* Social Proof: 1200+ students already enrolled to pro */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span>
                  <strong className="text-gray-900 dark:text-white font-extrabold">{HERO_CONFIG.socialProof.studentCount}</strong>{" "}
                  {HERO_CONFIG.socialProof.text}
                </span>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {HERO_CONFIG.socialProof.pricingNote}
                </span>
              </div>
            </div>

            {/* Quick Value Highlights */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-600 dark:text-gray-400 pt-1">
              <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                <Check className="w-3.5 h-3.5 text-brand-500" />
                <span>Complete DSA Course</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                <Check className="w-3.5 h-3.5 text-brand-500" />
                <span>Weekly Live Cohorts</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                <Check className="w-3.5 h-3.5 text-brand-500" />
                <span>1:1 Live Doubts</span>
              </span>
            </div>

          </div>

          {/* ── Right Column: Clean, Modern YouTube Video Embed ── */}
          <div className="lg:col-span-6 relative">
            
            {/* Ambient Backlight Glow behind Video Player */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/25 via-indigo-500/20 to-purple-500/15 blur-[90px] rounded-3xl pointer-events-none -z-10" />

            {/* Modern Cinema Player Container */}
            <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-white/90 via-white/80 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-900/80 dark:to-gray-950/90 border border-gray-200/90 dark:border-gray-800/90 shadow-2xl backdrop-blur-xl">
              
              {/* Top Video Header Bar */}
              <div className="flex items-center justify-between px-3.5 py-2.5 mb-2 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-100 dark:border-gray-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 ml-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-red-500" />
                    <span>crackDSA Pro Walkthrough</span>
                  </span>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Complete Details
                </span>
              </div>

              {/* YouTube Responsive Video Iframe */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-950 shadow-inner border border-gray-200/40 dark:border-gray-800/60">
                <iframe
                  src={`${HERO_CONFIG.video.embedUrl}?rel=0&modestbranding=1`}
                  title={HERO_CONFIG.video.title}
                  className="w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Bottom Caption */}
              <div className="pt-3 px-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <p className="truncate">
                  💡 {HERO_CONFIG.video.caption}
                </p>
                <span className="shrink-0 font-mono text-[11px] font-bold text-brand-600 dark:text-brand-400">
                  crackDSA
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ── Bottom Feature Strip (Bar of 4/6 items across bottom) ── */}
        <div className="pt-6 border-t border-gray-200/80 dark:border-gray-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {HERO_CONFIG.featureStrip.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative p-3 sm:p-3.5 rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:border-brand-500/40 hover:bg-white dark:hover:bg-gray-900 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3"
                >
                  <div className={`p-2 rounded-xl shrink-0 border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Top Placement Companies Marquee (Option 1) ── */}
        <div className="pt-6 sm:pt-8 border-t border-gray-200/80 dark:border-gray-800/80 space-y-4 text-center">
          <p className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
            Alumni &amp; Mentors Placed Across Global Tier-1 Product Companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 hover:opacity-100 transition-opacity duration-300">
            {HERO_SOCIAL_LOGOS.map((logo: any) =>
              logo.logoDarkUrl ? (
                <React.Fragment key={logo.id}>
                  <img
                    src={logo.logoUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain dark:hidden grayscale hover:grayscale-0 transition-all`}
                  />
                  <img
                    src={logo.logoDarkUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain hidden dark:inline-block grayscale hover:grayscale-0 transition-all`}
                  />
                </React.Fragment>
              ) : (
                <img
                  key={logo.id}
                  src={logo.logoUrl}
                  alt={logo.alt}
                  className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                    logo.themeClass || ""
                  } object-contain grayscale hover:grayscale-0 transition-all`}
                />
              )
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
