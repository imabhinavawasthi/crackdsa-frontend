"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import ProSubscriptionSection from "@/components/landing/ProSubscriptionSection";
import CoursesSection from "@/components/landing/CoursesSection";
import PracticeSection from "@/components/landing/PracticeSection";
import StatsBar from "@/components/landing/StatsBar";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CommunitySection from "@/components/landing/CommunitySection";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative bg-gray-950 text-white selection:bg-brand-500/30 selection:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <ProSubscriptionSection />
        <CoursesSection />
        <PracticeSection />
        <StatsBar />
        <TestimonialsSection />
        <CommunitySection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
