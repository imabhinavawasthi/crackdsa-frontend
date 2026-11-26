"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/common/Logo";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { MoreHorizontal, ChevronDown, User, ArrowRight, Crown, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  NavItem,
  sidebarSections,
  adminSidebarSections,
} from "@/config/sidebar";
import SidebarWidget from "./SidebarWidget";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const restoreActiveSubmenu = useCallback(() => {
    let submenuMatched = false;
    const sections = pathname.startsWith("/admin") ? adminSidebarSections : sidebarSections;
    sections.forEach((section) => {
      section.items.forEach((nav, index) => {
        if (nav.subItems) {
          const parentMatched = nav.path && isActive(nav.path);
          const subItemMatched = nav.subItems.some((subItem) => isActive(subItem.path));

          if (parentMatched || subItemMatched) {
            setOpenSubmenu({
              type: section.key,
              index,
            });
            submenuMatched = true;
          }
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    restoreActiveSubmenu();
  }, [restoreActiveSubmenu]);

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

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleSubmenuToggle = (index: number, menuType: string) => {
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

  const renderBadge = (item: any) => {
    if (item.badge) {
      return item.badge;
    }

    if (item.tag) {
      const bgClass = item.tagBg || "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20";
      const colorClass = item.tagColor || "";
      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border shadow-2xs select-none shrink-0 ${bgClass} ${colorClass}`}>
          {item.tag}
        </span>
      );
    }

    if (item.new) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-2xs select-none shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          NEW
        </span>
      );
    }

    if (item.pro) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border border-amber-500/25 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 shadow-2xs select-none shrink-0">
          <Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          PRO
        </span>
      );
    }

    return null;
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: string
  ) => (
    <ul className="flex flex-col gap-0.5">
      {navItems.map((nav, index) => (
        <li 
          key={nav.name}
          onMouseEnter={() => {
            if (nav.subItems && window.innerWidth >= 1024) {
              setOpenSubmenu({ type: menuType, index });
            }
          }}
          onMouseLeave={() => {
            if (nav.subItems && window.innerWidth >= 1024) {
              restoreActiveSubmenu();
            }
          }}
        >
          {nav.subItems ? (
            <Link
              href={nav.path || "#"}
              title={nav.name}
              onClick={(e) => {
                handleSubmenuToggle(index, menuType);
                if (!nav.path || nav.path === "#") {
                  e.preventDefault();
                } else {
                  closeSidebarOnMobile();
                }
              }}
              className={`menu-item group ${
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
                const isItemOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
                return (
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors duration-200 ${
                    isItemOpen
                      ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                      : "bg-gray-100/80 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-gray-200/70 dark:group-hover:bg-white/10"
                  }`}>
                    {nav.icon}
                  </span>
                )
              })()}
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-1">
                    {renderBadge(nav)}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : "group-hover:text-gray-600 dark:group-hover:text-gray-200"
                      }`}
                    />
                  </div>
                </>
              )}
            </Link>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                title={nav.name}
                onClick={closeSidebarOnMobile}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                {(() => {
                  const itemActive = isActive(nav.path!);
                  return (
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors duration-200 ${
                      itemActive
                        ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                        : "bg-gray-100/80 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-gray-200/70 dark:group-hover:bg-white/10"
                    }`}>
                      {nav.icon}
                    </span>
                  )
                })()}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    {renderBadge(nav) && (
                      <div className="ml-auto flex shrink-0 items-center pl-1">
                        {renderBadge(nav)}
                      </div>
                    )}
                  </>
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
              <ul className="mt-1 space-y-0.5 ml-7 pl-2 border-l border-gray-100 dark:border-white/5">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      title={subItem.name}
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
                              ? "text-brand-500 dark:text-brand-400"
                              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`}
                        >
                          {subItem.icon}
                        </span>
                      )}
                      <span className="truncate whitespace-nowrap flex-1 text-left">{subItem.name}</span>
                      {renderBadge(subItem) && (
                        <div className="ml-auto flex items-center shrink-0 pl-1">
                          {renderBadge(subItem)}
                        </div>
                      )}
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

  if (!mounted) {
    return (
      <aside
        className="fixed pt-0 flex flex-col top-0 px-3 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen border-r border-gray-200 w-[72px] lg:translate-x-0"
      >
        <div className="py-4 flex items-center justify-center w-full">
          <Logo href="/" variant="icon" width={32} height={32} />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed pt-0 flex flex-col top-0 px-3 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[280px]"
            : isHovered
            ? "w-[280px]"
            : "w-[72px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (window.innerWidth >= 1024) {
          restoreActiveSubmenu();
        }
      }}
    >
      <div className="py-4 flex items-center justify-center relative w-full border-b border-gray-100 dark:border-gray-800/60 lg:border-none">
        <Logo
          href="/"
          variant={isExpanded || isHovered || isMobileOpen ? "full" : "icon"}
          width={isExpanded || isHovered || isMobileOpen ? 150 : 40}
          height={isExpanded || isHovered || isMobileOpen ? 40 : 32}
          onClick={closeSidebarOnMobile}
        />
        {isMobileOpen && (
          <button
            onClick={closeSidebarOnMobile}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar text-[14px]">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {(() => {
              const sections = pathname.startsWith("/admin") ? adminSidebarSections : sidebarSections;
              return sections.map((section) => {
                if (section.requireAuth && !isLoggedIn) {
                  return (
                    <div key={section.key} className="py-0.5">
                      <h2
                        className={`mb-1 px-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center leading-5 text-gray-400 dark:text-gray-500 select-none ${
                          !isExpanded && !isHovered
                            ? "lg:justify-center"
                            : "justify-start"
                        }`}
                      >
                        {isExpanded || isHovered || isMobileOpen ? (
                          section.title
                        ) : (
                          <MoreHorizontal size={18} />
                        )}
                      </h2>
                      <ul className="flex flex-col gap-0.5">
                        <li>
                          <Link
                            href="/login"
                            onClick={closeSidebarOnMobile}
                            className={`menu-item group ${
                              isActive("/login") ? "menu-item-active" : "menu-item-inactive"
                            }`}
                          >
                            <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors duration-200 bg-gray-100/80 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-gray-200/70 dark:group-hover:bg-white/10`}>
                              <User size={18} />
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                              <span className="menu-item-text">Sign In</span>
                            )}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  );
                }

                return (
                  <div key={section.key} className="py-0.5">
                    <h2
                      className={`mb-1 px-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center leading-5 text-gray-400 dark:text-gray-500 select-none ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "justify-start"
                      }`}
                    >
                      {isExpanded || isHovered || isMobileOpen ? (
                        section.title
                      ) : (
                        <MoreHorizontal size={18} />
                      )}
                    </h2>
                    {renderMenuItems(section.items, section.key)}
                  </div>
                );
              });
            })()}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;