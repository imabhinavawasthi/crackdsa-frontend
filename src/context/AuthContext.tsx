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

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await fetchCurrentUser();
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    // ─── Polling (Every 2 Minutes) ───────────────────────────────────────────
    const interval = setInterval(() => {
      loadUser();
    }, 120000); // 120,000ms = 2 minutes

    return () => clearInterval(interval);
  }, [loadUser]);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: user !== null,
        logout,
        refetch: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
