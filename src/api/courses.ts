import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import { CourseSummary, CourseSection } from "@/types/course";

/** Shared helper — builds auth headers if a token exists. */
function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface BatchTopicDetailItem {
  title: string;
  found: boolean;
  section_id?: string;
  chapters_count: number;
  items_count: number;
  videos_count: number;
  problems_count: number;
  articles_count: number;
  is_upcoming: boolean;
}

export interface BatchTopicResponse {
  course_slug: string;
  matched_topics: Record<string, BatchTopicDetailItem>;
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

/**
 * Fetches full course curriculum section tree by slug or ID.
 */
export async function fetchCourseCurriculum(slug: string): Promise<CourseSection[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/courses/${slug}/curriculum`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Error fetching course curriculum:", err);
    return [];
  }
}

/**
 * Fetches dynamic details for multiple topics in a single batch call.
 */
export async function fetchBatchTopicDetails(
  courseIdOrSlug: string,
  topics: string[]
): Promise<BatchTopicResponse | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/courses/${courseIdOrSlug}/batch-topic-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ topics }),
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching batch topic details:", error);
    return null;
  }
}
