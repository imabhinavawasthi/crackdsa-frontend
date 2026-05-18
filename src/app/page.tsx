"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SOCIALS } from "@/constants/socials";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Layers,
  Zap,
  Users,
  Code2,
  BarChart3,
  ChevronRight,
  MonitorPlay,
  Send,
  MessageCircle,
} from "lucide-react";

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

          {/* Animated floating orbs */}
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute top-[15%] left-[15%] w-[400px] h-[400px] bg-brand-500/15 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -40, 30, 0], y: [0, 30, -30, 0], scale: [1, 0.9, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
            className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-blue-light-500/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 20, -30, 0], y: [0, -20, 40, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute bottom-[20%] left-[30%] w-[300px] h-[300px] bg-brand-600/10 rounded-full blur-[120px]"
          />

          {/* Animated ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.02, 1] }}
              transition={{ rotate: { repeat: Infinity, duration: 60, ease: "linear" }, scale: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              className="w-[700px] h-[700px] rounded-full border border-white/[0.03]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-white/[0.04] border-dashed"
            />
          </div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -60 - i * 15, 0],
                x: [0, (i % 2 === 0 ? 20 : -20), 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{ repeat: Infinity, duration: 6 + i * 1.5, ease: "easeInOut", delay: i * 0.8 }}
              className="absolute w-1 h-1 rounded-full bg-brand-400/60"
              style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 20}%` }}
            />
          ))}
        </div>

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-950/60 border-b border-white/[0.04]"
        >
          <div className="flex items-center justify-between px-6 md:px-10 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <Code2 size={14} className="text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">CrackDSA</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto w-full pt-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-1.5 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Sparkles size={13} className="text-brand-400" />
              </motion.div>
              <span className="text-xs font-medium text-gray-300">
                Personalised DSA Learning
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5"
            >
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                Stop grinding.
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-blue-light-400 bg-clip-text text-transparent">
                Start learning{" "}
              </span>
              <RotatingWord />
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-gray-400 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              CrackDSA adapts to your level, goals, and timeline. A structured,
              pattern-first approach that makes you interview-ready.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
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
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-gray-300 font-medium px-6 py-3.5 rounded-xl transition-all"
              >
                <MonitorPlay size={16} />
                Watch Demo
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-10 text-sm text-gray-500"
            >
              <span>
                <span className="text-white font-bold">20k+</span> learners
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>
                <span className="text-white font-bold">50k+</span> community
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>
                Mentors from{" "}
                <span className="text-gray-300">Google, Amazon, Microsoft</span>
              </span>
            </motion.div>
          </div>

          {/* Right: Animated code terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-shrink-0 w-full max-w-md lg:max-w-sm xl:max-w-md hidden md:block"
          >
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-brand-500/10 rounded-3xl blur-2xl" />

              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono ml-2">
                    your-roadmap.tsx
                  </span>
                </div>

                {/* Animated code lines */}
                <div className="p-5 font-mono text-[13px] space-y-3">
                  <CodeLine delay={0.5} color="text-gray-500">
                    {"// Your personalised path"}
                  </CodeLine>
                  <CodeLine delay={0.8} color="text-brand-400">
                    {"const roadmap = generateFor({"}
                  </CodeLine>
                  <CodeLine delay={1.1} color="text-gray-300" indent>
                    {'level: '}
                    <span className="text-success-400">&quot;intermediate&quot;</span>,
                  </CodeLine>
                  <CodeLine delay={1.4} color="text-gray-300" indent>
                    {'target: '}
                    <span className="text-success-400">&quot;FAANG&quot;</span>,
                  </CodeLine>
                  <CodeLine delay={1.7} color="text-gray-300" indent>
                    {'weeks: '}
                    <span className="text-warning-400">8</span>,
                  </CodeLine>
                  <CodeLine delay={2.0} color="text-brand-400">
                    {"});"}
                  </CodeLine>
                  <div className="h-3" />
                  <CodeLine delay={2.4} color="text-gray-500">
                    {"// Next pattern: Sliding Window"}
                  </CodeLine>
                  <CodeLine delay={2.7} color="text-blue-light-400">
                    {"roadmap.nextStep();"}
                  </CodeLine>

                  {/* Blinking cursor */}
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-4 bg-brand-400/70 rounded-sm mt-1"
                  />
                </div>

                {/* Bottom progress bar */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                    <span>Progress</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                    >
                      42%
                    </motion.span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "42%" }}
                      transition={{ delay: 2.8, duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════ PROBLEM ═══════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
              The Problem
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Everyone gets the{" "}
              <span className="text-gray-500 line-through decoration-gray-600">same</span>{" "}
              plan.
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-blue-light-400 bg-clip-text text-transparent">
                Nobody gets results.
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              A beginner, a final-year student prepping for FAANG, and someone
              switching careers — all grinding the same 450 problems.
              That&apos;s not learning. That&apos;s just hoping.
            </p>
          </motion.div>

          {/* Problem cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Target size={20} />,
                title: "No Direction",
                desc: "Random problem lists with no structure, sequence, or purpose.",
                color: "text-error-400",
              },
              {
                icon: <BarChart3 size={20} />,
                title: "No Adaptation",
                desc: "Same difficulty for everyone — beginners drown, advanced students stall.",
                color: "text-warning-400",
              },
              {
                icon: <Brain size={20} />,
                title: "No Pattern Focus",
                desc: "Memorising solutions instead of understanding the underlying patterns.",
                color: "text-brand-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-colors"
              >
                <div className={`mb-4 ${item.color}`}>{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SOLUTION ═══════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(70,95,255,0.08),transparent_70%)]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
              The CrackDSA Way
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Your roadmap.{" "}
              <span className="bg-gradient-to-r from-brand-400 to-blue-light-400 bg-clip-text text-transparent">
                Your pace.
              </span>
              <br />
              Your interview offer.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              We don&apos;t give you a list. We give you a{" "}
              <span className="text-white font-medium">personalised learning system</span>{" "}
              that adapts as you grow.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <Brain size={22} />,
                title: "AI-Personalised Roadmaps",
                desc: "Tell us your level, target company, and timeline — we generate a step-by-step plan built around DSA patterns.",
                gradient: "from-brand-500/20 to-brand-600/5",
              },
              {
                icon: <Layers size={22} />,
                title: "Pattern-First Curriculum",
                desc: "Learn sliding window, two pointers, binary search — the actual patterns interviewers test, not random problems.",
                gradient: "from-blue-light-500/20 to-blue-light-600/5",
              },
              {
                icon: <Zap size={22} />,
                title: "Curated DSA Sheets",
                desc: "Blind 75, CrackDSA 75, Pattern Mastery — structured sheets with difficulty progression built in.",
                gradient: "from-warning-500/20 to-warning-600/5",
              },
              {
                icon: <BarChart3 size={22} />,
                title: "Progress Tracking",
                desc: "See exactly where you stand, what patterns you've mastered, and what needs more work.",
                gradient: "from-success-500/20 to-success-600/5",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`group relative bg-gradient-to-br ${item.gradient} border border-white/[0.06] rounded-2xl p-7 hover:border-white/15 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.06] text-brand-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Three steps to interview-ready
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden md:block" />

            {[
              {
                step: "01",
                title: "Tell Us About You",
                desc: "Your current level, target companies, available hours, and preparation timeline.",
              },
              {
                step: "02",
                title: "Get Your Roadmap",
                desc: "AI generates a personalised path — topics sequenced by dependency, problems ordered by difficulty.",
              },
              {
                step: "03",
                title: "Learn, Practice, Track",
                desc: "Work through patterns, solve curated problems, and watch your progress accelerate.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...stagger}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex items-start gap-6 mb-10 last:mb-0"
              >
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-brand-500/10 to-blue-light-500/10 border border-white/[0.06] rounded-2xl p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "20k+", label: "Learners" },
                { value: "50k+", label: "Community" },
                { value: "75+", label: "Curated Problems" },
                { value: "5+", label: "FAANG Mentors" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...stagger}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ COMMUNITY ═══════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Community
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Learn together. Grow faster.
            </h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto mb-10">
              Join thousands of learners across YouTube, Telegram, and WhatsApp.
              Get daily tips, doubt resolution, and motivation.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={SOCIALS.youtube.crackdsa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-all"
            >
              <MonitorPlay size={16} className="text-red-400" />
              YouTube
            </a>
            <a
              href={SOCIALS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-all"
            >
              <Send size={16} className="text-blue-light-400" />
              Telegram
            </a>
            <a
              href={SOCIALS.whatsapp.channel}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-all"
            >
              <MessageCircle size={16} className="text-success-400" />
              WhatsApp
            </a>
            <a
              href={SOCIALS.linkedin.crackdsa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-all"
            >
              <Users size={16} className="text-brand-400" />
              LinkedIn
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(70,95,255,0.12),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Ready to{" "}
              <span className="bg-gradient-to-r from-brand-400 to-blue-light-400 bg-clip-text text-transparent">
                crack your next interview?
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">
              Join thousands of developers who switched from random grinding to
              structured, pattern-based preparation.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35"
            >
              Get Started — Free Forever
              <ChevronRight
                size={18}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center">
              <Code2 size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-400">CrackDSA</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy
            </Link>
            <a href="mailto:support@crackdsa.com" className="hover:text-gray-400 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} CrackDSA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════ Helper Components ═══════════════════════ */

import { useEffect, useState } from "react";

const WORDS = ["smart.", "patterns.", "right."];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex relative">
      {/* Invisible widest word to reserve width */}
      <span className="invisible">patterns.</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-brand-300 to-blue-light-400 bg-clip-text text-transparent"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CodeLine({
  children,
  delay,
  color,
  indent,
}: {
  children: React.ReactNode;
  delay: number;
  color: string;
  indent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`${color} ${indent ? "pl-6" : ""}`}
    >
      {children}
    </motion.div>
  );
}
