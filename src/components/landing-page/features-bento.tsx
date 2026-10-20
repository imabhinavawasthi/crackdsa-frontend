"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Flame,
  Sparkles,
  BookOpen,
  FileText,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Layers,
  Video,
  Users,
  UserCheck,
} from "lucide-react";

export function FeaturesBento() {
  const bentoItems = [
    {
      id: "sheets",
      title: "Curated Problem Sheets",
      badge: "Flagship Practice",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      description:
        "Master the exact problems asked at FAANG & top tier-1 product companies. Newbie to Expert, Sprint 75, 0 to Hero DSA Sheet with company tagging and live progress tracking.",
      link: "/dsa-sheet",
      linkText: "Browse All Sheets",
      icon: Layers,
      colSpan: "lg:col-span-7",
      features: [
        "Pattern Mastery Sheet (Top 180 Questions)",
        "crackDSA Sprint 75 Sheet",
        "Company Filters: Google, Amazon, Microsoft",
        "Save & Track Progress In Real-Time",
      ],
    },
    {
      id: "potd",
      title: "Regular Contest Editorials",
      badge: "Updated Regularly",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      description:
        "Never get stuck on a daily problem or weekend contest. Instant intuitive editorials with Python, C++, and Java solutions for LeetCode POTD, Codeforces, and CodeChef rounds.",
      link: "/contests",
      linkText: "Check Recent Editorials",
      icon: Flame,
      colSpan: "lg:col-span-5",
      features: [
        "Daily LeetCode Problem",
        "Weekly & Biweekly Contest Editorials",
        "Codeforces & CodeChef Editorials",
        "Detailed Multi-Language Solutions",
      ],
    },
    {
      id: "pro",
      title: "CrackDSA Pro",
      badge: "Less than ₹10/day | Complete Prep | 5★ Rated",
      badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40",
      description:
        "Complete DSA course and 150+ video lectures, weekly live weekend masterclasses, 1:1 live doubt sessions, CS Fundamentals, and System Design Notes.",
      link: "/pro",
      linkText: "View Pro Details & Pricing",
      icon: Sparkles,
      colSpan: "lg:col-span-5",
      highlightCard: true,
      features: [
        "Complete DSA Master Course",
        "Live Weekend Classes & Doubt Solving",
        "CS Fundamentals Notes (OS, DBMS, Networks)",
        "All Contest Editorials & Catalogs Included",
      ],
    },
    {
      id: "cs-fundamentals",
      title: "CS Fundamentals & System Design",
      badge: "Interview Specific",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      description:
        "Fast-track interview revision notes for Operating Systems, DBMS & SQL, Computer Networks, and Object-Oriented Design. Plus Low-Level (LLD) and High-Level Design (HLD) crash notes.",
      link: "/cs-fundamentals",
      linkText: "Study CS Notes",
      icon: BookOpen,
      colSpan: "lg:col-span-7",
      features: [
        "Operating Systems (Process, Threads, Memory)",
        "DBMS & High-Frequency SQL Queries",
        "Computer Networks (TCP/IP, HTTP/3, WebSockets)",
        "System Design (Caching, Sharding, Microservices)",
      ],
    },
    {
      id: "resume",
      title: "ATS-Optimized LaTeX Resume Builder",
      badge: "100% Free",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      description:
        "Craft an ATS-compliant software engineering resume in minutes. Built-in recruiter keyword matching, verified bullet point templates, and clean one-click LaTeX code export.",
      link: "/resume",
      linkText: "Build ATS Resume",
      icon: FileText,
      colSpan: "lg:col-span-6",
      features: [
        "FAANG-Vetted Single-Page Layout",
        "Real-Time ATS Keyword Match Score",
        "One-Click Overleaf & PDF Export",
        "Action-Verb Bullet Generators",
      ],
    },
    {
      id: "mock-interviews",
      title: "1:1 Live Mock Interviews",
      badge: "FAANG Calibrated",
      badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
      description:
        "Practice real coding, system design, and behavioral interview rounds with engineers from Amazon, LinkedIn, Zeta, and Google. Receive comprehensive scorecard feedback and interview readiness ratings.",
      link: "/dashboard",
      linkText: "Explore Mock Interviews",
      icon: Users,
      colSpan: "lg:col-span-6",
      features: [
        "1:1 Live Video Technical Rounds (60 Mins)",
        "FAANG Hiring Bar & Rubric Scoring",
        "Actionable Feedback on Code & Communication",
        "Behavioral & Resume Deep Dive Rounds",
      ],
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          One Platform.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Learn. Practice. Get Placed.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          From daily guided problem sprints to live mentor masterclasses, 1:1 mock interviews, and FAANG-vetted ATS resumes — everything is engineered for high-yield placement results.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {bentoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`${item.colSpan} rounded-3xl border ${
                item.highlightCard
                  ? "border-amber-500/30 dark:border-amber-500/40 bg-gradient-to-b from-white via-amber-50/20 to-amber-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950/20 shadow-lg shadow-amber-500/5"
                  : "border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900/90 shadow-sm"
              } p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      item.highlightCard
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          item.highlightCard
                            ? "text-amber-500"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={item.link}
                  className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${
                    item.highlightCard
                      ? "text-amber-600 dark:text-amber-400 hover:text-amber-500"
                      : "text-blue-600 dark:text-blue-400 hover:text-blue-500"
                  } transition-colors group`}
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
