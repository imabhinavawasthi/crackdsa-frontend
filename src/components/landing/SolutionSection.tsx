"use client";

import { Reveal } from "./Reveal";
import { SOLUTION_FEATURES } from "@/constants/landing";
import RoadmapProcessAnimation from "@/components/roadmap/RoadmapProcessAnimation";

export default function SolutionSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-4">
            The CrackDSA Way
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Your roadmap. Your pace.
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-blue-light-400 bg-clip-text text-transparent">
              Your interview offer.
            </span>
          </h2>
        </Reveal>

        {/* Feature Cards — 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {SOLUTION_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 0.1}>
                <div className="group relative h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]" />

                  <div className="relative z-10">
                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.06] ${feature.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Roadmap Process Animation */}
        <Reveal className="mt-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            See How AI Creates Your Personalised Path
          </p>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mb-10" />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="dark">
            <RoadmapProcessAnimation />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
