"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronDown,
  LayoutDashboard
} from "lucide-react";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="group flex items-center gap-3 rounded-xl p-1.5 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 dropdown-toggle"
      >
        {/* Avatar with Premium Ring & Presence */}
        <div className="relative h-10 w-10 flex-shrink-0">
          <div className="absolute -inset-0.5 animate-pulse bg-linear-to-tr from-brand-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full blur-[2px]" />
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
        </div>

        {/* User Info Hook */}
        <div className="hidden flex-col items-start lg:flex text-left">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Welcome,</p>
          <div className="flex items-center gap-1">
            <span className="max-w-[100px] truncate text-sm font-bold text-gray-900 dark:text-white">
              {user?.full_name?.split(" ")[0] ?? "Explorer"}
            </span>
            <ChevronDown 
              size={14} 
              className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>
      </button>

      {/* Premium Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-3 w-64 origin-top-right">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Dropdown
                isOpen={true} // Controlled by AnimatePresence
                onClose={closeDropdown}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95 shadow-gray-200/50 dark:shadow-none"
              >
                {/* Profile Header Card */}
                <div className="mb-3 flex items-center gap-3 border-b border-gray-100 px-2 pb-4 pt-1 dark:border-white/5">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-gray-100 dark:border-white/10">
                    <Image
                      width={48}
                      height={48}
                      src={user?.avatar_url ?? "/images/user/owner.jpg"}
                      alt={user?.full_name ?? "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      {user?.full_name ?? "—"}
                    </span>
                    <span className="truncate text-[10px] text-gray-500 dark:text-gray-400">
                      {user?.email ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <DropdownItem
                    onItemClick={closeDropdown}
                    tag="a"
                    href="/"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <LayoutDashboard size={18} className="text-gray-400 group-hover:text-brand-500" />
                    Dashboard
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    tag="a"
                    href="/profile"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <User size={18} className="text-gray-400 group-hover:text-brand-500" />
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    tag="a"
                    href="/settings"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <Settings size={18} className="text-gray-400 group-hover:text-brand-500" />
                    Account Settings
                  </DropdownItem>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    tag="a"
                    href="/support"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <HelpCircle size={18} className="text-gray-400 group-hover:text-brand-500" />
                    Help & Support
                  </DropdownItem>
                </div>

                {/* Footer / Logout */}
                <div className="mt-2 border-t border-gray-100 pt-2 dark:border-white/5">
                  <button
                    onClick={async () => {
                      closeDropdown();
                      await logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Sign out
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
