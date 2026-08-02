export interface CourseSectionItem {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  asset_id: string;
  slug?: string;
  is_free: boolean;
  duration_label: string;
}

export interface CourseSubsection {
  id: string;
  title: string;
  description?: string;
  items: CourseSectionItem[];
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  items?: CourseSectionItem[];
  subsections?: CourseSubsection[];
}

export interface VideoLectureDetail {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  duration_label?: string;
}

export interface VideoSource {
  type: "youtube" | "vimeo" | "cloudflare" | "gdrive" | "html5" | "mock";
  idOrUrl: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  is_pro: boolean;
  is_popular?: boolean;
  category?: string;
  instructor_ids: string[];
  total_problems: number;
  total_videos?: number;
  total_articles?: number;
  tags?: string[];
  sections?: CourseSection[];
  curriculum?: CourseSection[];
  metadata?: {
    thumbnail_url?: string;
    difficulty?: string;
    duration_weeks?: number;
    duration_hours?: number;
    rating?: number;
    number_of_students?: number;
    total_projects?: number;
    [key: string]: any;
  };
  is_active?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Instructor {
  id: string;
  name: string;
  company?: string;
  bio?: string;
  avatar_url?: string;
  profile_image_url?: string;
  color?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}
