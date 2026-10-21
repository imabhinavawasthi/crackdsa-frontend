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
    avatars: [
      "/pictures/abhinav.jpeg",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    ],
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
      metrics: "200+ Lectures • C++, Java & Python",
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
  sectionTag: "Unbeatable Value",
  title: "Why CrackDSA Pro?",
  subtitle:
    "Compare the value of all structured learning, live sessions, editorials, and notes combined in one transparent subscription.",
  standaloneItems: [
    { name: "Complete DSA Flagship Course (206+ Videos)", standaloneValue: 6999 },
    { name: "1 Full Year of Weekly Live Problem Solving & Doubt Classes", standaloneValue: 12000 },
    { name: "Newbie to Expert CP Sheet + Daily Contest Editorials", standaloneValue: 3499 },
    { name: "CS Fundamentals Revision Notes (OS, DBMS, CN, LLD)", standaloneValue: 2999 },
    { name: "VIP Pro Community + Curated Job Opportunities", standaloneValue: 1999 },
  ],
  totalStandaloneValue: 27496,
  proPriceMonthly: 799,
  proPriceYearly: 5999,
  savingsPercent: "78%",
  comparisonTable: [
    {
      feature: "Flagship DSA Master Curriculum",
      crackdsaPro: "Complete 206+ Videos with Whiteboards & Code",
      bootcamps: "Basic recordings or rigid 3-month timeline",
      genericPlatforms: "Disorganized random free videos",
    },
    {
      feature: "Weekly Live Problem Solving",
      crackdsaPro: "Interactive live cohorts with Abhinav every week",
      bootcamps: "TAs or batch mentors with generic slides",
      genericPlatforms: "No live classes",
    },
    {
      feature: "Weekly Live Doubt Resolution",
      crackdsaPro: "Scheduled live doubt-solving sessions & community support",
      bootcamps: "Slow forum ticketing system",
      genericPlatforms: "Comment section (rarely answered)",
    },
    {
      feature: "Rapid Contest Editorials",
      crackdsaPro: "Codeforces, LeetCode, CodeChef within hours",
      bootcamps: "None (only outdated textbook problems)",
      genericPlatforms: "Scattered community solutions",
    },
    {
      feature: "CS Fundamentals & Notes",
      crackdsaPro: "Comprehensive OS, DBMS, Networks & LLD notes",
      bootcamps: "Extra ₹15,000 add-on fee",
      genericPlatforms: "Textbook articles",
    },
    {
      feature: "Total Investment",
      crackdsaPro: "Starting at ₹799/mo or <₹8/day (2-Year Pass)",
      bootcamps: "₹50,000 to ₹1,20,000",
      genericPlatforms: "₹15,000 - ₹25,000/year",
      highlight: true,
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
  }
];
