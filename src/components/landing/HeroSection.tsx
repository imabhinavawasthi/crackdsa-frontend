"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { LANDING_CONFIG } from "@/config/landing.config";
import HeroTestimonialSlider from "@/components/landing/HeroTestimonialSlider";
import AnimatedRoadmapVisual from "@/components/landing/AnimatedRoadmapVisual";

// ── Counter hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const SOCIAL_PROOF_COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "LinkedIn"];

export default function HeroSection() {
  const { hero } = LANDING_CONFIG;
  const [wordIndex, setWordIndex] = useState(0);
  const [companyIndex, setCompanyIndex] = useState(0);
  const counter = useCountUp(500);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % hero.rotatingWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompanyIndex((prev) => (prev + 1) % SOCIAL_PROOF_COMPANIES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#FAFCFF] dark:bg-[#080C14] text-gray-900 dark:text-white pt-32 sm:pt-40 pb-20 overflow-hidden border-b border-gray-200/80 dark:border-gray-800/60 transition-colors duration-300 select-none">
      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          12% { transform: translateY(0); opacity: 1; }
          88% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .word-slider {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          height: 1.15em;
          position: relative;
        }
        .word-slider-inner {
          display: inline-block;
          animation: slideUp 2.4s ease-in-out;
        }
        .company-slider {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          height: 1.3em;
          position: relative;
          min-width: 5em;
        }
        .company-slider-inner {
          display: inline-block;
          animation: slideUp 2s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* Subtle Top Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* ── LEFT COLUMN: Text & CTAs ───────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-gray-900 dark:text-white">
              Stop solving{" "}
              <span ref={counter.ref} className="tabular-nums">{counter.count}+</span>{" "}
              random problems.
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400">
                {hero.titlePrefix}
              </span>
              <span className="block">
                <span className="word-slider">
                  <span
                    key={wordIndex}
                    className="word-slider-inner text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-300"
                  >
                    {hero.rotatingWords[wordIndex]}
                  </span>
                </span>
              </span>
            </h1>

            {/* Subtitle + Social Proof */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl font-normal leading-relaxed">
              {hero.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 font-medium tracking-wide">
              Learn how engineers at{" "}
              <span className="company-slider">
                <span
                  key={companyIndex}
                  className="company-slider-inner text-gray-800 dark:text-gray-200 font-semibold"
                >
                  {SOCIAL_PROOF_COMPANIES[companyIndex]}
                </span>
              </span>{" "}
              prepare for interviews.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary: Start Learning */}
              <Link
                href={hero.primaryCta.href}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(70,95,255,0.35)] dark:shadow-[0_0_25px_rgba(70,95,255,0.4)] hover:shadow-[0_6px_28px_rgba(70,95,255,0.5)] dark:hover:shadow-[0_0_35px_rgba(70,95,255,0.65)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{hero.primaryCta.text}</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Secondary: Explore Pro */}
              <Link
                href={hero.secondaryCta.href}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 border border-amber-500/40 dark:border-amber-400/40 hover:border-amber-500 dark:hover:border-amber-400 text-gray-900 dark:text-white font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 text-gray-950 shadow-xs group-hover:scale-110 transition-transform">
                  <Crown size={12} className="fill-current text-white" />
                </span>
                <span>{hero.secondaryCta.text}</span>
              </Link>
            </div>

            {/* Rotating Student Feedback */}
            <HeroTestimonialSlider />

          </div>

          {/* ── RIGHT COLUMN: Interactive Animated Roadmap Graph ─────── */}
          <div className="lg:col-span-5 relative">
            <AnimatedRoadmapVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
