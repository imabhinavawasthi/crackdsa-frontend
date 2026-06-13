import { Sparkles, BookOpen, Zap } from "lucide-react";

export const dsaSheetHeaderSlides = [
  {
    title: "Masterclass Sessions",
    description: "Deep dive into core DSA patterns with our expert-led masterclasses.",
    badge: "Live",
    color: "violet" as const,
    icon: Sparkles,
    href: "/masterclasses",
  },
  {
    title: "Complete Roadmaps",
    description: "Structured paths to guide you from beginner to advanced programmer.",
    badge: "Guided",
    color: "emerald" as const,
    icon: BookOpen,
    href: "/roadmap",
  },
  {
    title: "Premium Courses",
    description: "Comprehensive courses covering everything you need to crack top product companies.",
    badge: "Premium",
    color: "brand" as const,
    icon: Zap,
    href: "/courses",
  },
];
