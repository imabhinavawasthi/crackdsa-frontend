"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ChevronDown,
  Crown,
  Rocket,
  Trophy,
  User,
  Sparkles,
  Gift,
  HelpCircle,
} from "lucide-react";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isPro = !!user?.is_pro_active;

  function toggleDropdown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const menuItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <User size={16} className="text-blue-500 shrink-0" />,
      badge: null,
    },
    {
      name: "My Progress",
      path: "/progress",
      icon: <Trophy size={16} className="text-orange-500 shrink-0" />,
      badge: null,
    },
    {
      name: isPro ? "Manage Subscription" : "CrackDSA Pro Pass",
      path: isPro ? "/profile/subscription" : "/pro",
      icon: <Sparkles size={16} className="text-amber-500 shrink-0" />,
      badge: isPro ? (
        <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider shrink-0">
          Active
        </span>
      ) : (
        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-widest shadow-xs shrink-0">
          Pro
        </span>
      ),
    },
    {
      name: "Help & Support",
      path: "/support",
      icon: <HelpCircle size={16} className="text-purple-500 shrink-0" />,
      badge: null,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="group flex items-center gap-3 rounded-xl p-1.5 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 dropdown-toggle cursor-pointer"
      >
        {/* Avatar with Premium Ring & Presence */}
        <div className="relative h-10 w-10 shrink-0">
          <div className="absolute -inset-0.5 animate-pulse bg-gradient-to-tr from-brand-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full blur-[2px]" />
          <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-brand-500/30 dark:ring-gray-800">
            <Image
              width={40}
              height={40}
              src={user?.avatar_url ?? "/images/user/owner.jpg"}
              alt={user?.full_name ?? "User"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {/* Active Presence Dot */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />

          {isPro && (
            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 shadow-sm border-2 border-white dark:border-gray-950">
              <Crown size={10} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* User Info Hook */}
        <div className="hidden flex-col items-start lg:flex text-left">
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Welcome,</p>
          <div className="flex items-center gap-1">
            <span className="max-w-28 truncate text-sm font-bold text-gray-900 dark:text-white">
              {user?.full_name?.split(" ")[0] ?? "Explorer"}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Premium Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-3 w-72 origin-top-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Dropdown
                isOpen={true}
                onClose={closeDropdown}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white/95 p-2.5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95 shadow-gray-200/50 dark:shadow-none"
              >
                {/* Profile Header Card */}
                <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-2 pb-3 pt-1 dark:border-white/5">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gray-100 dark:border-white/10">
                    <Image
                      width={40}
                      height={40}
                      src={user?.avatar_url ?? "/images/user/owner.jpg"}
                      alt={user?.full_name ?? "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden min-w-0">
                    <span className="truncate text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span className="truncate">{user?.full_name ?? "Explorer"}</span>
                      {isPro && (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] px-1.5 py-0.2 rounded-sm uppercase font-black tracking-widest shrink-0">
                          PRO
                        </span>
                      )}
                    </span>
                    <span className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                      {user?.email ?? ""}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu Items */}
                <div className="space-y-0.5">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={closeDropdown}
                      className="flex items-center justify-between w-full rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge}
                    </Link>
                  ))}
                </div>

                {/* Footer / Logout */}
                <div className="mt-1.5 border-t border-gray-100 pt-1.5 dark:border-white/5">
                  <button
                    onClick={async () => {
                      closeDropdown();
                      await logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </Dropdown>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
