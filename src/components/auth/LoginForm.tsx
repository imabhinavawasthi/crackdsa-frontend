"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { getGoogleAuthUrl } from "@/functions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirect_to");

  useEffect(() => {
    // ─── Post-Login Redirection Guard ───────────────────────────────────────
    if (isLoggedIn) {
      router.replace("/");
      return;
    }

    if (redirectToParam && typeof window !== "undefined") {
      localStorage.setItem("crackdsa_login_redirect", redirectToParam);
    }
  }, [redirectToParam, isLoggedIn, router]);

  // ─── Prevent Flicker: Only show login if fully verified as logged out ───
  if (isLoading || isLoggedIn) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verifying session...</p>
        </motion.div>
      </div>
    );
  }

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth entry point
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-col flex-1 w-full p-6 sm:p-12"
    >
      <div className="w-full max-w-md mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="text-center sm:text-left mb-6">
          <h1 className="mb-2 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Welcome to CrackDSA
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Sign in to start your personalized DSA journey.
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-4 rounded-2xl bg-white px-8 py-4 text-base font-bold text-gray-700 shadow-xl shadow-gray-200/50 transition-all hover:bg-gray-50 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10 border border-gray-100 dark:border-white/10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.5033 12.2332C22.5033 11.3698 22.4318 10.7398 22.2771 10.0865H12.2178V13.9831H18.1225C17.9654 14.9515 17.3226 16.4098 15.894 17.3898L15.874 17.5202L19.0546 19.9351L19.275 19.9566C21.2987 18.1249 22.5033 15.4299 22.5033 12.2332Z"
                fill="#4285F4"
              />
              <path
                d="M12.2167 22.5C15.1095 22.5 17.5381 21.5667 19.3119 19.9566L15.931 17.3898C15.0263 18.0081 13.812 18.44 12.2167 18.44C9.38338 18.44 6.97862 16.6083 6.1214 14.0766L5.99575 14.087L2.68849 16.5954L2.64526 16.7132C4.40714 20.1432 8.02621 22.5 12.2167 22.5Z"
                fill="#34A853"
              />
              <path
                d="M6.12224 14.0766C5.89606 13.4233 5.76516 12.7233 5.76516 11.9999C5.76516 11.2766 5.89606 10.5766 6.11033 9.92324L6.10435 9.78409L2.75564 7.23547L2.64627 7.28659C1.92011 8.70992 1.50346 10.3082 1.50346 11.9999C1.50346 13.6916 1.92011 15.2899 2.64627 16.7132L6.12224 14.0766Z"
                fill="#FBBC05"
              />
              <path
                d="M12.2168 5.55998C14.2287 5.55998 15.5861 6.41164 16.3598 7.1233L19.3833 4.22998C17.5262 2.53831 15.1095 1.5 12.2168 1.5C8.02622 1.5 4.40715 3.85665 2.64526 7.28665L6.10921 9.92331C6.96644 7.39164 9.38338 5.55998 12.2168 5.55998Z"
                fill="#EB4335"
              />
            </svg>
            Continue with Google
          </motion.button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-brand-500 hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Trusted by Learners</span>
          <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
        </div>
      </div>
    </motion.div>
  );
}
