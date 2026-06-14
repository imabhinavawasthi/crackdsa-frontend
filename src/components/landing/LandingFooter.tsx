"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { FOOTER_SOCIAL_LINKS } from "@/constants/landing";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
          >
            <Code2 className="h-6 w-6 text-brand-400" />
            <span className="text-lg font-bold tracking-tight">CrackDSA</span>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <a
              href="mailto:support@crackdsa.com"
              className="transition-colors hover:text-white"
            >
              Contact
            </a>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {FOOTER_SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-400 transition-all duration-300 hover:border-white/[0.12] hover:text-white hover:bg-white/[0.05]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/[0.04] pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CrackDSA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
