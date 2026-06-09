export interface PracticeProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url?: string | null;
  description?: string | null;
  solutions?: Record<string, any>;
  resources?: {
    video_lectures?: string[];
    related_articles?: Array<{ id: string; title: string; slug: string }>;
  };
  attributes?: {
    tags?: string[];
    topicTags?: string[];
    company_tags?: string[];
    hints?: string[];
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}


export interface TagSummary {
  name: string;
  slug: string;
  count: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
}

export type CompanySummary = TagSummary;
export type TopicSummary = TagSummary;

export interface SolutionItem {
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

export interface ProblemSolutions {
  cpp: SolutionItem;
  python: SolutionItem;
  java: SolutionItem;
  javascript: SolutionItem;
}

export interface ProblemDetail {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problemUrl: string;
  description: string;
  solutions: ProblemSolutions;
  companyTags?: string[];
  topicTags?: string[];
  hints?: string[];
}

export interface ProblemStateUpdates {
  status?: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  notes?: any[];
}

export interface ProblemViewerProps {
  slug: string;
  problemData?: any;
  onStateChange?: (updates: ProblemStateUpdates) => void;
}

