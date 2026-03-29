// ─── Types ───────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  provider?: string;
  email_verified?: boolean;
};

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// ─── Token Utilities ─────────────────────────────────────────────────────────

const TOKEN_KEY = "crackdsa_access_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Mock flag (flip to false when real backend is ready) ────────────────────

const USE_MOCK = false;

// ─── Mock data ────────────────────────────────────────────────────────────────
// Set MOCK_LOGGED_IN to `true` to simulate a logged-in user,
// or `false` to simulate a logged-out / guest session.

const MOCK_LOGGED_IN = true;

const MOCK_USER: User = {
  id: "usr_001",
  full_name: "Abhinav Awasthi",
  email: "abhinav@crackdsa.com",
  avatar_url: "/images/user/owner1.jpg",
};

// ─── Auth API functions ───────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user from the backend.
 * Returns null if the user is not logged in (401 / no session).
 */
export async function fetchCurrentUser(): Promise<User | null> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_LOGGED_IN ? MOCK_USER : null;
  }

  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (res.status === 401 || res.status === 403) {
       clearStoredToken(); // Invalidate local token if server rejects it
       return null;
    }
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
    const data = await res.json();
    return data as User;
  } catch (err) {
    console.error("[fetchCurrentUser] error:", err);
    return null;
  }
}

/**
 * Log the current user out.
 */
export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 200));
    clearStoredToken();
    return;
  }
  
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${BACKEND_URL}/api/v1/oauth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
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
 */
export function getGoogleAuthUrl(redirectTo?: string): string {
  // Use the specific Google Auth URL from environment variables
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL ?? "";
}
