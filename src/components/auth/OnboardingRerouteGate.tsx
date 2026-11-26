"use client";

import React from "react";

/**
 * OnboardingRerouteGate
 * Onboarding is now skipped by default. Profile setup happens seamlessly in the background.
 */
export function OnboardingRerouteGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
