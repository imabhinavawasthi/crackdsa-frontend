"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Radio,
  HelpCircle,
  Users,
  MessageSquare,
  Code2,
  Trophy,
  Calendar,
  Video,
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize2,
  TrendingUp,
} from "lucide-react";
import { LIVE_MENTORSHIP_CONFIG } from "@/config/pro-page-config";

export function ProLiveMentorship() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section
      id="mentors"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-[#070b12] dark:via-[#090f19] dark:to-[#070b12] border-y border-blue-100/60 dark:border-gray-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION HEADER                                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>{LIVE_MENTORSHIP_CONFIG.sectionTag}</span>
          </div>

          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Learn from Mentors,{" "}
            <span className="text-blue-600 dark:text-blue-400">Live</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {LIVE_MENTORSHIP_CONFIG.subtitle}
          </p>

          {/* 4 Feature Pills in a row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-xs">
              <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Learn directly from experienced mentors</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-xs">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Ask doubts and get answers in real time</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-xs">
              <Code2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>See multiple approaches to solve a problem</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Build consistency with regular live sessions</span>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ROW 1: 3 FEATURE CARDS                                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {LIVE_MENTORSHIP_CONFIG.pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="relative rounded-[26px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-7 flex flex-col justify-between hover:shadow-2xl hover:border-blue-300 dark:hover:border-gray-700 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Icon & Pill Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border tracking-wider ${pillar.badgeColor}`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {pillar.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Schedule Footer */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-5 flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                  {idx === 2 ? (
                    <Video className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Calendar className="w-4 h-4 text-blue-500" />
                  )}
                  <span>{pillar.schedule}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ROW 2: LIVE VIDEO EMBED (LEFT) + SESSION ANATOMY & MENTOR (RIGHT) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* ─────────────────────────── LEFT: LIVE CLASS VIDEO PLAYER ─── */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-[28px] bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Top Bar: Live Status & Topic Title */}
            <div className="px-4 sm:px-6 py-3.5 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE
                </span>
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  Graph Algorithms - Part 1
                </span>
              </div>
              <span className="text-xs font-mono text-gray-400 font-semibold shrink-0">
                1:28:14
              </span>
            </div>

            {/* Embedded Live Video Player */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              <iframe
                src={`${LIVE_MENTORSHIP_CONFIG.videoUrl}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                title="CrackDSA Live Class Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Bottom Stream Player Controls Bar */}
            <div className="px-4 sm:px-6 py-3 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between gap-4 text-gray-300">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-xs font-mono text-gray-400">
                  1:28:14 / 2:00:00
                </span>
              </div>

              {/* Fake Progress Bar */}
              <div className="hidden sm:block flex-1 mx-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-[73%] h-full bg-red-600 rounded-full" />
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <Settings className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <Maximize2 className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          </div>

          {/* ─────────────────────────── RIGHT: SESSION ANATOMY & MENTOR ─── */}
          <div className="lg:col-span-5 xl:col-span-4 rounded-[28px] border border-blue-100/90 dark:border-gray-800 bg-white dark:bg-[#0c121e] shadow-xl shadow-blue-500/5 p-6 sm:p-7 flex flex-col justify-between space-y-6">
            {/* Session Anatomy */}
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {LIVE_MENTORSHIP_CONFIG.sessionAnatomy.tag}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  {LIVE_MENTORSHIP_CONFIG.sessionAnatomy.title}
                </h3>
              </div>

              {/* Vertical Stepper */}
              <div className="space-y-3 relative pl-1">
                {LIVE_MENTORSHIP_CONFIG.sessionAnatomy.steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Step Number Circle */}
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center shrink-0 z-10">
                      {step.step}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Connecting Line between steps */}
                    {idx < LIVE_MENTORSHIP_CONFIG.sessionAnatomy.steps.length - 1 && (
                      <div className="absolute left-3.5 top-7 w-px h-6 bg-blue-200 dark:bg-gray-800 z-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Meet Your Mentor Section */}
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Meet Your Mentor
              </p>

              {/* Mentor Profile Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-sm shrink-0">
                  <Image
                    src={LIVE_MENTORSHIP_CONFIG.mentor.avatar}
                    alt={LIVE_MENTORSHIP_CONFIG.mentor.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                    {LIVE_MENTORSHIP_CONFIG.mentor.name}
                  </h4>
                  <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 pt-0.5">
                    {LIVE_MENTORSHIP_CONFIG.mentor.role}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {LIVE_MENTORSHIP_CONFIG.mentor.experience}
                  </p>
                </div>
              </div>

              {/* 3 Metric Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {LIVE_MENTORSHIP_CONFIG.mentor.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-center"
                  >
                    <p className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">
                      {stat.value}
                    </p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight pt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}