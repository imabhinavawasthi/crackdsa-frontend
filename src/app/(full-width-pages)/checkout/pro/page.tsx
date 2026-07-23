"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Crown, Mail } from "lucide-react";

export default function ProCheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] py-12 px-4 relative flex items-center justify-center select-none">
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-3xl h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <Link href="/">
          <Image className="dark:hidden cursor-pointer" src="/images/logo/logo.svg" alt="CrackDSA" width={140} height={35} />
          <Image className="hidden dark:block cursor-pointer" src="/images/logo/logo-dark.svg" alt="CrackDSA" width={140} height={35} />
        </Link>
      </div>

      <div className="w-full max-w-3xl mx-auto mt-12 md:mt-8 relative z-10 text-center space-y-8">
        
        {/* Back Link */}
        <div className="text-left">
          <Link href="/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold">Back to Academy</span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl flex flex-col items-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner relative">
            <Crown size={32} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
          </div>

          <div className="space-y-3">
            <span className="rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
              Early Access Soon
            </span>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              PRO Subscription
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md mx-auto">
              We are opening early access to our PRO subscription shortly. We will send an email notification to all our users when registrations open so you can grab the early bird pricing.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800/60 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <Mail size={14} className="text-brand-500" />
              <span>Email Notification Scheduled</span>
            </div>
            
            <Link 
              href="/courses"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold transition-all w-full sm:w-auto shadow-sm"
            >
              <span>Explore Academy</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
