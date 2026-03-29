"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  LayoutDashboard,
  Route,
  Table,
  Calendar,
  CircleUser,
  PieChart,
  Box,
  Plug,
  MoreHorizontal,
  ChevronDown,
  Sparkles,
  Sheet,
  Dumbbell,
  BookOpen,
  FileText,
  Layers,
  Building2,
} from "lucide-react";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  // 🔥 LEARNING
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
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
        name: "DSA Kickstart",
        path: "/dsa-sheet/kickstart",
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

const othersItems: NavItem[] = [
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
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-1">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              {(() => {
                const isActive = openSubmenu?.type === menuType && openSubmenu?.index === index;
                return (
                  <span className={`flex items-center justify-center w-7.5 h-7.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                      : "bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/10"
                  }`}>
                    {nav.icon}
                  </span>
                )
              })()}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={closeSidebarOnMobile}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                {(() => {
                  const itemActive = isActive(nav.path!);
                  return (
                    <span className={`flex items-center justify-center w-7.5 h-7.5 rounded-lg transition-colors duration-200 ${
                      itemActive
                        ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                        : "bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/10"
                    }`}>
                      {nav.icon}
                    </span>
                  )
                })()}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-0.5 ml-8">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      onClick={closeSidebarOnMobile}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.icon && (
                        <span
                          className={`shrink-0 ${
                            isActive(subItem.path)
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }`}
                        >
                          {subItem.icon}
                        </span>
                      )}
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed pt-[74px] flex flex-col lg:pt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[260px]"
            : isHovered
            ? "w-[260px]"
            : "w-[72px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-4 hidden lg:flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar text-[14px]">
        <nav className="mb-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2
                className={`mb-2 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Learning"
                ) : (
                  <MoreHorizontal size={20} />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-2 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Practice"
                ) : (
                  <MoreHorizontal size={20} />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
