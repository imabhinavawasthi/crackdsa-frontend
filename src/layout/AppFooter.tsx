"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowUpRight, ExternalLink } from "lucide-react";

// ─── Inline social SVGs (lucide doesn't include brand icons) ─────────────────

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Courses",    href: "/courses" },
  { label: "Learn DSA",  href: "/learn" },
  { label: "My Roadmap", href: "/roadmap" },
  { label: "Progress",   href: "/progress" },
];

const PRACTICE_LINKS = [
  { label: "Practice DSA",  href: "/practice" },
  { label: "DSA Sheets",    href: "/dsa-sheet" },
  { label: "Topics",        href: "/practice/topics" },
  { label: "Companies",     href: "/practice/companies" },
  { label: "Masterclasses", href: "/masterclasses" },
];

const COMPANY_LINKS = [
  { label: "Community",      href: "/community" },
  { label: "Refer & Earn",   href: "/refer-earn" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use",   href: "/terms" },
];

const SOCIALS = [
  { icon: <IconGithub />,   href: "https://github.com",   label: "GitHub" },
  { icon: <IconTwitter />,  href: "https://twitter.com",  label: "Twitter" },
  { icon: <IconLinkedin />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <IconYoutube />,  href: "https://youtube.com",  label: "YouTube" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map(({ label, href, external }) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
              >
                {label}
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : (
              <Link
                href={href}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── AppFooter ────────────────────────────────────────────────────────────────

const AppFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="px-4 md:px-6 py-10 md:py-12">

        {/* Top grid: brand + 3 link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand column — spans full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/logo.svg"
                alt="CrackDSA"
                width={130}
                height={34}
                className="dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="CrackDSA"
                width={130}
                height={34}
                className="hidden dark:block"
              />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Master data structures &amp; algorithms with structured courses, curated sheets, and real interview prep.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 border border-gray-200 dark:border-gray-700 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Platform" links={QUICK_LINKS} />
          <FooterColumn title="Practice" links={PRACTICE_LINKS} />
          <FooterColumn title="Company"  links={COMPANY_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            © {year} CrackDSA. All rights reserved.
          </p>
          <a
            href="mailto:hello@crackdsa.com"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <Mail size={12} />
            hello@crackdsa.com
          </a>
        </div>

      </div>
    </footer>
  );
};

export default AppFooter;
