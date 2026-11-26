import { BACKEND_URL } from "@/config/api";
import { getAuthHeaders } from "@/functions/auth";

export interface ExpertProblem {
  id: string;
  created_at: string;
  sheet_title: string;
  sheet_description: string;
  problem_link: string;
  code_link: string;
  video_link: string;
  difficulty: number;
  serial_number: number;
  problem_name: string;
}

export interface CPSheetResponse {
  sheet_id: string;
  title: string;
  description: string;
  total_problems: number;
  problems: ExpertProblem[];
}

let memoryCache: CPSheetResponse | null = null;
const CACHE_KEY = "crackdsa_cache_newbie_to_expert";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchNewbieToExpertSheet(forceRefresh: boolean = false): Promise<CPSheetResponse> {
  if (!forceRefresh) {
    if (memoryCache) {
      return memoryCache;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(CACHE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            memoryCache = parsed.data;
            return parsed.data;
          }
        }
      } catch (e) {
        // Ignore session storage errors
      }
    }
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/cp/newbie-to-expert`, {
    headers,
  });

  if (!res.ok) {
    if (memoryCache) return memoryCache;
    throw new Error(`Failed to fetch CP sheet (HTTP ${res.status})`);
  }

  const data: CPSheetResponse = await res.json();
  memoryCache = data;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {}
  }
  return data;
}

export function clearNewbieToExpertCache(): void {
  memoryCache = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {}
  }
}
