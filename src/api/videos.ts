import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import type { VideoLectureDetail } from "@/types/course";

export type { VideoLectureDetail } from "@/types/course";

/**
 * Fetches the details of a single video lecture by its ID.
 * Automatically injects the user's bearer token if logged in.
 */
export async function fetchVideoDetails(videoId: string): Promise<VideoLectureDetail> {
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/video-lectures/${videoId}`, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Video lecture not found");
    }
    throw new Error("Failed to load video details");
  }

  return res.json();
}
