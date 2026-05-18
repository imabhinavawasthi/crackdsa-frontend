"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { getGoogleAuthUrl } from "@/functions/auth";
import { LogIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Rendered inside the routes layout.
 * Shows a small non-blocking banner when the background /me poll
 * detects the session has expired (user was logged in → now 401).
 */
export default function SessionExpiredBanner() {
  const { sessionExpired, dismissSessionExpired } = useAuth();

  return (
    <AnimatePresence>
      {sessionExpired && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[10000] w-[90vw] max-w-md"
        >
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-warning-300 dark:border-warning-500/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-warning-100 dark:bg-warning-500/15 text-warning-600 dark:text-warning-400 shrink-0">
              <LogIn size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Session Expired
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please log in again to continue.
              </p>
            </div>
            <a
              href={getGoogleAuthUrl()}
              className="shrink-0 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Log In
            </a>
            <button
              onClick={dismissSessionExpired}
              className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
