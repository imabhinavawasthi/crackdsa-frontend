"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Building,
  Code,
  Sparkles,
  Loader2,
  Calendar,
  Layers,
  ExternalLink,
  Edit2,
  TrendingUp,
  Bookmark,
  Notebook,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Brand-accurate inline SVG Icons
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function ProfilePage() {
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading || !isLoggedIn || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Loading profile data...</p>
      </div>
    );
  }

  const isPro = user?.is_pro_active || false;

  // Calculate profile completeness based on user fields
  const fields = [
    user.full_name,
    user.college,
    user.graduation_year,
    user.branch,
    user.codeforces_handle,
    user.social_links?.github,
    user.social_links?.linkedin,
    user.social_links?.twitter
  ];
  
  const completedFields = fields.filter(field => field && String(field).trim() !== "");
  const completenessPercentage = Math.round((completedFields.length / fields.length) * 100);

  return (
    <div className="relative mx-auto max-w-7xl space-y-8 pb-20 pt-2">
      {/* Dynamic Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(70,95,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(70,95,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" />
        <motion.div animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }} className="absolute left-10 top-0 h-96 w-96 rounded-full bg-brand-500/5 blur-[120px]" />
        <motion.div animate={{ x: [0, -15, 15, 0], y: [0, 10, -15, 0] }} transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }} className="absolute right-10 top-32 h-80 w-80 rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Header Profile Summary */}
      <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-gray-950 sm:p-8">
        <div className="absolute inset-0 bg-linear-to-br from-brand-500/[0.02] via-transparent to-indigo-500/[0.02]" />
        <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            {/* Avatar block with premium aura */}
            <div className="relative h-24 w-24 sm:h-28 sm:w-28">
              <div className="absolute -inset-1 animate-pulse rounded-full bg-linear-to-tr from-brand-500 via-violet-500 to-indigo-500 opacity-60 blur-[3px]" />
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-gray-100 dark:border-gray-950">
                <Image src={user.avatar_url ?? "/images/user/owner.jpg"} alt={user.full_name} width={112} height={112} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">{user.full_name}</h1>
                {isPro && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    <Sparkles size={11} className="fill-current" />
                    Pro
                  </span>
                )}
              </div>
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 sm:justify-start">
                <Mail size={14} />
                {user.email}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-white/5 dark:text-gray-400">
                  Role: <span className="capitalize">{user.roles?.[0] || "Student"}</span>
                </span>
                {user.provider && (
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-white/5 dark:text-gray-400">
                    Sign-in: <span className="capitalize">{user.provider}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-5 sm:flex">
            {/* Profile Completion Indicator */}
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Profile Strength</span>
                <span className={`text-xs font-extrabold ${completenessPercentage === 100 ? "text-emerald-500" : "text-brand-500"}`}>
                  {completenessPercentage === 100 ? "Complete" : `${completenessPercentage}%`}
                </span>
              </div>
              <div className="relative flex items-center justify-center h-9 w-9">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    className="stroke-gray-100 dark:stroke-gray-800"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    className={`${completenessPercentage === 100 ? "stroke-emerald-500" : "stroke-brand-500"} transition-all duration-500 ease-out`}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 15}`}
                    strokeDashoffset={`${2 * Math.PI * 15 * (1 - completenessPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                {completenessPercentage === 100 ? (
                  <span className="text-emerald-500 font-bold text-xs">✓</span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-550 dark:text-gray-400">{completenessPercentage}%</span>
                )}
              </div>
            </div>

            <Link href="/profile/edit" className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600">
              <Edit2 size={16} />
              Edit Profile
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Profile Completeness Callout */}
      {completenessPercentage < 100 && (
        <motion.div 
          {...fadeUp} 
          transition={{ duration: 0.4, delay: 0.01 }} 
          className="relative overflow-hidden rounded-[1.5rem] border border-amber-500/25 bg-amber-500/[0.04] p-5 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start gap-4">
            {/* Circular Progress Ring */}
            <div className="relative flex items-center justify-center h-12 w-12 shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-gray-200 dark:stroke-gray-800"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-amber-500 transition-all duration-500 ease-out"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - completenessPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">{completenessPercentage}%</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-500" />
                Complete Your Profile
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Your profile details are only <span className="font-extrabold text-amber-600 dark:text-amber-400">{completenessPercentage}%</span> complete. Fill in your college details, major, and developer handles to strengthen your profile.
              </p>
            </div>
          </div>
          
          <Link href="/profile/edit" className="relative z-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-amber-500/15 transition-all whitespace-nowrap self-stretch sm:self-auto">
            <span>Complete Profile</span>
            <Edit2 size={12} />
          </Link>
        </motion.div>
      )}

      {/* Quick Dashboard Links */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.02 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/progress" className="group flex items-center justify-between rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-500/30 dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-brand-500/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">My Progress</p>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Track your journey</p>
            </div>
          </div>
        </Link>
        
        <Link href="/profile/bookmarks" className="group flex items-center justify-between rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-500/30 dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-brand-500/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <Bookmark size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Bookmarks</p>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Saved problems</p>
            </div>
          </div>
        </Link>
        
        <Link href="/profile/notes" className="group flex items-center justify-between rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-500/30 dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-brand-500/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <Notebook size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">My Notes</p>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Your notations</p>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile and Academic Details Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Section 1: Basic Info */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500"><UserIcon size={16} /></span>
              Account Information
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Full Name</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <UserIcon size={16} className="text-gray-400" />
                  {user.full_name || "Not provided"}
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Mail size={16} className="text-gray-400" />
                  {user.email}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Academic Info */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><GraduationCap size={16} /></span>
              Academic Details
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">College / University</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Building size={16} className="text-gray-400" />
                  {user.college || "Not provided"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Graduation Year</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    <Calendar size={16} className="text-gray-400" />
                    {user.graduation_year || "Not provided"}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Engineering Branch</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    <Layers size={16} className="text-gray-400" />
                    {user.branch || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Integration Links & Subscription Section */}
        <div className="space-y-6">
          {/* Section 3: Professional Profiles */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500"><Code size={16} /></span>
              Developer Accounts
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Codeforces Handle</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Code size={16} className="text-gray-400" />
                  {user.codeforces_handle ? (
                    <a href={`https://codeforces.com/profile/${user.codeforces_handle}`} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline inline-flex items-center gap-1">
                      {user.codeforces_handle} <ExternalLink size={12} />
                    </a>
                  ) : "Not connected"}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">GitHub Profile</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <GithubIcon className="h-4 w-4 text-gray-400" />
                  {user.social_links?.github ? (
                    <a href={user.social_links.github} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline inline-flex items-center gap-1">
                      {user.social_links.github.replace("https://github.com/", "")} <ExternalLink size={12} />
                    </a>
                  ) : "Not connected"}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">LinkedIn Profile</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <LinkedinIcon className="h-4 w-4 text-gray-400" />
                  {user.social_links?.linkedin ? (
                    <a href={user.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline inline-flex items-center gap-1">
                      LinkedIn <ExternalLink size={12} />
                    </a>
                  ) : "Not connected"}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Twitter / X</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <TwitterIcon className="h-4 w-4 text-gray-400" />
                  {user.social_links?.twitter ? (
                    <a href={user.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline inline-flex items-center gap-1">
                      Twitter <ExternalLink size={12} />
                    </a>
                  ) : "Not connected"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Subscription & Access Details (Read Only Link) */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }} className="relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
            {isPro && <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/[0.03] to-transparent" />}
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500"><Sparkles size={16} /></span>
              Account Subscription
            </h2>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                Manage your PRO membership, check course unlock calendars, and view billing renewal cycles.
              </p>
              
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.01]">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Current Plan</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{isPro ? "PRO Subscription" : "Free Explorer"}</p>
                </div>
                <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${isPro ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" : "bg-gray-100 text-gray-500 dark:bg-white/5"}`}>
                  {isPro ? "Premium" : "Standard"}
                </span>
              </div>

              <Link href="/profile/subscription" className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-brand-500 hover:text-white dark:bg-gray-800/50 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all group cursor-pointer">
                <span>View Subscription Details</span>
                <ExternalLink size={13} className="text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Action triggers mobile */}
        <div className="flex flex-col gap-3 sm:hidden">
          <Link href="/profile/edit" className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600">
            <Edit2 size={16} />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
