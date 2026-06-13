"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ChevronRight, Sparkles, Map, PhoneCall, HelpCircle, User, Bot } from "lucide-react";
import Link from "next/link";
import { CONTACT_INFO } from "@/config/contact";

type FAQ = {
  id: string;
  question: string;
  icon: React.ElementType;
  answer: React.ReactNode;
};

const faqs: FAQ[] = [
  {
    id: "roadmap",
    question: "How to create a personalized roadmap?",
    icon: Map,
    answer: (
      <div className="space-y-3">
        <p>A personalized roadmap tailors the learning journey specifically to your current skills and target companies.</p>
        <p className="text-sm">If you purchase a specific course, you can generate a roadmap tailored just for that course. For full access, our PRO subscription lets you generate multiple roadmaps (up to 3 per month) across all topics!</p>
        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
          <p className="text-amber-800 dark:text-amber-400 font-bold mb-2">PRO Subscription</p>
          <p className="text-amber-700 dark:text-amber-500 text-xs mb-3">Unlock all courses, roadmap generation, and 1:1 mentorship.</p>
          <Link href="/checkout/pro" className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs shadow-md transition-colors">
            View PRO Plans
          </Link>
        </div>
      </div>
    )
  },
  {
    id: "doubts",
    question: "Have doubts in a course?",
    icon: HelpCircle,
    answer: (
      <div className="space-y-3">
        <p>While our premium courses are pre-recorded for lifetime access, we hold <strong>weekly live classes</strong> where you can get your doubts resolved directly!</p>
        <p className="text-sm">PRO subscribers also unlock exclusive 1:1 mentorship sessions (1 per month) for highly personalized guidance.</p>
        <Link href="/community" className="inline-block px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold text-xs shadow-md transition-colors">
          Join the Discord Community
        </Link>
      </div>
    )
  },
  {
    id: "support",
    question: "How to reach out to support?",
    icon: PhoneCall,
    answer: (
      <div className="space-y-3">
        <p>Having technical issues or payment queries? We're here to help.</p>
        <div className="flex flex-col gap-2">
          <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-semibold">
            📧 {CONTACT_INFO.email}
          </a>
          <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 transition-colors text-sm font-semibold border border-transparent dark:border-green-500/20">
            💬 Message on WhatsApp
          </a>
        </div>
      </div>
    )
  }
];

export default function CrackDSAAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const pathname = usePathname();

  // Route visibility configuration
  const allowedRoutes = ["/courses"];
  const allowedPrefixes = ["/courses/"];
  
  const isVisible = allowedRoutes.includes(pathname) || allowedPrefixes.some(prefix => pathname.startsWith(prefix));

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] sm:w-[360px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 flex items-center gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-black text-white leading-tight">CrackDSA Agent</h3>
                <p className="text-brand-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">AI Support Assistant</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 max-h-[400px] overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-[#0B0F19]">
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles className="text-white" size={14} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                  <p>Hi there! 👋 I'm the CrackDSA AI Agent. How can I help you today?</p>
                </div>
              </div>

              {!activeFAQ ? (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">Suggested Topics</p>
                  {faqs.map((faq) => {
                    const Icon = faq.icon;
                    return (
                      <button
                        key={faq.id}
                        onClick={() => setActiveFAQ(faq.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl text-left transition-colors group shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:bg-brand-100 dark:group-hover:bg-gray-900 text-brand-500 transition-colors">
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">{faq.question}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-500 transition-transform group-hover:translate-x-1" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFAQ}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* User Message */}
                    <div className="flex gap-3 justify-end">
                      <div className="bg-brand-500 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm text-sm font-medium max-w-[85%]">
                        {faqs.find((f) => f.id === activeFAQ)?.question}
                      </div>
                    </div>

                    {/* Agent Response */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <Sparkles className="text-white" size={14} />
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 w-full">
                        {faqs.find((f) => f.id === activeFAQ)?.answer}
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <button 
                            onClick={() => setActiveFAQ(null)}
                            className="text-xs font-bold text-gray-500 hover:text-brand-500 flex items-center gap-1 transition-colors"
                          >
                            <X size={12} /> View other topics
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/40 hover:shadow-brand-500/60 ring-4 ring-white/10 dark:ring-gray-900/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full mix-blend-overlay" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <Bot size={28} className="drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Dot */}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-bounce shadow-sm" />
        )}
      </button>
    </div>
  );
}
