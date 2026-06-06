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

  // Initial load - shows loading spinner
  const initialLoad = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await fetchCurrentUser();
      setUser(u);
    } catch (e) {
      console.error("[initialLoad] authentication error:", e);
      // General network error - do not force a logout if token exists
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent poll - no loading state, only reacts if user was logged in but session died
  const silentPoll = useCallback(async () => {
    try {
      const u = await fetchCurrentUser();
      if (u) {
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

    // Poll silently every 15 minutes
    const interval = setInterval(silentPoll, 900_000);
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
