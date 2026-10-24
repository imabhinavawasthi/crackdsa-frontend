"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Building,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/functions/auth";
import Logo from "@/components/common/Logo";
import { CollegeSelect } from "@/components/common/CollegeSelect";
import { BRANCHES_LIST } from "@/config/profile-constants";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to") || "/dashboard";

  const { user, isLoggedIn, isLoading: isAuthLoading, refetch } = useAuth();

  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [branch, setBranch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepopulate if user already had partial details
  useEffect(() => {
    if (user) {
      if (user.college) setCollege(user.college);
      if (user.graduation_year) setGraduationYear(user.graduation_year);
      if (user.branch) setBranch(user.branch);
    }
  }, [user]);

  // If user is logged out after check completes
  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  const handleFinish = async (skip: boolean) => {
    setError(null);
    if (skip) {
      setIsSkipping(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      if (skip) {
        // Mark onboarding completed in user metadata without overwriting existing data
        await updateUserProfile({
          metadata: {
            onboarding_completed: true,
          },
        });
      } else {
        await updateUserProfile({
          college: college.trim() || undefined,
          graduation_year: graduationYear || undefined,
          branch: branch || undefined,
          metadata: {
            onboarding_completed: true,
          },
        });
      }

      // Mark session storage so no duplicate gate intercepts
      if (user?.id && typeof window !== "undefined") {
        sessionStorage.setItem(`crackdsa_onboarding_skipped_${user.id}`, "true");
      }

      // Force context refetch so navbar, user state, and permissions update immediately
      await refetch();

      // Navigate to destination (or dashboard)
      router.replace(redirectTo);
    } catch (err: any) {
      console.error("Onboarding submission failed:", err);
      setError(err.message || "Failed to save your details. You can try again or skip for now.");
      setIsSubmitting(false);
      setIsSkipping(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#070b14]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Setting up your profile...
          </p>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 9 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-gray-50 dark:from-[#0a1020] dark:via-[#070b14] dark:to-[#070b14] text-gray-900 dark:text-white flex flex-col justify-between p-4 sm:p-6 md:p-10">
      {/* Top Header */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between pt-2 pb-6">
        <Logo href="/" />

        <button
          type="button"
          disabled={isSubmitting || isSkipping}
          onClick={() => handleFinish(true)}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50"
        >
          {isSkipping ? "Skipping..." : "Skip for now"}
        </button>
      </div>

      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto my-auto"
      >
        <div className="bg-white dark:bg-[#0d1527] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-8">
          {/* Welcome Banner */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Welcome to CrackDSA! 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Set up your profile to get started with curated problem sets and live sessions.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFinish(false);
            }}
            className="space-y-6"
          >
            {/* College Field with Dropdown + Other support */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Building size={14} className="text-blue-500" />
                College / University
              </label>
              <CollegeSelect
                value={college}
                onChange={setCollege}
                placeholder="Select or search your college / university"
              />
            </div>

            {/* Passing Year & Branch (2-column on tablet+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-500" />
                  Passing / Graduation Year
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#121c33] border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="">Select Passing Year</option>
                  {yearOptions.map((yr) => (
                    <option key={yr} value={String(yr)}>
                      {yr}
                    </option>
                  ))}
                  <option value="Working Professional">Working Professional / Already Graduated</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Layers size={14} className="text-violet-500" />
                  Branch / Degree
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#121c33] border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="">Select Degree / Branch</option>
                  {BRANCHES_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || isSkipping}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving your profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup &amp; Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting || isSkipping}
                onClick={() => handleFinish(true)}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-bold text-sm transition-all cursor-pointer disabled:opacity-50 text-center"
              >
                {isSkipping ? "Skipping..." : "Skip for now"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Bottom Footer Info */}
      <div className="w-full max-w-2xl mx-auto pt-6 pb-2 text-center text-xs text-gray-400 dark:text-gray-500">
        You can always update these details anytime from your{" "}
        <span className="font-semibold text-gray-600 dark:text-gray-300">Profile Settings</span>.
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#070b14]">
          <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
