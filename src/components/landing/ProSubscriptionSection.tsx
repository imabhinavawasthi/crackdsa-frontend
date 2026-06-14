"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { PRO_BENEFITS } from "@/constants/landing";

export default function ProSubscriptionSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-brand-600/20 via-indigo-600/10 to-purple-600/20 backdrop-blur-sm">
            {/* Subtle glow effects */}
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 p-8 sm:p-12 lg:p-16">
              {/* LEFT Column — 3/5 width */}
              <div className="lg:col-span-3 flex flex-col justify-center">
                {/* PRO badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-indigo-500/20 border border-brand-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    PRO
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Unlock Everything with{" "}
                  <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
                    PRO
                  </span>
                </h2>

                <p className="text-gray-400 text-lg mb-10 max-w-xl">
                  Get unlimited access to the complete CrackDSA ecosystem —
                  courses, mentorship, community, and everything you need to
                  crack your dream company.
                </p>

                {/* Benefits grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {PRO_BENEFITS.map((benefit, i) => (
                    <Reveal key={benefit.label} delay={i * 0.05}>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                        <span className="text-sm text-gray-300 font-medium">
                          {benefit.label}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* RIGHT Column — 2/5 width — Pricing card */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <Reveal delay={0.2}>
                  <div className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-md p-8 text-center">
                    {/* Top accent line */}
                    <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 mb-8" />

                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      Starting at
                    </p>

                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-5xl font-extrabold text-white">
                        ₹999
                      </span>
                      <span className="text-lg text-gray-500 font-medium">
                        /mo
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-8">
                      Cancel anytime · No hidden fees
                    </p>

                    <Link
                      href="/pro"
                      className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/40 hover:scale-[1.02]"
                    >
                      View Plans
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>

                    <p className="mt-4 text-xs text-gray-500">
                      Join 2,000+ PRO members
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
