"use client";

import React, { useState } from "react";
import DsaDocsSidebar from "./DsaDocsSidebar";
import { SidebarCategory } from "@/utils/mdxLoader";

interface DsaDocsSidebarWrapperProps {
  syllabus: SidebarCategory[];
  children: React.ReactNode;
}

export default function DsaDocsSidebarWrapper({ syllabus, children }: DsaDocsSidebarWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="w-full flex bg-gray-50/10 dark:bg-gray-950/10 h-screen overflow-hidden">
      
      {/* Sidebar Client component with dynamically crawled syllabus prop */}
      <DsaDocsSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        syllabus={syllabus} 
      />
      
      <div className="flex-1 w-full min-w-0 flex flex-col bg-white dark:bg-gray-900/60 overflow-hidden h-full">
        
        {/* Simple minimal header for collapsing docs sidebar inside learn section */}
        <div className="h-11 border-b border-gray-150 dark:border-gray-800/60 flex items-center justify-between px-4 shrink-0 bg-gray-50/20 dark:bg-gray-900/40 backdrop-blur-sm select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white hover:bg-gray-50 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-455 hover:text-brand-500 border border-gray-150 dark:border-gray-750 transition-colors shadow-sm"
              title={isSidebarOpen ? "Minimize Sidebar" : "Expand Sidebar"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-455 dark:text-gray-555 font-extrabold uppercase tracking-widest leading-none">
                DSA Documentation Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-150 dark:border-gray-750 px-2 py-0.5 rounded uppercase tracking-wider">
              v1.0.0
            </span>
          </div>
        </div>

        {/* Independent scroll wrapper for the article page content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
      
    </div>
  );
}
