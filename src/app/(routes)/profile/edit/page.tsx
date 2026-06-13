"use client";

import React, { useEffect, useState, useTransition, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/functions/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Building,
  Code,
  Sparkles,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar,
  Layers,
  ArrowLeft,
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

interface ProfileFormState {
  full_name: string;
  college: string;
  graduation_year: string;
  branch: string;
  codeforces_handle: string;
  github: string;
  linkedin: string;
  twitter: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function EditProfilePage() {
  const { user, isLoading, isLoggedIn, refetch } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  const [form, setForm] = useState<ProfileFormState>({
    full_name: "",
    college: "",
    graduation_year: "",
    branch: "",
    codeforces_handle: "",
    github: "",
    linkedin: "",
    twitter: "",
  });

  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const syncFormWithUser = useCallback(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        college: user.college || "",
        graduation_year: user.graduation_year || "",
        branch: user.branch || "",
        codeforces_handle: user.codeforces_handle || "",
        github: user.social_links?.github || "",
        linkedin: user.social_links?.linkedin || "",
        twitter: user.social_links?.twitter || "",
      });
      setStatusMessage(null);
    }
  }, [user]);

  useEffect(() => {
    syncFormWithUser();
  }, [syncFormWithUser]);

  if (isLoading || !isLoggedIn || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Loading your data...</p>
      </div>
    );
  }

  const handleFieldChange = (key: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!form.full_name.trim()) {
      setStatusMessage({ type: "error", text: "Full Name is required." });
      return;
    }

    startTransition(async () => {
      try {
        await updateUserProfile({
          full_name: form.full_name.trim(),
          college: form.college.trim(),
          graduation_year: form.graduation_year,
          branch: form.branch,
          codeforces_handle: form.codeforces_handle.trim(),
          social_links: {
            github: form.github.trim(),
            linkedin: form.linkedin.trim(),
            twitter: form.twitter.trim(),
          },
        });

        await refetch();
        setStatusMessage({ type: "success", text: "Profile changes saved successfully! Redirecting..." });
        
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } catch (err: any) {
        console.error(err);
        setStatusMessage({ type: "error", text: err?.message || "Failed to save profile. Please try again." });
      }
    });
  };

  return (
    <div className="relative mx-auto max-w-4xl space-y-8 pb-20 pt-2">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(70,95,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(70,95,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]" />
        <motion.div animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }} className="absolute left-10 top-0 h-96 w-96 rounded-full bg-brand-500/5 blur-[120px]" />
      </div>

      <div className="flex items-center justify-between">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-500 dark:text-gray-400">
          <ArrowLeft size={16} />
          Back to Profile
        </Link>
      </div>

      <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-gray-950 sm:p-8">
        <div className="absolute inset-0 bg-linear-to-br from-brand-500/[0.02] via-transparent to-indigo-500/[0.02]" />
        <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 dark:border-gray-950">
              <Image src={user.avatar_url ?? "/images/user/owner.jpg"} alt={user.full_name} width={96} height={96} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">Edit Profile</h1>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Update your personal and academic details</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/profile" className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
              Cancel
            </Link>
            <button onClick={handleSave} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 disabled:opacity-60">
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </motion.section>

      <AnimatePresence mode="wait">
        {statusMessage && (
          <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${statusMessage.type === "success" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-400"}`}>
            {statusMessage.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
            <p className="text-sm font-bold">{statusMessage.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
        {/* Section 1: Basic Info */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
          <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500"><UserIcon size={16} /></span>
            Account Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Full Name</label>
              <div className="relative">
                <input type="text" required value={form.full_name} onChange={(e) => handleFieldChange("full_name", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white" placeholder="Enter your name" />
                <UserIcon size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Email Address</label>
              <div className="relative">
                <input type="email" disabled value={user.email} className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pl-10 text-sm font-semibold text-gray-500 outline-hidden dark:border-white/5 dark:bg-white/[0.02]" />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">College / University</label>
              <div className="relative">
                <input type="text" value={form.college} onChange={(e) => handleFieldChange("college", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white" placeholder="Search or type college/university" />
                <Building size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Graduation Year</label>
                <div className="relative">
                  <select value={form.graduation_year} onChange={(e) => handleFieldChange("graduation_year", e.target.value)} className="w-full appearance-none rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white dark:bg-gray-950">
                    <option value="">Select Year</option>
                    {Array.from({ length: 11 }).map((_, i) => {
                      const year = new Date().getFullYear() - 4 + i;
                      return <option key={year} value={String(year)}>{year}</option>;
                    })}
                  </select>
                  <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Engineering Branch / Major</label>
                <div className="relative">
                  <select value={form.branch} onChange={(e) => handleFieldChange("branch", e.target.value)} className="w-full appearance-none rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white dark:bg-gray-950">
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Other">Other Branch</option>
                  </select>
                  <Layers size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Professional Profiles */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50">
          <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500"><Code size={16} /></span>
            Developer Accounts
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Codeforces Handle</label>
              <div className="relative">
                <input type="text" value={form.codeforces_handle} onChange={(e) => handleFieldChange("codeforces_handle", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white" placeholder="Codeforces handle" />
                <Code size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">GitHub Profile Link</label>
              <div className="relative">
                <input type="text" value={form.github} onChange={(e) => handleFieldChange("github", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white" placeholder="https://github.com/username" />
                <GithubIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">LinkedIn URL</label>
              <div className="relative">
                <input type="text" value={form.linkedin} onChange={(e) => handleFieldChange("linkedin", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white" placeholder="https://linkedin.com/in/username" />
                <LinkedinIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">Twitter / X Profile</label>
              <div className="relative">
                <input type="text" value={form.twitter} onChange={(e) => handleFieldChange("twitter", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 pl-10 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white" placeholder="https://x.com/username" />
                <TwitterIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action triggers mobile */}
        <div className="flex flex-col gap-3 sm:hidden">
          <button onClick={handleSave} disabled={isPending} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 disabled:opacity-60">
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
          <Link href="/profile" className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
