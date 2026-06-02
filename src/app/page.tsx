"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/constants/socials";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  Brain,
  Target,
  Layers,
  Zap,
  Code2,
  BarChart3,
  ChevronRight,
  MonitorPlay,
  Send,
  MessageCircle,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  ArrowUpRight,
  CheckCircle2,
  Play,
} from "lucide-react";

// ─── Scroll-triggered section wrapper ────────────────────────────────────────

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Rotating word in hero ───────────────────────────────────────────────────

const WORDS = ["patterns.", "clarity.", "confidence."];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex relative">
      <span className="invisible">confidence.</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 text-brand-400"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserMenu]);

  const initials = user?.full_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <Code2 size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">
            CrackDSA
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoading ? (
            /* Skeleton while auth loads */
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : isLoggedIn && user ? (
            /* ── Logged-in state ── */
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors px-3 py-2 hidden sm:block"
              >
                Dashboard
              </Link>

              {/* User avatar + dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-brand-500/30 focus:outline-none"
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name || "User"}
                      width={34}
                      height={34}
                      className="w-[34px] h-[34px] rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full bg-brand-500 flex items-center justify-center text-white text-[12px] font-bold ring-2 ring-white/10">
                      {initials}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-60 origin-top-right bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {/* Profile header */}
                      <div className="p-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <Image
                              src={user.avatar_url}
                              alt={user.full_name || "User"}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white text-[13px] font-bold">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">
                              {user.full_name || "User"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <BarChart3 size={15} className="text-gray-500" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <Users size={15} className="text-gray-500" />
                          My Profile
                        </Link>
                        <Link
                          href="/courses"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <BookOpen size={15} className="text-gray-500" />
                          Courses
                        </Link>
                      </div>

                      {/* Sign out */}
                      <div className="p-2 border-t border-white/[0.06]">
                        <button
                          onClick={async () => {
                            setShowUserMenu(false);
                            await logout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <ArrowRight size={15} className="rotate-180" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* ── Not logged in ── */
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-white text-gray-950 text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
                <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative bg-gray-950 text-white selection:bg-brand-500/30 selection:text-white">
      <Navbar />

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-5 sm:px-8 overflow-hidden">
        {/* Minimal background — single soft gradient, no orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/[0.07] rounded-full blur-[120px] -mt-48" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center pt-20 pb-16">
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium text-gray-400 tracking-wide">
              Trusted by 20,000+ SDE aspirants
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            <span className="text-white">Stop grinding.</span>
            <br />
            <span className="text-white">Start learning with </span>
            <RotatingWord />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-[17px] sm:text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            A structured, pattern-first DSA platform that adapts to your level,
            goals, and timeline. Built by engineers from Google, Amazon &
            Microsoft.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 text-[15px]"
            >
              Start Learning — Free
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href={SOCIALS.youtube.crackdsa}
              target="_blank"
              className="flex items-center gap-2.5 text-gray-400 hover:text-white font-medium px-6 py-3.5 rounded-xl transition-colors text-[15px]"
            >
              <Play size={14} className="fill-current" />
              Watch on YouTube
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-14 text-[13px] text-gray-500"
          >
            {[
              { bold: "20k+", label: "learners" },
              { bold: "50k+", label: "community" },
              { bold: "75+", label: "curated problems" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-white font-semibold">{item.bold}</span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════ TRUST BAR ════════════════════ */}
      <section className="py-12 px-5 sm:px-8 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-center text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-8">
              Mentors & alumni from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {["Google", "Amazon", "Microsoft", "Goldman Sachs", "Uber", "Adobe"].map(
                (company) => (
                  <span
                    key={company}
                    className="text-[15px] font-semibold text-gray-600 hover:text-gray-400 transition-colors cursor-default"
                  >
                    {company}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ PROBLEM ════════════════════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="max-w-2xl mb-16">
            <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
              The Problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight mb-5">
              Everyone follows the same list.
              <br />
              <span className="text-gray-500">Nobody gets results.</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-[17px] leading-relaxed">
              A beginner, a final-year student prepping for FAANG, and someone
              switching careers — all grinding the same 450 problems. That&apos;s
              not learning. That&apos;s hoping.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                icon: <Target size={20} />,
                title: "No Direction",
                desc: "Random problem lists with no structure, sequence, or learning outcome.",
                accent: "bg-red-500/10 text-red-400 border-red-500/10",
              },
              {
                icon: <BarChart3 size={20} />,
                title: "No Adaptation",
                desc: "Same difficulty for everyone — beginners drown, advanced learners stall.",
                accent: "bg-amber-500/10 text-amber-400 border-amber-500/10",
              },
              {
                icon: <Brain size={20} />,
                title: "No Pattern Focus",
                desc: "Memorising solutions instead of understanding the underlying thinking.",
                accent: "bg-brand-500/10 text-brand-400 border-brand-500/10",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-7 hover:border-white/[0.1] transition-colors">
                  <div
                    className={`w-10 h-10 rounded-xl ${item.accent} border flex items-center justify-center mb-5`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ SOLUTION / FEATURES ════════════════════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="max-w-2xl mb-16">
            <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
              The CrackDSA Way
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight mb-5">
              Your roadmap. Your pace.
              <br />
              Your interview offer.
            </h2>
            <p className="text-gray-400 text-base sm:text-[17px] leading-relaxed">
              We don&apos;t give you a list. We give you a{" "}
              <span className="text-white font-medium">
                personalised learning system
              </span>{" "}
              that evolves as you grow.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              {
                icon: <Brain size={20} />,
                title: "AI-Personalised Roadmaps",
                desc: "Tell us your level, target company, and timeline. We generate a step-by-step plan built around DSA patterns.",
                accent: "text-brand-400",
              },
              {
                icon: <Layers size={20} />,
                title: "Pattern-First Curriculum",
                desc: "Learn sliding window, two pointers, binary search — the actual patterns interviewers test, not random problems.",
                accent: "text-blue-light-400",
              },
              {
                icon: <Zap size={20} />,
                title: "Curated DSA Sheets",
                desc: "Blind 75, CrackDSA 75, Pattern Mastery — structured sheets with difficulty progression built in.",
                accent: "text-amber-400",
              },
              {
                icon: <TrendingUp size={20} />,
                title: "Real-Time Progress Tracking",
                desc: "See exactly where you stand, what patterns you've mastered, and what needs more work. Stay accountable.",
                accent: "text-emerald-400",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.1] transition-colors group">
                  <div
                    className={`w-10 h-10 rounded-xl bg-white/[0.04] ${item.accent} flex items-center justify-center mb-5 border border-white/[0.06] group-hover:border-white/[0.1] transition-colors`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <Reveal className="max-w-2xl mb-16">
            <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight">
              Three steps to interview-ready
            </h2>
          </Reveal>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Tell us about you",
                desc: "Your current level, target companies, available hours per week, and preparation timeline. Takes under 2 minutes.",
                icon: <Target size={18} />,
              },
              {
                step: "02",
                title: "Get your personalised roadmap",
                desc: "Our system generates a structured path — topics sequenced by dependency, problems ordered by difficulty, patterns front and centre.",
                icon: <BookOpen size={18} />,
              },
              {
                step: "03",
                title: "Learn, practice, track",
                desc: "Work through patterns with video lectures, solve curated problems, read concept articles, and watch your progress compound daily.",
                icon: <TrendingUp size={18} />,
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="flex gap-6 sm:gap-8 py-8 border-b border-white/[0.04] last:border-b-0 group">
                  {/* Step number */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <span className="text-[13px] font-bold text-brand-400 font-mono tracking-tight">
                      {item.step}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="pt-0.5">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed max-w-lg">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ STATS ════════════════════ */}
      <section className="py-20 px-5 sm:px-8">
        <Reveal>
          <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 sm:p-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
              {[
                { value: "20k+", label: "Active Learners", icon: <Users size={16} /> },
                { value: "50k+", label: "Community Members", icon: <MessageCircle size={16} /> },
                { value: "75+", label: "Curated Problems", icon: <Code2 size={16} /> },
                { value: "5+", label: "FAANG Mentors", icon: <Award size={16} /> },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-brand-400/60">{stat.icon}</div>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1.5 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════ WHAT STUDENTS SAY ════════════════════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
              Student Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight">
              Real learners. Real results.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                quote:
                  "CrackDSA's pattern approach changed everything. I stopped memorising and started understanding. Cleared Amazon SDE-1 in 2 months.",
                name: "Priya S.",
                role: "SDE-1, Amazon",
                color: "from-amber-500 to-orange-500",
              },
              {
                quote:
                  "The structured roadmap saved me from the chaos of random problem solving. The progress tracking kept me accountable every single day.",
                name: "Rahul M.",
                role: "SDE-2, Microsoft",
                color: "from-brand-500 to-blue-light-500",
              },
              {
                quote:
                  "Best investment I made for my career. The community is incredibly supportive and the curated sheets are gold for interview prep.",
                name: "Sneha K.",
                role: "SDE, Google",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item, i) => (
              <Reveal key={item.name} delay={i * 0.08}>
                <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.1] transition-colors flex flex-col">
                  <p className="text-[14px] text-gray-300 leading-relaxed mb-6 flex-1">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}
                    >
                      {item.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white leading-none">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ COMMUNITY ════════════════════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-brand-400 text-[13px] font-semibold uppercase tracking-wider mb-4">
              Community
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.15] tracking-tight mb-4">
              Learn together. Grow faster.
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto mb-10 leading-relaxed">
              Join thousands of learners across YouTube, Telegram, and WhatsApp.
              Daily tips, doubt resolution, and motivation.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                {
                  href: SOCIALS.youtube.crackdsa,
                  icon: <MonitorPlay size={15} />,
                  label: "YouTube",
                  accent: "hover:border-red-500/30 hover:text-red-400",
                },
                {
                  href: SOCIALS.telegram,
                  icon: <Send size={15} />,
                  label: "Telegram",
                  accent: "hover:border-blue-light-500/30 hover:text-blue-light-400",
                },
                {
                  href: SOCIALS.whatsapp.channel,
                  icon: <MessageCircle size={15} />,
                  label: "WhatsApp",
                  accent: "hover:border-emerald-500/30 hover:text-emerald-400",
                },
                {
                  href: SOCIALS.linkedin.crackdsa,
                  icon: <Users size={15} />,
                  label: "LinkedIn",
                  accent: "hover:border-brand-500/30 hover:text-brand-400",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 border border-white/[0.08] px-5 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 transition-all ${item.accent}`}
                >
                  {item.icon}
                  {item.label}
                  <ArrowUpRight size={12} className="opacity-40" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ FINAL CTA ════════════════════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-500/[0.06] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              Ready to crack
              <br />
              your next interview?
            </h2>
            <p className="text-gray-400 text-base sm:text-[17px] mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of developers who switched from random grinding to
              structured, pattern-based preparation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-[15px] sm:text-base px-8 py-4 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
              >
                Get Started — It&apos;s Free
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-2 text-gray-400 hover:text-white font-medium px-6 py-4 rounded-xl transition-colors text-[15px]"
              >
                <BookOpen size={15} />
                Browse Courses
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="border-t border-white/[0.04] py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <Code2 size={13} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[14px] font-bold text-gray-400">
                CrackDSA
              </span>
            </div>
            <div className="flex items-center gap-8 text-[13px] text-gray-600">
              <Link
                href="/terms"
                className="hover:text-gray-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-400 transition-colors"
              >
                Privacy
              </Link>
              <a
                href="mailto:support@crackdsa.com"
                className="hover:text-gray-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-gray-700">
              © {new Date().getFullYear()} CrackDSA. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { href: SOCIALS.youtube.crackdsa, icon: <MonitorPlay size={14} /> },
                { href: SOCIALS.telegram, icon: <Send size={14} /> },
                { href: SOCIALS.linkedin.crackdsa, icon: <Users size={14} /> },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
