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
  Compass,
  User,
  HelpCircle,
  Network,
  SheetIcon,
  Zap,
  Bookmark,
  Sparkles,
  Code2,
  Tag,
  CreditCard,
  TvMinimalPlay,
  MessageCircle,
  UserKey,
  UserStarIcon,
  GoalIcon,
  FolderTree,
  Users
} from "lucide-react";
import type { NavItem, SidebarSectionType, UserMenuItem } from "@/types/sidebar";
export type { NavItem, SidebarSectionType } from "@/types/sidebar";

export const learningItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <GraduationCap size={20} />,
    name: "Learn DSA",
    path: "/dsa",
    new: true,
  },
  {
    icon: <Route size={20} />,
    name: "Roadmap",
    path: "/roadmap",
    badge: (
      <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md bg-purple-500/10 text-purple-600 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30 select-none animate-pulse shrink-0">
        BETA
      </span>
    )
  },
];

export const practiceItems: NavItem[] = [
  {
    icon: <Network size={20} />,
    name: "Practice DSA",
    path: "/practice",
  },
  {
    icon: <Sheet size={20} />,
    name: "DSA Sheets",
    path: "/dsa-sheet",
    subItems: [
      {
        name: "Patterns",
        path: "/dsa-sheet/pattern-mastery",
        icon: <FolderTree size={16} />,
        new: true
      },
      {
        name: "Sprint 75",
        path: "/dsa-sheet/crackdsa-revision-sprint",
        icon: <Zap size={16} />
      },
      {
        name: "0 to Hero DSA",
        path: "/dsa-sheet/0-to-hero-dsa",
        icon: <GraduationCap size={16} />
      }
    ],
  },
  {
    icon: <Layers size={20} />,
    name: "Topics",
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
    name: "Companies",
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
  }
];

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
    name: "Articles / Blogs",
    path: "/admin/blogs",
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

export type { UserMenuItem } from "@/types/sidebar";

export const userMenuItems: UserMenuItem[] = [
  {
    name: "My Profile",
    path: "/profile",
    icon: <User size={18} />,
  },
  {
    name: "Help & Support",
    path: "/support",
    icon: <HelpCircle size={18} />,
  },
];

export const proItems: NavItem[] = [
  {
    icon: <GoalIcon size={20} />,
    name: "Pro Dashboard",
    path: "/pro/dashboard",
    new: true,
  },
  {
    icon: <TvMinimalPlay size={20} />,
    name: "Live Classes",
    path: "/live-sessions",
    pro: true,
  },
    {
    icon: <FileText size={20} />,
    name: "Resources & Notes",
    path: "/resources",
    pro: true,
  },
  {
    icon: <UserStarIcon size={20} />,
    name: "Personalized",
    path: "/pro/personalized",
    subItems: [
      { name: "Mentorship", path: "/pro/personalized/mentorship", icon: <UserKey size={16} />, pro: true },
      { name: "Doubt Solving Sessions", path: "/pro/personalized/doubt-solving-sessions", icon: <MessageCircle size={16} />, pro: true },
      { name: "Mock Interviews", path: "/pro/personalized/mock-interviews", icon: <Users size={16} />, new: true },
    ],
  }
];

export const sidebarSections: SidebarSectionType[] = [
  {
    title: "Learning",
    items: learningItems,
    key: "main",
  },
  {
    title: "Practice",
    items: practiceItems,
    key: "others",
  },
  {
    title: "PRO",
    items: proItems,
    key: "pro",
  },
  {
    title: "Account",
    items: accountItems,
    key: "account",
    requireAuth: true,
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

