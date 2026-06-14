"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.04] to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-brand-500/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-4">
            Start Now
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-5">
            Ready to crack your next interview?
          </h2>
          <p className="mx-auto max-w-xl text-gray-400 mb-10">
            Join 20,000+ learners who are building real DSA skills with
            pattern-driven prep. No fluff — just results.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all duration-300 hover:bg-brand-400 hover:shadow-brand-500/30"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.16] hover:text-white hover:bg-white/[0.06]"
            >
              Browse Courses
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
