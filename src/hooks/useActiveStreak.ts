"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { calculateActiveStreak } from "@/utils/streak";
import { fetchUserAssetStates } from "@/api/user";

/**
 * Hook that fetches user asset states and computes the active streak.
 * Returns the streak count (number of consecutive active days).
 */
export function useActiveStreak(): number {
  const { isLoggedIn } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const compute = async () => {
      try {
        const states = await fetchUserAssetStates();
        const interactionDates = (states || [])
          .map((s) => s.updated_at ?? s.last_interacted_at)
          .filter((d): d is string => Boolean(d));

        setStreak(calculateActiveStreak(interactionDates));
      } catch (err) {
        console.error("Failed to compute active streak:", err);
      }
    };

    compute();
  }, [isLoggedIn]);

  return isLoggedIn ? streak : 0;
}
