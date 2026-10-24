"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function OnboardingRerouteGate({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isLoggedIn || !user) return;

    // Check if user requires initial onboarding details
    if (user.needs_onboarding) {
      const excludedPrefixes = [
        "/onboarding",
        "/login",
        "/logout",
        "/terms",
        "/privacy",
      ];

      const isExcluded = excludedPrefixes.some((prefix) => pathname.startsWith(prefix));
      if (!isExcluded) {
        const isLocallySkipped =
          typeof window !== "undefined" &&
          sessionStorage.getItem(`crackdsa_onboarding_skipped_${user.id}`);

        if (!isLocallySkipped) {
          const returnUrl = pathname && pathname !== "/" ? pathname : "";
          const target = returnUrl
            ? `/onboarding?redirect_to=${encodeURIComponent(returnUrl)}`
            : "/onboarding";
          router.replace(target);
        }
      }
    }
  }, [user, isLoggedIn, isLoading, pathname, router]);

  return <>{children}</>;
}
