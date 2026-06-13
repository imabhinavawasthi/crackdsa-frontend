import React, { useState, useEffect } from "react";
import { Gift, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExitIntentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ExitIntentModal({ isOpen, onAccept, onDecline }: ExitIntentModalProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={onDecline}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-brand-500/20 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

            <button onClick={onDecline} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
              <X size={24} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-brand-500/20">
                <Gift size={40} className="animate-bounce" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Wait! Don't leave yet.</h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-6">
                We've unlocked an exclusive <span className="text-emerald-600 dark:text-emerald-400 font-bold">20% discount</span> just for you. Complete your purchase now before it expires!
              </p>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-2xl mb-6">
                <Clock className="text-brand-500 animate-pulse" size={20} />
                <span className="font-mono text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </span>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={onAccept}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Gift size={20} /> Claim 20% Off Now
                </button>
                <button
                  onClick={onDecline}
                  className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  No thanks, I'll pay full price later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
