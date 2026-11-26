import { Users, BookOpen, MessageSquare, Compass } from "lucide-react";

export const PRO_HERO = {
  badge: "CrackDSA Pro",
  headlineLine1: "Master DSA. Crack FAANG.",
  headlineLine2: "With Expert Guidance.",
  subtitle: "Unlock live classes, exclusive masterclasses, premium courses and tailored study plans. Stop guessing and start progressing.",
};

export const PRO_FEATURES = [
  {
    title: "Personalized Learning",
    description: "AI Powered Personalized Roadmap, Live Doubt Sessions and Mentorship. Get guidance from experts and mentors to stay on track and achieve your goals.",
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Tailored Coding Roadmaps",
    description: "Accelerate your learning with custom roadmaps designed for your level and target roles. Learn step-by-step without getting lost.",
    icon: Compass,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Expert Masterclasses",
    description: "Deep dive into complex topics like Dynamic Programming and Graph Theory with exclusive, high-quality video sessions.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Live Doubt Classes",
    description: "Stuck on a problem?  No more waiting days for community forum replies. Get your doubts resolved in real-time with our live doubt classes.",
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
    features: ["Access to AI personalized roadmap", "All Premium Courses", "Live Classes & Doubt Sessions", "Resources and Study Notes", "Access to Editorials & Solutions"],
    highlight: false
  },
  {
    id: "six-months",
    name: "6 Months",
    price: "₹4,999",
    period: "/6 months",
    description: "The most popular choice for dedicated learners.",
    features: ["Everything in Monthly", "1:1 Mentorship Sessions", "Priority doubt resolution", "Resume reviews"],
    highlight: true
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "₹14,999",
    period: " one-time",
    description: "Never worry about subscriptions again.",
    features: ["Everything in 6 Months", "Lifetime updates", "Dedicated 1:1 Mentorship for 1 Year", "Exclusive Masterclasses"],
    highlight: false
  }
];

export const PRO_FAQS = [
  {
    q: "Can I upgrade or downgrade later?",
    a: "Yes! If you start with a 3-month plan, you can easily upgrade to 6-months or lifetime from your dashboard at any time."
  },
  {
    q: "Is the content updated regularly?",
    a: "Absolutely. We update our advanced learning sheets and courses every single week based on recent interview experiences shared by our community."
  },
  {
    q: "What if I'm a complete beginner?",
    a: "PRO is designed for all levels. Our AI roadmap and live classes will sequence your learning from absolute basics up to hard-level FAANG problems."
  }
];