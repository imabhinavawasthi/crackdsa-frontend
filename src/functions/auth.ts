// ─── Types ───────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// ─── Mock flag (flip to false when real backend is ready) ────────────────────

const USE_MOCK = true;

// ─── Mock data ────────────────────────────────────────────────────────────────
// Set MOCK_LOGGED_IN to `true` to simulate a logged-in user,
// or `false` to simulate a logged-out / guest session.

const MOCK_LOGGED_IN = true;

const MOCK_USER: User = {
  id: "usr_001",
  name: "Abhinav Awasthi",
  email: "abhinav@crackdsa.com",
  avatarUrl: "/images/user/owner1.jpg",
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

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      credentials: "include",
    });
    if (res.status === 401 || res.status === 403) return null;
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
    const data = await res.json();
    return data.user as User;
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
    return;
  }
  await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
