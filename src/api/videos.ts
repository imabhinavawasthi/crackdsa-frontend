import { getAuthHeaders } from "@/api/auth";
import { BACKEND_URL } from "@/config/api";
import type { VideoLectureDetail } from "@/types/course";

export type { VideoLectureDetail } from "@/types/course";

/**
 * Fetches all video lectures.
 */
export async function fetchVideoLectures(): Promise<VideoLectureDetail[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/video-lectures`, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || []);
}

/**
 * Fetches the details of a single video lecture by its ID.
 * Automatically injects the user's bearer token if logged in.
 */
export async function fetchVideoDetails(
  videoId: string,
  options?: { itemId?: string; courseSlug?: string }
): Promise<VideoLectureDetail> {
  const headers = await getAuthHeaders();

  const queryParams = new URLSearchParams();
  if (options?.itemId) queryParams.set("item_id", options.itemId);
  if (options?.courseSlug) queryParams.set("course_slug", options.courseSlug);
  const qs = queryParams.toString();
  const url = `${BACKEND_URL}/api/v1/video-lectures/${videoId}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Video lecture not found");
    }
    throw new Error("Failed to load video details");
  }

  return res.json();
}
