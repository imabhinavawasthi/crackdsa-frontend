"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserActivitySummary } from "@/api/user";

/**
 * Hook that fetches lightweight user activity summary and returns the current streak.
 */
export function useActiveStreak(): number {
  const { isLoggedIn } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setStreak(0);
      return;
    }

    let isMounted = true;
    fetchUserActivitySummary().then((summary) => {
      if (isMounted && summary) {
        setStreak(summary.current_streak || 0);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  return isLoggedIn ? streak : 0;
}
