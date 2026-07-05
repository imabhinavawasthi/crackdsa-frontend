import {
  Compass,
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Mic,
  Video,
  Layers,
  Building2,
  Zap,
  BookOpen,
  FileText,
  Users
} from "lucide-react";

export const platformFeatures = [
  {
    title: "AI-Powered Roadmap",
    description: "Get a personalized learning path engineered by AI, tailored to your target companies and skill level.",
    icon: Compass,
    href: "/roadmap",
    gradient: "from-blue-500 to-indigo-600",
    glowColor: "blue",
    badge: "AI",
  },
  {
    title: "DSA Sheets",
    description: "Curated problem sets organized by patterns. Track progress and master every concept systematically.",
    icon: LayoutDashboard,
    href: "/dsa-sheet",
    gradient: "from-brand-500 to-brand-700",
    glowColor: "brand",
    badge: "Popular",
  },
  {
    title: "Courses & Masterclasses",
    description: "Expert-led video courses covering DSA, system design, and interview strategies from industry veterans.",
    icon: GraduationCap,
    href: "/courses",
    gradient: "from-purple-500 to-violet-600",
    glowColor: "purple",
    badge: "New",
  },
];

export const proFeatures = [
  {
    title: "1:1 Mentorship",
    description: "Personal guidance from engineers at top companies. Review your roadmap, resumes, and career path.",
    icon: Users,
    gradient: "from-amber-400 to-orange-500",
    href: "/pro/personalized",
  },
  {
    title: "Priority Support",
    description: "Get unstuck quickly with dedicated support for your queries. Help is available when you need it.",
    icon: MessageSquare,
    gradient: "from-rose-400 to-pink-600",
    href: "/support",
  },
  {
    title: "Live Classes",
    description: "Interactive sessions with expert instructors. Ask questions in real-time and learn alongside peers.",
    icon: Video,
    gradient: "from-emerald-400 to-teal-600",
    href: "/live-sessions",
  },
];

export interface EcosystemLink {
  name: string;
  href: string;
  icon: any;
  color: string;
  bg: string;
  pro?: boolean;
}

export const ecosystemLinks: EcosystemLink[] = [
  { name: "AI Roadmap", href: "/roadmap", icon: Compass, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "DSA Sheets", href: "/dsa-sheet", icon: LayoutDashboard, color: "text-brand-500", bg: "bg-brand-500/10" },
  { name: "Topic Practice", href: "/practice/topics", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Company Tags", href: "/practice/companies", icon: Building2, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Problem Arena", href: "/practice", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Masterclasses", href: "/masterclasses", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Resume Builder", href: "/resume", icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Community", href: "/community", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

export const featuredDSASheets = [
  {
    id: "crackdsa-revision-sprint",
    title: "CrackDSA Sprint 75",
    description: "The essential 75 problems every candidate must solve. Covers all key patterns.",
    problemCount: 75,
    difficulty: "Mixed" as const,
    image: "/images/sheets/crackdsa-75.png",
    color: "from-brand-500 to-indigo-600",
    tag: "Most Popular",
  },
  {
    id: "0-to-hero-dsa",
    title: "0 to Hero DSA",
    description: "Comprehensive DSA preparation from beginner to advanced concepts.",
    problemCount: 150,
    difficulty: "Mixed" as const,
    image: "/images/sheets/striver-sde.png",
    color: "from-orange-500 to-rose-600",
    tag: "Comprehensive",
  },
  {
    id: "blind-75",
    title: "Blind 75",
    description: "The classic curated set from Blind. Perfect for last-minute interview revision.",
    problemCount: 75,
    difficulty: "Medium" as const,
    image: "/images/sheets/blind-75.png",
    color: "from-emerald-500 to-teal-600",
    tag: "Classic",
  },
];
