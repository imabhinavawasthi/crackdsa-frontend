import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import { PracticeProblem } from "@/types/practice";

/**
 * Fetches the details of a single practice problem by its slug or ID.
 * Automatically injects the user's bearer token if logged in.
 */
export async function fetchProblemDetail(slug: string): Promise<PracticeProblem> {
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/${slug}`, { headers });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Problem not found");
    }
    throw new Error("Failed to load problem details");
  }

  return res.json();
}

/**
 * Fetches all practice problems catalog.
 * Automatically injects the user's bearer token if logged in.
 */
export async function fetchProblems(): Promise<PracticeProblem[]> {
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems`, { headers });
  if (!res.ok) {
    throw new Error("Unable to fetch practice problems catalog.");
  }

  return res.json();
}

/**
 * Fetches practice problems filtered by a company slug.
 */
export async function fetchCompanyProblems(slug: string): Promise<PracticeProblem[]> {
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/companies/${slug}`, { headers });
  if (!res.ok) {
    throw new Error("Unable to fetch problems for this company.");
  }

  return res.json();
}

/**
 * Fetches practice problems filtered by a topic slug.
 */
export async function fetchTopicProblems(slug: string): Promise<PracticeProblem[]> {
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/practice-problems/topics/${slug}`, { headers });
  if (!res.ok) {
    throw new Error("Unable to fetch problems for this topic.");
  }

  return res.json();
}


