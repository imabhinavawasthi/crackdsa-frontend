"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Radio,
  BarChart3,
  Users,
  Play,
  CheckCircle2,
  Circle,
  Trophy,
  ShieldCheck,
  Zap,
  UserCheck,
  Star,
  Code2,
} from "lucide-react";
import { getGoogleAuthUrl } from "@/functions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirect_to");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // ─── Post-Login Redirection Guard ───────────────────────────────────────
    if (isLoggedIn) {
      router.replace("/");
      return;
    }

    if (redirectToParam && typeof window !== "undefined") {
      localStorage.setItem("crackdsa_login_redirect", redirectToParam);
    }
  }, [redirectToParam, isLoggedIn, router]);

  if (isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F8FAFC] overflow-x-hidden flex flex-col justify-center select-none">
      {/* ─── Ambient Background Mesh & Subtle Grid Lines ───────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric gradients */}
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[130px]" />
        <div className="absolute top-[25%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-sky-300/15 blur-[150px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[140px]" />
        
        {/* Subtle geometric dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(#94A3B8 0.75px, transparent 0.75px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ─── Main Split-Layout Container ───────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDE: Brand Showcase & Interactive Visual Collage            */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-7 lg:pr-2">
            
            {/* Top Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <Image
                  src="/new-logos/crackdsa-logo-new-no-background.png"
                  alt="CrackDSA Logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
                  priority
                />
                <span className="font-black text-2xl tracking-tight text-slate-900">
                  Crack<span className="text-blue-600">DSA</span>
                </span>
              </Link>
            </motion.div>

            {/* Hero Heading & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Practice. Learn. <br />
                <span className="text-blue-600">Crack.</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Your complete platform for DSA, competitive programming and interview preparation.
              </p>
            </motion.div>

            {/* Feature Highlights (2x2 Grid) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl"
            >
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">Structured DSA Courses</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    From basics to advanced, with curated problems
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">Live Classes & Mentorship</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Learn and solve with expert mentors
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">Practice & Contest Editorials</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Curated sheets and detailed solutions
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">Thriving Community</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Discuss, learn and grow together
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ─── Visual Showcase Canvas (DSA Course + C++ Terminal + Testimonial) ─ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative pt-6 pb-2 hidden sm:block"
            >
              <div className="relative w-full h-[300px]">
                
                {/* Handwritten Annotation & Curved Arrow */}
                <div className="absolute right-[22%] -top-5 z-20 flex flex-col items-center pointer-events-none">
                  <span className="text-[11px] font-semibold text-blue-600 leading-tight text-center rotate-[-6deg] tracking-wide font-sans">
                    Learn<br />Practice<br />Crack
                  </span>
                  <svg
                    width="26"
                    height="32"
                    viewBox="0 0 28 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-500 mt-0.5 -rotate-12"
                  >
                    <path
                      d="M6 3C14 7 24 16 20 28M20 28L13 26M20 28L24 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Back Card: DSA Course Syllabus Card */}
                <div className="absolute right-4 top-1 w-[275px] bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-4 z-10 rotate-[2.5deg] hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">DSA Course</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  
                  {/* Active Module */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/80 border border-blue-100/80 mb-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Arrays</p>
                      <p className="text-[10px] text-slate-500">12 lectures · 40 problems</p>
                    </div>
                  </div>

                  {/* Syllabus Items */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-700 py-0.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-medium truncate max-w-[150px]">1. Introduction to Arrays</span>
                      </div>
                      <span className="text-[10px] text-slate-400">12:34</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700 py-0.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-medium truncate max-w-[150px]">2. Two Pointers</span>
                      </div>
                      <span className="text-[10px] text-slate-400">18:20</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700 py-0.5">
                      <div className="flex items-center gap-1.5">
                        <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="font-medium truncate max-w-[150px]">3. Sliding Window</span>
                      </div>
                      <span className="text-[10px] text-slate-400">25:10</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 pt-0.5">
                      <Circle className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                      <span className="font-medium">Linked List</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Front Card: Dark C++ Code Terminal */}
                <div className="absolute left-[36%] bottom-0 w-[315px] bg-[#0F172A] rounded-2xl border border-slate-800 shadow-2xl p-4 z-20 font-mono text-[11px] leading-relaxed">
                  {/* Header bar */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-1 bg-blue-950 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                      <Code2 className="w-3 h-3" />
                      <span>C++</span>
                    </div>
                  </div>

                  {/* Code Body */}
                  <div className="space-y-0.5 text-slate-300">
                    <p><span className="text-slate-600 mr-2 select-none">1</span><span className="text-purple-400">vector</span>&lt;<span className="text-emerald-400">int</span>&gt; <span className="text-yellow-300 font-bold">twoSum</span>(<span className="text-purple-400">vector</span>&lt;<span className="text-emerald-400">int</span>&gt;&amp; nums, <span className="text-emerald-400">int</span> target) &#123;</p>
                    <p><span className="text-slate-600 mr-2 select-none">2</span>  <span className="text-purple-400">unordered_map</span>&lt;<span className="text-emerald-400">int</span>, <span className="text-emerald-400">int</span>&gt; mp;</p>
                    <p><span className="text-slate-600 mr-2 select-none">3</span>  <span className="text-rose-400">for</span> (<span className="text-emerald-400">int</span> i = <span className="text-cyan-400">0</span>; i &lt; nums.<span className="text-sky-300">size</span>(); i++) &#123;</p>
                    <p><span className="text-slate-600 mr-2 select-none">4</span>    <span className="text-emerald-400">int</span> rem = target - nums[i];</p>
                    <p><span className="text-slate-600 mr-2 select-none">5</span>    <span className="text-rose-400">if</span> (mp.<span className="text-sky-300">count</span>(rem))</p>
                    <p><span className="text-slate-600 mr-2 select-none">6</span>      <span className="text-rose-400">return</span> &#123;mp[rem], i&#125;;</p>
                    <p><span className="text-slate-600 mr-2 select-none">7</span>    mp[nums[i]] = i;</p>
                    <p><span className="text-slate-600 mr-2 select-none">8</span>  &#123;</p>
                    <p><span className="text-slate-600 mr-2 select-none">9</span>  <span className="text-rose-400">return</span> &#123;&#125;;</p>
                    <p><span className="text-slate-600 mr-2 select-none">10</span>&#125;</p>
                  </div>

                  {/* Overlapping Badge: Top 1% Learners */}
                  <div className="absolute -top-6 -right-6 z-30 flex flex-col items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/40 border-[3px] border-white text-center">
                    <Trophy className="w-5 h-5 text-amber-300 mb-0.5 fill-amber-300/20" />
                    <span className="text-[10px] font-black leading-tight tracking-tight">Top 1%</span>
                    <span className="text-[8px] font-medium text-blue-100">Learners</span>

                    {/* Celebration sparkles around badge */}
                    <span className="absolute -top-1 -right-1 text-blue-400 text-xs font-bold animate-ping">✦</span>
                    <span className="absolute -bottom-1 -left-1 text-amber-300 text-[10px] font-bold">✦</span>
                  </div>
                </div>

                {/* Overlapping Testimonial Card */}
                <div className="absolute left-0 bottom-0 w-[270px] bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/80 p-3.5 z-30">
                  <span className="text-blue-600 text-2xl font-serif font-black leading-none block mb-1">“</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    CrackDSA helped me go from struggling with DSA to cracking my dream internship. The live classes and problem sheets are amazing!
                  </p>
                  
                  <div className="flex items-center gap-2.5 mt-2.5 pt-2.5 border-t border-slate-100">
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-400 to-orange-500 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                        AS
                      </div>
                    </div>
                    <div>
                      {/* 5 Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">Aditya Sharma</p>
                      <p className="text-[9px] text-slate-500">SDE Intern @ Microsoft</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE: Elevated White Login Card (1:1 with Design)           */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="w-full max-w-[440px] bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-7 sm:p-10 flex flex-col items-center text-center relative"
            >
              {/* Center CrackDSA Logo */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <Image
                  src="/new-logos/crackdsa-logo-new-no-background.png"
                  alt="CrackDSA Logo"
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain shrink-0"
                />
                <span className="font-black text-2xl tracking-tight text-slate-900">
                  Crack<span className="text-blue-600">DSA</span>
                </span>
              </div>

              {/* Card Title & Subtitle */}
              <h2 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight mt-3">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-[280px] leading-relaxed">
                Sign in with your Google account to continue your learning journey.
              </p>

              {/* ── Primary Google Sign-in Button ── */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="mt-7 w-full py-3.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 transition-all shadow-xs flex items-center justify-center gap-3 font-semibold text-slate-700 active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {/* Official Multi-Color Google "G" Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M22.5033 12.2332C22.5033 11.3698 22.4318 10.7398 22.2771 10.0865H12.2178V13.9831H18.1225C17.9654 14.9515 17.3226 16.4098 15.894 17.3898L15.874 17.5202L19.0546 19.9351L19.275 19.9566C21.2987 18.1249 22.5033 15.4299 22.5033 12.2332Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.2167 22.5C15.1095 22.5 17.5381 21.5667 19.3119 19.9566L15.931 17.3898C15.0263 18.0081 13.812 18.44 12.2167 18.44C9.38338 18.44 6.97862 16.6083 6.1214 14.0766L5.99575 14.087L2.68849 16.5954L2.64526 16.7132C4.40714 20.1432 8.02621 22.5 12.2167 22.5Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.12224 14.0766C5.89606 13.4233 5.76516 12.7233 5.76516 11.9999C5.76516 11.2766 5.89606 10.5766 6.11033 9.92324L6.10435 9.78409L2.75564 7.23547L2.64627 7.28659C1.92011 8.70992 1.50346 10.3082 1.50346 11.9999C1.50346 13.6916 1.92011 15.2899 2.64627 16.7132L6.12224 14.0766Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.2168 5.55998C14.2287 5.55998 15.5861 6.41164 16.3598 7.1233L19.3833 4.22998C17.5262 2.53831 15.1095 1.5 12.2168 1.5C8.02622 1.5 4.40715 3.85665 2.64526 7.28665L6.10921 9.92331C6.96644 7.39164 9.38338 5.55998 12.2168 5.55998Z"
                    fill="#EB4335"
                  />
                </svg>
                <span>{isSubmitting ? "Connecting..." : "Continue with Google"}</span>
              </button>

              {/* ── Secure & Hassle-free Divider ── */}
              <div className="mt-8 mb-6 relative w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
                  Secure &amp; Hassle-free
                </span>
              </div>

              {/* ── 3 Value Proposition Columns ── */}
              <div className="grid grid-cols-3 gap-2.5 w-full">
                {/* Column 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    Safe &amp; Secure <br /> Login
                  </span>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    No Extra <br /> Password
                  </span>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                    Access All <br /> Your Progress
                  </span>
                </div>
              </div>

              {/* ── Terms of Service & Privacy Policy ── */}
              <p className="mt-8 text-xs text-slate-500 leading-relaxed max-w-[280px]">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
