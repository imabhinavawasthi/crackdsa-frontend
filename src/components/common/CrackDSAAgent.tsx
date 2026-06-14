
"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ChevronRight, Sparkles, Map, PhoneCall, HelpCircle, User, Bot, Maximize2, Minimize2, Trash2 } from "lucide-react";
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
            📧 {`${CONTACT_INFO.email}`}
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const pathname = usePathname();
  const widgetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Route visibility configuration
  const allowedRoutes = ["/courses"];
  const allowedPrefixes = ["/courses/"];
  const isVisible = allowedRoutes.includes(pathname) || allowedPrefixes.some(prefix => pathname.startsWith(prefix));

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("crackdsa_agent_history");
      if (stored) {
        try {
          setChatHistory(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse agent history", e);
        }
      }
    }
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll to bottom when history changes or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, isOpen]);

  const handleFAQClick = (faqId: string) => {
    if (isTyping) return;
    
    // Add to history
    const newHistory = [...chatHistory, faqId];
    setChatHistory(newHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("crackdsa_agent_history", JSON.stringify(newHistory));
    }
    
    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  const clearHistory = () => {
    setChatHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("crackdsa_agent_history");
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={widgetRef} 
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end"
      onMouseEnter={() => setIsOpen(true)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
              isExpanded 
                ? "w-[90vw] sm:w-[500px] md:w-[600px] h-[80vh] max-h-[800px]" 
                : "w-[320px] sm:w-[360px] h-[500px] max-h-[70vh]"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 flex items-center gap-3 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20 shrink-0 shadow-inner z-10">
                <Sparkles className="text-white" size={20} />
              </div>
              <div className="z-10 flex-1">
                <h3 className="font-black text-white leading-tight">CrackDSA Agent</h3>
                <p className="text-brand-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">AI Support Assistant</p>
              </div>
              
              <div className="z-10 flex items-center gap-2">
                {chatHistory.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Clear Chat History"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                  title={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 bg-gray-50/50 dark:bg-[#0B0F19] custom-scrollbar">
              
              {/* Welcome Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles className="text-white" size={14} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 max-w-[85%]">
                  <p>Hi there! 👋 I'm the CrackDSA AI Agent. How can I help you today?</p>
                </div>
              </div>

              {/* Chat History */}
              {chatHistory.map((faqId, index) => {
                const faq = faqs.find(f => f.id === faqId);
                if (!faq) return null;
                
                const isLast = index === chatHistory.length - 1;
                const showTyping = isLast && isTyping;

                return (
                  <div key={`${faqId}-${index}`} className="space-y-5">
                    {/* User Message */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 justify-end"
                    >
                      <div className="bg-brand-500 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm text-sm font-medium max-w-[85%]">
                        {faq.question}
                      </div>
                    </motion.div>

                    {/* Agent Response */}
                    {showTyping ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <Sparkles className="text-white" size={14} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 w-16 flex items-center justify-center gap-1.5 h-[52px]">
                          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <Sparkles className="text-white" size={14} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 w-full max-w-[90%]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Suggested Topics List */}
              {!isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                  className="space-y-2 mt-4"
                >
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">
                    {chatHistory.length > 0 ? "Any other questions?" : "Suggested Topics"}
                  </p>
                  {faqs.map((faq) => {
                    const Icon = faq.icon;
                    return (
                      <button
                        key={faq.id}
                        onClick={() => handleFAQClick(faq.id)}
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
                </motion.div>
              )}
              
              {/* Invisible spacer to ensure scrolling reaches bottom cleanly */}
              <div className="h-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/40 hover:shadow-brand-500/60 ring-4 ring-white/10 dark:ring-gray-900/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none relative group"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full mix-blend-overlay overflow-hidden" />
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
        
        {/* Notification Dot - Now completely visible since overflow-hidden is removed from parent button */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-950 rounded-full animate-bounce shadow-sm" />
        )}
      </button>
    </div>
  );
}
