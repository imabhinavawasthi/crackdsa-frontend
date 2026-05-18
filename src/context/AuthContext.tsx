"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchCurrentUser, logout as logoutApi, type User } from "@/functions/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
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

  // Initial load — shows loading spinner
  const initialLoad = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await fetchCurrentUser();
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent poll — no loading state, only reacts if user was logged in but session died
  const silentPoll = useCallback(async () => {
    try {
      const u = await fetchCurrentUser();
      if (u) {
        // Still logged in — update user silently (in case profile changed)
        setUser(u);
        setSessionExpired(false);
      } else {
        // Server returned null — only flag session expired if user WAS logged in
        setUser((prev) => {
          if (prev !== null) {
            setSessionExpired(true);
          }
          return null;
        });
      }
    } catch {
      // Network error — don't flash UI, just silently skip
    }
  }, []);

  useEffect(() => {
    initialLoad();

    // Poll silently every 2 minutes
    const interval = setInterval(silentPoll, 120_000);
    return () => clearInterval(interval);
  }, [initialLoad, silentPoll]);

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
