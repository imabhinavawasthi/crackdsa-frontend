"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Lock, Sparkles, Gem, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// List of routes that require Pro subscription
export const PRO_ROUTES = [
  "/pro/dashboard",
  "/pro/personalized",
  "/live-sessions",
  "/roadmap/onboarding"
];

function ProLockedScreen() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const benefits = [
    "Personalized DSA Preparation Roadmap",
    "Weekly Elite 1-on-1 Mentor Sync-ups",
    "Advanced Live System Design Masterclasses",
    "Priority TA Doubt Support (under 15 mins)"
  ];

  return (
    <div className="w-full flex items-center justify-center py-12 px-4 select-none font-sans">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/15 dark:border-amber-500/25 bg-linear-to-b from-white to-gray-50/50 dark:from-gray-900/60 dark:to-gray-950/40 backdrop-blur-md shadow-xl p-8 sm:p-10 text-center overflow-hidden">
        {/* Soft Background Radial Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Lock / Premium Icon */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mx-auto mb-6 shadow-md shadow-amber-500/20 border border-amber-400/20">
          <Lock className="h-6 w-6" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          Exclusive Premium Content
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium max-w-sm mx-auto">
          Subscribe to <span className="text-amber-500 font-extrabold">CrackDSA Pro</span> to unlock access to this page and all elite features.
        </p>

        {/* Minimalist LeetCode-style benefits list */}
        <div className="max-w-sm mx-auto bg-gray-50/70 dark:bg-gray-950/40 rounded-2xl p-5 border border-gray-100 dark:border-white/5 text-left mb-8 space-y-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400">
                <CheckCircle2 size={12} className="stroke-[3]" />
              </span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          {isLoggedIn ? (
            <Link
              href="/pro"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Gem size={14} className="fill-white animate-pulse" />
              Subscribe to Pro
            </Link>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Sparkles size={14} />
              Sign In to Unlock
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Check if current path matches a Pro route
  const isProRoute = PRO_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // Show loading spinner if page is protected and auth status is resolving
  if (isProRoute && isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[40vh] select-none">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
            Verifying access...
          </span>
        </div>
      </div>
    );
  }

  // If path is pro-only and user is not active pro, block access
  const isPro = user?.is_pro_active === true;
  if (isProRoute && !isPro) {
    return <ProLockedScreen />;
  }

  return <>{children}</>;
}
