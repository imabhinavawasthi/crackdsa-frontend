import { BACKEND_URL } from "@/config/api";
import { getStoredToken } from "@/functions/auth";

export interface CacheKeyDetail {
  key: string;
  namespace: string;
  ttl_remaining_seconds: number;
  created_at: number;
}

export interface CacheStatsResponse {
  total_keys: number;
  hits: number;
  misses: number;
  hit_rate_pct: number;
  namespaces: Record<string, number>;
  keys: CacheKeyDetail[];
}

export interface InvalidateResponse {
  success: boolean;
  message: string;
  namespace: string;
  invalidated_count: number;
}

export async function fetchCacheStats(): Promise<CacheStatsResponse> {
  const token = getStoredToken();
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/cache/stats`, {
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch cache stats (HTTP ${res.status})`);
  }

  return res.json();
}

export async function invalidateCacheNamespace(namespace: string): Promise<InvalidateResponse> {
  const token = getStoredToken();
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/cache/invalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify({ namespace }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to invalidate cache (HTTP ${res.status})`);
  }

  return res.json();
}
