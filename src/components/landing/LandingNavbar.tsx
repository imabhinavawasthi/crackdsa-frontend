"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  ArrowRight,
  Code2,
  BarChart3,
  Users,
  BookOpen,
} from "lucide-react";

export default function LandingNavbar() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollPosition = useScrollPosition();
  const scrolled = scrollPosition > 20;

  useClickOutside(menuRef, () => {
    if (showUserMenu) setShowUserMenu(false);
  });

  const initials = user?.full_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <Code2 size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">
            CrackDSA
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : isLoggedIn && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors px-3 py-2 hidden sm:block"
              >
                Dashboard
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-brand-500/30 focus:outline-none"
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name || "User"}
                      width={34}
                      height={34}
                      className="w-[34px] h-[34px] rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full bg-brand-500 flex items-center justify-center text-white text-[12px] font-bold ring-2 ring-white/10">
                      {initials}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-60 origin-top-right bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <Image
                              src={user.avatar_url}
                              alt={user.full_name || "User"}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white text-[13px] font-bold">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">
                              {user.full_name || "User"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <BarChart3 size={15} className="text-gray-500" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <Users size={15} className="text-gray-500" />
                          My Profile
                        </Link>
                        <Link
                          href="/courses"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <BookOpen size={15} className="text-gray-500" />
                          Courses
                        </Link>
                      </div>

                      <div className="p-2 border-t border-white/[0.06]">
                        <button
                          onClick={async () => {
                            setShowUserMenu(false);
                            await logout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <ArrowRight size={15} className="rotate-180" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-white text-gray-950 text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
                <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
