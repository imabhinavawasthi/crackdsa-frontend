"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full bg-[#F8FAFC]">
        {children}
      </div>
    </ThemeProvider>
  );
}
