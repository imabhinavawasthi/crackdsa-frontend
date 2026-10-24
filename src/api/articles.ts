import { BACKEND_URL } from "@/config/api";
import { getAuthHeaders } from "@/api/auth";

/**
 * Fetches all platform articles/blogs.
 */
export async function fetchArticles(): Promise<any[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/articles`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || []);
}
