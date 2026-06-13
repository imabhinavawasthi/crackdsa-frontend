"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Sparkles, Building2, BookOpen, Users, HelpCircle, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";
import { CompareSection } from "@/components/common/CompareSection";

const features = [
  {
    title: "1-on-1 FAANG Mentorship",
    description: "Get paired with engineers from top product companies. They review your code, guide your roadmap, and conduct mock interviews.",
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10"
  },
  {
    title: "Company-Specific Tags",
    description: "Stop solving random problems. Unlock the exact problem sets asked by Google, Amazon, Microsoft, and Meta in the last 6 months.",
    icon: Building2,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10"
  },
  {
    title: "Expert Masterclasses",
    description: "Deep dive into complex topics like Dynamic Programming and System Design with exclusive, high-quality video sessions.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10"
  },
  {
    title: "Priority Doubt Resolution",
    description: "Stuck on a problem? Get immediate help from our Teaching Assistants. No more waiting days for community forum replies.",
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10"
  }
];

const faqs = [
  {
    q: "How does the 1-on-1 mentorship work?",
    a: "You'll be matched with a mentor based on your target companies. You can schedule weekly syncs to review your progress, get resume feedback, or conduct mock interviews."
  },
  {
    q: "Can I upgrade or downgrade later?",
    a: "Yes! If you start with a 3-month plan, you can easily upgrade to 6-months or lifetime from your dashboard at any time."
  },
  {
    q: "Is the content updated regularly?",
    a: "Absolutely. We update our company tags and problem sheets every single week based on recent interview experiences shared by our community."
  },
  {
    q: "What if I'm a complete beginner?",
    a: "PRO is designed for all levels. Our AI roadmap will sequence your learning from absolute basics up to hard-level FAANG problems."
  }
];

export default function ProLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-black uppercase tracking-widest mb-8 shadow-sm"
          >
            <Crown size={18} /> CrackDSA Pro
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-6"
          >
            Master DSA. Crack FAANG. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">With Expert Guidance.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Unlock company-specific tags, priority 1-on-1 mentorship, and exclusive masterclasses. Stop guessing and start progressing.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/checkout/pro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1"
            >
              <Sparkles size={20} /> Upgrade to PRO
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm"
            >
              See Everything <ChevronRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* What is Possible (Features) */}
      <section id="features" className="py-24 px-4 bg-white dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              What becomes possible with PRO?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
              We built PRO to give you the exact same advantages that top-tier bootcamp students pay thousands of dollars for.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:shadow-xl transition-shadow shadow-sm"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.color} mb-6 shadow-sm border border-white/50 dark:border-white/5`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <CompareSection />

      {/* FAQ & Support Footer */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <HelpCircle size={20} className="text-brand-500" /> {faq.q}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 font-medium pl-7">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-indigo-600 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-black mb-4">Still have questions?</h3>
            <p className="text-brand-100 font-medium mb-8 max-w-lg mx-auto text-lg">
              Our support team is ready to help you decide if PRO is the right fit for your career goals.
            </p>
            <a
              href="mailto:support@crackdsa.com"
              className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
            >
              <MessageSquare size={20} /> Contact Support
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
