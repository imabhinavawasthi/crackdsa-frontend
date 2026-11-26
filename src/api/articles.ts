import { BACKEND_URL } from "@/config/api";
import { getAuthHeaders } from "@/api/auth";

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  cover_image?: string | null;
  category: string;
  difficulty?: string | null;
  read_time_minutes: number;
  author_name?: string | null;
  author_avatar?: string | null;
  resources?: Record<string, any>;
  attributes?: Record<string, any>;
  is_published: boolean;
  is_active: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all published articles for public discovery.
 */
export async function fetchArticles(): Promise<ArticleItem[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/v1/articles`, {
      headers: authHeaders,
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : (data.items || []);
  } catch (err) {
    console.error("Error fetching articles:", err);
    return [];
  }
}

/**
 * Fetches single article by slug or UUID.
 */
export async function fetchArticleDetail(slugOrId: string): Promise<ArticleItem | null> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/v1/articles/${slugOrId}`, {
      headers: authHeaders,
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`Error fetching article ${slugOrId}:`, err);
    return null;
  }
}

/**
 * Fetches all articles (including drafts) for administrative management.
 */
export async function fetchAdminArticles(): Promise<ArticleItem[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/articles`, {
      headers: authHeaders,
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching admin articles:", err);
    return [];
  }
}

/**
 * Creates a new article (Admin only).
 */
export async function createArticle(data: Partial<ArticleItem>): Promise<ArticleItem> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/articles`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create article");
  }

  return await res.json();
}

/**
 * Updates an article (Admin only).
 */
export async function updateArticle(id: string, data: Partial<ArticleItem>): Promise<ArticleItem> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/articles/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update article");
  }

  return await res.json();
}

/**
 * Deletes an article (Admin only).
 */
export async function deleteArticle(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/articles/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete article");
  }
}
