"use client";

import { useMemo, useEffect, useState } from "react";
import { CheckCircle2, Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchActiveRoadmapApi } from "@/api/roadmap";
import { fetchUserAssetStates } from "@/api/user";
import { fetchProblemOfTheDay } from "@/api/potd";
import { RoadmapDBRecord } from "@/components/roadmap/types";
import { useActiveStreak } from "@/hooks/useActiveStreak";
import { DetailedProblem } from "@/types/dsa-sheet";

import {
  HeroFeaturesSection,
  UserGreetingSection,
  ActiveRoadmapSection,
  FeatureShowcaseSection,
  FeaturedDSASheetsSection,
  EnrolledCoursesSection,
  ProExclusiveSection,
  EcosystemSection,
  UpgradeBanner,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Welcome to crackDSA";
  const isPro = user?.is_pro_active === true;
  const streak = useActiveStreak();

  // Data States
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapDBRecord | null>(null);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [dailyProblem, setDailyProblem] = useState<DetailedProblem | null>(null);

  // Fetch Problem of the Day for ALL users (public endpoint, no auth needed)
  useEffect(() => {
    async function loadPotd() {
      const potd = await fetchProblemOfTheDay();
      if (potd) {
        setDailyProblem({
          id: potd.id,
          slug: potd.slug,
          title: potd.title,
          difficulty: potd.difficulty,
          platform: potd.platform,
          problem_url: potd.problem_url || undefined,
        });
      }
    }
    loadPotd();
  }, []);

  // Fetch logged-in user specific data (roadmap, solved count)
  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const [roadmap, assetStates] = await Promise.all([
          fetchActiveRoadmapApi().catch(() => null),
          fetchUserAssetStates().catch(() => []),
        ]);

        setActiveRoadmap(roadmap);

        const solvedCount = assetStates.filter(
          (asset: { asset_type: string; status: string }) => asset.asset_type === "problem" && asset.status === "done"
        ).length;
        setProblemsSolved(solvedCount);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  const stats = useMemo(
    () => [
      { label: "Solved", value: isLoading ? "–" : problemsSolved.toString(), icon: CheckCircle2, color: "text-emerald-500" },
      { label: "Streak", value: streak > 0 ? `${streak}d` : "–", icon: Flame, color: "text-orange-500" },
    ],
    [isLoading, problemsSolved, streak]
  );

  const combinedCourses = useMemo(() => {
    const proCourses = (user?.pro_courses || []).map(c => ({ ...c, is_pro_course: true }));
    const purchasedCourses = (user?.purchased_courses || []).map(c => ({ ...c, is_pro_course: false }));
    
    const combined = [...purchasedCourses];
    proCourses.forEach(proCourse => {
      if (!combined.some(c => c.course_id === proCourse.course_id)) {
        combined.push(proCourse);
      }
    });
    return combined;
  }, [user?.pro_courses, user?.purchased_courses]);

  // Show loading spinner while auth is resolving
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  // ─── PRO VIEW ─────────────────────────────────────────────────────────────

  if (isPro) {
    return (
      <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-6 px-4">
        <UserGreetingSection firstName={firstName} isPro stats={stats} dailyProblem={dailyProblem} />
        <ActiveRoadmapSection isLoading={isLoading} activeRoadmap={activeRoadmap} isLoggedIn isPro />
        <EnrolledCoursesSection enrolledCourses={combinedCourses} />
        <ProExclusiveSection />
        <FeatureShowcaseSection isLoggedIn />
        <EcosystemSection />
      </div>
    );
  }

  // ─── COMMON VIEW (Guest + Free User) ─────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-6 px-4">
      <UserGreetingSection firstName={firstName} isPro={false} stats={isLoggedIn ? stats : undefined} dailyProblem={dailyProblem} />
      <HeroFeaturesSection />
      <FeatureShowcaseSection isLoggedIn={isLoggedIn} />
      {isLoggedIn && combinedCourses.length > 0 && <EnrolledCoursesSection enrolledCourses={combinedCourses} />}
      <FeaturedDSASheetsSection />
      <EcosystemSection />
      <UpgradeBanner isLoggedIn={isLoggedIn} />
    </div>
  );
}
