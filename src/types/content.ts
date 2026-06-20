export interface SidebarItem {
  slug: string;
  title: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarCategory {
  id: string;
  title: string;
  description?: string;
  items: SidebarItem[];
  sections?: SidebarSection[];
}

export interface ArticleContent {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  whatYouWillLearn: string[];
  theory: string;
  visualization?: string;
  examples?: string[];
  codeExamples?: {
    cpp: string;
    java: string;
    python: string;
  };
  complexity?: {
    best: string;
    average: string;
    worst: string;
    space: string;
    description: string;
  };
  commonMistakes: string[];
  interviewTips: string[];
  practiceProblems: {
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
    url: string;
  }[];
  summary: string;
  content: string;
  toc: any[]; // Table of Contents
}

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}
