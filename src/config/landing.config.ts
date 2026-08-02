import {
  Brain,
  Layers,
  Zap,
  TrendingUp,
  Target,
  Users,
  Code2,
  Award,
  BookOpen,
  Building2,
  FileText,
  Sparkles,
  Rocket,
  Headphones,
  Radio,
  MessageCircle,
  FolderOpen,
  CheckCircle2,
  Cpu,
  Compass,
  GraduationCap,
  ShieldCheck,
  Activity,
  Terminal
} from "lucide-react";
import { SOCIALS } from "@/constants/contact";

export const LANDING_CONFIG = {
  hero: {
    badge: "PATTERNS • ROADMAPS • SHEETS",
    titleLine1: "Stop solving random problems.",
    titlePrefix: "Learn with",
    rotatingWords: ["clarity.", "guidance.", "personalisation.", "structure.", "patterns."],
    subtitle:
      "A structured, interview-focused, pattern-based learning roadmap, designed for self-paced learning with live classes from industry experts.",
    socialProof:
      "Built on how engineers at Google, Microsoft, and Meta actually prepare for interviews.",
    primaryCta: { text: "Start Learning", href: "/dashboard" },
    secondaryCta: { text: "Explore Pro", href: "/pro" },
    videoYoutubeId: "G7fdasRHmq4",
    testimonials: [
      { quote: "Went from struggling with arrays to cracking Amazon SDE-1 in 8 weeks.", name: "Rahul S.", role: "SDE-1 at Amazon" },
      { quote: "The pattern-based approach changed everything, I finally stopped grinding blindly.", name: "Priya K.", role: "SDE at Microsoft" },
      { quote: "Best DSA resource I've found. Structured sheets + roadmap saved me months.", name: "Arjun M.", role: "SDE at Google" },
      { quote: "Live doubt sessions with mentors from FAANG made all the difference.", name: "Sneha R.", role: "SDE at Flipkart" },
      { quote: "Cleared 5 out of 6 interviews after following the 75-problem sheet.", name: "Vikram T.", role: "SDE-2 at Uber" },
    ],
  },

  trust: {
    title: "Engineers using CrackDSA work at top tech companies",
    companies: ["Google", "Amazon", "Microsoft", "Meta", "LinkedIn", "Uber", "Zomato", "Swiggy"],
  },

  uspAI: {
    badge: "PERSONALIZED PREPARATION",
    title: "Why top candidates don't grind LeetCode blindly",
    subtitle:
      "Random problem solving leads to burnout. CrackDSA analyzes your interview date, target company, and current skill level to build a realistic daily plan.",
    features: [
      {
        icon: Brain,
        title: "AI-Generated Timeline",
        desc: "Tell us your target company and interview date. We map out exactly what to solve each day.",
        gradient: "from-blue-600 to-indigo-600",
        tag: "Personalized",
      },
      {
        icon: Layers,
        title: "15 Core Patterns",
        desc: "Master Sliding Window, Two Pointers, and DP patterns instead of memorizing 500 individual codes.",
        gradient: "from-indigo-600 to-purple-600",
        tag: "High Yield",
      },
      {
        icon: Activity,
        title: "Weak-Spot Diagnostics",
        desc: "Track pattern accuracy in real-time so you know exactly where you lose speed during interviews.",
        gradient: "from-emerald-600 to-teal-600",
        tag: "Analytics",
      },
      {
        icon: ShieldCheck,
        title: "Company Question Sets",
        desc: "Solve problems categorized by actual frequency in recent interview rounds at top tech companies.",
        gradient: "from-amber-600 to-orange-600",
        tag: "Real Data",
      },
    ],
  },

  masterCourse: {
    badge: "FLAGSHIP PROGRAM",
    title: "The Complete DSA Master Course",
    subtitle:
      "Everything you need from zero to interview readiness. No fluff, no endless filler videos.",
    highlights: [
      {
        icon: GraduationCap,
        title: "0 to 100 Structured Syllabus",
        desc: "Arrays, Linked Lists, Trees, Graphs, DP, and System Design basics explained step-by-step.",
      },
      {
        icon: Headphones,
        title: "Live Doubt Solving & Code Reviews",
        desc: "Get your code debugged by senior product engineers whenever you get stuck.",
      },
      {
        icon: FileText,
        title: "Handbooks & Pattern Cheat Sheets",
        desc: "Downloadable complexity charts, pattern templates, and quick revision notes.",
      },
      {
        icon: Radio,
        title: "Live Masterclasses & Cohorts",
        desc: "Interactive live problem-solving sessions focusing on hard algorithmic patterns.",
      },
    ],
    ctaText: "View DSA Master Course",
    ctaHref: "/courses",
  },

  dsaSheets: {
    badge: "CURATED PRACTICE",
    title: "High-Impact Problem Sheets",
    subtitle:
      "Curated lists built to maximize retention and eliminate redundant practice.",
    sheets: [
      {
        id: "crackdsa-75",
        title: "CrackDSA 75",
        desc: "The 75 essential pattern-based problems every candidate must solve before coding interviews.",
        level: "Must Solve",
        count: "75 Problems",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      },
      {
        id: "pattern-mastery",
        title: "Pattern Mastery Sheet",
        desc: "120 problems structured by pattern to build intuitive problem-solving speed.",
        level: "Pattern Focus",
        count: "120 Problems",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      },
      {
        id: "sde-ultimate",
        title: "SDE Ultimate Sheet",
        desc: "Comprehensive 0-to-hero problem set for SDE-1 and SDE-2 interview prep.",
        level: "Complete Prep",
        count: "250 Problems",
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      },
    ],
    ctaText: "Explore All DSA Sheets",
    ctaHref: "/dsa-sheet",
  },

  ecosystem: {
    badge: "PRACTICE GROUND",
    title: "Everything you need to practice & revise",
    subtitle:
      "Targeted tools to test your problem-solving speed and reinforce key concepts.",
    items: [
      {
        icon: FolderOpen,
        title: "Topic-Wise Practice",
        desc: "Master Arrays, Dynamic Programming, Graphs, and Trees step-by-step.",
        href: "/practice/topics",
        accent: "from-blue-600 to-indigo-600",
      },
      {
        icon: Building2,
        title: "Company-Wise Questions",
        desc: "Filter questions asked in recent Google, Amazon, and Microsoft interview rounds.",
        href: "/practice/companies",
        accent: "from-amber-600 to-orange-600",
      },
      {
        icon: BookOpen,
        title: "Live Masterclasses",
        desc: "Deep-dive live sessions on hard patterns, recursion, and DP optimization.",
        href: "/masterclasses",
        accent: "from-emerald-600 to-teal-600",
      },
      {
        icon: Terminal,
        title: "Notes & Cheat Sheets",
        desc: "Time & space complexity charts, pattern templates, and quick interview guides.",
        href: "/resources",
        accent: "from-purple-600 to-pink-600",
      },
    ],
  },

  statsBar: [
    { value: "20,000+", label: "Active Learners", icon: Users },
    { value: "50,000+", label: "Community Members", icon: MessageCircle },
    { value: "75+", label: "Curated Sheets & Topics", icon: Code2 },
    { value: "15", label: "Core DSA Patterns", icon: Award },
  ],

  testimonials: {
    badge: "STUDENT OUTCOMES",
    title: "Real results from real engineers",
    items: [
      {
        quote:
          "CrackDSA's pattern approach saved me from endless random problem grinding. I understood the patterns and cleared my Amazon SDE-1 interview in 2 months.",
        name: "Priya S.",
        role: "SDE-1 at Amazon",
        avatarColor: "from-amber-500 to-orange-500",
      },
      {
        quote:
          "The CrackDSA 75 sheet + Live Doubt Support made a huge difference. I stopped memorizing codes and started solving unseen hard problems smoothly.",
        name: "Rahul M.",
        role: "Software Engineer at Microsoft",
        avatarColor: "from-brand-500 to-blue-500",
      },
      {
        quote:
          "Instead of getting overwhelmed by 500+ problems, learning pattern by pattern gave me total confidence during my Google tech screens.",
        name: "Sneha K.",
        role: "SDE at Google",
        avatarColor: "from-emerald-500 to-teal-500",
      },
    ],
  },

  community: {
    badge: "COMMUNITY",
    title: "Join 50,000+ engineers preparing together",
    subtitle: "Get daily practice problems, live doubt discussions, and placement updates.",
    links: [
      { label: "YouTube", href: SOCIALS.youtube.crackdsa, icon: "youtube", accent: "hover:border-red-500/40 hover:text-red-400" },
      { label: "Telegram", href: SOCIALS.telegram, icon: "telegram", accent: "hover:border-blue-400/40 hover:text-blue-400" },
      { label: "WhatsApp Channel", href: SOCIALS.whatsapp.channel, icon: "whatsapp", accent: "hover:border-emerald-500/40 hover:text-emerald-400" },
      { label: "LinkedIn", href: SOCIALS.linkedin.crackdsa, icon: "linkedin", accent: "hover:border-indigo-500/40 hover:text-indigo-400" },
    ],
  },

  finalCta: {
    badge: "GET STARTED",
    title: "Ready to prepare with structure?",
    subtitle: "Build your personalized roadmap today and start practicing with curated sheets.",
    primaryCta: { text: "Get My AI Roadmap", href: "/roadmap/onboarding" },
    secondaryCta: { text: "Explore Free DSA Sheets", href: "/dsa-sheet" },
  },
};
