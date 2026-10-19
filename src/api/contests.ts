import { BACKEND_URL } from "@/config/api";
import { getAuthHeaders } from "@/functions/auth";
import { ContestSummary, ContestDetail, ContestSuggestionPayload, ContestProblem } from "@/types/contest";

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

/**
 * Fetches all contest summaries with optional platform and search filtering.
 */
export async function fetchContests(platform?: string, search?: string): Promise<ContestSummary[]> {
  const params = new URLSearchParams();
  if (platform && platform.toLowerCase() !== "all") {
    params.set("platform", platform.toLowerCase());
  }
  if (search && search.trim()) {
    params.set("search", search.trim());
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
