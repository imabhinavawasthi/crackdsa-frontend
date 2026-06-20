"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/functions/auth";
import { calculateActiveStreak } from "@/utils/streak";
import { BACKEND_URL } from "@/config/api";

/**
 * Hook that fetches user asset states and computes the active streak.
 * Returns the streak count (number of consecutive active days).
 */
export function useActiveStreak(): number {
  const { isLoggedIn } = useAuth();
  const [streak, setStreak] = useState(0);

  const backendUrl = BACKEND_URL;

  useEffect(() => {
    if (!isLoggedIn) {
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

        type AssetState = {
          updated_at?: string | null;
          last_interacted_at?: string | null;
          [key: string]: unknown;
        };

        const states: AssetState[] = (await res.json()) || [];
        const interactionDates = states
          .map((s) => s.updated_at ?? s.last_interacted_at)
          .filter((d): d is string => Boolean(d));

        setStreak(calculateActiveStreak(interactionDates));
      } catch (err) {
        console.error("Failed to compute active streak:", err);
      }
    };

    compute();
  }, [isLoggedIn, backendUrl]);

  return isLoggedIn ? streak : 0;
}
