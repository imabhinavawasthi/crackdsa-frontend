export type Instructor = {
  name: string;
  role: string;
  sub_title?: string;
  bio?: string;
  company: string;
  color: string;
  profile_image_url?: string;
  metadata?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
    [key: string]: any;
  };
};

export type CourseMetadata = {
  difficulty: string;
  duration_weeks: number;
  duration_hours: number;
  total_projects: number;
  marketing_syllabus: string[];
  thumbnail_url?: string;
  prerequisites: string[];
  learning_outcomes: string[];
  rating?: number;
  reviews?: number;
  number_of_students?: number;
  feedbacks?: {
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
    rating: number;
  }[];
  [key: string]: any;
};

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  instructor_ids: string[];
  tags: string[];
  is_pro: boolean;
  is_popular: boolean;
  status: string;
  price: number;
  original_price: number;
  total_problems: number;
  total_articles: number;
  total_videos: number;
  metadata: CourseMetadata;
};

export type CourseSectionItem = {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  asset_id: string;
  is_free: boolean;
  duration_label?: string;
};

export type CourseSubsection = {
  id: string;
  title: string;
  description?: string;
  items: CourseSectionItem[];
};

export type CourseSection = {
  id: string;
  title: string;
  description?: string;
  items?: CourseSectionItem[];
  subsections?: CourseSubsection[];
};
