"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { SOCIALS, EMAILS } from "@/constants/contact";
import {
  MessageSquare,
  Mail,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
  MonitorPlay,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function SupportPage() {
  const { user } = useAuth();
  
  // Form state
  const [name, setName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState("General Query");
  const [message, setMessage] = useState("");

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the formatted message
    const formattedText = `*New Support & Feedback Request* 🚀\n\n*Name:* ${name}\n*Email:* ${email}\n*Category:* ${category}\n\n*Message:*\n${message}`;
    
    // Encode for URL
    const encodedText = encodeURIComponent(formattedText);
    
    // Support WhatsApp number from constants
    const whatsappUrl = `https://wa.me/919956217210?text=${encodedText}`;
    
    // Open in new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I upgrade to CrackDSA PRO?",
      a: "You can purchase PRO access directly from the subscription details tab in your Profile menu, or click the PRO badge inside the sidebar navigation to see current premium plans."
    },
    {
      q: "Are the DSA practice sheets updated regularly?",
      a: "Yes! Our sheets, curation algorithms, and editorial solutions are updated weekly by engineering mentors to match the latest coding test patterns at FAANG and top-tier product startups."
    },
    {
      q: "How can I report a bug or suggest a feature?",
      a: "Please fill out the Support and Feedback form on this page and send it to our team via WhatsApp. You can also email us directly at support@crackdsa.com."
    },
    {
      q: "Can I request custom topics or sheets?",
      a: "Absolutely! We value feedback from our community. Use the contact form to share your curriculum requests and our engineering team will evaluate them for addition."
    }
  ];

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Help & Support" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 select-none">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} listClassName="text-xs font-medium" />

      {/* Page Header */}
      <PageHeader
        title={
          <>
            Help & {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
              Support Center
            </span>
          </>
        }
        subtitle="Need assistance, want to report a technical issue, or share platform feedback? Select a channel below."
        accent="brand"
      />

      {/* 2-Column layout: Left is Form, Right is Email/Social channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Support & Feedback Form (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            {...fadeUp} 
            className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50 space-y-5"
          >
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                <MessageSquare size={18} />
              </span>
              <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                Submit Help Request or Feedback
              </h2>
            </div>
            
            <form key={user?.id || "anonymous"} onSubmit={handleWhatsAppRedirect} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Inquiry Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white dark:bg-gray-950"
                >
                  <option value="General Query">General Query</option>
                  <option value="Account & Billing Support">Account & Billing Support</option>
                  <option value="Report a Bug">Report a Bug / Technical Issue</option>
                  <option value="Content Feedback">Content Feedback</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need help with or share your feedback..."
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-hidden dark:border-white/10 dark:text-white"
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-success-500 hover:bg-success-600 text-white font-extrabold text-sm py-3 px-5 rounded-xl shadow-lg shadow-success-500/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Send size={16} />
                Send via WhatsApp
              </button>
            </form>
          </motion.div>
          
          {/* FAQ Accordion Section */}
          <motion.div 
            {...fadeUp} 
            transition={{ delay: 0.1 }}
            className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900/50 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <HelpCircle size={18} />
              </span>
              <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="divide-y divide-gray-150 dark:divide-gray-800">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: Contact & Community Channels (1/3 width on desktop) */}
        <div className="space-y-6">
          
          {/* Email Support Channels */}
          <motion.div 
            {...fadeUp} 
            transition={{ delay: 0.05 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 pl-1">
              Direct Email
            </h3>
            <div className="flex flex-col gap-3">
              <EmailCard
                email={EMAILS.support}
                icon={<Mail size={20} />}
                title="Support"
                description="Technical help or account issues"
              />
              <EmailCard
                email={EMAILS.business}
                icon={<Sparkles size={20} />}
                title="Business & Enquiries"
                description="Sponsorships & collaborations"
              />
              <EmailCard
                email={EMAILS.colleges}
                icon={<GraduationCap size={20} />}
                title="Colleges"
                description="Mentorship & campus webinars"
              />
            </div>
          </motion.div>

          {/* Social Platforms */}
          <motion.div 
            {...fadeUp} 
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-550 pl-1">
              Join Our Socials
            </h3>
            <div className="flex flex-col gap-3">
              <SocialCard
                href={SOCIALS.youtube.crackdsa}
                icon={<MonitorPlay size={20} />}
                iconBg="bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"
                title="CrackDSA YouTube"
                subtitle="Curated visual lectures"
              />
              <SocialCard
                href={SOCIALS.telegram}
                icon={<Send size={20} />}
                iconBg="bg-blue-light-100 dark:bg-blue-light-500/15 text-blue-light-600 dark:text-blue-light-400"
                title="Telegram Group"
                subtitle="Daily discussions"
              />
              <SocialCard
                href={SOCIALS.whatsapp.channel}
                icon={<MessageSquare size={20} />}
                iconBg="bg-success-100 dark:bg-success-500/15 text-success-600 dark:text-success-400"
                title="WhatsApp Channel"
                subtitle="Mentorship resources"
              />
              <SocialCard
                href={SOCIALS.linkedin.crackdsa}
                icon={<Briefcase size={20} />}
                iconBg="bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400"
                title="LinkedIn Page"
                subtitle="CrackDSA updates"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ── Reusable sub-components ────────────────────────────────────────────────── */

function SocialCard({
  href,
  icon,
  iconBg,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3.5 p-4 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-800/50 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <ExternalLink size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
    </a>
  );
}

function EmailCard({
  email,
  icon,
  title,
  description,
}: {
  email: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className="group flex items-start gap-3.5 p-4 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-800/50 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-lg shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{description}</p>
        <p className="text-xs font-medium text-brand-600 dark:text-brand-400">{email}</p>
      </div>
    </a>
  );
}
