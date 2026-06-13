// ─── Types ───────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  provider?: string;
  email_verified?: boolean;
  phone?: string;
  roles?: string[];
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
  college?: string;
  graduation_year?: string;
  branch?: string;
  codeforces_handle?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  metadata?: Record<string, any>;
  pro_subscription?: {
    is_pro?: boolean;
    expires_at?: string;
  };
  purchased_courses?: Record<string, any>;
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
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("crackdsa_refresh_token");
  }
}

/**
 * Attempt to silently refresh the access token using the stored refresh token.
 */
export async function attemptTokenRefresh(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  const refreshToken = localStorage.getItem("crackdsa_refresh_token");
  if (!refreshToken) return false;

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
          localStorage.setItem("crackdsa_refresh_token", data.refresh_token);
        }
        return true;
      }
    }
  } catch (err) {
    console.warn("[attemptTokenRefresh] Failed to refresh token:", err);
  }
  
  return false;
}

// ─── Auth API functions ───────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user from the backend.
 * Returns null if the user is not logged in (401 / no session).
 * Throws an error for network errors or transient server errors to prevent false-positive logouts.
 */
export async function fetchCurrentUser(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("[fetchCurrentUser] network error:", err);
    throw err; // Rethrow network errors so the app knows it is a connection issue, not a logout
  }

  if (res.status === 401 || res.status === 403) {
     const refreshed = await attemptTokenRefresh();
     if (refreshed) {
       // Retry with the new token
       const newToken = getStoredToken();
       res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
         headers: {
           "Authorization": `Bearer ${newToken}`,
         },
       });
       
       if (res.status === 401 || res.status === 403) {
          clearStoredToken();
          return null;
       }
     } else {
       clearStoredToken(); // Invalidate local token if server rejects it & refresh fails
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
  const baseUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
  if (!baseUrl) return "";

  if (typeof window !== "undefined") {
    try {
      const url = new URL(baseUrl);
      const origin = window.location.origin;
      const finalRedirect = redirectTo || `${origin}/login/callback`;
      url.searchParams.set("redirect_to", finalRedirect);
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
  metadata?: Record<string, any>;
}): Promise<User> {
  const token = getStoredToken();
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to update profile" }));
    
    if (res.status === 401 || res.status === 403) {
       const refreshed = await attemptTokenRefresh();
       if (refreshed) {
         // Retry update profile
         const newToken = getStoredToken();
         const retryRes = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${newToken}`,
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
