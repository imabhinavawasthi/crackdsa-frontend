"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Sparkles, ChevronRight, HelpCircle, MessageSquare, CheckCircle2 } from "lucide-react";
import { CompareSection } from "@/components/common/CompareSection";
import { PRO_HERO, PRO_FEATURES, PRO_FAQS, PRO_PRICING } from "@/constants/pro";

export default function ProLandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 pb-24 overflow-hidden selection:bg-brand-500/30">
      
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-black uppercase tracking-widest mb-8 backdrop-blur-md"
            >
              <Crown size={16} className="text-brand-400" /> {PRO_HERO.badge}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6"
            >
              {PRO_HERO.headlineLine1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-orange-400 to-brand-500">
                {PRO_HERO.headlineLine2}
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              {PRO_HERO.subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.6)]"
              >
                <Sparkles size={20} /> View Pricing Plans
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
              >
                Explore Features <ChevronRight size={20} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                The Premium Advantage
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to stop struggling and start cracking interviews.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRO_FEATURES.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.color} mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Invest in your career. One FAANG offer pays for this 100x over.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {PRO_PRICING.map((plan, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`relative p-8 rounded-[2rem] border backdrop-blur-md flex flex-col h-full ${
                    plan.highlight 
                      ? "border-brand-500/50 bg-brand-500/5 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] md:-translate-y-4" 
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-8 flex-grow">{plan.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <CheckCircle2 size={18} className="text-brand-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/checkout/pro?plan=${plan.id}`}
                    className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                      plan.highlight
                        ? "bg-brand-500 text-white hover:bg-brand-600"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compare Section */}
        <div className="max-w-6xl mx-auto px-4">
          <CompareSection />
        </div>

        {/* FAQs & CTA */}
        <section className="py-24 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid gap-4 mb-20">
            {PRO_FAQS.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 md:p-8 rounded-[1.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-sm"
              >
                <h4 className="text-lg md:text-xl font-bold text-white mb-3 flex items-start gap-3">
                  <HelpCircle size={24} className="text-brand-500 shrink-0 mt-1" /> 
                  <span>{faq.q}</span>
                </h4>
                <p className="text-gray-400 pl-9 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          {/* Support Banner */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-brand-600/20 to-indigo-600/20 border border-brand-500/20 text-center relative overflow-hidden backdrop-blur-md">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-4">Still have questions?</h3>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto text-lg">
                Our support team is ready to help you decide if PRO is the right fit for your career goals.
              </p>
              <a
                href="mailto:support@crackdsa.com"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105"
              >
                <MessageSquare size={20} /> Contact Support
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
