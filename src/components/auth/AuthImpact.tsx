"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Target } from "lucide-react";

const stats = [
  { label: "Active Learners", value: "10k+", icon: Users, color: "text-blue-400" },
  { label: "Mastery Rate", value: "95%", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Target Companies", value: "500+", icon: Target, color: "text-amber-400" },
];

export default function AuthImpact() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto p-6 text-white">
      {/* Premium Background Mesh (Subtle) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(70,95,255,0.15)_0,transparent_50%)]" />

      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <Image
          width={180}
          height={36}
          src="/images/logo/auth-logo.svg"
          alt="CrackDSA Logo"
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Main Pitch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-extrabold mb-2 leading-tight sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-300">
          Crack Your Dream <br /> Tech Career.
        </h2>
        <p className="text-sm text-blue-100/70 max-w-sm mx-auto">
          The last platform you'll ever need to master DSA and land high-paying offers.
        </p>
      </motion.div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 gap-2 w-full mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-center bg-gray-900/50 p-2 rounded-lg">
                <Icon className={stat.color} size={18} />
              </div>
              <div>
                <p className="text-lg font-bold leading-none mb-1">{stat.value}</p>
                <p className="text-[10px] text-blue-200/50 uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Social Proof Quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative bg-gradient-to-br from-blue-600/20 to-brand-500/10 border border-brand-500/10 p-4 rounded-xl"
      >
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-brand-400 text-brand-400" />
          ))}
        </div>
        <p className="italic text-blue-50 text-[11px] leading-relaxed mb-3">
          "The personalized roadmap helped me solve LeetCode Hard problems in record time. Highly recommended!"
        </p>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-brand-400 to-blue-600 border border-white/20" />
          <p className="text-[9px] font-bold text-white uppercase tracking-wider">Rahul Sharma — SDE @ Google</p>
        </div>
      </motion.div>
    </div>
  );
}
