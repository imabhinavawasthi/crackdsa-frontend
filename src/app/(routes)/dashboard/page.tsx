"use client";

import { useMemo, useEffect, useState } from "react";
import { Loader2, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchLiveClasses } from "@/api/live-classes";
import { fetchCourses } from "@/api/courses";
import { fetchContests } from "@/api/contests";
import { fetchUserAssetStates } from "@/api/user";
import { LiveClass } from "@/types/live-class";
import { CourseSummary } from "@/types/course";
import { ContestSummary } from "@/types/contest";

import {
  DashboardGreeting,
  StreakCalendar,
  DashboardLiveClasses,
  DashboardContinueLearning,
  DashboardEditorials,
  DashboardDSASheets,
  DashboardCSAndMock,
  DashboardPopularTopics,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || (isLoggedIn ? "Learner" : "Learner");

  // State
  const [loading, setLoading] = useState(true);
  const [upcomingClass, setUpcomingClass] = useState<LiveClass | null>(null);
  const [lastClass, setLastClass] = useState<LiveClass | null>(null);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [cpSolvedCount, setCpSolvedCount] = useState(0);
  const [activityDates, setActivityDates] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Check if enrolled in DSA course
  const isEnrolledInDSA = useMemo(() => {
    if (!isLoggedIn || !user) return false;
    return Boolean(
      user.roles?.includes("admin") ||
      user.is_pro_active ||
      user.enrolled_courses?.some((c: any) => c.course_id === "dsa" || c.course_id === "54b8ebac-66f4-498a-9b94-66a149866d3e") ||
      user.pro_courses?.some((c: any) => c.course_id === "dsa" || c.course_id === "54b8ebac-66f4-498a-9b94-66a149866d3e") ||
      user.purchased_courses?.some((c: any) => c.course_id === "dsa" || c.course_id === "54b8ebac-66f4-498a-9b94-66a149866d3e")
    );
  }, [user, isLoggedIn]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);

        // Fetch Live Classes, Courses, and Contests in parallel
        const [liveClassesRes, coursesRes, contestsRes] = await Promise.all([
          fetchLiveClasses({ limit: 10 }).catch(() => null),
          fetchCourses().catch(() => []),
          fetchContests().catch(() => []),
        ]);

        if (!isMounted) return;

        // 1. Process Live Classes
        if (liveClassesRes && liveClassesRes.items) {
          const items = liveClassesRes.items;
          const upcoming = items.find((c) => c.status === "live" || c.status === "upcoming") || null;
          const completed = items.find((c) => c.status === "completed") || null;
          setUpcomingClass(upcoming);
          setLastClass(completed);
        }

        // 2. Process Courses
        if (coursesRes) {
          setCourses(coursesRes);
        }

        // 3. Process Contests
        if (contestsRes) {
          setContests(contestsRes);
        }

        // 4. Process User Progress & Streak Metrics
        let assetStates: any[] = [];
        if (isLoggedIn) {
          assetStates = await fetchUserAssetStates().catch(() => []);
        }

        // Videos completed in DSA
        const videosDone = assetStates.filter(
          (a) => a.asset_type === "video" && a.status === "done"
        ).length;
        setCompletedLessonsCount(videosDone);

        // CP Sheet Solved Count
        const cpDoneFromApi = assetStates.filter(
          (a) => a.asset_id && a.asset_id.startsWith("cp:") && a.status === "done"
        ).length;

        let totalCpDone = cpDoneFromApi;
        if (typeof window !== "undefined" && totalCpDone === 0) {
          const localCp = localStorage.getItem("crackdsa_cp_sheet_states");
          if (localCp) {
            try {
              const parsed = JSON.parse(localCp);
              totalCpDone = Object.values(parsed).filter((v: any) => v.status === "done").length;
            } catch {}
          }
        }
        setCpSolvedCount(totalCpDone);

        // Extract dates for Activity Heatmap
        const dates: string[] = [];
        assetStates.forEach((a) => {
          if (a.updated_at) {
            dates.push(a.updated_at.slice(0, 10));
          }
        });

        // Add dates from local storage if available
        if (typeof window !== "undefined") {
          const localSolved = localStorage.getItem("crackdsa_solved_problems");
          if (localSolved && dates.length === 0) {
            try {
              const solvedIds = JSON.parse(localSolved);
              if (solvedIds.length > 0) {
                // If user has solved problems locally, add today as active
                dates.push(new Date().toLocaleDateString("en-CA"));
              }
            } catch {}
          }
        }

        // Compute Streak Metrics
        const { currentStreak: cStreak, maxStreak: mStreak, uniqueDates } = computeStreak(dates);
        setActivityDates(uniqueDates);
        setCurrentStreak(cStreak);
        setMaxStreak(mStreak);

      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);


  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* ─── 1. FULL WIDTH MOUNTAIN HEADER ──────────────────────────── */}
      <DashboardGreeting firstName={firstName} />

      {/* ─── 2. SECTION NEXT TO HEADER: LIVE CLASSES, EDITORIALS & STREAK ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <DashboardLiveClasses
          upcomingClass={upcomingClass}
          lastClass={lastClass}
          loading={loading}
        />
        <DashboardEditorials
          contests={contests}
          loading={loading}
        />
        <StreakCalendar
          activityDates={activityDates}
          currentStreak={currentStreak}
          maxStreak={maxStreak}
          loading={loading}
        />
      </div>

      {/* ─── 3. CONTINUE LEARNING (FEATURED DSA & COURSES) ───────────── */}
      <DashboardContinueLearning
        isLoggedIn={isLoggedIn}
        isEnrolledInDSA={isEnrolledInDSA}
        completedLessonsCount={completedLessonsCount}
        totalLessonsCount={206}
        cpSolvedCount={cpSolvedCount}
        cpTotalCount={175}
      />

      {/* ─── 4. DSA SHEETS & CS FUNDAMENTALS ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <DashboardDSASheets cpSolvedCount={cpSolvedCount} cpTotalCount={175} />
        <DashboardCSAndMock />
      </div>

      {/* ─── 5. POPULAR TOPICS SHORTCUTS ──────────────────────────────── */}
      <DashboardPopularTopics />
    </div>
  );
}

// ─── Utility: Compute Current & Max Streak ────────────────────────────────────
function computeStreak(dateStrings: string[]) {
  if (!dateStrings || dateStrings.length === 0) {
    return { currentStreak: 0, maxStreak: 0, uniqueDates: [] };
  }

  const uniqueDates = Array.from(new Set(dateStrings.map((d) => d.slice(0, 10))))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0, uniqueDates: [] };
  }

  // Max streak
  let maxStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const dayStr of uniqueDates) {
    const curDate = new Date(dayStr);
    if (!prevDate) {
      running = 1;
    } else {
      const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    if (running > maxStreak) maxStreak = running;
    prevDate = curDate;
  }

  // Current streak (counting backwards from today or yesterday)
  const todayStr = new Date().toLocaleDateString("en-CA");
  const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
  const revDays = [...uniqueDates].reverse();

  let currentStreak = 0;
  if (revDays[0] === todayStr || revDays[0] === yesterdayStr) {
    currentStreak = 1;
    let active = new Date(revDays[0]);
    for (let i = 1; i < revDays.length; i++) {
      const p = new Date(revDays[i]);
      const diff = Math.round((active.getTime() - p.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        currentStreak++;
        active = p;
      } else {
        break;
      }
    }
  }

  return { currentStreak, maxStreak, uniqueDates };
}
