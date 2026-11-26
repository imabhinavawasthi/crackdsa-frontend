'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Award, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap,
  Check
} from 'lucide-react';
import { SocialIcon } from '@/components/common/SocialIcons';

// Vector Company Logos
const CompanyLogos = {
  Amazon: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <path
        d="M13.92 14.5c-2.48 1.83-6.07 2.8-9.19 2.8-4.37 0-8.31-1.63-11.29-4.36-.23-.21-.03-.5.25-.34 3.22 1.86 7.18 2.98 11.29 2.98 2.77 0 5.83-.65 8.56-2.02.42-.21.77.29.38.94zm1.18-.8c-.31-.4-.6-1.57-.6-2.17 0-.25.13-.33.32-.19 1.05.8 2.76.95 3.73.18.2-.16.36-.07.24.15-.65 1.15-2.06 2.45-3.69 2.03z"
        fill="#FF9900"
      />
      <path
        d="M13.8 8.8c-.2-1.8-1.5-3.1-3.3-3.1-2 0-3.5 1.6-3.5 3.7 0 .8.3 1.5.7 2 .1.1.1.3 0 .4l-1.2 1.3c-.1.1-.3.1-.4 0-.7-.9-1.1-2.1-1.1-3.4 0-3.1 2.4-5.6 5.5-5.6 3.1 0 5.5 2.5 5.5 5.6v2.1c0 .2-.2.4-.4.4h-1.5c-.2 0-.4-.2-.4-.4V8.8z"
        fill="currentColor"
      />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V9.91H5.06v8.59h2.8z" />
    </svg>
  ),
  Zeta: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#00D285" />
      <path d="M7 7h10l-6.5 10H17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Zscaler: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#0072CE" />
      <path d="M7.5 8h9l-5.5 8h5.5" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Zomato: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#E23744" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontStyle="italic">z</text>
    </svg>
  ),
  Gameskraft: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#FF5E14" />
      <path d="M7 12l5-5 5 5-5 5-5-5z" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="2" fill="#FF5E14" />
    </svg>
  ),
  GeeksforGeeks: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#2F8D46" />
      <path d="M8.5 9.5a2.5 2.5 0 0 0 0 5h2M15.5 9.5a2.5 2.5 0 0 1 0 5h-2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  PWSkills: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#1C1E24" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#F9BC02" fontSize="10" fontWeight="900">PW</text>
    </svg>
  ),
  NewtonSchool: () => (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none">
      <rect width="24" height="24" rx="5" fill="#5B21B6" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">N</text>
    </svg>
  ),
};

interface AbhinavAwasthiCardProps {
  className?: string;
  showTitle?: boolean;
}

