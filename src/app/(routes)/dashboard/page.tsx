"use client";

import { useMemo, useEffect, useState, useRef } from "react";
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

// ─── Custom Hook for Progressive Lazy In-View Detection ──────────────────────────
function useLazyInView(rootMargin = "250px", idleFallbackMs = 2500) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If running in an environment without IntersectionObserver, show immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    let timer: any = null;
    if (idleFallbackMs > 0) {
      timer = setTimeout(() => {
        setInView(true);
      }, idleFallbackMs);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (timer) clearTimeout(timer);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [rootMargin, idleFallbackMs]);

  return { ref, inView };
}

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || (isLoggedIn ? "Learner" : "Learner");

  // ─── Section 1: Independent State per Card ─────────────────────────────────
  const [liveClassLoading, setLiveClassLoading] = useState(true);
  const [featuredClass, setFeaturedClass] = useState<LiveClass | null>(null);
  const [upcomingClass, setUpcomingClass] = useState<LiveClass | null>(null);
  const [lastClass, setLastClass] = useState<LiveClass | null>(null);

  const [contestsLoading, setContestsLoading] = useState(true);
  const [contests, setContests] = useState<ContestSummary[]>([]);

  const [streakLoading, setStreakLoading] = useState(true);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [cpSolvedCount, setCpSolvedCount] = useState(0);
  const [activityDates, setActivityDates] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // ─── Section 3: Lazy-Loaded Sheets & Courses ──────────────────────────────
  const { ref: section3Ref, inView: section3InView } = useLazyInView("250px", 2200);
  const [sheetsLoading, setSheetsLoading] = useState(true);
  const [sheets, setSheets] = useState<DSASheet[]>([]);

  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courses, setCourses] = useState<CourseSummary[]>([]);

  // ─── Section 4: Lazy-Loaded Popular Topics ────────────────────────────────
  const { ref: section4Ref, inView: section4InView } = useLazyInView("200px", 3500);

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

  // ─── 1. Load Live Classes independently ─────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    fetchFeaturedLiveClass()
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setFeaturedClass(res);
          if (res.status === "live" || res.status === "upcoming") {
            setUpcomingClass(res);
            setLastClass(null);
          } else {
            setUpcomingClass(null);
            setLastClass(res);
          }
        }
      })
      .catch((err) => {
        console.error("Live classes load error:", err);
      })
      .finally(() => {
        if (isMounted) setLiveClassLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── 2. Load Contests independently ─────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    fetchContests(undefined, undefined, 3)
      .then((res) => {
        if (!isMounted) return;
        if (res) setContests(res);
      })
      .catch((err) => {
        console.error("Contests load error:", err);
      })
      .finally(() => {
        if (isMounted) setContestsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── 3. Load Activity & Streak Metrics independently ────────────────────────
  useEffect(() => {
    let isMounted = true;

    if (isLoggedIn) {
      fetchUserActivitySummary()
        .then((res) => {
          if (!isMounted) return;
          if (res) {
            setCurrentStreak(res.current_streak || 0);
            setMaxStreak(res.max_streak || 0);
            setActivityDates(res.month_active_dates || []);
            setCompletedLessonsCount(res.completed_lessons_count || 0);

            let cpCount = res.cp_solved_count || 0;
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
          }
        })
        .catch((err) => {
          console.error("Activity summary error:", err);
        })
        .finally(() => {
          if (isMounted) setStreakLoading(false);
        });
    } else {
      // Local storage fallback for guest
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
      setStreakLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // ─── 4. Lazy Load Section 3: Sheets & Courses (Triggered by Scroll/In-View) ──
  useEffect(() => {
    if (!section3InView) return;
    let isMounted = true;

    // Fetch Sheets
    fetchSheets(3)
      .then((res) => {
        if (!isMounted) return;
        if (res) setSheets(res);
      })
      .catch((err) => {
        console.error("Sheets load error:", err);
      })
      .finally(() => {
        if (isMounted) setSheetsLoading(false);
      });

    // Fetch Courses
    fetchCourses(3)
      .then((res) => {
        if (!isMounted) return;
        if (res) setCourses(res);
      })
      .catch((err) => {
        console.error("Courses load error:", err);
      })
      .finally(() => {
        if (isMounted) setCoursesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [section3InView]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* ─── 1. FULL WIDTH MOUNTAIN HEADER (Instant) ──────────────────── */}
      <DashboardGreeting firstName={firstName} />

      {/* ─── 2. SECTION 1: LIVE CLASSES, EDITORIALS & STREAK (Priority 1) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in duration-500">
        <DashboardLiveClasses
          featuredClass={featuredClass}
          upcomingClass={upcomingClass}
          lastClass={lastClass}
          loading={liveClassLoading}
        />
        <DashboardEditorials
          contests={contests}
          loading={contestsLoading}
        />
        <StreakCalendar
          activityDates={activityDates}
          currentStreak={currentStreak}
          maxStreak={maxStreak}
          loading={streakLoading}
        />
      </div>

      {/* ─── 3. CONTINUE LEARNING (Priority 2) ─────────────────────────── */}
      <div className="animate-in fade-in duration-700">
        <DashboardContinueLearning
          isLoggedIn={isLoggedIn}
          isEnrolledInDSA={isEnrolledInDSA}
          completedLessonsCount={completedLessonsCount}
          totalLessonsCount={206}
          cpSolvedCount={cpSolvedCount}
          cpTotalCount={175}
        />
      </div>

      {/* ─── 4. SECTION 3: DSA SHEETS, COURSES & CS FUNDAMENTALS (Lazy-Loaded) */}
      <div
        ref={section3Ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch transition-opacity duration-700"
      >
        <DashboardTopSheets
          sheets={sheets}
          loading={sheetsLoading}
        />
        <DashboardTopCourses
          courses={courses}
          loading={coursesLoading}
        />
        <DashboardTopCSFundamentals />
      </div>

      {/* ─── 5. SECTION 4: POPULAR TOPICS (Deep Lazy-Loaded) ───────────── */}
      <div ref={section4Ref} className="min-h-[140px]">
        {section4InView ? (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <DashboardPopularTopics />
          </div>
        ) : (
          <div className="h-44 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 animate-pulse" />
        )}
      </div>
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
