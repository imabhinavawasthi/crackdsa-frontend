"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  Timer, 
  TrendingUp, 
  Quote, 
  ChevronDown, 
  Calendar,
  Users,
  Award,
  Video,
  FileCheck2,
  ArrowRight
} from "lucide-react";
import { 
  MOCK_INTERVIEW_SERVICE, 
  MOCK_INTERVIEW_REVIEWS, 
  MOCK_INTERVIEW_FAQS 
} from "@/config/mock-interviews.config";
import { AbhinavAwasthiCard } from "@/components/instructors/AbhinavAwasthiCard";

// Map feature icon strings to Lucide components
const FEATURE_ICONS: Record<string, React.ElementType> = {
  Code2,
  Timer,
  Sparkles,
  TrendingUp,
};

export default function MockInterviewsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const service = MOCK_INTERVIEW_SERVICE;
  const reviews = MOCK_INTERVIEW_REVIEWS;
  const faqs = MOCK_INTERVIEW_FAQS;

  return (
    <div className="space-y-12 pb-16">
      {/* ─── 1. HERO SECTION & BOOKING CARD ────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-linear-to-b from-white via-gray-50/60 to-white dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 p-6 sm:p-10 lg:p-12 shadow-sm">
        {/* Soft Background Radial Glows */}
        <div className="absolute -top-24 -left-24 size-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Value Props */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                {service.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                <Video size={13} />
                {service.type}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                5.0 Rating (Verified)
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {service.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                {service.description}
              </p>
            </div>

            {/* Quick Benefits Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.highlights.slice(0, 4).map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 size={13} className="stroke-[2.5]" />
                  </span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Trust Footer Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
                <span>100% Confidential & Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Flexible Rescheduling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 size={16} className="text-purple-600 dark:text-purple-400" />
                <span>Detailed Scorecard</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Action Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border-2 border-brand-500/30 dark:border-brand-500/40 bg-white dark:bg-gray-850 p-6 sm:p-8 shadow-xl shadow-brand-500/5">
              {/* Top Banner Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-5">
                <Sparkles size={12} className="animate-pulse" />
                Book 1:1 With Abhinav
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  {service.priceFormatted}
                </span>
                {service.originalPriceFormatted && (
                  <span className="text-lg sm:text-xl font-bold text-gray-400 line-through">
                    {service.originalPriceFormatted}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-black">
                  50% OFF
                </span>
              </div>

              {/* Duration & Format */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 mb-6">
                <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{service.duration}</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Live 1:1 Video Session</span>
              </div>

              {/* Deliverables summary */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-700/60 space-y-2.5 mb-6 text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between font-semibold">
                  <span>Session Length:</span>
                  <span className="font-bold text-gray-900 dark:text-white">60 Minutes</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Platform:</span>
                  <span className="font-bold text-gray-900 dark:text-white">Google Meet + Live IDE</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Feedback Format:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Verbal + Written Scorecard</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Target Level:</span>
                  <span className="font-bold text-gray-900 dark:text-white">SDE-1 / SDE-2 (FAANG & Startups)</span>
                </div>
              </div>

              {/* Primary Topmate CTA Button */}
              <a
                href={service.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
              >
                <span>Book Slot on Topmate</span>
                <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Topmate Redirection Disclaimer */}
              <p className="mt-3.5 text-center text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Redirects to secure Topmate calendar for instant slot booking & confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERVIEWER SPOTLIGHT ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              YOUR INTERVIEWER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Get Interviewed by Abhinav Awasthi
            </h2>
          </div>
        </div>
        <AbhinavAwasthiCard />
      </section>

      {/* ─── 3. WHAT'S INCLUDED / KEY FEATURES ────────────────────────── */}
      <section className="space-y-6">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            WHAT TO EXPECT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Designed to simulate real FAANG pressure
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            A comprehensive 60-minute interview process that tests code efficiency, edge-case coverage, and articulation under time constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {service.features.map((feature, idx) => {
            const Icon = FEATURE_ICONS[feature.icon] || Code2;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:border-gray-300 dark:hover:border-gray-700"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-800/50">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS: 4 STEPS ─────────────────────────────────── */}
      <section className="rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40 p-6 sm:p-10">
        <div className="mb-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Simple 4-Step Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.steps.map((st) => (
            <div key={st.step} className="relative space-y-3">
              <div className="text-3xl font-black text-brand-500/30 dark:text-brand-400/20">
                {st.step}
              </div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                {st.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. VERIFIED REVIEWS & RATINGS ────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              STUDENT FEEDBACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Real Reviews from Candidates
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Hear directly from engineers who booked mock interviews and mentorship sessions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">5.0 / 5</span>
            <span className="text-xs text-gray-400 font-medium">({reviews.length} Verified Reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-colors hover:border-gray-300 dark:hover:border-gray-700"
            >
              <div className="space-y-3">
                {/* Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={18} className="text-gray-300 dark:text-gray-700" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Date Footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-xs font-black">
                    {rev.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {rev.author}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Verified Session
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. FAQS ACCORDION ────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            HAVE QUESTIONS?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden shadow-xs">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-850"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-600 dark:text-brand-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 7. BOTTOM CTA BANNER ─────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-600 via-indigo-600 to-purple-700 p-8 sm:p-10 text-white shadow-xl shadow-brand-500/20">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles size={12} />
              Limited Slots Available Weekly
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to clear your dream company interview?
            </h3>
            <p className="text-sm text-white/80 max-w-xl">
              Get genuine, zero-sugarcoating feedback and learn how top engineers think through difficult algorithmic questions.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
            <a
              href={service.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-xs font-black uppercase tracking-wider text-gray-900 shadow-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Book Mock on Topmate</span>
              <ArrowRight size={14} />
            </a>
            <span className="text-[11px] text-white/70 font-medium">
              {service.duration} • {service.priceFormatted}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
