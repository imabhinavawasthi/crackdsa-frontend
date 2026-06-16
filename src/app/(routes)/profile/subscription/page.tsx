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
import WhatsAppSupportButton from "@/components/common/WhatsAppSupportButton";
import { motion } from "framer-motion";
import LoginRequired from "@/components/common/LoginRequired";

export default function SubscriptionPage() {
  const { isLoggedIn, user, isLoading: isAuthLoading } = useAuth();
  const [subscriptionDetails, setSubscriptionDetails] = React.useState<any>(null);
  const [isDetailsLoading, setIsDetailsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isLoggedIn) {
      setIsDetailsLoading(false);
      return;
    }
    
    async function fetchDetails() {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
        const token = localStorage.getItem("crackdsa_access_token");
        const res = await fetch(`${BACKEND_URL}/api/v1/auth/subscription-details`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSubscriptionDetails(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsDetailsLoading(false);
      }
    }
    fetchDetails();
  }, [isLoggedIn]);

  if (isAuthLoading || isDetailsLoading) {
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

  const isPro = user?.is_pro_active || false;
  
  const proSub = subscriptionDetails?.pro_subscription || {};
  const purchasedCourses = subscriptionDetails?.purchased_courses || {};
  
  // Backwards compatibility for courses
  let coursesList: any[] = [];
  if (purchasedCourses.courses) {
    coursesList = purchasedCourses.courses;
  } else {
    // Legacy support
    coursesList = Object.entries(purchasedCourses).map(([id, detail]: [string, any]) => ({
      course_id: id,
      course_name: detail.target_name || id,
      valid_till_epoch: detail.end_time === -1 || detail.end_time === "-1" ? -1 : new Date(detail.end_time).getTime() / 1000,
      transaction_id: detail.transaction_id
    }));
  }
  const courseCount = coursesList.length;

  // Backwards compatibility for PRO
  let proHistory: any[] = [];
  if (proSub.all_purchases) {
    proHistory = proSub.all_purchases;
  } else if (proSub.history) {
    proHistory = proSub.history.map((h: any) => ({
      duration_in_days: h.added_duration_months === -1 ? -1 : h.added_duration_months * 30,
      purchase_date_epoch: new Date(h.start_time).getTime() / 1000,
      transaction_id: h.transaction_id,
      plan: h.plan
    }));
  }
  
  const currentExpiryEpoch = proSub.subscription_active_till_epoch 
    || (proSub.end_time === -1 ? -1 : (new Date(proSub.end_time).getTime() / 1000));

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
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <CreditCard size={14} />
                <span>Current Plan Overview</span>
              </h2>
              <Link
                href="/profile/transactions"
                className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-wider"
              >
                View Transactions
              </Link>
            </div>

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
                currentExpiryEpoch && (
                  <div className="space-y-1 text-left sm:text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex sm:justify-end items-center gap-1">
                      <Calendar size={12} /> Expiration
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-250">
                      {currentExpiryEpoch === -1
                        ? "Lifetime Access"
                        : new Date(currentExpiryEpoch * 1000).toLocaleDateString("en-US", {
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

            {/* PRO History List */}
            {isPro && proHistory && proHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">PRO Purchase History</h3>
                <div className="space-y-2">
                  {proHistory.map((hist: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-white/[0.02] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-300 capitalize">{hist.plan || "PRO"} Plan</p>
                        <p className="text-xs text-gray-500">Purchased: {new Date(hist.purchase_date_epoch * 1000).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-700 dark:text-gray-300">
                          {hist.duration_in_days === -1 ? "Lifetime" : `+${hist.duration_in_days} Days`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">{hist.transaction_id?.slice(0,8)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {coursesList.map((detail: any) => (
                  <div
                    key={detail.course_id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/[0.01]"
                  >
                    <div className="min-w-0 space-y-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-brand-500 block">Course</span>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">
                        {detail.course_name}
                      </h4>
                    </div>

                    <div className="mt-2 sm:mt-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left sm:text-right flex flex-col sm:items-end gap-2">
                      <div>
                        {detail.valid_till_epoch === -1 ? (
                          <span>Lifetime Access</span>
                        ) : (
                          <span>Access Expires: {detail.valid_till_epoch ? new Date(detail.valid_till_epoch * 1000).toLocaleDateString() : "Lifetime"}</span>
                        )}
                        {detail.transaction_id && detail.transaction_id !== "legacy" && (
                           <span className="block mt-0.5 opacity-50 font-mono">TX: {detail.transaction_id.slice(0,8)}</span>
                        )}
                      </div>
                      <Link 
                        href={`/courses/${detail.course_id}`}
                        className="inline-flex items-center gap-1.5 text-brand-500 hover:text-brand-600 transition-colors"
                      >
                        Go to Course <ArrowLeft size={10} className="rotate-180" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Support Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium">
                Have questions about your subscriptions or courses?
              </div>
              <WhatsAppSupportButton 
                title="Contact Support"
                message={`Hi CrackDSA Support, I have a question regarding my subscriptions.\n\nEmail: ${user?.email}`}
              />
            </div>
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
