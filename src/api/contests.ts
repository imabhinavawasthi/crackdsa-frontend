import { BACKEND_URL } from "@/config/api";
import { getAuthHeaders } from "@/functions/auth";
import { 
  ContestSummary, 
  ContestDetail, 
  ContestSuggestionPayload, 
  ContestProblem,
  ContestPaginatedResponse 
} from "@/types/contest";

export interface SiblingProblem {
  id: string;
  slug_url: string;
  problem_name: string;
  problem_index?: string;
  difficulty_label?: string;
  has_editorial?: boolean;
}

export interface ContestProblemEditorialResponse {
  contest: {
    id: string;
    platform: string;
    contest: string;
    date: string;
    contest_url?: string | null;
  };
  problem: ContestProblem;
  prev_problem?: {
    slug_url: string;
    problem_name: string;
    problem_index?: string;
  } | null;
  next_problem?: {
    slug_url: string;
    problem_name: string;
    problem_index?: string;
  } | null;
  siblings: SiblingProblem[];
}

export interface FetchPaginatedContestsParams {
  platform?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches paginated contest summaries with complete metadata, total counts, and platform distributions.
 */
export async function fetchPaginatedContests(
  params?: FetchPaginatedContestsParams
): Promise<ContestPaginatedResponse> {
  const query = new URLSearchParams();
  if (params?.platform && params.platform.toLowerCase() !== "all") {
    query.set("platform", params.platform.toLowerCase());
  }
  if (params?.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }
  if (params?.sortBy) {
    query.set("sort_by", params.sortBy);
  }
  if (params?.page && params.page > 0) {
    query.set("page", params.page.toString());
  }
  if (params?.limit && params.limit > 0) {
    query.set("limit", params.limit.toString());
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`${BACKEND_URL}/api/v1/contests/paginated${queryString}`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch paginated contest editorials.");
  }

  return res.json();
}

/**
 * Fetches contest summaries with optional platform, search, limit, and pagination filtering.
 */
export async function fetchContests(
  platform?: string, 
  search?: string,
  limit?: number,
  page?: number
): Promise<ContestSummary[]> {
  const params = new URLSearchParams();
  if (platform && platform.toLowerCase() !== "all") {
    params.set("platform", platform.toLowerCase());
  }
  if (search && search.trim()) {
    params.set("search", search.trim());
  }
  if (limit && limit > 0) {
    params.set("limit", limit.toString());
  }
  if (page && page > 0) {
    params.set("page", page.toString());
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${BACKEND_URL}/api/v1/contests${queryString}`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contest editorials.");
  }

  return res.json();
}

/**
 * Fetches detailed problems and editorials for a specific contest.
 */
export async function fetchContestDetail(platform: string, contestSlug: string): Promise<ContestDetail> {
  const p = encodeURIComponent(platform.toLowerCase());
  const c = encodeURIComponent(contestSlug);

  const res = await fetch(`${BACKEND_URL}/api/v1/contests/${p}/${c}`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(res.status === 404 ? "Contest not found" : "Failed to load contest details.");
  }

  return res.json();
}

/**
 * Fetches a single contest problem editorial with siblings.
 */
export async function fetchContestProblemEditorial(
  platform: string,
  contestSlug: string,
  problemSlug: string
): Promise<ContestProblemEditorialResponse> {
  const p = encodeURIComponent(platform.toLowerCase());
  const c = encodeURIComponent(contestSlug);
  const prob = encodeURIComponent(problemSlug);

  const res = await fetch(`${BACKEND_URL}/api/v1/contests/${p}/${c}/problems/${prob}`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(res.status === 404 ? "Contest problem editorial not found" : "Failed to load editorial.");
  }

  return res.json();
}

/**
 * Submits a contest suggestion from a user.
 */
export async function submitContestSuggestion(data: ContestSuggestionPayload): Promise<{ status: string; message: string }> {
  const res = await fetch(`${BACKEND_URL}/api/v1/contests/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit contest suggestion.");
  }

  return res.json();
}
