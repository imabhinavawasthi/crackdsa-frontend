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
} from "lucide-react";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  color?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const iconColorMap: Record<string, { bg: string; bgActive: string; text: string; textActive: string }> = {
  blue:    { bg: "bg-blue-50 dark:bg-blue-500/10",     bgActive: "bg-blue-100 dark:bg-blue-500/20",     text: "text-blue-500 dark:text-blue-400",     textActive: "text-blue-600 dark:text-blue-300" },
  purple:  { bg: "bg-purple-50 dark:bg-purple-500/10",   bgActive: "bg-purple-100 dark:bg-purple-500/20",   text: "text-purple-500 dark:text-purple-400",   textActive: "text-purple-600 dark:text-purple-300" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", bgActive: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-500 dark:text-emerald-400", textActive: "text-emerald-600 dark:text-emerald-300" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-500/10",     bgActive: "bg-amber-100 dark:bg-amber-500/20",     text: "text-amber-500 dark:text-amber-400",     textActive: "text-amber-600 dark:text-amber-300" },
  rose:    { bg: "bg-rose-50 dark:bg-rose-500/10",       bgActive: "bg-rose-100 dark:bg-rose-500/20",       text: "text-rose-500 dark:text-rose-400",       textActive: "text-rose-600 dark:text-rose-300" },
  cyan:    { bg: "bg-cyan-50 dark:bg-cyan-500/10",       bgActive: "bg-cyan-100 dark:bg-cyan-500/20",       text: "text-cyan-500 dark:text-cyan-400",       textActive: "text-cyan-600 dark:text-cyan-300" },
  orange:  { bg: "bg-orange-50 dark:bg-orange-500/10",   bgActive: "bg-orange-100 dark:bg-orange-500/20",   text: "text-orange-500 dark:text-orange-400",   textActive: "text-orange-600 dark:text-orange-300" },
  indigo:  { bg: "bg-indigo-50 dark:bg-indigo-500/10",   bgActive: "bg-indigo-100 dark:bg-indigo-500/20",   text: "text-indigo-500 dark:text-indigo-400",   textActive: "text-indigo-600 dark:text-indigo-300" },
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
    color: "blue",
    subItems: [{ name: "Pro", path: "/pro", pro: true, icon: <Sparkles size={16} /> }],
  },
  {
    icon: <Route size={20} />,
    name: "My Roadmap",
    path: "/roadmap",
    color: "purple",
  },
  {
    icon: <Table size={20} />,
    name: "Practice",
    path: "/practice",
    color: "emerald",
  },
  {
    icon: <Calendar size={20} />,
    name: "Progress",
    path: "/progress",
    color: "amber",
  },
  {
    icon: <CircleUser size={20} />,
    name: "Profile",
    path: "/profile",
    color: "rose",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChart size={20} />,
    name: "Charts",
    color: "cyan",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <Box size={20} />,
    name: "UI Elements",
    color: "orange",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <Plug size={20} />,
    name: "Authentication",
    color: "indigo",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
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
                const colors = nav.color ? iconColorMap[nav.color] : null;
                const isItemActive = openSubmenu?.type === menuType && openSubmenu?.index === index;
                if (colors) {
                  return (
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                      isItemActive
                        ? `${colors.bgActive} ${colors.textActive}`
                        : `${colors.bg} ${colors.text}`
                    }`}>
                      {nav.icon}
                    </span>
                  );
                }
                return (
                  <span className={isItemActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                    {nav.icon}
                  </span>
                );
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
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                {(() => {
                  const colors = nav.color ? iconColorMap[nav.color] : null;
                  const itemActive = isActive(nav.path!);
                  if (colors) {
                    return (
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                        itemActive
                          ? `${colors.bgActive} ${colors.textActive}`
                          : `${colors.bg} ${colors.text}`
                      }`}>
                        {nav.icon}
                      </span>
                    );
                  }
                  return (
                    <span className={itemActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                      {nav.icon}
                    </span>
                  );
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
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
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
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
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
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
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
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
