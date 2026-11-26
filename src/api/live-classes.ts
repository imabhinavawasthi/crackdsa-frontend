import { BACKEND_URL } from "@/config/api";
import { getAuthHeaders } from "@/functions/auth";
import { LiveClass, LiveClassPaginatedResponse } from "@/types/live-class";

export interface LiveClassFilterParams {
  status?: string;
  topic?: string;
  search?: string;
  visibility?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches single featured live class for dashboard:
 * 1. Ongoing live class if any, OR
 * 2. Most recent upcoming scheduled class if any (closest in future), OR
 * 3. Single most recent completed class.
 * Redacts sensitive links for non-pro users if class is not free.
 */
export async function fetchFeaturedLiveClass(): Promise<LiveClass | null> {
  const res = await fetch(`${BACKEND_URL}/api/v1/live-classes/featured`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Unable to fetch featured live class.");
  }
  return res.json();
}

/**
 * Fetches paginated real live classes from the FastAPI backend / Supabase
 */
export async function fetchLiveClasses(
  params?: LiveClassFilterParams
): Promise<LiveClassPaginatedResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") query.set("status", params.status);
  if (params?.topic && params.topic !== "all") query.set("topic", params.topic);
  if (params?.search && params.search.trim()) query.set("search", params.search.trim());
  if (params?.visibility && params.visibility !== "all") query.set("visibility", params.visibility);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`${BACKEND_URL}/api/v1/live-classes${qs}`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Unable to fetch live classes.");
  }
  return res.json();
}

/**
 * Fetches a single live class by UUID or slug
 */
export async function fetchLiveClassDetail(idOrSlug: string): Promise<LiveClass> {
  const res = await fetch(`${BACKEND_URL}/api/v1/live-classes/${idOrSlug}`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Unable to fetch live class details.");
  }
  return res.json();
}
