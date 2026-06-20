import { LucideIcon } from "lucide-react";

export type RoadmapItemStatus = "completed" | "current" | "locked";
export type RoadmapItemType = "video" | "article" | "problem";

export interface RoadmapItem {
  id: string;
  title: string;
  type: RoadmapItemType;
  difficulty?: "Easy" | "Medium" | "Hard";
  status: RoadmapItemStatus;
  timeEstimate: string;
  url?: string;
}

export type TopicStatus = "completed" | "in-progress" | "locked";

export interface Topic {
  id: string;
  title: string;
  description: string;
  status: TopicStatus;
  items: RoadmapItem[];
  icon: string | LucideIcon;
  iconColor: string;
  iconBg: string;
}

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  topics: Topic[];
  color: string;
}

export interface RoadmapStructure {
  phases: Phase[];
}

export interface RoadmapUserInput {
  primary_goal: string;
  target_role: string;
  target_company_tier: string;
  urgency_level: string;
  duration_weeks: number;
  experience_level: string;
  problems_solved_count: number;
  strong_topics: string[];
  weak_topics: string[];
  time_per_week_hours: number;
  learning_style: string;
  programming_language: string;
  preferred_language?: string;
}

export interface RoadmapDBRecord {
  id: string;
  user_id: string;
  title: string;
  user_input: RoadmapUserInput;
  structure: RoadmapStructure;
  is_active: boolean;
  is_deleted: boolean;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}
