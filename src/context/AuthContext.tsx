"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  fetchCurrentUser,
  getValidAccessToken,
  logout as logoutApi,
  type User,
} from "@/functions/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<User | null>;
  sessionExpired: boolean;
  dismissSessionExpired: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Initial load - shows loading spinner
  const initialLoad = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const u = await fetchCurrentUser();
      setUser(u);
      return u;
    } catch (e) {
      console.error("[initialLoad] authentication error:", e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Proactive token check - silently refreshes expiring tokens before any API call fails
  const checkTokenFreshness = useCallback(async () => {
    try {
      const token = await getValidAccessToken();
      if (!token) {
        setUser((prev) => {
          if (prev !== null) {
            setSessionExpired(true);
          }
          return null;
        });
      }
    } catch (err) {
      console.warn("[checkTokenFreshness] error checking token:", err);
    }
  }, []);

  // Silent poll - syncs user profile state every 10 minutes
  const silentPoll = useCallback(async () => {
    try {
      const u = await fetchCurrentUser();
      if (u) {
        setUser(u);
      } else {
        // Server returned null - only flag session expired if user WAS logged in
        setUser((prev) => {
          if (prev !== null) {
            setSessionExpired(true);
          }
          return null;
        });
      }
    } catch (err) {
      // Network error / 500 server error - don't log out, keep active session, silently skip
      console.warn("[silentPoll] skipped due to connection or server issue:", err);
    }
  }, []);

  useEffect(() => {
    initialLoad();

    // Check and silently rotate expiring token every 60 seconds
    const tokenInterval = setInterval(checkTokenFreshness, 60_000);

    // Profile sync every 10 minutes
    const pollInterval = setInterval(silentPoll, 600_000);

    // Proactively refresh when tab becomes visible or window gains focus (e.g. computer woke up from sleep)
    const handleVisibility = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkTokenFreshness();
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(pollInterval);
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [initialLoad, checkTokenFreshness, silentPoll]);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    setSessionExpired(false);
  }, []);

  const dismissSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: user !== null,
        logout,
        refetch: initialLoad,
        sessionExpired,
        dismissSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
