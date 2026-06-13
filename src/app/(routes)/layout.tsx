"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppFooter from "@/layout/AppFooter";
import SessionExpiredBanner from "@/components/auth/SessionExpiredBanner";
import CrackDSAAgent from "@/components/common/CrackDSAAgent";
import React from "react";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[260px]"
    : "lg:ml-[72px]";

  return (
    <div className="min-h-screen flex overflow-x-hidden">
      <SessionExpiredBanner />
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="flex-1 p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
        <AppFooter />
      </div>
      <CrackDSAAgent />
    </div>
  );
}
