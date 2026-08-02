import { BACKEND_URL } from "@/config/api";

export interface ProblemOfTheDay {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url: string | null;
}

/**
 * Fetches the Problem of the Day from the backend.
 * Public endpoint — no auth required.
 */
export async function fetchProblemOfTheDay(): Promise<ProblemOfTheDay | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/potd`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
