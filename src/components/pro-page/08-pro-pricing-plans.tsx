"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Check,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  BarChart3,
  Clock,
  FileText,
  Users,
  BadgePercent,
} from "lucide-react";
import { PRO_PRICING_PLANS, PRICING_TRUST_BADGES } from "@/config/pro-pricing";
import { CHOOSE_PLAN_FAQS } from "@/config/pro-page-config";
import { CONTACT_INFO } from "@/constants/contact";

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

interface ProPricingPlansProps {
  onSelectPlan?: (planId: "monthly" | "yearly" | "lifetime") => void;
}

export function ProPricingPlans({ onSelectPlan }: ProPricingPlansProps = {}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-blue-50/30 dark:from-[#070b12] dark:via-[#090f19] dark:to-[#070b12] border-t border-blue-100/60 dark:border-gray-800/80"
    >
      {/* Background Subtle Doodle Wave Vectors */}
      <div className="absolute top-12 left-10 w-32 h-16 pointer-events-none opacity-20 dark:opacity-10 hidden md:block">
        <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" className="text-blue-500 w-full h-full">
          <path d="M0 20 Q 25 0, 50 20 T 100 20" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-16 right-12 w-32 h-16 pointer-events-none opacity-20 dark:opacity-10 hidden md:block">
        <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" className="text-blue-500 w-full h-full">
          <path d="M0 20 Q 25 35, 50 20 T 100 20" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION HEADER                                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Top Crown Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider shadow-xs">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>CHOOSE YOUR PLAN</span>
          </div>

          {/* Big Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Less than the price of{" "}
            <span className="text-blue-600 dark:text-blue-500">
              a cup of tea per day.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Get complete access to structured learning, live mentorship, premium resources, and a supportive community. Cancel anytime with zero hidden fees.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3 PRICING CARDS                                              */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4">
          {PRO_PRICING_PLANS.map((plan) => {
            const isHighlighted = !!plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted
                    ? "bg-[#0b1b36] text-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20 lg:-translate-y-2"
                    : "bg-white dark:bg-[#0c121e] text-gray-900 dark:text-white border border-gray-200/90 dark:border-gray-800 shadow-xl shadow-gray-500/5 hover:border-blue-300 dark:hover:border-gray-700"
                }`}
              >
                {/* Highlight Top Tab: MOST POPULAR */}
                {plan.topBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-t-xl bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 fill-gray-950 text-gray-950" />
                      {plan.topBadge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Top Row: Icon + Title + Pill Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          isHighlighted
                            ? "bg-blue-600/30 text-blue-400 border border-blue-400/30"
                            : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20"
                        }`}
                      >
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight leading-tight">
                          {plan.name}
                        </h3>
                        <p
                          className={`text-xs ${
                            isHighlighted ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
                          } pt-0.5`}
                        >
                          {plan.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shrink-0 ${plan.pillColor}`}
                    >
                      {plan.pillBadge}
                    </span>
                  </div>

                  {/* Pricing Block */}
                  <div
                    className={`space-y-2 border-y py-4 ${
                      isHighlighted ? "border-blue-900/60" : "border-gray-100 dark:border-gray-800"
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                      {plan.billingPeriod && (
                        <span
                          className={`text-xs font-semibold ${
                            isHighlighted ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {plan.billingPeriod}
                        </span>
                      )}
                    </div>

                    {/* Discount & Savings Pill */}
                    <div className="flex items-center gap-2 text-xs">
                      {isHighlighted ? (
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 font-bold text-xs border border-blue-400/20 flex items-center gap-1.5">
                          <span>Save {plan.discountPercent}%</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">Less than ₹8/day</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-200/60 dark:border-emerald-500/20">
                          Save {plan.discountPercent}%
                        </span>
                      )}

                      <span
                        className={`line-through font-mono text-xs ${
                          isHighlighted ? "text-gray-400" : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Checklist (8 Items) */}
                  <ul className="space-y-3 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {isHighlighted ? (
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 stroke-[2.5]" />
                        )}
                        <span
                          className={`leading-snug ${
                            isHighlighted ? "text-gray-200" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 mt-6">
                  {onSelectPlan ? (
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isHighlighted
                          ? "bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-500/30"
                          : "border border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={`/checkout/pro?plan=${plan.id}`}
                      className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        isHighlighted
                          ? "bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-500/30"
                          : "border border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* BOTTOM VALUE STRIP (4 TRUST BADGES)                          */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="rounded-[28px] border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#0c121e] p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TRUST_BADGES.map((badge, idx) => {
              const renderIcon = () => {
                if (badge.type === "piggy")
                  return (
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <BadgePercent className="w-5 h-5" />
                    </div>
                  );
                if (badge.type === "clock")
                  return (
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                  );
                if (badge.type === "file")
                  return (
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  );
                return (
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                );
              };

              return (
                <div key={idx} className="flex items-center gap-3.5 text-left">
                  {renderIcon()}
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* INTERACTIVE FREQUENTLY ASKED QUESTIONS                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
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
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-blue-500" : ""
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

          {/* WhatsApp Direct Help Banner with 24/7 Support */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 shadow-sm">
                <IconWhatsapp />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Payment Issue or Queries? 24/7 WhatsApp Support
                  </p>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                    24/7 Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 pt-0.5">
                  Faced any bank deduction, activation delay, or have queries? Chat directly with our team for instant resolution.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hi%20CrackDSA%20team,%20I%20have%20questions%20or%20need%20help%20with%20Pro%20subscription%20payment.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <IconWhatsapp />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}