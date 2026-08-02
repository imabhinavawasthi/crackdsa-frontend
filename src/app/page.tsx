"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import UspAISection from "@/components/landing/UspAISection";
import MasterCourseSection from "@/components/landing/MasterCourseSection";
import DsaSheetsSection from "@/components/landing/DsaSheetsSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import StatsBar from "@/components/landing/StatsBar";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CommunitySection from "@/components/landing/CommunitySection";
import FinalCTA from "@/components/landing/FinalCTA";
import AppFooter from "@/layout/AppFooter";

export default function LandingPage() {
  return (
    <div className="relative bg-gray-50 text-gray-900 dark:bg-[#080C14] dark:text-white selection:bg-brand-500/30 selection:text-white transition-colors duration-300">
      <LandingNavbar />
      <main>
        {/* 1. Modern Hero Section */}
        <HeroSection />

        {/* 2. FAANG Placement Marquee */}
        {/* <TrustBar /> */}

        {/* 3. Primary USP: AI-Personalized Learning & Roadmaps */}
        <UspAISection />

        {/* 4. Single Flagship DSA Master Course */}
        <MasterCourseSection />

        {/* 5. Industry-Standard DSA Sheets Spotlight */}
        <DsaSheetsSection />

        {/* 6. Complete Ecosystem: Topic, Company, Masterclasses, Resources */}
        <EcosystemSection />

        {/* 7. Platform Statistics */}
        <StatsBar />

        {/* 8. Student Success Stories */}
        <TestimonialsSection />

        {/* 9. Community Channels */}
        <CommunitySection />

        {/* 10. Bottom CTA */}
        <FinalCTA />
      </main>

      {/* Main Shared Platform Footer */}
      <AppFooter />
    </div>
  );
}
