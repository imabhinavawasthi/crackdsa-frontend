"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/button/Button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 py-10">

      {/* Animated Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-indigo-500/10 blur-3xl" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex flex-col items-center">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-7xl leading-tight font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
        >
          CrackDSA is Rebuilding
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-10"
        >
          Not another DSA platform.
          <br />
          Something fundamentally different is coming.
        </motion.p>

        {/* Gym + Shoe Analogy Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-8 max-w-xl sm:max-w-2xl text-center mb-10 shadow-2xl"
        >
          <p className="text-gray-300 text-base sm:text-lg">
            Imagine going to the gym...
          </p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            A beginner, a marathon runner, and someone trying to bulk — all following the same plan.
          </p>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Or wearing the same shoe size.
          </p>
          <p className="text-blue-300 mt-4 font-semibold text-base sm:text-lg">
            Sounds wrong, right?
          </p>
        </motion.div>

        {/* Hint Line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-gray-500 mb-8 sm:mb-10 text-center text-sm sm:text-base px-2"
        >
          We're quietly building something that changes this.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center w-full max-w-sm"
        >
          <p className="text-gray-500 mb-4">Be early. Shape what we build.</p>

          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%20found%20CrackDSA.%20I%20have%20a%20few%20suggestions%20that%20could%20help%20shape%20it."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full rounded-2xl px-6 py-3 text-base sm:text-lg bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20">
              Have suggestions? 💡
            </Button>
          </a>
        </motion.div>

        {/* Footer Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 sm:mt-16 text-xs sm:text-sm text-gray-600 text-center px-2"
        >
          Coming sooner than you think.
        </motion.p>
      </div>
    </div>
  );
}
