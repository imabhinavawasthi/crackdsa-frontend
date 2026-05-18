export interface Problem {
  problem_id: string;
  // We can add title, difficulty, etc. if the backend provides it, but based on the schema requested, only problem_id was provided.
  title?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface Step {
  id: string;
  title: string;
  pattern_id: string;
  problems: Problem[];
}

export interface Topic {
  id: string;
  title: string;
  steps: Step[];
}

export interface DSASheet {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  level?: string;
  estimated_hours?: number;
  is_public?: boolean;
  version?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  sheet_json: {
    topics: Topic[];
  };
}
