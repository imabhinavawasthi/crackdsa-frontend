import { getAuthHeaders, getValidAccessToken } from "@/api/auth";
import { BACKEND_URL } from "@/config/api";

export interface UserBookmarkItem {
  asset_id: string;
  asset_type: "problem" | "video" | "article" | string;
  title: string;
  subtitle: string;
  href: string;
  badge?: string | null;
  badge_color?: string | null;
  difficulty?: string | null;
  status?: string;
  bookmarked_at?: string | null;
  updated_at?: string | null;
  notes_count: number;
  metadata?: Record<string, any>;
}

export interface UserNoteItem {
  id: string;
  text: string;
  created_at: string;
  asset_id: string;
  asset_type: "problem" | "video" | "article" | string;
  title: string;
  subtitle: string;
  href: string;
  badge?: string | null;
  badge_color?: string | null;
  status?: string;
}

export interface ProblemDifficultyStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface UserProgressSummary {
  problems_solved: ProblemDifficultyStats;
  total_problems: ProblemDifficultyStats;
  articles_read: number;
  lectures_completed: number;
  bookmarked_count: number;
  streak: number;
  recent_bookmarks: UserBookmarkItem[];
  recent_notes: UserNoteItem[];
  heatmap_activity: Record<string, number>;
}

export interface UserAssetState {
  id: string;
  user_id: string;
  asset_id: string;
  asset_type: "problem" | "video" | "article";
  status: "pending" | "done" | "revision";
  is_bookmarked: boolean;
  notes?: any[];
  updated_at?: string;
  last_interacted_at?: string;
}

export interface UpdateAssetStatePayload {
  status?: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  notes?: any[];
}

export interface UserActivitySummary {
  current_streak: number;
  max_streak: number;
  current_month: string;
  month_active_dates: string[];
  month_active_count: number;
  total_active_days: number;
  completed_lessons_count?: number;
  cp_solved_count?: number;
}

// In-flight promise & short TTL cache for deduplicating concurrent / rapid calls to /states
let inFlightStatesPromise: Promise<UserAssetState[]> | null = null;
let assetStatesCache: { data: UserAssetState[]; timestamp: number } | null = null;
let inFlightActivityPromise: Promise<UserActivitySummary | null> | null = null;
let activityCache: { data: UserActivitySummary; timestamp: number } | null = null;
const CACHE_TTL_MS = 15000; // 15 seconds

export function clearUserAssetStatesCache() {
  assetStatesCache = null;
  inFlightStatesPromise = null;
  activityCache = null;
  inFlightActivityPromise = null;
}

/**
 * Fetches lightweight activity summary (streaks & current month active days) computed on backend.
 */
export async function fetchUserActivitySummary(forceRefresh = false): Promise<UserActivitySummary | null> {
  const authHeaders = await getAuthHeaders();
  if (!("Authorization" in authHeaders)) return null;

  const now = Date.now();
  if (!forceRefresh && activityCache && now - activityCache.timestamp < CACHE_TTL_MS) {
    return activityCache.data;
  }

  if (!forceRefresh && inFlightActivityPromise) {
    return inFlightActivityPromise;
  }

  inFlightActivityPromise = (async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/activity/summary`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch user activity summary");
      }

      const data = await res.json();
      activityCache = { data, timestamp: Date.now() };
      return data;
    } catch {
      return null;
    } finally {
      inFlightActivityPromise = null;
    }
  })();

  return inFlightActivityPromise;
}

/**
 * Fetches all asset states for the currently authenticated user.
 * Automatically deduplicates concurrent calls and caches results for 15s to prevent redundant network bursts.
 */
export async function fetchUserAssetStates(forceRefresh = false): Promise<UserAssetState[]> {
  const authHeaders = await getAuthHeaders();
  if (!("Authorization" in authHeaders)) return [];

  const now = Date.now();
  if (!forceRefresh && assetStatesCache && now - assetStatesCache.timestamp < CACHE_TTL_MS) {
    return assetStatesCache.data;
  }

  if (!forceRefresh && inFlightStatesPromise) {
    return inFlightStatesPromise;
  }

  inFlightStatesPromise = (async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/assets/states`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user asset states");
      }

      const data = await res.json();
      assetStatesCache = { data, timestamp: Date.now() };
      return data;
    } finally {
      inFlightStatesPromise = null;
    }
  })();

  return inFlightStatesPromise;
}

/**
 * Updates the asset state for a specific asset (problem, video, article).
 */
export async function updateUserAssetState(
  assetType: "problem" | "video" | "article",
  assetId: string,
  payload: UpdateAssetStatePayload
): Promise<UserAssetState> {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/user/assets/states/${assetType}/${assetId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Failed to update asset state for ${assetType} ${assetId}`);
  }

  // Clear cache so subsequent reads reflect the update
  clearUserAssetStatesCache();

  return res.json();
}

/**
 * Fetches subscription details for the currently authenticated user.
 */
export async function fetchSubscriptionDetails(): Promise<any> {
  const authHeaders = await getAuthHeaders();
  if (!("Authorization" in authHeaders)) return null;

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/subscription-details`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subscription details");
  }

  return res.json();
}

/**
 * Fetches all bookmarked items for the currently authenticated user with all metadata resolved.
 * Zero client-side cross-table lookups needed!
 */
export async function fetchUserBookmarks(): Promise<UserBookmarkItem[]> {
  const authHeaders = await getAuthHeaders();
  if (!("Authorization" in authHeaders)) return [];

  const res = await fetch(`${BACKEND_URL}/api/v1/user/bookmarks`, {
    headers: authHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 401) return [];
    throw new Error("Failed to fetch user bookmarks");
  }
  return res.json();
}

/**
 * Fetches all notes written by the currently authenticated user with parent resource metadata resolved.
 * Zero client-side cross-table lookups needed!
 */
export async function fetchUserNotes(): Promise<UserNoteItem[]> {
  const authHeaders = await getAuthHeaders();
  if (!("Authorization" in authHeaders)) return [];

  const res = await fetch(`${BACKEND_URL}/api/v1/user/notes`, {
    headers: authHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 401) return [];
    throw new Error("Failed to fetch user notes");
  }
  return res.json();
}

/**
 * Fetches unified progress summary (problem difficulty stats, completed counts, streaks, heatmap,
 * recent bookmarks, recent notes) in a single optimized backend call.
 */
export async function fetchUserProgressSummary(): Promise<UserProgressSummary | null> {
  const authHeaders = await getAuthHeaders();
  if (!("Authorization" in authHeaders)) return null;

  const res = await fetch(`${BACKEND_URL}/api/v1/user/progress/summary`, {
    headers: authHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error("Failed to fetch user progress summary");
  }
  return res.json();
}
