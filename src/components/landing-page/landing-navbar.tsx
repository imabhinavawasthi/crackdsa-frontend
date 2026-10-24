"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Trophy,
  Layers,
  FileText,
  BookOpen,
  Briefcase,
  Sparkles,
  Rocket,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown,
  GitFork,
  CheckCircle2,
  Video,
  Users,
  Compass,
  Building2,
  Calendar,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useAuth } from "@/context/AuthContext";
import { getGoogleAuthUrl } from "@/functions/auth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isPro = !!user?.is_pro_active;
  const pathname = usePathname();

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await logout();
      window.location.reload();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleLogIn = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("crackdsa_login_redirect", pathname || "/dashboard");
      window.location.href = getGoogleAuthUrl();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/85 dark:bg-gray-950/85 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ─── Left: Brand Logo & Desktop Nav ───────────────────────── */}
        <div className="flex items-center gap-7">
          <Logo href="/" width={138} height={34} className="hover:opacity-90 transition-opacity" />

          {/* Desktop Navigation Mega Menus */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
            
            {/* 1. Learn DSA Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors focus:outline-none cursor-pointer">
                <span>Learn DSA</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-84 p-2 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50">
                <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-500">
                    Data Structures &amp; Algorithms
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Curated sheets, topic-wise practice &amp; daily editorials
                  </p>
                </div>
                <div className="py-1 space-y-0.5">
                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/course/dsa"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <Code2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">DSA Master Curriculum</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Complete topic breakdown from Arrays to DP</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/dsa-sheet"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <Layers className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">Curated DSA Sheets</p>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                            HOT
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">SDE Sheet, Newbie to Expert, Blind 75</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/practice/topics"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <GitFork className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Topic-wise Practice</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Filtered problem ladders with progress tracking</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/practice/companies"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <Building2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Company-wise Practice</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Target Google, Amazon, Microsoft questions</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/contests"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <Trophy className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Contest Solutions &amp; Editorials</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">LeetCode, Codeforces &amp; CodeChef archives</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Interview Prep Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors focus:outline-none cursor-pointer">
                <span>Interview Kit</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50">
                <div className="p-2.5 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-500">
                    Interview Preparation Tools
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    CS notes, resume optimizer &amp; mock interviews
                  </p>
                </div>
                <div className="py-1 space-y-0.5">
                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/cs-fundamentals"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">CS Fundamentals</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">OS, DBMS, Computer Networks &amp; OOPs notes</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/resume"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <FileText className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">ATS Resume Builder</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            FREE
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">FAANG-vetted clean LaTeX export &amp; keyword scoring</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/courses"
                      className="flex items-start gap-3 p-2.5 text-xs font-medium cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Explore All Courses</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">DSA, System Design &amp; Competitive Programming</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Live Classes Direct Link */}
            <Link
              href="/live-sessions"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer group"
            >
              <Video className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Live Classes</span>
            </Link>

            {/* 4. Masterclasses Link */}
            <Link
              href="/masterclasses"
              className="flex items-center gap-1 px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-gray-400" />
              <span>Masterclasses</span>
            </Link>

            {/* 5. Community Link */}
            <Link
              href="/community"
              className="flex items-center gap-1 px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span>Community</span>
            </Link>
          </nav>
        </div>

        {/* ─── Right: CTA Buttons, Theme Toggle & Auth State ─────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Start Free Button */}
          {isLoggedIn && <Link
            href="/dsa-sheet"
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800/70 border border-gray-200 dark:border-gray-800 transition-all hover:border-brand-500/30"
          >
            <span>Start Learning for Free</span>
          </Link>}

          {/* CrackDSA Pro High-Conversion Pill */}
          <Link
            href={isPro ? "/dashboard" : "/pro"}
            className="group relative inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden shrink-0"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="tracking-tight font-black">{isPro ? "View Pro" : "CrackDSA Pro"}</span>
          </Link>

          {/* Theme Toggle Button */}
          <div className="hidden sm:flex items-center">
            <ThemeToggleButton />
          </div>

          {/* User Profile Avatar / Login Button */}
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <button
                  className={cn(
                    "relative rounded-full transition-all focus:outline-none p-0.5",
                    isPro
                      ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background hover:ring-amber-400"
                      : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-brand-500/50"
                  )}
                  aria-label="User profile menu"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user?.full_name?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  {isPro && (
                    <span
                      className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white dark:ring-gray-950 shadow-xs tracking-wider uppercase leading-tight"
                      title="CrackDSA Pro Active"
                    >
                      PRO
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50">
                <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user?.full_name || "User"}
                    </p>
                    {isPro && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 uppercase tracking-wider">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || ""}
                  </p>
                </div>
                <div className="pt-1 space-y-0.5">
                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200"
                    >
                      <Rocket className="w-3.5 h-3.5 text-brand-500" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/progress"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200"
                    >
                      <Trophy className="w-3.5 h-3.5 text-orange-500" />
                      <span>My Progress</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 rounded-xl">
                    <Link
                      href={isPro ? "/profile/subscription" : "/pro"}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isPro ? "Manage Subscription" : "CrackDSA Pro Pass"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold cursor-pointer rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-xl text-xs font-bold gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
                  <DialogHeader className="items-center text-center">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <Logo href="/" width={140} height={36} />
                      </div>
                      <DialogTitle className="text-xl font-black text-gray-900 dark:text-white">
                        Welcome to CrackDSA 🚀
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                        Sign in to track your problem sheets, attend live mentor sessions, and access interview preparation notes.
                      </DialogDescription>
                      <div className="w-full mt-6">
                        <button
                          onClick={handleLogIn}
                          type="button"
                          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-bold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 488 512">
                            <path
                              fill="currentColor"
                              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            />
                          </svg>
                          <span>Continue with Google</span>
                        </button>
                      </div>
                      <p className="mt-5 text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="text-gray-700 dark:text-gray-300 underline hover:text-brand-500"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-gray-700 dark:text-gray-300 underline hover:text-brand-500"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-xs"
              >
                <span>Dashboard</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Navigation Drawer ─────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Navigation</span>
            <ThemeToggleButton />
          </div>

          <nav className="flex flex-col space-y-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
            <Link
              href="/course/dsa"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <Code2 className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Learn DSA Curriculum</span>
            </Link>

            <Link
              href="/dsa-sheet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Curated Problem Sheets</span>
            </Link>

            <Link
              href="/practice/topics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <GitFork className="w-4 h-4 text-violet-500 shrink-0" />
              <span>Topic-wise Practice</span>
            </Link>

            <Link
              href="/practice/companies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Company-wise Practice</span>
            </Link>

            <Link
              href="/contests"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Contests &amp; Editorials</span>
            </Link>

            <Link
              href="/cs-fundamentals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
              <span>CS Fundamentals Notes</span>
            </Link>

            <Link
              href="/resume"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>ATS Resume Builder (Free)</span>
            </Link>

            <Link
              href="/live-sessions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <Video className="w-4 h-4 text-red-500 shrink-0" />
              <span>Live Classes &amp; Doubts</span>
            </Link>

            <Link
              href="/community"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80"
            >
              <Users className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Community</span>
            </Link>
          </nav>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <Link
              href={isPro ? "/dashboard" : "/pro"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPro ? "View Pro Dashboard" : "Get CrackDSA Pro"}</span>
            </Link>

            {!isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Your Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
