"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import Logo from "@/components/common/Logo";

export type PaymentStage = "idle" | "awaiting_payment" | "verifying" | "success" | "error";

interface PaymentProcessingOverlayProps {
  isOpen: boolean;
  stage: PaymentStage;
  itemName?: string;
  amount?: number;
  errorMessage?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export default function PaymentProcessingOverlay({
  isOpen,
  stage,
  itemName = "Course Enrollment",
  amount,
  errorMessage,
  onRetry,
  onCancel,
}: PaymentProcessingOverlayProps) {
  if (!isOpen || stage === "idle") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-lg bg-white dark:bg-[#0d1527] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-blue-500/10 text-center flex flex-col items-center space-y-6"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <Logo href="/" />
          </div>

          {/* Dynamic Graphic & Status Indicator */}
          {stage === "awaiting_payment" && (
            <div className="relative flex items-center justify-center pt-2">
              <span className="absolute size-24 rounded-full bg-blue-500/20 dark:bg-blue-500/15 animate-ping duration-1000" />
              <div className="relative size-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="size-10 stroke-[2.2]" />
              </div>
            </div>
          )}

          {stage === "verifying" && (
            <div className="relative flex items-center justify-center pt-2">
              <div className="size-20 rounded-3xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Loader2 className="size-10 animate-spin stroke-[2.2]" />
              </div>
            </div>
          )}

          {stage === "success" && (
            <div className="relative flex items-center justify-center pt-2">
              <div className="size-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="size-10 stroke-[2.2]" />
              </div>
            </div>
          )}

          {stage === "error" && (
            <div className="relative flex items-center justify-center pt-2">
              <div className="size-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <ShieldAlert className="size-10 stroke-[2.2]" />
              </div>
            </div>
          )}

          {/* Texts */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              {stage === "awaiting_payment" && "Payment Window In Progress..."}
              {stage === "verifying" && "Verifying Transaction..."}
              {stage === "success" && "Payment Successful! 🎉"}
              {stage === "error" && "Verification Pending"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              {stage === "awaiting_payment" && (
                <>
                  Complete your payment in the secure Razorpay overlay.
                  {itemName && (
                    <span className="block mt-1 font-semibold text-gray-700 dark:text-gray-300">
                      Purchasing: {itemName} {amount ? `(₹${amount.toLocaleString("en-IN")})` : ""}
                    </span>
                  )}
                </>
              )}
              {stage === "verifying" &&
                "Confirming payment with the bank and unlocking your access. Please hold on for just a moment..."}
              {stage === "success" &&
                "Your enrollment has been successfully confirmed! Taking you to your course now..."}
              {stage === "error" &&
                (errorMessage || "Payment could not be verified automatically. Don't worry, your payment is safe.")}
            </p>
          </div>

          {/* High-Priority Warning Box (When awaiting payment or verifying) */}
          {(stage === "awaiting_payment" || stage === "verifying") && (
            <div className="w-full rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-left flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-extrabold uppercase tracking-wide">
                  Important: Please do not close or leave this page
                </p>
                <p className="opacity-90 leading-relaxed text-[11px]">
                  Do not refresh, close this browser tab, or press the back button while your payment is being processed. You will be automatically redirected as soon as the transaction finishes.
                </p>
              </div>
            </div>
          )}

          {/* Error Actions */}
          {stage === "error" && (
            <div className="w-full pt-2 flex flex-col sm:flex-row gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Retry Payment
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Close &amp; Back
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
