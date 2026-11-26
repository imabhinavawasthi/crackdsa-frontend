/**
 * Centralized Pro Pricing Configuration for CrackDSA Pro
 * Easy to edit prices, discounts, and plan features in one place.
 */

export interface ProPricingTier {
  id: "monthly" | "yearly" | "lifetime";
  name: string;
  subtitle: string;
  price: number; // in INR
  originalPrice: number; // in INR
  billingPeriod: string;
  discountPercent: number;
  highlighted?: boolean;
  topBadge?: string;
  pillBadge: string;
  pillColor: string;
  buttonText: string;
  features: string[];
}

export const PRO_PRICING_CONFIG: Record<string, ProPricingTier> = {
  monthly: {
    id: "monthly",
    name: "Monthly Pro",
    subtitle: "Flexible monthly access",
    price: 799,
    originalPrice: 1599,
    billingPeriod: "per month",
    discountPercent: 50,
    pillBadge: "FLEXIBLE",
    pillColor: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
    buttonText: "Get Monthly Pro",
    features: [
      "Complete DSA Course (200+ lectures)",
      "Weekly Live DSA Classes",
      "Live Doubt Clearing Sessions",
      "CP Sheets & Contest Editorials",
      "CS Fundamentals Notes",
      "Access to Masterclasses",
      "Pro Community & Mentorship Chat",
      "Curated Job Opportunities & Resources",
    ],
  },
  yearly: {
    id: "yearly",
    name: "2-Year Pro Pass",
    subtitle: "Complete interview preparation",
    price: 5999,
    originalPrice: 16999,
    billingPeriod: "",
    discountPercent: 62,
    highlighted: true,
    topBadge: "MOST POPULAR",
    pillBadge: "BEST VALUE",
    pillColor: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
    buttonText: "Get 2-Year Pro Pass",
    features: [
      "Everything in Monthly Pro",
      "2 Years of Access (no renewals)",
      "All Future Updates & New Content",
      "All Live Classes, Recordings & Notes",
      "Contest Editorials & CP Sheets",
      "CS Fundamentals & System Design",
      "Pro Community & Mentor Interaction",
      "Curated Job Opportunities & Hiring Resources",
    ],
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime Member Pass",
    subtitle: "Pay once, learn forever",
    price: 9999,
    originalPrice: 20000,
    billingPeriod: "one-time payment",
    discountPercent: 50,
    pillBadge: "LONG-TERM",
    pillColor: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20",
    buttonText: "Get Lifetime Member Pass",
    features: [
      "Everything in 2-Year Pro",
      "Lifetime Access to All Current Content",
      "All Future Updates (Courses, Notes, Sheets)",
      "Lifetime Access to Live Class Recordings",
      "PRO Community — Lifetime Access",
      "Curated Job Opportunities & Resources",
      "No Renewals, No Hidden Fees",
      "Best Value for Long-Term Learners",
    ],
  },
};

export const PRO_PRICING_PLANS: ProPricingTier[] = Object.values(PRO_PRICING_CONFIG);

export const PRICING_TRUST_BADGES = [
  {
    title: "Great Value",
    subtitle: "Save up to 62% compared to monthly billing",
    type: "piggy",
  },
  {
    title: "Flexible Plans",
    subtitle: "Choose what fits your timeline. Cancel anytime.",
    type: "clock",
  },
  {
    title: "All-In-One Access",
    subtitle: "Courses, live classes, practice sheets, editorials & more.",
    type: "file",
  },
  {
    title: "Join a Thriving Community",
    subtitle: "Learn and grow with thousands of aspiring engineers.",
    type: "users",
  },
];

/**
 * Helper to get a pricing plan by ID with safe fallback to yearly
 */
export function getProPlanById(planId?: string | null): ProPricingTier {
  if (!planId) return PRO_PRICING_CONFIG.yearly;
  return PRO_PRICING_CONFIG[planId] || PRO_PRICING_CONFIG.yearly;
}
