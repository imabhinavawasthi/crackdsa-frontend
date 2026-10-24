"use client";

import { useMemo, useEffect, useState } from "react";
import { Loader2, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchFeaturedLiveClass } from "@/api/live-classes";
import { fetchContests } from "@/api/contests";
import { fetchUserActivitySummary } from "@/api/user";
import { fetchSheets } from "@/api/sheets";
import { fetchCourses } from "@/api/courses";
import { LiveClass } from "@/types/live-class";
import { ContestSummary } from "@/types/contest";
import { DSASheet } from "@/types/dsa-sheet";
import { CourseSummary } from "@/types/course";

import {
  DashboardGreeting,
  StreakCalendar,
  DashboardLiveClasses,
  DashboardContinueLearning,
  DashboardEditorials,
  DashboardTopSheets,
  DashboardTopCourses,
  DashboardTopCSFundamentals,
  DashboardPopularTopics,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || (isLoggedIn ? "Learner" : "Learner");

  // State
  const [loading, setLoading] = useState(true);
  const [featuredClass, setFeaturedClass] = useState<LiveClass | null>(null);
  const [upcomingClass, setUpcomingClass] = useState<LiveClass | null>(null);
  const [lastClass, setLastClass] = useState<LiveClass | null>(null);
  const [contests, setContests] = useState<ContestSummary[]>([]);
  const [sheets, setSheets] = useState<DSASheet[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
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

        // Fetch Live Class, Contests, Activity Summary, Sheets, and Courses in parallel
        const [featuredClassRes, contestsRes, activitySummaryRes, sheetsRes, coursesRes] = await Promise.all([
          fetchFeaturedLiveClass().catch(() => null),
          fetchContests(undefined, undefined, 3).catch(() => []),
          isLoggedIn ? fetchUserActivitySummary().catch(() => null) : Promise.resolve(null),
          fetchSheets(3).catch(() => []),
          fetchCourses(3).catch(() => []),
        ]);

        if (!isMounted) return;

        // 1. Process Live Class
        if (featuredClassRes) {
          setFeaturedClass(featuredClassRes);
          if (featuredClassRes.status === "live" || featuredClassRes.status === "upcoming") {
            setUpcomingClass(featuredClassRes);
            setLastClass(null);
          } else {
            setUpcomingClass(null);
            setLastClass(featuredClassRes);
          }
        } else {
          setFeaturedClass(null);
          setUpcomingClass(null);
          setLastClass(null);
        }

        // 2. Process Contests
        if (contestsRes) {
          setContests(contestsRes);
        }

        // 3. Process Sheets & Courses
        if (sheetsRes) {
          setSheets(sheetsRes);
        }
        if (coursesRes) {
          setCourses(coursesRes);
        }

        // 4. Process Activity & Streak Metrics
        if (activitySummaryRes) {
          setCurrentStreak(activitySummaryRes.current_streak || 0);
          setMaxStreak(activitySummaryRes.max_streak || 0);
          setActivityDates(activitySummaryRes.month_active_dates || []);
          setCompletedLessonsCount(activitySummaryRes.completed_lessons_count || 0);

          let cpCount = activitySummaryRes.cp_solved_count || 0;
          if (typeof window !== "undefined" && cpCount === 0) {
            const localCp = localStorage.getItem("crackdsa_cp_sheet_states");
            if (localCp) {
              try {
                const parsed = JSON.parse(localCp);
                cpCount = Object.values(parsed).filter((v: any) => v.status === "done").length;
              } catch {}
            }
          }
          setCpSolvedCount(cpCount);
        } else {
          // Fallback to local storage for guests
          let localDates: string[] = [];
          if (typeof window !== "undefined") {
            const localSolved = localStorage.getItem("crackdsa_solved_problems");
            if (localSolved) {
              try {
                const solvedIds = JSON.parse(localSolved);
                if (solvedIds.length > 0) localDates.push(new Date().toLocaleDateString("en-CA"));
              } catch {}
            }
            const localCp = localStorage.getItem("crackdsa_cp_sheet_states");
            if (localCp) {
              try {
                const parsed = JSON.parse(localCp);
                const cpCount = Object.values(parsed).filter((v: any) => v.status === "done").length;
                setCpSolvedCount(cpCount);
              } catch {}
            }
          }
          const { currentStreak: cStreak, maxStreak: mStreak, uniqueDates } = computeStreak(localDates);
          setActivityDates(uniqueDates);
          setCurrentStreak(cStreak);
          setMaxStreak(mStreak);
        }

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

      {/* ─── 2. SECTION 1: LIVE CLASSES, EDITORIALS & STREAK ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <DashboardLiveClasses
          featuredClass={featuredClass}
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

      {/* ─── 4. SECTION 2: DSA SHEETS, COURSES & CS FUNDAMENTALS ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <DashboardTopSheets
          sheets={sheets}
          loading={loading}
        />
        <DashboardTopCourses
          courses={courses}
          loading={loading}
        />
        <DashboardTopCSFundamentals />
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
