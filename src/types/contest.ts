export type ContestPlatform =
  | "all"
  | "codeforces"
  | "codechef"
  | "leetcode"
  | "atcoder"
  | "google kick start"
  | "icpc"
  | "other";

export interface ContestSummary {
  id: string;
  platform: string;
  contest: string;
  date: string;
  created_at: string;
  total_problems: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  has_video: boolean;
  badge?: "HOT" | "NEW" | string | null;
}

export interface ContestProblem {
  id: string;
  platform: string;
  created_at: string;
  problem_name: string;
  problem_description?: string | null;
  problem_link?: string | null;
  video_editorial?: string | null;
  editorial?: string | null;
  difficulty?: number | null;
  company_tags?: any;
  topic_tags?: string[];
  slug_url: string;
  contest?: string | null;
  solution_link?: string | null;
  problem_index?: string;
  difficulty_label?: "Easy" | "Medium" | "Hard" | string;
  has_editorial?: boolean;
}

export interface ContestDetail {
  id: string;
  platform: string;
  contest: string;
  date: string;
  total_problems: number;
  contest_url?: string | null;
  problems: ContestProblem[];
}

export interface ContestSuggestionPayload {
  platform: string;
  contest_name: string;
  contest_url?: string;
  notes?: string;
}

export interface ContestPlatformCount {
  id: string;
  label: string;
  count: number;
}

export interface ContestPaginatedResponse {
  items: ContestSummary[];
  total_count: number;
  total_pages: number;
  page: number;
  limit: number;
  total_contests: number;
  total_problems: number;
  platforms: ContestPlatformCount[];
}
