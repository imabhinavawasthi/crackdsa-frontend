"use client";

import { TESTIMONIALS } from "@/constants/landing";
import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <Reveal className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-3">
            Student Stories
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real learners. Real results.
          </h2>
        </Reveal>

        {/* Testimonial cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const initials = t.name
              .split(" ")
              .map((w) => w[0])
              .join("");

            return (
              <Reveal key={t.name} delay={0.1 * i}>
                <div className="group relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm transition-colors hover:border-white/[0.12]">
                  {/* Quote icon */}
                  <Quote className="mb-4 h-6 w-6 text-white/10" />

                  {/* Quote text */}
                  <p className="flex-1 text-[15px] leading-relaxed text-gray-300">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
