"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Sparkles, ChevronRight, HelpCircle, MessageSquare, CheckCircle2 } from "lucide-react";
import { CompareSection } from "@/components/common/CompareSection";
import { PRO_HERO, PRO_FEATURES, PRO_FAQS, PRO_PRICING } from "@/constants/pro";
import { CONTACT_INFO } from "@/constants/contact";

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

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
          <CompareSection forceDark={true} />
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
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}?text=Hi%20CrackDSA!%20I%20have%20some%20questions%20about%20PRO%20subscription.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
              >
                <IconWhatsapp /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
