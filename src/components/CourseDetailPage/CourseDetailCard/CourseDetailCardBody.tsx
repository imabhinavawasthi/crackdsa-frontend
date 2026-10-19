'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  CheckSquare, 
  ChevronRight, 
  Clock, 
  Crown, 
  FileText, 
  Monitor, 
  PlayCircle, 
  RefreshCw, 
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
  const { user, isLoggedIn } = useAuth();

  const isEnrolled = Boolean(
    isLoggedIn &&
      (user?.enrolled_courses?.some((c: any) => c.course_id === course.slug || c.course_id === course.id) ||
        user?.pro_courses?.some((c: any) => c.course_id === course.slug || c.course_id === course.id))
  );

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
              {isEnrolled ? (
                <Link
                  href={`/course/${course.slug}/learn`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-6 text-center text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 active:scale-[0.99]"
                >
                  <span>Go to Classroom</span>
                  <ChevronRight className="size-4" />
                </Link>
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

