"use client";

import { PLATFORM_STATS } from "@/constants/landing";
import { Reveal } from "./Reveal";

export default function StatsBar() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-10 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {PLATFORM_STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Reveal key={stat.label} delay={0.1 * i}>
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
