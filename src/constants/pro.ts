import { Users, Building2, BookOpen, MessageSquare } from "lucide-react";

export const PRO_HERO = {
  badge: "CrackDSA Pro",
  headlineLine1: "Master DSA. Crack FAANG.",
  headlineLine2: "With Expert Guidance.",
  subtitle: "Unlock company-specific tags, priority 1-on-1 mentorship, and exclusive masterclasses. Stop guessing and start progressing.",
};

export const PRO_FEATURES = [
  {
    title: "1-on-1 FAANG Mentorship",
    description: "Get paired with engineers from top product companies. They review your code, guide your roadmap, and conduct mock interviews.",
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Company-Specific Tags",
    description: "Stop solving random problems. Unlock the exact problem sets asked by Google, Amazon, Microsoft, and Meta in the last 6 months.",
    icon: Building2,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Expert Masterclasses",
    description: "Deep dive into complex topics like Dynamic Programming and System Design with exclusive, high-quality video sessions.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Priority Doubt Resolution",
    description: "Stuck on a problem? Get immediate help from our Teaching Assistants. No more waiting days for community forum replies.",
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

export const PRO_PRICING = [
  {
    id: "monthly",
    name: "Monthly",
    price: "₹999",
    period: "/month",
    description: "Perfect for short-term interview prep.",
    features: ["Access to all company tags", "Community support", "Masterclass recordings"],
    highlight: false
  },
  {
    id: "six-months",
    name: "6 Months",
    price: "₹4,999",
    period: "/6 months",
    description: "The most popular choice for dedicated learners.",
    features: ["Everything in Monthly", "2 Mock Interviews per month", "Priority doubt resolution", "Resume reviews"],
    highlight: true
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "₹14,999",
    period: " one-time",
    description: "Never worry about subscriptions again.",
    features: ["Everything in 6 Months", "Lifetime updates", "Unlimited 1-on-1 mentorship", "Referral guarantees"],
    highlight: false
  }
];

export const PRO_FAQS = [
  {
    q: "How does the 1-on-1 mentorship work?",
    a: "You'll be matched with a mentor based on your target companies. You can schedule weekly syncs to review your progress, get resume feedback, or conduct mock interviews."
  },
  {
    q: "Can I upgrade or downgrade later?",
    a: "Yes! If you start with a 3-month plan, you can easily upgrade to 6-months or lifetime from your dashboard at any time."
  },
  {
    q: "Is the content updated regularly?",
    a: "Absolutely. We update our company tags and problem sheets every single week based on recent interview experiences shared by our community."
  },
  {
    q: "What if I'm a complete beginner?",
    a: "PRO is designed for all levels. Our AI roadmap will sequence your learning from absolute basics up to hard-level FAANG problems."
  }
];
