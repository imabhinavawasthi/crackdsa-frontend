export interface LiveClass {
  id: string;
  class_name: string;
  class_topic?: string | null;
  instructor_name?: string | null;
  class_time_epoch?: number | null;
  class_duration?: number | null;
  class_link?: string | null;
  class_recording?: string | null;
  class_notes?: string | null;
  class_subtopics?: string[] | null;
  class_url_slug?: string | null;
  status: "live" | "upcoming" | "completed";
  visibility?: "public" | "private" | string;
  thumbnail_url?: string | null;
  class_image?: string | null;
  created_at?: string | null;
}

export interface LiveClassCounts {
  all: number;
  live: number;
  upcoming: number;
  completed: number;
}

export interface LiveClassPaginatedResponse {
  items: LiveClass[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  counts: LiveClassCounts;
  available_topics?: string[];
  upcoming_classes?: LiveClass[];
}
