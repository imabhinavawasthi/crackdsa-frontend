export interface MockInterviewReview {
  id: string;
  rating: number; // Out of 5
  comment: string;
  author: string;
  date: string;
  role?: string;
  company?: string;
}

export interface MockInterviewService {
  id: string;
  title: string;
  badge: string;
  type: string;
  duration: string;
  price: number;
  originalPrice?: number;
  priceFormatted: string;
  originalPriceFormatted?: string;
  bookingUrl: string;
  description: string;
  highlights: string[];
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  steps: {
    step: string;
    title: string;
    description: string;
  }[];
}

export const MOCK_INTERVIEW_SERVICE: MockInterviewService = {
  id: "dsa-mock-interview-1-1",
  title: "1:1 Mock DSA Interview",
  badge: "Public",
  type: "1:1 Live Mentorship",
  duration: "60 mins",
  price: 1999,
  originalPrice: 3999,
  priceFormatted: "₹ 1,999",
  originalPriceFormatted: "₹ 3,999",
  bookingUrl: "https://topmate.io/abhinavawasthi/112037",
  description:
    "Simulate a real FAANG/tier-1 product engineering coding round with Abhinav Awasthi (SDE-2 @ Zeta, Ex-LinkedIn). Master edge cases, problem-solving speed, and algorithmic communication under realistic timed conditions.",
  highlights: [
    "60 Minutes Live Coding & Problem-Solving Session",
    "Real-time FAANG/Product Company Interview Simulation",
    "Live Code Walkthrough & Edge-case Stress Testing",
    "Comprehensive Verbal & Written Feedback",
    "Algorithm Optimization & Communication Techniques",
    "Custom Targeted Preparation Advice & Next Steps",
  ],
  features: [
    {
      icon: "Code2",
      title: "Real Problem Solving",
      description: "Solve 1-2 curated DSA problems tailored to your target company level (SDE-1 / SDE-2).",
    },
    {
      icon: "Timer",
      title: "Timed 60-Min Pressure",
      description: "Experience the real interview atmosphere and learn to manage time, thought flow, and stress.",
    },
    {
      icon: "Sparkles",
      title: "Actionable Scorecard",
      description: "Get concrete evaluation on problem identification, coding syntax, complexity analysis, and communication.",
    },
    {
      icon: "TrendingUp",
      title: "Targeted Roadmap",
      description: "Receive specific problem suggestions and topic recommendations to overcome weak areas.",
    },
  ],
  steps: [
    {
      step: "01",
      title: "Book Your Slot on Topmate",
      description: "Choose a convenient date and time that fits your schedule via the Topmate booking calendar.",
    },
    {
      step: "02",
      title: "Share Your Target Goals",
      description: "Provide your target companies (Amazon, Google, Zeta, etc.), experience level, and preferred language.",
    },
    {
      step: "03",
      title: "Live 1:1 Video Interview",
      description: "Connect on Google Meet. Code live on a shared IDE while thinking out loud, just like in a real round.",
    },
    {
      step: "04",
      title: "Detailed Scorecard & Q&A",
      description: "Receive deep personalized feedback on where you shined, what to fix, and how to improve before your actual interviews.",
    },
  ],
};

export const MOCK_INTERVIEW_REVIEWS: MockInterviewReview[] = [
  {
    id: "rev-1",
    rating: 5,
    comment: "Encouraging, insightful and genuinely wants to help",
    author: "Anonymous",
    date: "30th Aug, 2026",
  },
  {
    id: "rev-2",
    rating: 5,
    comment: "Sir was really knowledgeable and the interview helped me gain confidence",
    author: "Paramveer Singh",
    date: "31st Jul, 2025",
  },
  {
    id: "rev-3",
    rating: 5,
    comment: "I had mock DSA interview with him, his feedback at the end was very helpful and to the point.",
    author: "Srushti Sachdev",
    date: "21st Feb, 2025",
  },
  {
    id: "rev-4",
    rating: 5,
    comment: "Found it useful for getting a gist very quickly. Useful in interview scenarios where you're expected to know a breadth of topics .",
    author: "Sriram Krishnamurthy",
    date: "9th Dec, 2024",
  },
  {
    id: "rev-5",
    rating: 5,
    comment: "Very good and useful notes.",
    author: "Nirjhara Srivastava",
    date: "19th Apr, 2024",
  },
];

export const MOCK_INTERVIEW_FAQS = [
  {
    question: "Who conducts the 1:1 mock interview?",
    answer: "The session is directly taken by Abhinav Awasthi — SDE-2 @ Zeta (Directi), Ex-LinkedIn, ICPC AIR 57, and Candidate Master on Codeforces.",
  },
  {
    question: "Which programming languages can I use?",
    answer: "You can code in your preferred language of choice, including C++, Java, Python, or JavaScript/TypeScript.",
  },
  {
    question: "How are the questions selected for the mock?",
    answer: "Problems are tailored dynamically to match your target company profile (e.g. Amazon, Google, Microsoft, Uber, Fintech unicorns) and target role (SDE-1 or SDE-2).",
  },
  {
    question: "Will I get written feedback after the session?",
    answer: "Yes, you will receive immediate verbal feedback in the call plus a summary scorecard evaluating code correctness, time & space complexity, approach, and communication.",
  },
];
