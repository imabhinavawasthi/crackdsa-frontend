"use client";

import React from "react";
import Link from "next/link";
import { Mail, ExternalLink, MapPin, Building2, Globe, Sparkles } from "lucide-react";
import Logo from "@/components/common/Logo";
import { SOCIALS as SOCIALS_CONST, CONTACT_INFO } from "@/constants/contact";

// ─── Inline Social SVGs ───────────────────────────────────────────────────────

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

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.59-3.27 3.6-1.5 4.35-1.76 4.84-1.77.11 0 .35.03.5.16.12.1.16.24.18.34.02.06.03.18.02.28z" />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORM_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/courses" },
  { label: "DSA Course", href: "/course/dsa" },
  { label: "Progress", href: "/progress" },
];

const PRACTICE_LINKS = [
  { label: "DSA Sheets", href: "/dsa-sheet" },
  { label: "Newbie to Expert Sheet", href: "/cp/newbie-to-expert", badge: "Popular" },
  { label: "Topicwise", href: "/practice/topics" },
  { label: "Companywise", href: "/practice/companies" },
  { label: "Contest Editorials", href: "/contests" },
];

const COMPANY_LINKS = [
  { label: "Community", href: "/community" },
  { label: "Refer & Earn", href: "/refer-earn" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const SOCIALS = [
  { icon: <IconYoutube />, href: SOCIALS_CONST.youtube.crackdsa, label: "YouTube" },
  { icon: <IconLinkedin />, href: SOCIALS_CONST.linkedin.crackdsa, label: "LinkedIn" },
  { icon: <IconTelegram />, href: SOCIALS_CONST.telegram, label: "Telegram" },
  { icon: <IconWhatsapp />, href: SOCIALS_CONST.whatsapp.channel, label: "WhatsApp" },
];

// ─── Sub-component: FooterColumn ──────────────────────────────────────────────

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string; badge?: string; external?: boolean }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map(({ label, href, badge, external }) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
              >
                <span>{label}</span>
                <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
            ) : (
              <Link
                href={href}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
              >
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 border border-brand-200/50 dark:border-brand-500/30">
                    {badge}
                  </span>
                )}
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
  return (
    <footer className="mt-auto border-t border-gray-200/90 dark:border-gray-800 bg-gradient-to-b from-white via-gray-50/50 to-gray-100/70 dark:from-gray-900 dark:via-gray-950/60 dark:to-gray-950 text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 space-y-12">

        {/* 1. Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Col 1 & 2: Brand, Value Proposition & Sister Platform Card */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo href="/" width={150} height={36} />
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              The premier platform for mastering Data Structures &amp; Algorithms, curated contest problem sheets, CS fundamentals, and accelerating your tech career with real interview mentorship.
            </p>

            {/* Social Links */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Connect with our Community
              </span>
              <div className="flex items-center gap-2">
                {SOCIALS.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/80 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 border border-gray-200 dark:border-gray-700/80 shadow-2xs hover:scale-105 transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Sister Platform Card */}
            <div className="pt-2">
              <a
                href="https://coding75.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/5 hover:border-blue-500/40 hover:bg-blue-50/80 dark:hover:bg-blue-500/10 transition-all max-w-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Sister Platform: coding75.com
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Learn Agentic AI and Latest Tech 🚀
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 3: Platform */}
          <FooterColumn title="Platform" links={PLATFORM_LINKS} />

          {/* Col 4: Practice */}
          <FooterColumn title="Practice" links={PRACTICE_LINKS} />

          {/* Col 5: Company */}
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>

        {/* 2. Corporate & Office Addresses Strip */}
        <div className="p-6 rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Maa Lalita Edtech Private Limited
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Parent entity of crackDSA &amp; coding75
                </p>
              </div>
            </div>

            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-800/80 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all self-start sm:self-auto"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{CONTACT_INFO.email}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400 pt-1">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-200">Regional Office</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Indiranagar, Bangalore - 208021
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-200">Registered Office</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Kanpur, Uttar Pradesh - 208021
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar: Copyright & Sister Platform Link */}
        <div className="pt-4 border-t border-gray-200/80 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              © 2026 crackDSA™ • A part of Maa Lalita Edtech Private Limited. All rights reserved.
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Handcrafted for engineers preparing for FAANG, Top Tier-1 Tech &amp; Global Product Companies.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Sister Platform:</span>
            <a
              href="https://coding75.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <span>coding75.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default AppFooter;
