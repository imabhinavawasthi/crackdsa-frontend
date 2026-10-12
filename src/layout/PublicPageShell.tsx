"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import AppFooter from "@/layout/AppFooter";

export default function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <AppHeader hideSidebarToggle />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </div>
  );
}
