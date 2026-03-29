"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";
import AuthImpact from "@/components/auth/AuthImpact";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white z-1 dark:bg-gray-900 overflow-hidden">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full min-h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          
          {/* Form Content Section (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col flex-1 w-full lg:w-1/2 justify-center items-center z-10"
          >
            {children}
          </motion.div>

          {/* Impact & Motivation Section (Right) */}
          <div className="lg:w-1/2 w-full min-h-screen bg-brand-950 dark:bg-brand-950 lg:flex items-center justify-center hidden relative overflow-hidden">
            {/* High-End Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full">
              {/* Common Grid Shape Overlay */}
              <GridShape />
              <AuthImpact />
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
