"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
  Zap,
  BookOpen,
  Calendar,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoginRequired from "@/components/common/LoginRequired";

export default function SubscriptionPage() {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Profile
          </Link>
        </div>
        <LoginRequired
          title="Subscription Details Require Sign In"
          description="Sign in to view your tier status, course access records, and billing options."
        />
      </div>
    );
  }

  const isPro = user?.pro_subscription?.is_pro || false;
  const courseCount = Array.isArray(user?.purchased_courses) 
    ? user.purchased_courses.length 
    : Object.keys(user?.purchased_courses || {}).length;

  const proFeatures = [
    "Unlimited access to premium DSA worksheets and curated lists",
    "Detailed video solutions for complex algorithmic problems",
    "Exclusive invitation to crackDSA Masterclasses and events",
    "Active participation in professional community networks",
    "Real-time streak analytics and progress logging metrics"
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 select-none space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                <Sparkles size={20} />
              </span>
              Subscription & Access
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Manage your active subscription, premium benefits, and course enrollments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier Details Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
            {isPro && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/[0.04] to-transparent animate-pulse" />
            )}
            
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
              <CreditCard size={14} />
              <span>Current Plan Overview</span>
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/50 dark:bg-white/[0.01] rounded-2xl border border-gray-100 dark:border-white/5 p-5">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Tier</p>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  {isPro ? "PRO Subscription" : "Free Explorer"}
                  {isPro && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2.5 py-0.5 rounded-lg border border-yellow-500/10 shadow-xs">
                      Premium
                    </span>
                  )}
                </h3>
              </div>

              {isPro ? (
                user?.pro_subscription?.expires_at && (
                  <div className="space-y-1 text-left sm:text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex sm:justify-end items-center gap-1">
                      <Calendar size={12} /> Expiration
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-250">
                      {new Date(user?.pro_subscription?.expires_at || 0).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                )
              ) : (
                <Link
                  href="/checkout/pro"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/10 cursor-pointer"
                >
                  <Zap size={12} className="fill-white" />
                  Upgrade to PRO
                </Link>
              )}
            </div>
          </div>

          {/* Active Courses Enrollment Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
              <BookOpen size={14} />
              <span>Active Course Purchases ({courseCount})</span>
            </h2>

            {courseCount === 0 ? (
              <div className="border border-dashed border-gray-250/70 dark:border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">No enrollments yet</p>
                <p className="text-xs text-gray-400 mt-1">Explore courses catalog to subscribe to curriculum paths.</p>
                <Link
                  href="/courses"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-bold uppercase tracking-wider"
                >
                  Browse Courses <ArrowLeft size={12} className="rotate-180" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {((Array.isArray(user?.purchased_courses) 
                  ? user.purchased_courses.map((id: string) => [id, { expires_at: null }])
                  : Object.entries(user?.purchased_courses || {})) as any[]
                ).map(([slug, detail]: [string, any]) => (
                  <div
                    key={slug}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/[0.01]"
                  >
                    <div className="min-w-0 space-y-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-brand-500 block">Course</span>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">
                        {slug.length > 20 ? "Purchased Course" : slug.replace(/-/g, " ")}
                      </h4>
                    </div>

                    {detail?.expires_at && (
                      <div className="mt-2 sm:mt-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Access Expires: {new Date(detail.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Benefits Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50 h-fit space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Sparkles size={14} className="text-brand-500" />
            <span>Premium Benefits</span>
          </h2>

          <ul className="space-y-3.5 pt-2">
            {proFeatures.map((feat, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check size={12} />
                </span>
                <span className="text-xs font-medium text-gray-550 dark:text-gray-400 leading-relaxed">
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
