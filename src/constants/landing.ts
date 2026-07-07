import {
  Target,
  BarChart3,
  Brain,
  Layers,
  Zap,
  TrendingUp,
  Users,
  MessageCircle,
  Code2,
  Award,
  MonitorPlay,
  Send,
  BookOpen,
  Building2,
  FileText,
  Crown,
  Rocket,
  Headphones,
  Radio,
  GraduationCap,
  FolderOpen,
} from "lucide-react";
import { SOCIALS } from "@/constants/contact";

// ─── Hero ────────────────────────────────────────────────────────────────────

export const HERO_ROTATING_WORDS = ["patterns.", "clarity.", "confidence."];

export const HERO_VIDEO_ID = "G7fdasRHmq4";

export const HERO_STATS = [
  { bold: "20k+", label: "learners" },
  { bold: "50k+", label: "community" },
  { bold: "75+", label: "curated problems" },
];

// ─── Trust Bar ───────────────────────────────────────────────────────────────

export const TRUST_COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Linkedin",
  "Zeta",
  "Zomato",
];

// ─── Problem Section ─────────────────────────────────────────────────────────

export const PROBLEM_CARDS = [
  {
    icon: Target,
    title: "No Direction",
    desc: "Random problem lists with no structure, sequence, or learning outcome.",
    accent: "bg-red-500/10 text-red-400 border-red-500/10",
  },
  {
    icon: BarChart3,
    title: "No Adaptation",
    desc: "Same difficulty for everyone — beginners drown, advanced learners stall.",
    accent: "bg-amber-500/10 text-amber-400 border-amber-500/10",
  },
  {
    icon: Brain,
    title: "No Pattern Focus",
    desc: "Memorising solutions instead of understanding the underlying thinking.",
    accent: "bg-brand-500/10 text-brand-400 border-brand-500/10",
  },
];

// ─── Solution / Features ─────────────────────────────────────────────────────

export const SOLUTION_FEATURES = [
  {
    icon: Brain,
    title: "AI-Personalised Roadmaps",
    desc: "Tell us your level, target company, and timeline. We generate a step-by-step plan built around DSA patterns.",
    accent: "text-brand-400",
  },
  {
    icon: Layers,
    title: "Pattern-First Curriculum",
    desc: "Learn sliding window, two pointers, binary search — the actual patterns interviewers test, not random problems.",
    accent: "text-blue-light-400",
  },
  {
    icon: Zap,
    title: "Curated DSA Sheets",
    desc: "CrackDSA 75, Pattern Mastery — structured sheets with difficulty progression built in.",
    accent: "text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Progress Tracking",
    desc: "See exactly where you stand, what patterns you've mastered, and what needs more work. Stay accountable.",
    accent: "text-emerald-400",
  },
];

// ─── PRO Subscription ────────────────────────────────────────────────────────

export const PRO_BENEFITS = [
  { label: "All Courses Access", icon: BookOpen },
  { label: "Personalised Roadmap", icon: Rocket },
  { label: "1:1 Mentorship", icon: Headphones },
  { label: "Priority Support", icon: Crown },
  { label: "CrackDSA Pro Community", icon: Users },
  { label: "All Live Classes", icon: Radio },
  { label: "Doubt Solving Sessions", icon: MessageCircle },
  { label: "All Future Courses", icon: GraduationCap },
];

// ─── Practice Section ────────────────────────────────────────────────────────

export const PRACTICE_HIGHLIGHTS = [
  {
    title: "Topic-Wise Practice",
    desc: "Master each pattern individually — Arrays, Trees, Graphs, DP, and more with curated problem sets.",
    href: "/practice/topics",
    icon: FolderOpen,
    accent: "text-brand-400",
    border: "border-brand-500/20 hover:border-brand-500/40",
  },
  {
    title: "Company-Wise Practice",
    desc: "Solve the exact problems asked at Google, Amazon, Microsoft, Meta, and 50+ other top companies.",
    href: "/practice/companies",
    icon: Building2,
    accent: "text-amber-400",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  {
    title: "Curated DSA Sheets",
    desc: "Pattern Mastery, Abhinav's SDE Sheet, CrackDSA 75 — structured problem sets with difficulty progression.",
    href: "/dsa-sheet",
    icon: FileText,
    accent: "text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
];

// ─── Platform Stats ──────────────────────────────────────────────────────────

export const PLATFORM_STATS = [
  { value: "20k+", label: "Active Learners", icon: Users },
  { value: "50k+", label: "Community Members", icon: MessageCircle },
  { value: "75+", label: "Curated Problems", icon: Code2 },
  { value: "5+", label: "FAANG Mentors", icon: Award },
];

// ─── Testimonials ────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    quote:
      "CrackDSA's pattern approach changed everything. I stopped memorising and started understanding. Cleared Amazon SDE-1 in 2 months.",
    name: "Priya S.",
    role: "SDE-1, Amazon",
    color: "from-amber-500 to-orange-500",
  },
  {
    quote:
      "The structured roadmap saved me from the chaos of random problem solving. The progress tracking kept me accountable every single day.",
    name: "Rahul M.",
    role: "SDE-2, Microsoft",
    color: "from-brand-500 to-blue-light-500",
  },
  {
    quote:
      "Best investment I made for my career. The community is incredibly supportive and the curated sheets are gold for interview prep.",
    name: "Sneha K.",
    role: "SDE, Google",
    color: "from-emerald-500 to-teal-500",
  },
];

// ─── Community Links ─────────────────────────────────────────────────────────

export const COMMUNITY_LINKS = [
  {
    href: SOCIALS.youtube.crackdsa,
    icon: MonitorPlay,
    label: "YouTube",
    accent: "hover:border-red-500/30 hover:text-red-400",
  },
  {
    href: SOCIALS.telegram,
    icon: Send,
    label: "Telegram",
    accent: "hover:border-blue-light-500/30 hover:text-blue-light-400",
  },
  {
    href: SOCIALS.whatsapp.channel,
    icon: MessageCircle,
    label: "WhatsApp",
    accent: "hover:border-emerald-500/30 hover:text-emerald-400",
  },
  {
    href: SOCIALS.linkedin.crackdsa,
    icon: Users,
    label: "LinkedIn",
    accent: "hover:border-brand-500/30 hover:text-brand-400",
  },
];

// ─── Footer Links ────────────────────────────────────────────────────────────

export const FOOTER_SOCIAL_LINKS = [
  { href: SOCIALS.youtube.crackdsa, icon: MonitorPlay },
  { href: SOCIALS.telegram, icon: Send },
  { href: SOCIALS.linkedin.crackdsa, icon: Users },
];
