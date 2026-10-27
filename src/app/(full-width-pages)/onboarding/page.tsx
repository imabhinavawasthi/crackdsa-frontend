"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/functions/auth";
import Logo from "@/components/common/Logo";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectTo = searchParams.get("redirect_to") || "/dashboard";
  const redirectTo = rawRedirectTo === "/onboarding" || rawRedirectTo === "/" ? "/dashboard" : rawRedirectTo;

  const { user, isLoggedIn, isLoading: isAuthLoading, refetch } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    let isMounted = true;

    const setupProfile = async () => {
      try {
        // Ensure onboarding is marked completed in user metadata
        await updateUserProfile({
          metadata: {
            onboarding_completed: true,
          },
        });

        if (user?.id && typeof window !== "undefined") {
          sessionStorage.setItem(`crackdsa_onboarding_skipped_${user.id}`, "true");
        }

        await refetch();

        if (isMounted) {
          setIsCompleted(true);
          setTimeout(() => {
            router.replace(redirectTo);
          }, 600);
        }
      } catch (err) {
        console.error("Auto profile setup error:", err);
        // Fallback: navigate to destination anyway
        if (isMounted) {
          router.replace(redirectTo);
        }
      }
    };

    setupProfile();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, isLoggedIn, user?.id, redirectTo, refetch, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-gray-50 dark:from-[#0a1020] dark:via-[#070b14] dark:to-[#070b14] text-gray-900 dark:text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-[#0d1527] border border-gray-200/80 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none text-center space-y-6">
          <div className="flex justify-center">
            <Logo href="/" />
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 pt-2">
            <div className="relative flex items-center justify-center">
              {isCompleted ? (
                <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center animate-in zoom-in-75 duration-300">
                  <CheckCircle2 className="size-8" />
                </div>
              ) : (
                <div className="size-16 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 flex items-center justify-center">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                {isCompleted ? "All set! Redirecting..." : "Setting up your profile..."}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                {isCompleted
                  ? "Taking you straight to your learning dashboard."
                  : "Preparing your personalized problem sets and course workspace."}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 pt-2">
            <Sparkles className="size-3 text-amber-500" />
            <span>You can update college and profile details anytime in Settings</span>
          </div>
        </div>
      </motion.div>
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
