"use client";

import { PROBLEM_CARDS } from "@/constants/landing";
import { Reveal } from "./Reveal";

export default function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-gray-950 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold text-red-400/80 uppercase tracking-[0.2em] mb-4">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Everyone follows the same list.
            <br />
            <span className="text-gray-500">Nobody gets results.</span>
          </h2>
        </Reveal>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEM_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={0.1 + i * 0.15}>
              <div className="group relative h-full rounded-2xl border border-gray-800/60 bg-gray-900/40 backdrop-blur-sm p-7 transition-all duration-300 hover:border-gray-700/80 hover:bg-gray-900/60 hover:-translate-y-1">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${card.accent} mb-5`}
                >
                  <card.icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