export function AbhinavAwasthiCard({ className = '', showTitle = false }: AbhinavAwasthiCardProps) {
  const avatarUrl = "https://assets.leetcode.com/users/abhinavawasthi/avatar_1717828974.png";
  const linkedinUrl = "https://www.linkedin.com/in/abhinavawasthi01/";
  const youtubeUrl = "https://www.youtube.com/@AbhinavAwasthi";

  const stats = [
    {
      label: 'ICPC Regional Rank',
      value: 'AIR 57',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400',
    },
    {
      label: 'LeetCode & CodeChef',
      value: 'Top 1%',
      sublabel: 'Global & India Rank',
      icon: Award,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400',
    },
    {
      label: 'Codeforces Rating',
      value: 'Candidate Master',
      sublabel: 'Rating 1900+',
      icon: Zap,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400',
    },
    {
      label: 'Students Mentored',
      value: '5,000+',
      sublabel: 'Taught & Guided',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400',
    },
  ];

  const crackedCompanies = [
    { name: 'Amazon', logo: CompanyLogos.Amazon },
    { name: 'Zscaler', logo: CompanyLogos.Zscaler },
    { name: 'Zomato', logo: CompanyLogos.Zomato },
    { name: 'Gameskraft', logo: CompanyLogos.Gameskraft },
    { name: 'Zeta (Directi)', logo: CompanyLogos.Zeta },
    { name: 'LinkedIn', logo: CompanyLogos.LinkedIn },
  ];

  const workAndMentorship = [
    {
      category: 'Software Engineering Experience',
      items: [
        {
          name: 'Zeta (Directi)',
          role: 'SDE-2 (Current)',
          logo: CompanyLogos.Zeta,
          desc: 'High-scale distributed fintech & payments infrastructure',
        },
        {
          name: 'LinkedIn',
          role: 'Ex-Software Engineer',
          logo: CompanyLogos.LinkedIn,
          desc: 'Large-scale distributed systems and data pipelines',
        },
      ],
    },
    {
      category: 'Mentorship & Teaching Experience',
      items: [
        {
          name: 'GeeksforGeeks',
          role: 'Ex-DSA Mentor',
          logo: CompanyLogos.GeeksforGeeks,
          desc: 'Trained thousands of engineers in algorithms & system design',
        },
        {
          name: 'PW Skills (PhysicsWallah)',
          role: 'Ex-DSA Mentor',
          logo: CompanyLogos.PWSkills,
          desc: 'Lead instructor for competitive programming & interview batches',
        },
        {
          name: 'Newton School',
          role: 'Ex-DSA Mentor',
          logo: CompanyLogos.NewtonSchool,
          desc: '1-on-1 interview prep & mock interviews for tech roles',
        },
      ],
    },
  ];

  return (
    <div className={`rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xs transition-colors ${className}`}>
      {showTitle && (
        <div className="mb-6">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            INSTRUCTOR & MENTOR
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Meet your instructor
          </h2>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with Glow and Verified Badge */}
        <div className="relative shrink-0">
          <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md">
            <Image
              src={avatarUrl}
              alt="Abhinav Awasthi"
              width={112}
              height={112}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md border-2 border-white dark:border-gray-900">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                Abhinav Awasthi
              </h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                SDE-2 @ Zeta (Directi) • Ex-LinkedIn
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                Founder & Lead Mentor @ CrackDSA
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <SocialIcon name="linkedin" size={14} />
                <span>LinkedIn</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
              >
                <SocialIcon name="youtube" size={14} className="text-red-600 dark:text-red-500" />
                <span>YouTube</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            </div>
          </div>

          <p className="mt-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Passionate software engineer and educator with deep experience building mission-critical distributed systems at LinkedIn and Zeta. Taught and mentored over 5,000+ students with multiple placements into FAANG and tier-1 product unicorns.
          </p>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-850/50 p-3.5 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`flex size-7 items-center justify-center rounded-lg ${s.color}`}>
                  <Icon className="size-4" />
                </div>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {s.value}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {s.label}
              </p>
              {s.sublabel && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.sublabel}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Cracked Interview Offers Banner */}
      <div className="mt-6 rounded-2xl border border-emerald-500/25 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/30 dark:via-teal-950/15 dark:to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
            <Check className="size-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Cracked Top Tech Interviews & Offers
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3.5 leading-relaxed">
          Cleared rigorous algorithmic and system design interview loops across top product companies:
        </p>

        {/* Company Logos Grid */}
        <div className="flex flex-wrap gap-2.5">
          {crackedCompanies.map((c) => {
            const Logo = c.logo;
            return (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-white/90 dark:bg-gray-850/90 px-3 py-1.5 shadow-xs backdrop-blur-xs transition-colors hover:border-gray-300 dark:hover:border-gray-600"
              >
                <Logo />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Work & Mentorship Experience Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5">
        {workAndMentorship.map((group) => (
          <div key={group.category} className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {group.category}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {group.items.map((item) => {
                const Logo = item.logo;
                return (
                  <div
                    key={item.name}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/60 dark:bg-gray-850/40 p-3"
                  >
                    <div className="mt-0.5">
                      <Logo />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                          {item.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AbhinavAwasthiCard;
