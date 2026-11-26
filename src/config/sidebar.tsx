import {
  LayoutDashboard,
  Route,
  Table,
  CircleUser,
  Sheet,
  BookOpen,
  FileText,
  Layers,
  Building2,
  GraduationCap,
  ChevronLeft,
  Video,
  User,
  HelpCircle,
  SheetIcon,
  Zap,
  Bookmark,
  Sparkles,
  Tag,
  CreditCard,
  TvMinimalPlay,
  MessageCircle,
  GoalIcon,
  FolderTree,
  Users,
  Trophy,
  FileCode,
  FileCheck,
  Crown,
  Rocket,
  Gift,
} from "lucide-react";
import type { NavItem, SidebarSectionType, UserMenuItem } from "@/types/sidebar";
export type { NavItem, SidebarSectionType } from "@/types/sidebar";

// ─── 1. Learning Section ─────────────────────────────────────────────────────
export const learningItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <BookOpen size={20} />,
    name: "Courses",
    path: "/courses",
    new: true,
  },
  {
    icon: <Sparkles size={20} />,
    name: "Masterclasses",
    path: "/masterclasses",
  },
  {
    icon: <TvMinimalPlay size={20} />,
    name: "Live Classes",
    path: "/live-classes",
    pro: true,
  },
];

// ─── 2. DSA Section ──────────────────────────────────────────────────────────
export const dsaItems: NavItem[] = [
  {
    icon: <GraduationCap size={20} />,
    name: "DSA Course",
    path: "/course/dsa",
  },
  {
    icon: <Sheet size={20} />,
    name: "DSA Sheets",
    path: "/dsa-sheet",
    new: true,
    subItems: [
      {
        name: "Patterns",
        path: "/dsa-sheet/pattern-mastery",
        icon: <FolderTree size={16} />,
        new: true,
      },
      {
        name: "Sprint 75",
        path: "/dsa-sheet/crackdsa-revision-sprint",
        icon: <Zap size={16} />,
      },
      {
        name: "0 to Hero DSA",
        path: "/dsa-sheet/0-to-hero-dsa",
        icon: <GraduationCap size={16} />,
      },
    ],
  },
  {
    icon: <Layers size={20} />,
    name: "TopicWise",
    path: "/practice/topics",
    subItems: [
      { name: "Array", path: "/practice/topics/array" },
      { name: "String", path: "/practice/topics/string" },
      { name: "Binary Search", path: "/practice/topics/binary-search" },
      { name: "Dynamic Programming", path: "/practice/topics/dynamic-programming" },
      { name: "Graph", path: "/practice/topics/graph" },
    ],
  },
  {
    icon: <Building2 size={20} />,
    name: "CompanyWise",
    path: "/practice/companies",
    subItems: [
      { name: "Google", path: "/practice/companies/google" },
      { name: "Amazon", path: "/practice/companies/amazon" },
      { name: "Microsoft", path: "/practice/companies/microsoft" },
      { name: "Meta", path: "/practice/companies/meta" },
      { name: "Apple", path: "/practice/companies/apple" },
    ],
  },
];

// Backwards compatibility alias
export const practiceItems = dsaItems;

// ─── 3. Competitive Programming Section ───────────────────────────────────────
export const cpItems: NavItem[] = [
  {
    icon: <Trophy size={20} />,
    name: "Newbie to Expert",
    path: "/cp/newbie-to-expert",
    new: true,
  },
  {
    icon: <FileCode size={20} />,
    name: "Contest Editorials",
    path: "/contests/editorials",
  }
];

// ─── 4. Interview Prep Section ───────────────────────────────────────────────
export const interviewPrepItems: NavItem[] = [
  {
    icon: <FileText size={20} />,
    name: "CS Fundamentals",
    path: "/cs-fundamentals",
    new: true,
  },
  {
    icon: <Users size={20} />,
    name: "Mock Interview 1:1",
    path: "/mock-interviews",
    pro: true,
  },
  {
    icon: <FileCheck size={20} />,
    name: "Resume Builder",
    path: "/resume",
  },
];

