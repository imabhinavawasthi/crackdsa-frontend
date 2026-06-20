import { ReactNode } from "react";

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
