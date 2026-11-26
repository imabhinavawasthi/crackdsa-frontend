import React from "react";
import dynamic from "next/dynamic";
import { AnnouncementBanner } from "./announcement-banner";
import { LandingNavbar } from "./landing-navbar";
import { HeroSection } from "./hero-section";
import { FeaturesBento } from "./features-bento";

// Dynamically import below-the-fold sections to streamline initial page load & hydration
const SheetsShowcase = dynamic(
  () => import("./sheets-showcase").then((mod) => mod.SheetsShowcase)
);
// const ProHighlightBanner = dynamic(
//   () => import("./pro-highlight-banner").then((mod) => mod.ProHighlightBanner)
// );
const LandingTestimonials = dynamic(
  () => import("./landing-testimonials").then((mod) => mod.LandingTestimonials)
);
const LandingFAQ = dynamic(
  () => import("./landing-faq").then((mod) => mod.LandingFAQ)
);
const AppFooter = dynamic(() => import("@/layout/AppFooter"));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#070b12] text-gray-900 dark:text-gray-100 scroll-smooth selection:bg-brand-500/20 selection:text-brand-600 dark:selection:text-brand-400">
      {/* 1. Top Real-Time Countdown Sales Ticker (takeUforward Zenkai Banner Benchmark) */}
      <AnnouncementBanner />

      {/* 2. Modern Glassmorphic Navbar with Mega Menus & Auth Integration */}
      <LandingNavbar />

      <main className="space-y-4">
        {/* 3. Hero Section with Key Metrics & Placement Marquee */}
        <HeroSection />

        {/* 4. "One Platform. Every Placement Advantage." 6-Pillar Platform Bento Grid */}
        <FeaturesBento />

        {/* 6. Curated Sheets Interactive Browser (SDE Sheet 180, Blind 75, Love Babbar 450) */}
        <SheetsShowcase />

        {/* 7. CrackDSA Pro Spotlight Banner (< ₹10/day, Live Classes & Doubts by Abhinav) */}
        {/* <ProHighlightBanner /> */}

        {/* 8. Verified Student Placement Wins (Microsoft, ServiceNow, GFG, Juspay, etc.) */}
        <LandingTestimonials />

        {/* 9. TUF-Style Interactive Frequently Asked Questions (FAQ) Accordion */}
        <LandingFAQ />

        {/* 10. Final High-Impact CTA Banner */}
        {/* <FinalCta /> */}
      </main>

      {/* 11. Global Footer */}
      <AppFooter />
    </div>
  );
}
