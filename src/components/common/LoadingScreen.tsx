"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950"
        >
          <div className="relative">
            {/* Pulsing Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: [0.8, 1.1, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-48 h-12 sm:w-64 sm:h-16 md:w-72 md:h-20"
            >
              <Image
                src="/images/logo/logo-dark.svg"
                alt="CrackDSA Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Subtle glow effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 blur-3xl -z-10 rounded-full scale-150"
            />
          </div>

          {/* Optional: Loading text or bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 md:bottom-12 w-full px-4 text-center"
          >
            <p className="text-gray-400 text-xs sm:text-sm font-medium tracking-widest uppercase">
              Welcome to your personalised DSA Learning
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
