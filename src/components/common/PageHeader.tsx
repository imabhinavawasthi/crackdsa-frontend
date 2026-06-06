"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────── */

export interface PageHeaderStat {
  /** Stat label (e.g. "Problems Solved") */
  label: string;
  /** Stat value (e.g. "142") */
  value: string | number;
  /** Optional icon for the stat */
  icon?: LucideIcon;
  /** Tailwind class for the icon color */
  iconColor?: string;
}

export interface PageHeaderAction {
  /** Button label */
  label: string;
  /** Click handler or href */
  href?: string;
  onClick?: () => void;
  /** Primary CTA style vs ghost/outline */
  variant?: "primary" | "outline";
  /** Optional icon */
  icon?: LucideIcon;
}

export interface PageHeaderProps {
  /** Small badge/pill text shown above the title */
  badge?: string;
  /** Icon shown inside the badge pill */
  badgeIcon?: LucideIcon;
  /** Main page title — supports ReactNode for gradient spans */
  title: React.ReactNode;
  /** Subtitle/description text */
  subtitle?: string;
  /** Array of stat items to render on the right side */
  stats?: PageHeaderStat[];
  /** Action buttons (CTAs) rendered below subtitle */
  actions?: PageHeaderAction[];
  /** Right-side slot for fully custom content (overrides stats) */
  rightSlot?: React.ReactNode;
  /** Bottom slot for content rendered below the header area */
  bottomSlot?: React.ReactNode;
  /** Gradient accent color preset for background effects */
  accent?: "brand" | "emerald" | "amber" | "rose" | "violet" | "sky";
  /** Use dark/inverted theme (dark background with light text) */
  variant?: "default" | "dark";
  /** Additional className for the outer wrapper */
  className?: string;

  // NEW SLIDESHOW/TICKER PROPS
  /** Infinite horizontal ticker items */
  tickerItems?: string[];
  /** Optional label before the ticker */
  tickerLabel?: string;
  /** Words to cycle with dynamic rotator */
  rotatorItems?: string[];
  /** Prefix for the rotator word */
  rotatorPrefix?: string;
  /** Suffix for the rotator word */
  rotatorSuffix?: string;
  /** Custom slides for right-hand card slideshow carousel */
  slides?: Array<{
    title: string;
    description: string;
    badge?: string;
    color?: "brand" | "emerald" | "amber" | "rose" | "violet" | "sky";
    icon?: LucideIcon;
    href?: string;
  }>;
}

/* ─── Accent Color Map ────────────────────────────────────────────── */

const accentMap = {
  brand: {
    orbA: "bg-brand-500/12",
    orbB: "bg-blue-light-500/10",
    badge: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/15",
    badgeDark: "bg-brand-500/15 text-brand-300 border-brand-400/20",
    grid: "rgba(70,95,255,0.04)",
    gridDark: "rgba(70,95,255,0.06)",
    statIcon: "text-brand-500",
  },
  emerald: {
    orbA: "bg-emerald-500/12",
    orbB: "bg-teal-500/10",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15",
    badgeDark: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    grid: "rgba(16,185,129,0.04)",
    gridDark: "rgba(16,185,129,0.06)",
    statIcon: "text-emerald-500",
  },
  amber: {
    orbA: "bg-amber-500/12",
    orbB: "bg-orange-500/10",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15",
    badgeDark: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    grid: "rgba(245,158,11,0.04)",
    gridDark: "rgba(245,158,11,0.06)",
    statIcon: "text-amber-500",
  },
  rose: {
    orbA: "bg-rose-500/12",
    orbB: "bg-pink-500/10",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15",
    badgeDark: "bg-rose-500/15 text-rose-300 border-rose-400/20",
    grid: "rgba(244,63,94,0.04)",
    gridDark: "rgba(244,63,94,0.06)",
    statIcon: "text-rose-500",
  },
  violet: {
    orbA: "bg-violet-500/12",
    orbB: "bg-purple-500/10",
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/15",
    badgeDark: "bg-violet-500/15 text-violet-300 border-violet-400/20",
    grid: "rgba(139,92,246,0.04)",
    gridDark: "rgba(139,92,246,0.06)",
    statIcon: "text-violet-500",
  },
  sky: {
    orbA: "bg-sky-500/12",
    orbB: "bg-cyan-500/10",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/15",
    badgeDark: "bg-sky-500/15 text-sky-300 border-sky-400/20",
    grid: "rgba(14,165,233,0.04)",
    gridDark: "rgba(14,165,233,0.06)",
    statIcon: "text-sky-500",
  },
};

/* ─── Animation Presets ───────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ─── Component ───────────────────────────────────────────────────── */

