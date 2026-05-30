"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import NextTopLoader from "nextjs-toploader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  // Centralized security guard redirects
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (isAdminRoute && !user?.roles?.includes("admin")) {
        router.push("/");
      }
    }
  }, [authLoading, isLoggedIn, user, router, isAdminRoute]);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[260px]"
    : "lg:ml-[72px]";

  // Prevent flashing during verification or redirection phase
  if (authLoading || !isLoggedIn || (isAdminRoute && !user?.roles?.includes("admin"))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-900">
        <Loader2 size={36} className="animate-spin text-brand-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold tracking-wide animate-pulse">
          Verifying secure access parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      <NextTopLoader color="#465FFF" showSpinner={false} zIndex={100000} />
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
