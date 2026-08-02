"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { LANDING_CONFIG } from "@/config/landing.config";

export default function FinalCTA() {
  const { finalCta } = LANDING_CONFIG;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-950 text-white border-t border-white/5">
      {/* Futuristic Gradient background overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-gradient-to-r from-cyan-500/10 via-brand-500/10 to-purple-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            <span>{finalCta.badge}</span>
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl mb-5">
            {finalCta.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-400 font-medium leading-relaxed mb-10 text-base">
            {finalCta.subtitle}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={finalCta.primaryCta.href}
              className="group inline-flex items-center gap-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-brand-500 to-purple-600 px-8 py-4 text-sm font-extrabold text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
            >
              <Sparkles size={16} />
              <span>{finalCta.primaryCta.text}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href={finalCta.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-gray-300 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:text-white"
            >
              <span>{finalCta.secondaryCta.text}</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
