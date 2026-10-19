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

export async function fetchNewbieToExpertSheet(): Promise<CPSheetResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/v1/cp/newbie-to-expert`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CP sheet (HTTP ${res.status})`);
  }

  return res.json();
}
