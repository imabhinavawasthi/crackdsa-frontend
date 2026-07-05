"use client";

import { useMemo, useEffect, useState } from "react";
import { CheckCircle2, Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchActiveRoadmapApi } from "@/api/roadmap";
import { fetchUserAssetStates } from "@/api/user";
import { fetchProblems } from "@/api/problems";
import { RoadmapDBRecord } from "@/components/roadmap/types";
import { useActiveStreak } from "@/hooks/useActiveStreak";
import { DetailedProblem } from "@/types/dsa-sheet";

import {
  UserGreetingSection,
  ActiveRoadmapSection,
  FeatureShowcaseSection,
  FeaturedDSASheetsSection,
  ProFeaturesSection,
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

  useEffect(() => {
    async function loadDashboardData() {
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

        // Fetch a date-stable daily problem using limit & offset pagination
        const now = new Date();
        const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
        const offset = seed % 180;

        let problems = await fetchProblems(1, offset).catch(() => []);
        // Fallback to offset 0 if the generated offset exceeds the available problems
        if (problems.length === 0 && offset > 0) {
          problems = await fetchProblems(1, 0).catch(() => []);
        }
        if (problems.length > 0) {
          const p = problems[0];
          setDailyProblem({
            id: p.id,
            slug: p.slug,
            title: p.title,
            difficulty: p.difficulty as "Easy" | "Medium" | "Hard",
            platform: p.platform,
            problem_url: p.problem_url || undefined,
          });
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
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

  // ─── GUEST VIEW (not logged in) ──────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-6 px-4">
        <UserGreetingSection firstName={firstName} isPro={false} />
        <ActiveRoadmapSection isLoading={isLoading} activeRoadmap={null} isLoggedIn={false} isPro={false} />
        <FeatureShowcaseSection isLoggedIn={false} />
        <FeaturedDSASheetsSection />
        <ProFeaturesSection isPro={false} />
        <EcosystemSection />
        <UpgradeBanner isLoggedIn={false} />
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

  // ─── FREE USER VIEW ───────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16 pt-6 px-4">
      <UserGreetingSection firstName={firstName} isPro={false} stats={stats} dailyProblem={dailyProblem} />
      <ActiveRoadmapSection isLoading={isLoading} activeRoadmap={activeRoadmap} isLoggedIn isPro={false} />
      {combinedCourses.length > 0 && <EnrolledCoursesSection enrolledCourses={combinedCourses} />}
      <FeatureShowcaseSection isLoggedIn />
      <FeaturedDSASheetsSection />
      <ProFeaturesSection isPro={false} />
      <EcosystemSection />
      <UpgradeBanner isLoggedIn />
    </div>
  );
}
