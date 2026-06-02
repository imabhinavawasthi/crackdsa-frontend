import { ReactNode } from "react";
import {
  LayoutDashboard,
  Route,
  Table,
  Calendar,
  CircleUser,
  Sparkles,
  Sheet,
  Dumbbell,
  BookOpen,
  FileText,
  Layers,
  Building2,
  GraduationCap,
  ChevronLeft,
  Video,
  Compass,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

export type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  icon?: ReactNode;
};

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  subItems?: NavSubItem[];
};

export const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <GraduationCap size={20} />,
    name: "Courses",
    path: "/courses",
  },
  {
    icon: <Compass size={20} />,
    name: "Learn",
    path: "/learn",
  },
  {
    icon: <Route size={20} />,
    name: "My Roadmap",
    path: "/roadmap",
  },
  {
    icon: <Sheet size={20} />,
    name: "DSA Sheets",
    path: "/dsa-sheet",
    subItems: [
      {
        name: "Blind 75",
        path: "/dsa-sheet/blind-75",
        icon: <Dumbbell size={16} />,
      },
      {
        name: "Pattern Mastery",
        path: "/dsa-sheet/pattern-mastery",
      },
      {
        name: "CrackDSA 75",
        path: "/dsa-sheet/crackdsa-75",
        new: true,
      },
      {
        name: "30-Day Sprint",
        path: "/dsa-sheet/30-day-sprint",
      },
    ],
  },
  {
    icon: <BookOpen size={20} />,
    name: "Masterclasses",
    path: "/masterclasses",
  },
  {
    icon: <Sparkles size={20} />,
    name: "Personalized",
    path: "/personalized",
  },
  {
    icon: <FileText size={20} />,
    name: "Resume",
    path: "/resume",
  },
];

export const othersItems: NavItem[] = [
  {
    icon: <Table size={20} />,
    name: "Practice",
    path: "/practice",
  },
  {
    icon: <Layers size={20} />,
    name: "Topics",
    path: "/practice/topics",
    subItems: [
      { name: "All Topics", path: "/practice/topics/all" },
      { name: "Arrays", path: "/practice/topics/arrays" },
      { name: "Strings", path: "/practice/topics/strings" },
      { name: "Binary Search", path: "/practice/topics/binary-search" },
      { name: "Dynamic Programming", path: "/practice/topics/dp" },
      { name: "Graphs", path: "/practice/topics/graph" },
    ],
  },
  {
    icon: <Building2 size={20} />,
    name: "Companies",
    path: "/practice/companies",
    subItems: [
      { name: "Google", path: "/practice/companies/google" },
      { name: "Amazon", path: "/practice/companies/amazon" },
      { name: "Zeta", path: "/practice/companies/zeta" },
    ],
  },
  {
    icon: <Calendar size={20} />,
    name: "Progress",
    path: "/progress",
  },
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
];

export const adminOthersItems: NavItem[] = [
  {
    icon: <ChevronLeft size={20} />,
    name: "Exit Panel",
    path: "/dashboard",
  },
];

export type UserMenuItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export const userMenuItems: UserMenuItem[] = [
  {
    name: "My Profile",
    path: "/profile",
    icon: <User size={18} />,
  },
  {
    name: "Account Settings",
    path: "/settings",
    icon: <Settings size={18} />,
  },
  {
    name: "Help & Support",
    path: "/support",
    icon: <HelpCircle size={18} />,
  },
];
