"use client";

import React, { useState, useEffect } from "react";
import DsaDocsSidebar from "./DsaDocsSidebar";
import { SidebarCategory } from "@/utils/mdxLoader";
import AppHeader from "@/layout/AppHeader";

interface DsaDocsSidebarWrapperProps {
  syllabus: SidebarCategory[];
  children: React.ReactNode;
}

export default function DsaDocsSidebarWrapper({ syllabus, children }: DsaDocsSidebarWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("crackdsa_learn_sidebar");
    return stored === null ? true : stored === "open";
  });

  const handleToggleSidebar = (forceState?: boolean) => {
    setIsSidebarOpen((prev) => {
      const nextState = forceState !== undefined ? forceState : !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("crackdsa_learn_sidebar", nextState ? "open" : "closed");
      }
      return nextState;
    });
  };

  return (
    <div className="w-full flex bg-gray-50/10 dark:bg-gray-950/10 h-screen overflow-hidden">
      
      {/* Sidebar Client component with dynamically crawled syllabus prop */}
      <DsaDocsSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        syllabus={syllabus} 
      />
      
      <div className="flex-1 w-full min-w-0 flex flex-col bg-white dark:bg-gray-900/60 overflow-hidden h-full">
        
        {/* Unified Application Header configured to toggle Docs Sidebar */}
        <div className="shrink-0 z-40 relative">
          <AppHeader 
            onToggleSidebar={() => handleToggleSidebar()} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>

        {/* Independent scroll wrapper for the article page content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
      
    </div>
  );
}
