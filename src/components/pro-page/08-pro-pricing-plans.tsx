"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Clock,
  ExternalLink,
} from "lucide-react";
import { PRO_PRICING_PLANS } from "@/config/pro-pricing";
import { CHOOSE_PLAN_FAQS } from "@/config/pro-page-config";
import { CONTACT_INFO } from "@/constants/contact";

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function ProPricingPlans() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 relative overflow-hidden bg-gray-50/50 dark:bg-gray-950/40 border-t border-gray-200/80 dark:border-gray-800/80">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-brand-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-black uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Section 08 • Choose Your Plan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Transparent Pricing. Everything Unlocked.
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Choose the membership that matches your college timeline. Cancel anytime with zero hidden fees.
          </p>
        </div>

        {/* ── 3 Pricing Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {PRO_PRICING_PLANS.map((plan) => {
            const isHighlighted = !!plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`group relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted
                    ? "bg-gradient-to-b from-brand-900 via-gray-900 to-gray-950 text-white border-2 border-brand-500 shadow-2xl shadow-brand-500/25 md:-translate-y-2"
                    : "bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-xl hover:border-brand-500/40"
                }`}
              >
                {/* Popular / Recommended Pill */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Tier Title & Tagline */}
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-2xl font-black">
                      {plan.name}
                    </h3>
                    <p className={`text-xs ${isHighlighted ? "text-gray-300" : "text-gray-500 dark:text-gray-400"} leading-relaxed`}>
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Numbers */}
                  <div className="text-left space-y-1 border-y border-gray-200/40 dark:border-gray-800 py-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black font-mono">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                      <span className={`text-xs font-mono font-bold ${isHighlighted ? "text-gray-400" : "text-gray-500"}`}>
                        {plan.billingPeriod}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="line-through text-gray-400 dark:text-gray-500 font-mono">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        Save {plan.discountPercent}%
                      </span>
                      {plan.dailyCostEquivalent !== "0" && (
                        <span className={`font-mono font-bold ${isHighlighted ? "text-amber-300" : "text-amber-600 dark:text-amber-400"}`}>
                          • {plan.dailyCostEquivalent}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-3 text-left">
                    <p className={`text-[10px] font-black uppercase tracking-wider ${isHighlighted ? "text-brand-300" : "text-gray-500 dark:text-gray-400"}`}>
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-2.5 text-xs">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlighted ? "text-brand-400" : "text-brand-500"}`} />
                          <span className={isHighlighted ? "text-gray-200" : "text-gray-700 dark:text-gray-300"}>
                            {feat.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-6 border-t border-gray-200/40 dark:border-gray-800">
                  <Link
                    href={`/checkout/pro?plan=${plan.id}`}
                    className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isHighlighted
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/25 hover:shadow-amber-500/40"
                        : "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20 hover:shadow-brand-500/30"
                    }`}
                  >
                    <span>Get {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-2">
                    {plan.savingsNote}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Interactive Frequently Asked Questions ── */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Have Doubts?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {CHOOSE_PLAN_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/80">
                      <p className="pl-7">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── WhatsApp Direct Consultation Banner ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-600/10 via-indigo-600/10 to-emerald-600/10 border border-brand-500/20 text-center relative overflow-hidden backdrop-blur-md max-w-4xl mx-auto space-y-5">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Still have questions about CrackDSA Pro?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
              Our mentor team is available directly on WhatsApp to guide you on syllabus fit, batch schedules, and customized college roadmaps.
            </p>
          </div>

          <div>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace("+", "")}?text=Hi%20CrackDSA!%20I%20have%20questions%20regarding%20CrackDSA%20Pro%20subscription.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
            >
              <IconWhatsapp />
              <span>Chat with Mentors on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ── Final High-Impact Subscription CTA Banner ── */}
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white shadow-2xl text-center space-y-6 max-w-5xl mx-auto">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-black uppercase tracking-wider">
              Limited Intake Cohort
            </span>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight">
              Transform Your Career with CrackDSA Pro
            </h3>
            <p className="text-sm sm:text-base text-brand-100 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ ambitious software engineers from 100+ colleges across India and crack tier-1 product companies.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-white text-gray-950 font-black text-sm sm:text-base shadow-xl hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            >
              Get Started Now (From ₹799/mo) →
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-brand-100 font-semibold pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Instant Dashboard Access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>All 206+ Video Lectures Included</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Weekly Live Doubt Hours</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