// ─── 5. Account Section (as it is) ───────────────────────────────────────────
export const accountItems: NavItem[] = [
  {
    icon: <User size={20} />,
    name: "Profile",
    path: "/profile",
    subItems: [
      { name: "Subscription Details", path: "/profile/subscription", icon: <Sparkles size={16} /> },
    ],
  },
  {
    icon: <GraduationCap size={20} />,
    name: "My Progress",
    path: "/progress",
    subItems: [
      { name: "Bookmarked Items", path: "/profile/bookmarks", icon: <Bookmark size={16} /> },
      { name: "My Notes", path: "/profile/notes", icon: <FileText size={16} /> },
    ],
  },
];

// ─── 6. PRO Section ──────────────────────────────────────────────────────────
export const proItems: NavItem[] = [
  {
    icon: <Crown size={20} />,
    name: "Pro Membership",
    path: "/pro",
    pro: true,
  }
];

// ─── Sidebar Sections Registry ───────────────────────────────────────────────
export const sidebarSections: SidebarSectionType[] = [
  {
    title: "Learning",
    items: learningItems,
    key: "learning",
  },
  {
    title: "DSA",
    items: dsaItems,
    key: "dsa",
  },
  {
    title: "Competitive Programming",
    items: cpItems,
    key: "cp",
  },
  {
    title: "Interview Prep",
    items: interviewPrepItems,
    key: "interview-prep",
  },
  {
    title: "Account",
    items: accountItems,
    key: "account",
    requireAuth: true,
  },
  {
    title: "PRO",
    items: proItems,
    key: "pro",
  },
];

// ─── Admin Navigation (Intact) ───────────────────────────────────────────────
export const adminNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Admin Home",
    path: "/admin",
  },
  {
    icon: <Video size={20} />,
    name: "Video Lectures",
    path: "/admin/videos",
  },
  {
    icon: <CircleUser size={20} />,
    name: "Instructors",
    path: "/admin/instructors",
  },
  {
    icon: <Table size={20} />,
    name: "Practice Problems",
    path: "/admin/problems",
  },
  {
    icon: <FileText size={20} />,
    name: "Articles & Notes",
    path: "/admin/articles",
  },
  {
    icon: <BookOpen size={20} />,
    name: "Courses",
    path: "/admin/courses",
  },
  {
    icon: <SheetIcon size={20} />,
    name: "DSA Sheets",
    path: "/admin/dsa-sheets",
  },
  {
    icon: <Route size={20} />,
    name: "Roadmaps",
    path: "/admin/roadmaps",
  },
];

export const adminOthersItems: NavItem[] = [
  {
    icon: <Zap size={20} />,
    name: "Cache Control",
    path: "/admin/cache",
  },
  {
    icon: <Tag size={20} />,
    name: "Coupons",
    path: "/admin/coupons",
  },
  {
    icon: <CreditCard size={20} />,
    name: "Transactions",
    path: "/admin/transactions",
  },
  {
    icon: <ChevronLeft size={20} />,
    name: "Exit Panel",
    path: "/dashboard",
  },
];

export const adminSidebarSections: SidebarSectionType[] = [
  {
    title: "Admin Panel",
    items: adminNavItems,
    key: "main",
  },
  {
    title: "Manage",
    items: adminOthersItems,
    key: "others",
  },
];

export const userMenuItems: UserMenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Rocket size={18} />,
  },
  {
    name: "My Progress",
    path: "/progress",
    icon: <Trophy size={18} />,
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: <User size={18} />,
  },
  {
    name: "CrackDSA Pro Pass",
    path: "/pro",
    icon: <Sparkles size={18} />,
  },
  {
    name: "Refer & Earn",
    path: "/refer-earn",
    icon: <Gift size={18} />,
  },
  {
    name: "Help & Support",
    path: "/support",
    icon: <HelpCircle size={18} />,
  },
];
