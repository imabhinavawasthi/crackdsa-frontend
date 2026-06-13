"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { calculateActiveStreak } from "@/utils/streak";

/**
 * Hook that fetches user asset states and computes the active streak.
 * Returns the streak count (number of consecutive active days).
 */
export function useActiveStreak(): number {
  const { isLoggedIn } = useAuth();
  const [streak, setStreak] = useState(0);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (!isLoggedIn) {
      setStreak(0);
      return;
    }

    const compute = async () => {
      try {
        const token = getStoredToken();
        if (!token) return;

        const res = await fetch(`${backendUrl}/api/v1/user/assets/states`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const states: any[] = (await res.json()) || [];
        const interactionDates = states
          .map((s) => s.updated_at || s.last_interacted_at)
          .filter(Boolean);

        setStreak(calculateActiveStreak(interactionDates));
      } catch (err) {
        console.error("Failed to compute active streak:", err);
      }
    };

    compute();
  }, [isLoggedIn, backendUrl]);

  return streak;
}
