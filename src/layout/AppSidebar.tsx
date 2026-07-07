"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { MoreHorizontal, ChevronDown, User, ArrowRight } from "lucide-react";
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
      const bgClass = item.tagBg || "bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20";
      const colorClass = item.tagColor || "";
      return (
        <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border ${bgClass} ${colorClass} select-none`}>
          {item.tag}
        </span>
      );
    }

    if (item.new) {
      return (
        <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 select-none">
          NEW
        </span>
      );
    }

    if (item.pro) {
      return (
        <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs border border-transparent dark:from-amber-600 dark:to-orange-600 select-none scale-95 shrink-0">
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
    <ul className="flex flex-col gap-1">
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
              onClick={(e) => {
                handleSubmenuToggle(index, menuType);
                if (!nav.path || nav.path === "#") {
                  e.preventDefault();
                } else {
                  closeSidebarOnMobile();
                }
              }}
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
                <>
                  <span className={`menu-item-text`}>{nav.name}</span>
                  {renderBadge(nav) && (
                    <span className="ml-2 flex shrink-0">{renderBadge(nav)}</span>
                  )}
                </>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 group-hover:hidden ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                  <ArrowRight
                    className="ml-auto w-5 h-5 text-brand-500 hidden group-hover:block transition-all duration-200"
                  />
                </>
              )}
            </Link>
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
                  <>
                    <span className={`menu-item-text`}>{nav.name}</span>
                    {renderBadge(nav) && (
                      <span className="ml-2 flex shrink-0">{renderBadge(nav)}</span>
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
                      {renderBadge(subItem) && (
                        <span className="flex items-center gap-1.5 ml-auto shrink-0">
                          {renderBadge(subItem)}
                        </span>
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
        className="fixed pt-18.5 flex flex-col lg:pt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen border-r border-gray-200 w-18 lg:translate-x-0"
      >
        <div className="py-4 hidden lg:flex lg:justify-center">
          <Link href="/">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed pt-18.5 flex flex-col lg:pt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-65"
            : isHovered
            ? "w-65"
            : "w-18"
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
            {(() => {
              const sections = pathname.startsWith("/admin") ? adminSidebarSections : sidebarSections;
              return sections.map((section) => {
                if (section.requireAuth && !isLoggedIn) {
                  return (
                    <div key={section.key} className="">
                      <h2
                        className={`mb-2 text-xs uppercase flex leading-5 text-gray-400 ${
                          !isExpanded && !isHovered
                            ? "lg:justify-center"
                            : "justify-start"
                        }`}
                      >
                        {isExpanded || isHovered || isMobileOpen ? (
                          section.title
                        ) : (
                          <MoreHorizontal size={20} />
                        )}
                      </h2>
                      <ul className="flex flex-col gap-1">
                        <li>
                          <Link
                            href="/login"
                            onClick={closeSidebarOnMobile}
                            className={`menu-item group ${
                              isActive("/login") ? "menu-item-active" : "menu-item-inactive"
                            }`}
                          >
                            <span className={`flex items-center justify-center w-7.5 h-7.5 rounded-lg transition-colors duration-200 bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/10`}>
                              <User size={18} />
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                              <span className={`menu-item-text`}>Sign In</span>
                            )}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  );
                }

                return (
                  <div key={section.key} className="">
                    <h2
                      className={`mb-2 text-xs uppercase flex leading-5 text-gray-400 ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "justify-start"
                      }`}
                    >
                      {isExpanded || isHovered || isMobileOpen ? (
                        section.title
                      ) : (
                        <MoreHorizontal size={20} />
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