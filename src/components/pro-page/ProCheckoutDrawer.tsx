"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Tag,
  ArrowRight,
  Sparkles,
  Check,
  Shield,
  Video,
  Radio,
  MessageCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PRO_PRICING_CONFIG, ProPricingTier } from "@/config/pro-pricing";
import { applyCoupon, createOrder, verifyPayment, loadRazorpaySDK } from "@/functions/checkout";

interface ProCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: "monthly" | "yearly" | "lifetime";
  initialCoupon?: string;
}

export function ProCheckoutDrawer({
  isOpen,
  onClose,
  initialPlanId = "yearly",
  initialCoupon = "",
}: ProCheckoutDrawerProps) {
  const router = useRouter();
  const { user, isLoggedIn, refetch } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<"monthly" | "yearly" | "lifetime">(
    PRO_PRICING_CONFIG[initialPlanId] ? initialPlanId : "yearly"
  );

  const plan: ProPricingTier = PRO_PRICING_CONFIG[selectedPlanId] || PRO_PRICING_CONFIG.yearly;

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    discount_amount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Sync initialPlanId when changed from parent
  useEffect(() => {
    if (initialPlanId && PRO_PRICING_CONFIG[initialPlanId]) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Recalculate discount amount whenever plan or applied coupon changes
  const basePrice = plan.price;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = Math.round((basePrice * appliedCoupon.discount_value) / 100);
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  }
  const finalPrice = Math.max(1, basePrice - discountAmount);

  // Coupon Application Handler (Strictly manual verification, no public fetching)
  async function handleApplyCoupon(codeToApply?: string) {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await applyCoupon(code, "pro_subscription", selectedPlanId);

      if (res.valid && res.discount_value) {
        let calcDiscount = 0;
        if (res.discount_type === "percentage") {
          calcDiscount = Math.round((basePrice * res.discount_value) / 100);
        } else {
          calcDiscount = res.discount_value;
        }

        setAppliedCoupon({
          code: code,
          discount_type: res.discount_type,
          discount_value: res.discount_value,
          discount_amount: calcDiscount,
        });
        setCouponCodeInput(code);
        setCouponSuccess(`Coupon ${code} applied! Saved ₹${calcDiscount.toLocaleString("en-IN")}`);
      } else {
        setCouponError(res.message || "Invalid coupon code");
      }
    } catch (err: any) {
      setCouponError(err.message || "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError(null);
    setCouponSuccess(null);
  }

  // Payment Execution via Razorpay
  async function handleProceedToPayment() {
    setPaymentError(null);

    if (!isLoggedIn) {
      const returnUrl = `/pro?checkout=true&plan=${selectedPlanId}${
        appliedCoupon ? `&coupon=${appliedCoupon.code}` : ""
      }`;
      if (typeof window !== "undefined") {
        localStorage.setItem("crackdsa_login_redirect", returnUrl);
      }
      router.push(`/login?redirect_to=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setIsProcessingPayment(true);

    try {
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded && !(window as any).Razorpay) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection and try again."
        );
      }

      const orderData = await createOrder(
        "pro_subscription",
        selectedPlanId,
        appliedCoupon?.code,
        `CrackDSA Pro (${plan.name})`
      );

      const razorpayKey = orderData.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKey,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "CrackDSA Pro",
        description: `${plan.name} - Complete Placement Pass`,
        image: "/images/logo/logo-icon.svg",
        order_id: orderData.order_id?.startsWith("order_mock_")
          ? undefined
          : orderData.order_id,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              transaction_id: orderData.transaction_id,
              razorpay_order_id: response.razorpay_order_id || orderData.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            try {
              await refetch();
            } catch (authErr) {
              console.warn("Post-payment auth refetch error:", authErr);
            }

            onClose();
            router.push(`/profile/subscription?status=success&plan=${selectedPlanId}`);
          } catch (verifyErr: any) {
            console.error("Payment verification failed:", verifyErr);
            setPaymentError(
              verifyErr.message ||
                "Payment was processed, but verification failed. Please contact WhatsApp support with your payment receipt."
            );
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
        },
        notes: {
          plan_id: plan.id,
          transaction_id: orderData.transaction_id,
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      // Mock test mode fallback if local mock order ID is returned
      if (orderData.order_id?.startsWith("order_mock_")) {
        const confirmMock = window.confirm(
          `[TEST MODE SIMULATION]\n\nRazorpay test order initialized for ₹${orderData.amount}.\nClick OK to simulate successful test payment, or Cancel to abort.`
        );
        if (confirmMock) {
          options.handler({
            razorpay_order_id: orderData.order_id,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: "mock_test_signature",
          });
          return;
        } else {
          setIsProcessingPayment(false);
          return;
        }
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setPaymentError(
          response.error.description ||
            "Payment failed. Please try again or reach out on WhatsApp."
        );
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setPaymentError(err.message || "Failed to initialize payment gateway. Please try again.");
      setIsProcessingPayment(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-lg bg-white dark:bg-[#0c121e] text-gray-900 dark:text-gray-100 shadow-2xl flex flex-col h-full border-l border-gray-200 dark:border-gray-800"
            >
              {/* ── Drawer Header ────────────────────────────────────────── */}
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#0c121e]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-white">
                      CrackDSA Pro Checkout
                    </h2>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Close checkout drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Scrollable Body ──────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* 1. Plan Switcher Tabs */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Select Plan:
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800">
                    {(["monthly", "yearly", "lifetime"] as const).map((tierKey) => {
                      const p = PRO_PRICING_CONFIG[tierKey];
                      if (!p) return null;
                      const isSelected = p.id === selectedPlanId;

                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlanId(p.id);
                            if (appliedCoupon) {
                              let calcDiscount = 0;
                              if (appliedCoupon.discount_type === "percentage") {
                                calcDiscount = Math.round((p.price * appliedCoupon.discount_value) / 100);
                              } else {
                                calcDiscount = appliedCoupon.discount_value;
                              }
                              setAppliedCoupon({
                                ...appliedCoupon,
                                discount_amount: calcDiscount,
                              });
                            }
                          }}
                          className={`relative p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-0.5 ${
                            isSelected
                              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm font-black border border-blue-500/30 ring-1 ring-blue-500/20"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold"
                          }`}
                        >
                          {p.topBadge && (
                            <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-blue-600 text-white leading-tight">
                              Popular
                            </span>
                          )}
                          <span className="text-xs leading-tight">{p.name.replace(" Pass", "")}</span>
                          <span className="text-xs font-bold font-mono">
                            ₹{p.price.toLocaleString("en-IN")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Order Summary Card */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 dark:border-gray-800/80">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {plan.id === "monthly"
                          ? "Billed monthly • Cancel anytime"
                          : plan.id === "yearly"
                          ? "Full 2 Years Access (< ₹9/day)"
                          : "Permanent Lifetime Member Access"}
                      </p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      {plan.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Manual Coupon Code Input (No public code list) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-500" />
                        <span>Have a Coupon Code?</span>
                      </span>
                      {appliedCoupon && (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[10px] text-red-500 hover:underline font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </label>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                          <span>Code &lsquo;{appliedCoupon.code}&rsquo; Active</span>
                        </div>
                        <span>-₹{appliedCoupon.discount_amount.toLocaleString("en-IN")}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="ENTER CODE"
                          value={couponCodeInput}
                          onChange={(e) => {
                            setCouponCodeInput(e.target.value.toUpperCase());
                            setCouponError(null);
                            setCouponSuccess(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs uppercase font-mono font-bold tracking-wider text-gray-900 dark:text-white placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <button
                          type="button"
                          disabled={couponLoading || !couponCodeInput.trim()}
                          onClick={() => handleApplyCoupon()}
                          className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponError}</span>
                      </p>
                    )}

                    {couponSuccess && (
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponSuccess}</span>
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-gray-200/60 dark:border-gray-800/80 text-xs">
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                      <span>Regular Price</span>
                      <span className="line-through font-mono">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span>Plan Price</span>
                      <span className="font-mono font-semibold">₹{plan.price.toLocaleString("en-IN")}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span className="font-mono">-₹{appliedCoupon.discount_amount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-baseline justify-between">
                      <div>
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          Total Payable
                        </span>
                        <p className="text-[10px] text-gray-400">All taxes & live mentorship included</p>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-mono">
                        ₹{finalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Included Deliverables Checklist */}
                <div className="space-y-2.5 p-4 rounded-2xl bg-blue-50/30 dark:bg-blue-950/20 border border-blue-500/20">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocked Immediately:</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>200+ Video Lectures by Abhinav Awasthi</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Weekly Live Problem Solving Sessions</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Weekly 1:1 Live Doubt Resolution Classes</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>CS Fundamentals & System Design Notes</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Curated CP Topic Sheets & Editorials</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Private Community & Off-Campus Hiring Drops</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* ── Fixed Footer CTA ─────────────────────────────────────── */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-md space-y-3 shrink-0">
                {paymentError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
                    {paymentError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Launching Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {isLoggedIn
                          ? `Pay ₹${finalPrice.toLocaleString("en-IN")}`
                          : "Sign In to Proceed to Payment"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    UPI, Cards, NetBanking
                  </span>

                  <a
                    href={`https://wa.me/919956217210?text=${encodeURIComponent(
                      `Hi CrackDSA team, I need help with payment for CrackDSA Pro (${plan.name}) at ₹${finalPrice}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Help</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