export default function PageHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  stats,
  actions,
  rightSlot,
  bottomSlot,
  accent = "brand",
  variant = "default",
  className = "",
  tickerItems,
  tickerLabel,
  rotatorItems,
  rotatorPrefix,
  rotatorSuffix,
  slides,
}: PageHeaderProps) {
  const colors = accentMap[accent];
  const isDark = variant === "dark";

  const [rotatorIndex, setRotatorIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Cycle rotator index
  useEffect(() => {
    if (!rotatorItems || rotatorItems.length <= 1) return;
    const interval = setInterval(() => {
      setRotatorIndex((prev) => (prev + 1) % rotatorItems.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [rotatorItems]);

  // Cycle slide index
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [slides]);

  const hasRightSlot = rightSlot || (stats && stats.length > 0) || (slides && slides.length > 0);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isDark
          ? "bg-gray-950 border border-gray-800 shadow-2xl shadow-brand-500/5"
          : "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md"
      } ${className}`}
    >
      {/* ─── Background Effects ─── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="page-header-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle
                cx="1.5"
                cy="1.5"
                r="1"
                fill={isDark ? colors.gridDark : colors.grid}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#page-header-dots)" />
        </svg>

        {/* Floating gradient orbs with subtle movement */}
        <motion.div
          animate={{ x: [0, 16, -12, 0], y: [0, -12, 8, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className={`absolute -left-12 -top-12 h-48 w-48 rounded-full ${colors.orbA} blur-[80px]`}
        />
        <motion.div
          animate={{ x: [0, -14, 18, 0], y: [0, 10, -16, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className={`absolute -right-8 -bottom-8 h-40 w-40 rounded-full ${colors.orbB} blur-[70px]`}
        />

        {/* Subtle rotating ring decoration (dark variant only) */}
        {isDark && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
              className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/[0.04]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-dashed border-white/[0.03]"
            />
          </>
        )}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Badge + Title + Subtitle + Actions */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Badge Pill */}
            {badge && (
              <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                    isDark ? colors.badgeDark : colors.badge
                  }`}
                >
                  {BadgeIcon && <BadgeIcon size={12} />}
                  {badge}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className={`text-2xl sm:text-3xl font-semibold tracking-tight leading-tight ${
                isDark ? "text-white" : "text-gray-900 dark:text-white"
              }`}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {(subtitle || (rotatorItems && rotatorItems.length > 0)) && (
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="space-y-2"
              >
                {subtitle && (
                  <p
                    className={`max-w-xl text-sm leading-relaxed ${
                      isDark ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {subtitle}
                  </p>
                )}

                {rotatorItems && rotatorItems.length > 0 && (
                  <div
                    className={`flex items-center flex-wrap gap-x-1.5 text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {rotatorPrefix && <span>{rotatorPrefix}</span>}
                    <span className="relative inline-flex h-5 items-center overflow-hidden align-middle">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={rotatorIndex}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className={`inline-block font-semibold text-transparent bg-clip-text bg-gradient-to-r ${
                            accent === "brand" ? "from-brand-600 to-indigo-500 dark:from-brand-400 dark:to-indigo-300" :
                            accent === "emerald" ? "from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300" :
                            accent === "amber" ? "from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-300" :
                            accent === "rose" ? "from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-300" :
                            accent === "violet" ? "from-violet-600 to-purple-500 dark:from-violet-400 dark:to-purple-300" :
                            "from-sky-600 to-cyan-500 dark:from-sky-400 dark:to-cyan-300"
                          }`}
                        >
                          {rotatorItems[rotatorIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    {rotatorSuffix && <span>{rotatorSuffix}</span>}
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            {actions && actions.length > 0 && (
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                {actions.map((action, idx) => {
                  const ActionIcon = action.icon;
                  const isPrimary = action.variant !== "outline";

                  const btnClass = isPrimary
                    ? isDark
                      ? "bg-white text-gray-950 hover:bg-gray-100 shadow-xl shadow-white/10 font-semibold"
                      : "bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/15 font-semibold"
                    : isDark
                    ? "border border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm font-medium"
                    : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium";

                  const content = (
                    <span
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all active:scale-[0.98] cursor-pointer ${btnClass}`}
                    >
                      {ActionIcon && <ActionIcon size={15} />}
                      {action.label}
                    </span>
                  );

                  if (action.href) {
                    return (
                      <a key={idx} href={action.href}>
                        {content}
                      </a>
                    );
                  }

                  return (
                    <button key={idx} onClick={action.onClick} type="button">
                      {content}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right: Stats, Custom Slot, or Slideshow */}
          {hasRightSlot && (
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="shrink-0"
            >
              {rightSlot ? (
                rightSlot
              ) : stats && stats.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {stats.map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + idx * 0.08, duration: 0.35 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                          isDark
                            ? "border-white/10 bg-white/[0.04] backdrop-blur-sm"
                            : "border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50"
                        }`}
                      >
                        {StatIcon && (
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              isDark ? "bg-white/10" : "bg-white dark:bg-gray-800 shadow-sm"
                            }`}
                          >
                            <StatIcon
                              size={16}
                              className={stat.iconColor || colors.statIcon}
                            />
                          </div>
                        )}
                        <div>
                          <p
                            className={`text-lg font-semibold leading-none ${
                              isDark ? "text-white" : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {stat.value}
                          </p>
                          <p
                            className={`text-[10px] mt-1 uppercase tracking-wider ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {stat.label}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : slides && slides.length > 0 ? (
                <div className="relative w-full sm:w-[280px] md:w-[320px] h-[150px] overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-800/80 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md shadow-lg group">
                  {/* Background Glow inside Card */}
                  <div className={`absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-[40px] opacity-15 transition-colors duration-700 ${
                    slides[activeSlide].color === "emerald" ? "bg-emerald-500" :
                    slides[activeSlide].color === "amber" ? "bg-amber-500" :
                    slides[activeSlide].color === "rose" ? "bg-rose-500" :
                    slides[activeSlide].color === "violet" ? "bg-violet-500" :
                    slides[activeSlide].color === "sky" ? "bg-sky-500" :
                    "bg-brand-500"
                  }`} />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlide}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute inset-0 p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          {slides[activeSlide].badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase border ${
                              slides[activeSlide].color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              slides[activeSlide].color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              slides[activeSlide].color === "rose" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                              slides[activeSlide].color === "violet" ? "bg-violet-500/10 text-violet-500 border-violet-500/20" :
                              slides[activeSlide].color === "sky" ? "bg-sky-500/10 text-sky-500 border-sky-500/20" :
                              "bg-brand-500/10 text-brand-500 border-brand-500/20"
                            }`}>
                              {slides[activeSlide].badge}
                            </span>
                          )}
                          {slides[activeSlide].icon && (
                            <div className={`p-1.5 rounded-lg ${
                              isDark ? "bg-white/5" : "bg-gray-100"
                            }`}>
                              {React.createElement(slides[activeSlide].icon, {
                                size: 14,
                                className: 
                                  slides[activeSlide].color === "emerald" ? "text-emerald-500" :
                                  slides[activeSlide].color === "amber" ? "text-amber-500" :
                                  slides[activeSlide].color === "rose" ? "text-rose-500" :
                                  slides[activeSlide].color === "violet" ? "text-violet-500" :
                                  slides[activeSlide].color === "sky" ? "text-sky-500" :
                                  "text-brand-500"
                              })}
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {slides[activeSlide].title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {slides[activeSlide].description}
                        </p>
                      </div>
                      
                      {slides[activeSlide].href && (
                        <a
                          href={slides[activeSlide].href}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-80 ${
                            slides[activeSlide].color === "emerald" ? "text-emerald-500" :
                            slides[activeSlide].color === "amber" ? "text-amber-500" :
                            slides[activeSlide].color === "rose" ? "text-rose-500" :
                            slides[activeSlide].color === "violet" ? "text-violet-500" :
                            slides[activeSlide].color === "sky" ? "text-sky-500" :
                            "text-brand-500"
                          }`}
                        >
                          Explore Path →
                        </a>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Dots indicators */}
                  {slides.length > 1 && (
                    <div className="absolute bottom-4 right-5 flex gap-1 z-20">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlide(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            activeSlide === idx
                              ? slides[activeSlide].color === "emerald" ? "bg-emerald-500 w-3" :
                                slides[activeSlide].color === "amber" ? "bg-amber-500 w-3" :
                                slides[activeSlide].color === "rose" ? "bg-rose-500 w-3" :
                                slides[activeSlide].color === "violet" ? "bg-violet-500 w-3" :
                                slides[activeSlide].color === "sky" ? "bg-sky-500 w-3" :
                                "bg-brand-500 w-3"
                              : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </motion.div>
          )}
        </div>

        {/* Infinite Marquee Ticker */}
        {tickerItems && tickerItems.length > 0 && (
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 border-t border-gray-100 dark:border-gray-800/50 pt-5 overflow-hidden relative"
          >
            {tickerLabel && (
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
                {tickerLabel}
              </div>
            )}
            <div className="relative flex items-center w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <motion.div
                animate={{ x: [0, "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 40,
                }}
                className="flex gap-3 whitespace-nowrap min-w-max py-1"
              >
                {/* Double list for seamless looping */}
                {[...tickerItems, ...tickerItems].map((item, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-sm transition-all duration-300 ${
                      isDark
                        ? "bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/[0.06] hover:border-white/10 hover:scale-[1.02]"
                        : "bg-gray-50/50 border-gray-100 text-gray-600 dark:bg-gray-900/30 dark:border-gray-800/40 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-850 hover:scale-[1.02]"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      accent === "brand" ? "bg-brand-500 shadow-[0_0_6px_#465fff]" :
                      accent === "emerald" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" :
                      accent === "amber" ? "bg-amber-500 shadow-[0_0_6px_#f59e0b]" :
                      accent === "rose" ? "bg-rose-500 shadow-[0_0_6px_#f43f5e]" :
                      accent === "violet" ? "bg-violet-500 shadow-[0_0_6px_#8b5cf6]" :
                      "bg-sky-500 shadow-[0_0_6px_#0ea5e9]"
                    }`} />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Bottom Slot */}
        {bottomSlot && (
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800"
          >
            {bottomSlot}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
