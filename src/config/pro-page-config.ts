import {
  GraduationCap,
  Radio,
  FileText,
  Trophy,
  Cpu,
  UserCheck,
  Video,
  HelpCircle,
  Code2,
  Layers,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Network,
  Server,
  BookOpen,
  Briefcase,
  Target,
  Terminal,
  Rocket,
  BarChart3,
  Crown,
  ShoppingCart,
} from "lucide-react";
import { PRO_PRICING_CONFIG, PRO_PRICING_PLANS } from "./pro-pricing";

export { PRO_PRICING_CONFIG, PRO_PRICING_PLANS };

// ─────────────────────────────────────────────────────────────────────────────
// 01. HERO SECTION CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const HERO_CONFIG = {
  badge: "CrackDSA Pro",
  note: "Your complete interview preparation partner 🚀",
  headlinePrefix: "Master DSA.",
  headlineMiddle: "Learn Fundamentals.",
  headlineHighlight: "Crack Interviews.",
  rotatingPhrases: [
    "Crack Interviews.",
    "Dream Tech Offers.",
    "Tier-1 Placements.",
    "FAANG & Startups."
  ],
  subtitle:
    "One subscription for structured learning, DSA course, CS Fundamentals, curated practice, live mentorship, and interview preparation: all in one place.",
  primaryCta: {
    text: "Get CrackDSA Pro",
    href: "#pricing",
  },
  secondaryCta: {
    text: "View DSA Curriculum",
    href: "/course/dsa",
  },
  video: {
    url: "https://youtu.be/eUESza1d9Ac?si=BjFtsvrkbRSbfEg9",
    youtubeId: "eUESza1d9Ac",
    embedUrl: "https://www.youtube.com/embed/eUESza1d9Ac",
    title: "CrackDSA Pro Program Walkthrough",
    caption: "Watch how CrackDSA Pro accelerates your tech interview preparation",
  },
  socialProof: {
    studentCount: "1,200+",
    text: "students already enrolled to pro",
    pricingNote: `starts from ₹${PRO_PRICING_CONFIG.monthly.price} per month & less than ₹10 per day`,
  },
  previewCards: {
    liveClass: {
      status: "LIVE",
      label: "Next Live Class",
      title: "Graph Algorithms - Part 1",
      subtitle: "BFS, DFS and their applications",
      date: "Today, 7:00 PM",
      duration: "1h 30m",
      mentor: "Abhinav Awasthi",
      mentorRole: "Founder @ CrackDSA • SDE 2 @ Zeta",
      mentorImage: "/pictures/abhinav.jpeg",
      ctaText: "Join Class",
    },
    inProgressCourse: {
      status: "IN PROGRESS",
      progressText: "10 / 206 lessons",
      title: "Data Structures & Algorithms [Beginner to Advanced]",
      progressPercent: 5,
      ctaText: "Continue Learning",
      stats: [
        { label: "206 Videos", icon: "video" },
        { label: "22 Sections", icon: "layers" },
        { label: "Lifetime Access", icon: "shield" },
      ],
    },
    contestEditorials: {
      title: "Recent Contest Editorials",
      items: [
        {
          id: "cf-950",
          name: "Codeforces Round 950 (Div. 2)",
          platform: "Codeforces",
          date: "12 Oct 2026",
          problemsCount: "5 problems",
          iconColor: "text-amber-500 bg-amber-500/10",
        },
        {
          id: "atc-387",
          name: "AtCoder Beginner Contest 387",
          platform: "AtCoder",
          date: "8 Oct 2026",
          problemsCount: "4 problems",
          iconColor: "text-blue-500 bg-blue-500/10",
        },
        {
          id: "lc-420",
          name: "LeetCode Weekly Contest 420",
          platform: "LeetCode",
          date: "5 Oct 2026",
          problemsCount: "4 problems",
          iconColor: "text-orange-500 bg-orange-500/10",
        },
      ],
    },
    cpSheet: {
      title: "Newbie to Expert CP Sheet",
      badge: "175 problems",
      description: "Curated Codeforces problems with video editorials and solutions.",
      solved: 3,
      total: 175,
      percent: 2,
    },
  },
  featureStrip: [
    {
      id: "courses",
      title: "Structured DSA Courses",
      subtitle: "Beginner to Advanced",
      icon: GraduationCap,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "live",
      title: "Live Classes",
      subtitle: "Weekly doubt sessions",
      icon: Radio,
      color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
    },
    {
      id: "editorials",
      title: "Contest Editorials",
      subtitle: "Detailed solutions and discussions",
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "cs",
      title: "CS Fundamentals",
      subtitle: "OS, DBMS, CN, OOPs and more",
      icon: Cpu,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    }
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 02. EVERYTHING INCLUDED IN PRO CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const EVERYTHING_INCLUDED_CONFIG = {
  sectionTag: "One Subscription • Full Access",
  title: "Everything Included in CrackDSA Pro",
  subtitle:
    "A complete, structured ecosystem designed to take you from foundational problem-solving to cracking technical interviews at top tech companies.",
  features: [
    {
      id: "dsa-course",
      title: "Flagship DSA Master Course",
      highlight: "Structured Curriculum from Foundations to Advanced",
      description:
        "Comprehensive zero-to-advanced curriculum covering complexity analysis, Arrays, Binary Search, Trees, Graphs, Dynamic Programming & Advanced Algorithms with detailed explanations and clean code implementations.",
      icon: BookOpen,
      badge: "Flagship Course",
      badgeColor: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20",
      metrics: "200+ Lectures • Explained from Basics",
      link: "/course/dsa",
      buttonText: "Open Course Curriculum",
      isPrimaryHero: true,
      topicsPreview: [
        "Foundations, Bitwise & Math",
        "Arrays, Sliding Window & Two Pointers",
        "Trees, BST & Binary Lifting",
        "Graphs, Shortest Paths & Topo Sort",
        "Dynamic Programming Patterns",
        "Tries, Disjoint Set Union & Segment Trees",
      ],
    },
    {
      id: "live-classes",
      title: "Live Problem-Solving Classes",
      highlight: "Interactive Sessions with Abhinav Awasthi",
      description:
        "Deconstruct challenging interview problems live. Focus on building intuition from scratch, identifying key problem patterns, discussing time-space trade-offs, and writing bug-free code.",
      icon: Radio,
      badge: "Weekly Live Sessions",
      badgeColor: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20",
      metrics: "Interactive Live Cohorts",
      link: "/live-sessions",
      buttonText: "View Live Schedule",
      tags: ["Intuition Building", "Hard Problem Teardown", "Full Session Recordings"],
    },
    {
      id: "live-doubts",
      title: "Dedicated Live Doubt Clearing",
      highlight: "Regular Doubt Sessions & Community Support",
      description:
        "Never stay blocked while practicing. Attend scheduled live doubt-clearing sessions to get your doubts addressed, review difficult test cases, and understand optimal solutions.",
      icon: HelpCircle,
      badge: "Live Mentorship",
      badgeColor: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20",
      metrics: "Scheduled Weekly Sessions",
      link: "/live-sessions",
      buttonText: "Explore Doubt Sessions",
      tags: ["Code Review", "Logic Debugging", "Concept Clarification"],
    },
    {
      id: "contest-editorials",
      title: "Post-Contest Editorials",
      highlight: "Solutions for LeetCode, Codeforces & CodeChef",
      description:
        "Structured video and written editorials published after weekly contests. Review alternate approaches, optimize your submissions, and upsolve problems effectively.",
      icon: Trophy,
      badge: "Contest Upsolving",
      badgeColor: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20",
      metrics: "Regular Contest Coverage",
      link: "/contests",
      buttonText: "Browse Contest Editorials",
      tags: ["LeetCode Contests", "Codeforces Rounds", "Clean Multi-Language Code"],
    },
    {
      id: "cs-fundamentals",
      title: "Core CS Fundamentals & Notes",
      highlight: "High-Yield Notes for Technical Interviews",
      description:
        "Curated revision notes, system architecture overviews, and high-frequency interview questions for Operating Systems, DBMS & SQL, Computer Networks, and OOPs.",
      icon: Cpu,
      badge: "Interview Prep",
      badgeColor: "bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20",
      metrics: "Comprehensive Revision Notes",
      link: "/cs-fundamentals",
      buttonText: "Explore CS Notes",
      tags: ["Operating Systems", "DBMS & SQL", "Computer Networks", "OOPs & System Design"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 03. STRUCTURED DSA COURSES CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const STRUCTURED_COURSES_CONFIG = {
  sectionTag: "Curriculum Deep-Dive",
  title: "Learn with Structured DSA Courses",
  subtitle:
    "Intuition first, syntax second. Every topic is built from first principles with whiteboard proofs, space-time analysis, and battle-tested code templates.",
  flagshipCourse: {
    badge: "Flagship Placement Masterclass",
    title: "Complete Data Structures & Algorithms [Beginner to Advanced]",
    instructor: "Abhinav Awasthi",
    instructorRole: "Founder @ CrackDSA • SDE 2 @ Zeta • Ex-LinkedIn",
    stats: [
      { label: "Video Lessons", value: "206+" },
      { label: "Curriculum Modules", value: "22" },
      { label: "Languages Covered", value: "C++, Java, Python" },
      { label: "Practice Problems", value: "450+" },
    ],
    overview:
      "Engineered specifically for engineering students and working professionals aiming for Tier-1 product companies. From recursion fundamentals to Tree DP and Segment Trees.",
    modules: [
      {
        index: "01",
        name: "Complexity Analysis & Algorithmic Math",
        duration: "6 Hours • 16 Lectures",
        topics: ["Big-O, Omega, Theta Proofs", "Bit Manipulation Tricks", "Sieve & Modular Arithmetic", "Recursion Trees & Master Theorem"],
        highlight: "Foundation for 1600+ CP",
      },
      {
        index: "02",
        name: "Arrays, Two Pointers & Sliding Window",
        duration: "10 Hours • 28 Lectures",
        topics: ["Prefix Sums & 2D Matrices", "Fixed & Dynamic Sliding Window", "Dutch National Flag & In-place Operations", "Kadane's Algorithm Variants"],
        highlight: "80% of Tier-1 Screening Rounds",
      },
      {
        index: "03",
        name: "Binary Search & Monotonic Stack/Queue",
        duration: "8 Hours • 22 Lectures",
        topics: ["Binary Search on Answer Space", "Rotated Sorted Arrays", "Next Greater Element O(N)", "Largest Rectangle in Histogram"],
        highlight: "Favorite Pattern of Google & Uber",
      },
      {
        index: "04",
        name: "Binary Trees & Binary Search Trees (BST)",
        duration: "12 Hours • 32 Lectures",
        topics: ["Tree Traversals (Iterative & Recursive)", "Lowest Common Ancestor (LCA)", "Serialize & Deserialize Trees", "BST Validation & Rotations"],
        highlight: "High-Frequency FAANG Onsite",
      },
      {
        index: "05",
        name: "Graphs & Advanced Pathfinding",
        duration: "16 Hours • 44 Lectures",
        topics: ["BFS & DFS Applications", "Dijkstra & 0-1 BFS", "Topological Sort (Kahn's)", "Bridges, Articulation Points & DSU"],
        highlight: "Essential for Senior Roles",
      },
      {
        index: "06",
        name: "Dynamic Programming Masterclass",
        duration: "20 Hours • 52 Lectures",
        topics: ["Memoization to Tabulation", "Knapsack & Subsequence Variants", "DP on Grids & Strings (LCS/LIS)", "Tree DP & Bitmask DP"],
        highlight: "The Ultimate Placement Differentiator",
      },
    ],
  },
  otherCourses: [
    {
      id: "dp-mastery",
      title: "Dynamic Programming Deep Dive",
      lectures: "52 Lectures • 20 Hours",
      description: "Master all 12 core DP patterns from Knapsack to Digit DP and Tree DP with mathematical proofs.",
      level: "Intermediate to Hard",
      badge: "Mastery Series",
    },
    {
      id: "system-design",
      title: "System Design for SDE Interviews",
      lectures: "34 Lectures • 14 Hours",
      description: "Learn High-Level Design (HLD) & Low-Level Design (LLD): Caching, Load Balancing, Kafka, and Sharding.",
      level: "All Levels",
      badge: "Interview Ready",
    },
    {
      id: "cp-bootcamp",
      title: "Competitive Programming Bootcamp",
      lectures: "40 Lectures • 18 Hours",
      description: "Fast I/O, Segment Trees with Lazy Propagation, Fenwick Trees, Number Theory, and Codeforces upsolving.",
      level: "Rating 1200 - 1900+",
      badge: "CP Specialized",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 04. LIVE MENTORSHIP & CLASSES CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const LIVE_MENTORSHIP_CONFIG = {
  sectionTag: "Live & Interactive",
  title: "Learn from Mentors, Live",
  subtitle:
    "Recorded videos build concepts, but live classes build real-time problem-solving muscle. Interact, clarify doubts, and dissect complex problems together.",
  videoUrl: "https://www.youtube.com/embed/eUESza1d9Ac",
  featurePills: [
    { text: "Learn directly from experienced mentors", icon: Users },
    { text: "Ask doubts and get answers in real time", icon: MessageSquare },
    { text: "See multiple approaches to solve a problem", icon: Code2 },
    { text: "Build consistency with regular live sessions", icon: Trophy },
  ],
  pillars: [
    {
      title: "Weekly Live DSA Classes",
      subtitle: "Structured learning with real-time problem solving",
      description:
        "Every week, join live sessions where we solve hand-picked problems, discuss key patterns, and build intuition together.",
      schedule: "Every Saturday • 7:00 PM IST",
      icon: Radio,
      badge: "Interactive & Live",
      badgeColor: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    },
    {
      title: "Weekly Live Doubt Sessions",
      subtitle: "Ask. Discuss. Get Unstuck.",
      description:
        "Bring your buggy submissions, confusing concepts, or approach ideas. Get live help from mentors and peers in a supportive learning environment.",
      schedule: "Every Sunday • 6:00 PM IST",
      icon: HelpCircle,
      badge: "Mentor Support",
      badgeColor: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    },
    {
      title: "Exclusive Masterclasses",
      subtitle: "Go beyond DSA",
      description:
        "Specialized live workshops on System Design, company-specific preparation, advanced problem solving, and more.",
      schedule: "Bi-Weekly Masterclasses",
      icon: Users,
      badge: "Exclusive for Pro",
      badgeColor: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    },
  ],
  sessionAnatomy: {
    tag: "SESSION ANATOMY",
    title: "How a Live Class Works",
    steps: [
      {
        step: "01",
        title: "Concept Recap (10–15 min)",
        description: "Quick revision of key concepts and problem patterns.",
      },
      {
        step: "02",
        title: "Live Problem Solving (60–70 min)",
        description: "Solve hand-picked problems step by step with multiple approaches.",
      },
      {
        step: "03",
        title: "Interactive Discussion (10–15 min)",
        description: "Q&A, edge cases, optimizations, and alternate solutions.",
      },
      {
        step: "04",
        title: "Takeaways & Practice (5 min)",
        description: "Key learnings and recommended problems to practice.",
      },
    ],
  },
  mentor: {
    name: "Abhinav Awasthi",
    role: "Founder @ CrackDSA • Ex-Amazon, Zscaler, Zomato",
    experience: "6+ years of teaching experience",
    avatar: "/pictures/abhinav.jpeg",
    stats: [
      { label: "Students Mentored", value: "50,000+" },
      { label: "ICPC Regional Rank", value: "AIR 57" },
      { label: "Top Rated DSA Educator", value: "4.9 / 5.0 ★" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 05. COMPETITIVE PROGRAMMING & PRACTICE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const CP_PRACTICE_CONFIG = {
  sectionTag: "Competitive Edge",
  title: "Practice Like a Competitive Programmer",
  subtitle:
    "Top tech companies do not ask textbook questions — they test problem adaptation. Develop the intuition of a competitive programmer to solve unseen problems within 25 minutes.",
  features: [
    {
      title: "Newbie to Expert CP Sheet",
      count: "175 Handpicked Problems",
      description:
        "Sequenced specifically for placement preparation from 800 to 1900+ Codeforces difficulty rating. Every problem includes full video intuition and multi-language code.",
      badge: "Flagship Sheet",
      icon: Flame,
    },
    {
      title: "Contest Editorials Within Hours",
      count: "Codeforces • LeetCode • CodeChef",
      description:
        "Don't wait days for unofficial blog posts. Get crystal clear post-contest editorials with intuition, corner cases, and clean implementations immediately after contest ends.",
      badge: "Rapid Upsolving",
      icon: Trophy,
    },
    {
      title: "Multi-Language Clean Templates",
      count: "C++ • Python • Java",
      description:
        "Every solution is written with clean, idiomatic code templates, space-time complexity analysis, and modular functions suitable for clean coding rounds.",
      badge: "Clean Code",
      icon: Terminal,
    },
    {
      title: "Company & Pattern Tagging",
      count: "Google • Amazon • Microsoft • Uber",
      description:
        "Target the exact algorithmic patterns favored by your dream company. Filter questions by Sliding Window, Monotonic Stack, Binary Search, or Graphs.",
      badge: "Smart Filters",
      icon: Target,
    },
  ],
  recentContestsSample: [
    {
      name: "Codeforces Round 950 (Div. 2)",
      platform: "Codeforces",
      date: "12 Oct 2026",
      problems: ["A. Problem Generator", "B. Choosing Cubes", "C. Sofia and Lost Operations", "D. GCD-sequence", "E. Matrix Grid Flip"],
    },
    {
      name: "AtCoder Beginner Contest 387",
      platform: "AtCoder",
      date: "8 Oct 2026",
      problems: ["A. Happy New Year 2026", "B. 9x9 Sum", "C. Snake Numbers", "D. Snuke Maze BFS"],
    },
    {
      name: "LeetCode Weekly Contest 420",
      platform: "LeetCode",
      date: "5 Oct 2026",
      problems: ["Q1. Find Substring", "Q2. Count Substrings with K", "Q3. Min Division Operations", "Q4. Check Tree Character Paths"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 06. PREPARE BEYOND DSA (CS FUNDAMENTALS) CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const BEYOND_DSA_CONFIG = {
  sectionTag: "Core CS Fundamentals",
  title: "Core CS Fundamentals & Notes",
  subtitle:
    "DSA gets you through the coding rounds, but CS Fundamentals, System Design, and core engineering concepts secure your final offer.",
  csFundamentals: [
    {
      subject: "Operating Systems",
      icon: Cpu,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      topics: [
        "Process vs Thread & Context Switching",
        "Virtual Memory, Paging & Segmentation",
        "Deadlocks, Mutexes & Semaphores",
        "CPU Scheduling Algorithms & IPC",
      ],
      badge: "High-Frequency PYQs",
    },
    {
      subject: "DBMS & SQL",
      icon: Database,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      topics: [
        "ACID Properties & Transaction Isolation",
        "B+ Tree Indexing & Query Optimization",
        "Database Normalization (1NF to BCNF)",
        "Complex SQL Queries: Joins & Window Functions",
      ],
      badge: "Interview Core",
    },
    {
      subject: "Computer Networks",
      icon: Network,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      topics: [
        "TCP 3-Way Handshake & Teardown",
        "DNS Resolution Lifecycle & Routing",
        "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)",
        "TLS/SSL Handshake & WebSockets",
      ],
      badge: "System Design Prep",
    },
    {
      subject: "OOPs & Low-Level Design (LLD)",
      icon: Server,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      topics: [
        "SOLID Principles with Clean Code",
        "Factory, Singleton & Observer Patterns",
        "Schema Design for Real-World Systems",
        "UML Class Diagrams & Multi-threading",
      ],
      badge: "Onsite Round Prep",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 07. WHY CRACKDSA PRO (VALUE COMPARISON) CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const WHY_PRO_CONFIG = {
  sectionTag: "UNBEATABLE VALUE",
  title: "Why CrackDSA Pro?",
  subtitle:
    "Get everything you need for complete interview preparation at a fraction of the cost. Structured learning, live mentorship, premium resources, and a supportive community — all in one plan.",
  savingsPercent: "78%",
  standalone: {
    tag: "INDIVIDUAL PURCHASES",
    title: "Buying Resources Separately",
    subtitle: "Pay for each resource individually and end up spending much more.",
    items: [
      {
        title: "Complete DSA Flagship Course",
        subtitle: "206+ videos • Explained from Basics",
        price: 6999,
        icon: BookOpen,
        color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200/60 dark:border-blue-500/20",
      },
      {
        title: "2 Year of Weekly Live Classes",
        subtitle: "Live problem solving & doubt sessions",
        price: 12000,
        icon: Radio,
        color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-500/20",
      },
      {
        title: "Newbie to Expert CP Sheet + Editorials",
        subtitle: "Topic-wise sheets • Daily contest editorials",
        price: 3499,
        icon: FileText,
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20",
      },
      {
        title: "CS Fundamentals Revision Notes",
        subtitle: "OS, DBMS, CN, LLD and more",
        price: 2999,
        icon: Cpu,
        color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200/60 dark:border-purple-500/20",
      },
      {
        title: "VIP Community & Job Opportunities",
        subtitle: "Peer learning, discussions & curated opportunities",
        price: 1999,
        icon: Users,
        color: "text-pink-600 bg-pink-50 dark:bg-pink-500/10 border-pink-200/60 dark:border-pink-500/20",
      },
    ],
    totalPrice: 27496,
  },
  proPass: {
    tag: "ALL-IN-ONE SOLUTION",
    title: "CrackDSA Pro",
    subtitle: "Get complete access to all resources with one subscription.",
    planBadge: "WITH CRACKDSA 2-YEAR PASS",
    price: PRO_PRICING_CONFIG.yearly.price,
    durationText: "Full 2 Years Access",
    perDayText: "Less than ₹8/day",
    checkpoints: [
      "Everything included — zero separate upsells",
      "Instant access to 206+ lectures & upcoming live cohorts",
      "Permanent community networking & daily job alerts",
      "Regular contest coverage, editorials, and new resources",
      "Best value for long-term interview preparation",
    ],
    badges: [
      { label: "Full Access", type: "infinity" },
      { label: "Regular Updates", type: "play" },
      { label: "Active Community", type: "users" },
      { label: "Best Value", type: "star" },
    ],
  },
  bottomBenefits: [
    {
      title: "Better Value",
      subtitle: "Save 78% compared to individual purchases",
      icon: BarChart3,
    },
    {
      title: "Long-Term Access",
      subtitle: "2 years of uninterrupted learning",
      icon: Clock,
    },
    {
      title: "Stay Ahead",
      subtitle: "New content and updates included",
      icon: Rocket,
    },
    {
      title: "Stronger Together",
      subtitle: "Learn, discuss, and grow with a like-minded community",
      icon: Users,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 08. CHOOSE YOUR PLAN & FAQS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const CHOOSE_PLAN_FAQS = [
  {
    q: "How does CrackDSA Pro work once I subscribe?",
    a: "Immediately upon subscribing, your account is upgraded to Pro status. You unlock instant access to all 206+ DSA video modules, problem sheets with solutions, and receive calendar invites and links for all upcoming weekly live classes and doubt clearing sessions.",
  },
  {
    q: "What if I face any payment issue or activation delay?",
    a: "If your payment gets interrupted, deducted from your bank, or your account isn't activated automatically, please don't worry! We provide dedicated 24/7 WhatsApp support. Simply tap the WhatsApp button below or message our support number with your transaction details, and our team will resolve it and activate your Pro access immediately.",
  },
  {
    q: "What if I am a complete beginner in programming?",
    a: "CrackDSA Pro is built specifically to take you from beginner to advanced. We start with foundational complexity analysis, basic pointers, and recursion before stepping up to intermediate and hard topics. Our weekly doubt sessions ensure you never get left behind.",
  },
  {
    q: "What programming languages are supported?",
    a: "All code walkthroughs, editorials, and course templates are provided in C++, Python, and Java. You can prepare in whichever language you feel most comfortable with for technical interviews.",
  },
  {
    q: "What is the schedule for weekly live classes and doubt sessions?",
    a: "Live classes take place on weekends (typically Saturday and Sunday evenings IST) so college students and working professionals can attend without schedule conflicts. All live classes are also recorded and uploaded to your dashboard within 24 hours.",
  },
  {
    q: "Can I upgrade my monthly subscription to the 2-Year or Lifetime Pass later?",
    a: "Yes! You can upgrade your subscription at any time directly from your profile settings. Any unused balance can be adjusted towards your upgraded pass.",
  },
  {
    q: "What is your refund policy?",
    a: "We have a strict no-refund policy because instant access to the entire proprietary curriculum, 206+ lectures, problem sheets, and editorial archives is unlocked immediately upon purchase. However, we 100% guarantee top-tier, industry-leading content built by mentors from top tier-1 tech companies. We take extreme pride in the quality, depth, and practical relevance of every single resource.",
  }
];
