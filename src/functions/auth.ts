// ─── Types ───────────────────────────────────────────────────────────────────

import type { 
  User 
} from "@/types/auth";
export type { 
  PurchasedCourse,
  ProPurchaseHistory,
  ProSubscription,
  EnrolledCourse,
  User 
} from "@/types/auth";
import { BACKEND_URL } from "@/config/api";

// ─── Token Utilities ─────────────────────────────────────────────────────────

const TOKEN_KEY = "crackdsa_access_token";
const REFRESH_TOKEN_KEY = "crackdsa_refresh_token";
const EXPIRES_AT_KEY = "crackdsa_expires_at";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  }
}

// In-flight singleton promise to prevent concurrent refresh token race conditions
let refreshPromise: Promise<string | null> | null = null;

/**
 * Proactively retrieves a valid access token.
 * If the current token is expired or within 5 minutes of expiring,
 * it silently refreshes the token using the refresh token before returning it.
 * Uses a single-flight mutex so concurrent callers share the exact same refresh request.
 */
export async function getValidAccessToken(forceRefresh = false): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(EXPIRES_AT_KEY);

  if (!token && !refreshToken) return null;

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : 0;

  // If no refresh token is stored, return token if still valid
  if (!refreshToken) {
    if (expiresAt > 0 && expiresAt <= now) {
      clearStoredToken();
      return null;
    }
    return token;
  }

  // If token is still comfortably valid (> 5 minutes remaining) and not forced, return it directly
  if (!forceRefresh && token && expiresAt > 0 && expiresAt - now > 300) {
    return token;
  }

  // If a refresh is already in flight, reuse it
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          setStoredToken(data.access_token);
          if (data.refresh_token) {
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
          }
          const expiresIn = data.expires_in || 3600;
          localStorage.setItem(
            EXPIRES_AT_KEY,
            (Math.floor(Date.now() / 1000) + expiresIn).toString()
          );
          return data.access_token;
        }
      } else if (res.status === 401 || res.status === 400) {
        // Refresh token genuinely invalid/expired on server
        console.warn("[getValidAccessToken] Refresh token rejected by server.");
        clearStoredToken();
        return null;
      }
    } catch (err) {
      console.warn("[getValidAccessToken] Network glitch during refresh:", err);
      // On network failure, do NOT wipe tokens; keep existing session if still valid
      if (expiresAt > now) {
        return token;
      }
    } finally {
      refreshPromise = null;
    }

    return token;
  })();

  return refreshPromise;
}

/**
 * Attempt to silently refresh the access token using the stored refresh token.
 */
export async function attemptTokenRefresh(): Promise<boolean> {
  const token = await getValidAccessToken(true);
  return token !== null;
}

/**
 * Returns Authorization header with a guaranteed fresh, non-expired token.
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getValidAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth API functions ───────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user from the backend.
 * Returns null if the user is not logged in (401 / no session).
 * Throws an error for network errors or transient server errors to prevent false-positive logouts.
 */
export async function fetchCurrentUser(): Promise<User | null> {
  // Proactively guarantee a fresh, non-expired token before calling /api/v1/auth/me
  const token = await getValidAccessToken();
  if (!token) return null;

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("[fetchCurrentUser] network error:", err);
    throw err; // Rethrow network errors so the app knows it is a connection issue, not a logout
  }

  // If token was rejected (e.g. edge-case clock skew), attempt one forced refresh
  if (res.status === 401 || res.status === 403) {
    const refreshedToken = await getValidAccessToken(true);
    if (refreshedToken) {
      res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${refreshedToken}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        clearStoredToken();
        return null;
      }
    } else {
      clearStoredToken();
      return null;
    }
  }

  if (!res.ok) {
    throw new Error(`Server returned status ${res.status}`);
  }

  const data = await res.json();
  return data as User;
}

/**
 * Log the current user out.
 */
export async function logout(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.warn("[logout] failed on server, clearing locally anyway:", err);
    }
  }

  clearStoredToken();
  window.location.href = "/login";
}

/**
 * Get the Google Auth URL from the backend.
 * Guarantees prompt=select_account instead of prompt=consent so users are never
 * bombarded with the consent screen on every single login.
 */
export function getGoogleAuthUrl(redirectTo?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
  if (!baseUrl) return "";

  if (typeof window !== "undefined") {
    try {
      const url = new URL(baseUrl);
      const origin = window.location.origin;
      const finalRedirect = redirectTo || `${origin}/login/callback`;
      url.searchParams.set("redirect_to", finalRedirect);
      
      // Ensure select_account is used instead of re-prompting consent every single login
      url.searchParams.set("prompt", "select_account");
      
      return url.toString();
    } catch (error) {
      console.error("Invalid NEXT_PUBLIC_GOOGLE_AUTH_URL", error);
      return baseUrl;
    }
  }

  return baseUrl;
}

/**
 * Update the user's profile details.
 */
export async function updateUserProfile(profileData: {
  full_name?: string;
  college?: string;
  graduation_year?: string;
  branch?: string;
  codeforces_handle?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  metadata?: Record<string, unknown>;
}): Promise<User> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to update profile" }));

    if (res.status === 401 || res.status === 403) {
      const refreshedToken = await getValidAccessToken(true);
      if (refreshedToken) {
        const retryRes = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshedToken}`,
          },
          body: JSON.stringify(profileData),
        });
        if (retryRes.ok) return retryRes.json() as Promise<User>;
      }
      clearStoredToken();
    }

    throw new Error(errorData.detail || "Failed to update profile");
  }

  return res.json() as Promise<User>;
}
