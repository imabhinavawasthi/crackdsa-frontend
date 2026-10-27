'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  CheckCircle2, 
  CheckSquare, 
  ChevronRight, 
  Clock, 
  Crown, 
  Monitor, 
  PlayCircle, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

import type { CourseSummary } from '@/types/course';
import { formatPrice, getDiscountPercent } from '../courseDetailUtils';
import { useAuth } from '@/context/AuthContext';

type Tab = 'individual' | 'pro';

interface CourseDetailCardBodyProps {
  course: CourseSummary;
}

export default function CourseDetailCardBody({ course }: CourseDetailCardBodyProps) {
  const [activeTab, setActiveTab] = useState<Tab>('individual');
  const { user, isLoggedIn, isPro } = useAuth();

  // Check if user is enrolled via individual purchase, pro courses, or enrolled courses
  const isEnrolledInCourse = Boolean(
    isLoggedIn &&
      (user?.enrolled_courses?.some((c: any) =>
        c.course_id === course.slug ||
        c.course_id === course.id ||
        c.course_slug === course.slug ||
        c.course_slug === course.id ||
        (course.slug === "dsa" && (c.course_id === "data-structures-algorithms-mastery-program" || c.course_slug === "data-structures-algorithms-mastery-program"))
      ) ||
      user?.pro_courses?.some((c: any) =>
        c.course_id === course.slug ||
        c.course_id === course.id ||
        c.course_slug === course.slug ||
        c.course_slug === course.id ||
        (course.slug === "dsa" && (c.course_id === "data-structures-algorithms-mastery-program" || c.course_slug === "data-structures-algorithms-mastery-program"))
      ) ||
      user?.purchased_courses?.some((c: any) =>
        c.course_id === course.slug ||
        c.course_id === course.id ||
        c.course_slug === course.slug ||
        c.course_slug === course.id ||
        (course.slug === "dsa" && (c.course_id === "data-structures-algorithms-mastery-program" || c.course_slug === "data-structures-algorithms-mastery-program"))
      ))
  );

  // User has full access if they bought the course OR have active Pro membership
  const hasAccess = Boolean(isLoggedIn && (isPro || isEnrolledInCourse));

  // ─── Enrolled / Pro User View: Clean Classroom CTA with no sales/pricing ─────
  if (hasAccess) {
    return (
      <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 space-y-4 transition-colors">
        {/* Enrolled Status Banner */}
        <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5.5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  You are enrolled in this course
                </span>
                {isPro && !isEnrolledInCourse && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    <Sparkles className="size-2.5" /> Pro Pass
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                You have full access to all video lectures, course curriculum, and practice problems.
              </p>
            </div>
          </div>
        </div>

        {/* Classroom Action */}
        <div>
          {course.status === 'upcoming' ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 py-3.5 px-6 text-center text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300">
              <span>Upcoming Course • Starts Soon</span>
            </div>
          ) : (
            <Link
              href={`/course/${course.slug}/learn`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 px-6 text-center text-sm sm:text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Go to Classroom</span>
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ─── Non-Enrolled View: Pricing, Purchase & Pro Options ────────────────────────
  const discount = getDiscountPercent(course.price, course.original_price);
  const totalVideos = course.total_videos || 0;

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      {/* Tabs Header */}
      <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setActiveTab('individual')}
          className={`relative py-3.5 text-center text-sm font-semibold transition-colors ${
            activeTab === 'individual'
              ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 -mb-[2px]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Individual Purchase
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pro')}
          className={`relative py-3.5 text-center text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'pro'
              ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 -mb-[2px]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span>CrackDSA Pro</span>
          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
            BEST VALUE
          </span>
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === 'individual' ? (
          <div>
            {/* Price display */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {formatPrice(course.price)}
              </span>
              {course.original_price > course.price && (
                <span className="text-base font-normal text-gray-400 dark:text-gray-500 line-through">
                  {formatPrice(course.original_price)}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-md border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Main CTA */}
            <div className="mt-4">
              {course.status === 'upcoming' ? (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 py-3.5 px-6 text-center text-base font-bold text-amber-700 dark:text-amber-300">
                  <span>Upcoming Course</span>
                </div>
              ) : (
                <Link
                  href={`/checkout/course/${course.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-6 text-center text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.99]"
                >
                  <span>Buy This Course</span>
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </div>

            {/* OR Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-3 font-bold tracking-wider text-gray-400 dark:text-gray-500">OR</span>
              </div>
            </div>

            {/* Subscribe to CrackDSA Pro Promo Box */}
            <Link
              href="/pro"
              className="group flex items-center justify-between gap-3 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 transition-all hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <Crown className="size-4.5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    Subscribe to CrackDSA Pro
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    Get this course and all other courses with a single subscription.
                  </p>
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </Link>

            {/* Bullet Feature List */}
            <ul className="mt-5 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold">
                <Zap className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Live weekly classes & doubt clearing included</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span>Lifetime access to course content</span>
              </li>
              {totalVideos > 0 && (
                <li className="flex items-center gap-3">
                  <PlayCircle className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                  <span>{totalVideos} high-quality video lectures</span>
                </li>
              )}
              <li className="flex items-center gap-3">
                <CheckSquare className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span>Curated practice problems with solutions</span>
              </li>
              <li className="flex items-center gap-3">
                <Award className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span>Certificate of completion</span>
              </li>
              <li className="flex items-center gap-3">
                <Monitor className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span>Access on web, mobile and TV</span>
              </li>
            </ul>
          </div>
        ) : (
          /* CrackDSA Pro Tab Content */
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30 p-4">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                <Sparkles className="size-4" />
                <span>All-Access Membership</span>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Unlock <strong className="text-gray-900 dark:text-white">every single course</strong>, live mentorship sessions, CP sheets, and priority doubt support with one pass.
              </p>
            </div>

            <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2.5">
                <Zap className="size-4 text-amber-500 shrink-0" />
                <span>Access this course + all other courses</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Interactive live classes & masterclasses</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Award className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>CS Fundamentals</span>
              </li>
            </ul>

            <Link
              href="/pro"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-6 text-center text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
            >
              <span>Explore Pro Membership</span>
              <ChevronRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
