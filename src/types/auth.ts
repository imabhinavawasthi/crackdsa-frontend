export interface PurchasedCourse {
  start_time: string;
  end_time: string | number; // -1 for lifetime
  transaction_id: string;
}

export interface ProPurchaseHistory {
  plan: string;
  start_time: string;
  added_duration_months: number; // -1 for lifetime
  transaction_id: string;
}

export interface ProSubscription {
  is_active: boolean;
  plan: string;
  start_time: string;
  end_time: string | number; // -1 for lifetime
  transaction_id: string;
  history: ProPurchaseHistory[];
}

export interface EnrolledCourse {
  course_id: string;
  course_name: string;
}

export type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  provider?: string;
  email_verified?: boolean;
  phone?: string;
  roles?: string[];
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
  college?: string;
  graduation_year?: string;
  branch?: string;
  codeforces_handle?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  metadata?: Record<string, any>;
  is_pro_active?: boolean;
  enrolled_courses?: EnrolledCourse[];
  // Legacy fields (will be undefined from /me)
  pro_subscription?: any;
  purchased_courses?: any;
};
