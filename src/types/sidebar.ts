import { ReactNode } from "react";

export type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  tag?: string;
  tagBg?: string;
  tagColor?: string;
  badge?: ReactNode;
  icon?: ReactNode;
};

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  pro?: boolean;
  new?: boolean;
  tag?: string;
  tagBg?: string;
  tagColor?: string;
  badge?: ReactNode;
  subItems?: NavSubItem[];
};

export type UserMenuItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export type SidebarSectionType = {
  title: string;
  items: NavItem[];
  key: string;
  requireAuth?: boolean;
};
