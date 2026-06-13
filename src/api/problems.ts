import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import { PracticeProblem, TopicSummary, CompanySummary } from "@/types/practice";

/** Shared helper — builds auth headers if a token exists. */
function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetches the details of a single practice problem by its slug or ID.
 */
export async function fetchProblemDetail(slug: string): Promise<PracticeProblem> {
  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/${slug}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Problem not found" : "Failed to load problem details");
  }
  return res.json();
}

/**
 * Fetches all practice problems catalog.
 */
export async function fetchProblems(): Promise<PracticeProblem[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch practice problems catalog.");
  return res.json();
}

/**
 * Fetches practice problems filtered by a company slug.
 */
export async function fetchCompanyProblems(slug: string): Promise<PracticeProblem[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/companies/${slug}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch problems for this company.");
  return res.json();
}

/**
 * Fetches practice problems filtered by a topic slug.
 */
export async function fetchTopicProblems(slug: string): Promise<PracticeProblem[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/topics/${slug}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch problems for this topic.");
  return res.json();
}

/**
 * Fetches the aggregated topics summary (name, slug, problem counts by difficulty).
 * Used by the Topics directory page.
 */
export async function fetchTopicsSummary(): Promise<TopicSummary[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/topics-summary`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch topics summary.");
  return res.json();
}

/**
 * Fetches the aggregated companies summary (name, slug, problem counts by difficulty).
 * Used by the Companies directory page.
 */
export async function fetchCompaniesSummary(): Promise<CompanySummary[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/companies-summary`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch companies summary.");
  return res.json();
}
