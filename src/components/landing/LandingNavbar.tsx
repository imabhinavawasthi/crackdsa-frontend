"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Compass, FileText, BookOpen, Layers, Menu, X, ArrowRight, Brain, Video } from "lucide-react";
import Logo from "@/components/common/Logo";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Learn DSA", href: "/courses", icon: BookOpen },
    { label: "Live Classes", href: "/live-classes", icon: Video },
    { label: "DSA Sheets", href: "/dsa-sheet", icon: FileText, badge: "New" },
    { label: "Practice Ground", href: "/practice", icon: Layers },
    { label: "Masterclasses", href: "/masterclasses", icon: Compass },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/85 dark:bg-[#080C14]/85 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-3 px-5 sm:px-6"
            : "bg-transparent py-2 px-3"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo href="/" priority width={140} height={32} />
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 dark:bg-white/3 border border-gray-200/80 dark:border-white/8 p-1.5 rounded-xl backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 transition-all group"
                >
                  <Icon size={14} className="text-gray-400 dark:text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black bg-brand-500 text-white rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggleButton />

            <Link
              href="/login"
              className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/roadmap/onboarding"
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-950 text-xs font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <Sparkles size={14} className="text-amber-400 dark:text-brand-600" />
              <span>AI Roadmap</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Right Bar (Theme Toggle + Menu Icon) */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2 pb-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-brand-500 dark:text-brand-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-brand-500 text-white rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/roadmap"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-950 text-sm font-extrabold"
              >
                <Sparkles size={16} />
                <span>Generate AI Roadmap</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
