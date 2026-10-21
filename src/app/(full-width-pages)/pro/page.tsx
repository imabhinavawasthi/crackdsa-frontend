"use client";

import React from "react";
import { AnnouncementBanner } from "@/components/landing-page/announcement-banner";
import { LandingNavbar } from "@/components/landing-page/landing-navbar";
import AppFooter from "@/layout/AppFooter";

// ─── Redesigned CrackDSA Pro Sections ──────────────────────────────────────────
import { ProHero } from "@/components/pro-page/01-pro-hero";
import { ProEverythingIncluded } from "@/components/pro-page/02-pro-everything-included";
import { ProLiveMentorship } from "@/components/pro-page/04-pro-live-mentorship";
import { ProBeyondDsa } from "@/components/pro-page/06-pro-beyond-dsa";
import { ProWhyValue } from "@/components/pro-page/07-pro-why-value";
import { ProPricingPlans } from "@/components/pro-page/08-pro-pricing-plans";

export default function ProLandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#070b12] text-gray-900 dark:text-gray-100 scroll-smooth selection:bg-brand-500/20 selection:text-brand-600 dark:selection:text-brand-400">
      {/* Top Countdown Ticker */}
      <AnnouncementBanner />

      {/* Modern Glassmorphic Navbar with Mega Menus & Auth */}
      <LandingNavbar />

      <main className="space-y-0">
        {/* 01. Hero — Go Further with CrackDSA Pro (Matches & elevates reference mockup) */}
        <ProHero />

        {/* 02. Everything Included in Pro (Visual bento grid of all unlocked features) */}
        <ProEverythingIncluded />

        {/* 03. Learn from Mentors, Live (Weekly classes, doubt solving & live video embed) */}
        <ProLiveMentorship />

        {/* 04. Core CS Fundamentals & Notes (OS, DBMS, Computer Networks & OOPs) */}
        <ProBeyondDsa />

        {/* 05. Why CrackDSA Pro? (Accurate itemized value vs individual purchase & matrix comparison) */}
        <ProWhyValue />

        {/* 06. Choose Your Plan (Transparent pricing, FAQs & final subscription CTA) */}
        <ProPricingPlans />
      </main>

      {/* Global Comprehensive Footer */}
      <AppFooter />
    </div>
  );
}
