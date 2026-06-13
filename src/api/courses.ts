import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import { CourseSummary } from "@/types/course";

/** Shared helper — builds auth headers if a token exists. */
function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetches all courses.
 */
export async function fetchCourses(): Promise<CourseSummary[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/courses`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch courses catalog.");
  return res.json();
}

/**
 * Fetches course details by slug or ID.
 */
export async function fetchCourseDetail(slug: string): Promise<CourseSummary> {
  const res = await fetch(`${BACKEND_URL}/api/v1/courses/${slug}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch course details.");
  return res.json();
}
