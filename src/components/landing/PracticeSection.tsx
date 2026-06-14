"use client";

import { PRACTICE_HIGHLIGHTS } from "@/constants/landing";
import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PracticeSection() {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-8 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <Reveal className="max-w-2xl mb-16">
          <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
            Practice Lab
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight mb-5">
            Practice Smarter, Not Harder
          </h2>
          <p className="text-gray-400 text-base sm:text-[17px] leading-relaxed">
            Curated problem sets organized by topic, company, and difficulty.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRACTICE_HIGHLIGHTS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <Link href={item.href} className="group block h-full">
                <div
                  className={`h-full bg-white/[0.02] border rounded-2xl p-7 transition-all duration-300 relative overflow-hidden ${item.border} hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-6 border border-white/[0.06] transition-colors ${item.accent}`}
                  >
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    {item.title}
                    <ArrowRight
                      size={18}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white"
                    />
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-brand-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
