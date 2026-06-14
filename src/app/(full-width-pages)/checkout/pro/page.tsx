"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Crown, CheckCircle2, ShieldCheck, Tag, Loader2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRazorpay } from "react-razorpay";
import { applyCoupon, createOrder, fetchEligibleCoupons } from "@/functions/checkout";
import { useAuth } from "@/context/AuthContext";
import ExitIntentModal from "@/components/common/ExitIntentModal";

const PLANS = {
  "3_months": { title: "3 Months", price: 2999, original: 4500 },
  "6_months": { title: "6 Months", price: 4999, original: 8000 },
  "12_months": { title: "12 Months (Best Value)", price: 7999, original: 15000 },
};

export default function ProCheckoutPage() {
  const router = useRouter();
  const { user, refetch } = useAuth();
  const { Razorpay } = useRazorpay();
  
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>("6_months");
  
  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, type: string, value: number} | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [eligibleCoupons, setEligibleCoupons] = useState<any[]>([]);
  
  // Exit Intent State
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasShownExitModal, setHasShownExitModal] = useState(false);
  
  // Payment State
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = PLANS[selectedPlan].price;
  const originalPrice = PLANS[selectedPlan].original;
  const platformDiscount = Math.max(0, originalPrice - basePrice);
  
  // Fetch coupons on mount
  React.useEffect(() => {
    async function loadCoupons() {
      const data = await fetchEligibleCoupons("pro_subscription", selectedPlan);
      setEligibleCoupons(data.coupons || []);
    }
    loadCoupons();
  }, [selectedPlan]);

  // Exit Intent logic
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShownExitModal && !isProcessing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitModal && !isProcessing) {
        setShowExitModal(true);
        setHasShownExitModal(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShownExitModal, isProcessing]);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasShownExitModal) {
      setShowExitModal(true);
      setHasShownExitModal(true);
    } else {
      router.push("/courses");
    }
  };

  const handleAcceptExitOffer = () => {
    setShowExitModal(false);
    applySpecificCoupon("SPECIAL20");
  };

  const finalPrice = useMemo(() => {
    if (!appliedCoupon) return basePrice;
    if (appliedCoupon.type === "percentage") {
      return basePrice - (basePrice * appliedCoupon.value) / 100;
    }
    return Math.max(0, basePrice - appliedCoupon.value);
  }, [basePrice, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError("");
    
    try {
      const res = await applyCoupon(couponCode, "pro_subscription", selectedPlan);
      if (res.valid) {
        setAppliedCoupon({ code: couponCode, type: res.discount_type, value: res.discount_value });
      } else {
        setCouponError(res.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError(err.message || "Error validating coupon");
      setAppliedCoupon(null);
    } finally {
      setIsApplying(false);
    }
  };

  const applySpecificCoupon = async (code: string) => {
    setCouponCode(code);
    setIsApplying(true);
    setCouponError("");
    try {
      const res = await applyCoupon(code, "pro_subscription", selectedPlan);
      if (res.valid) {
        setAppliedCoupon({ code, type: res.discount_type, value: res.discount_value });
      } else {
        setCouponError(res.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError(err.message || "Error validating coupon");
      setAppliedCoupon(null);
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePayment = async () => {
    if (!user) {
      // Need login, maybe redirect or show modal. For MVP, we assume they are logged in if they reach here
      alert("Please log in to purchase.");
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create Order on Backend
      const order = await createOrder("pro_subscription", selectedPlan, appliedCoupon?.code);
      
      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", 
        amount: order.amount * 100, // paise
        currency: order.currency,
        order_id: order.razorpay_order_id,
        name: "CrackDSA",
        description: `PRO Subscription - ${PLANS[selectedPlan].title}`,
        handler: async function (response: any) {
          // Webhook handles the actual backend fulfillment, but we can optimistically redirect
          // We should ideally wait a second for the webhook to process, then refetch user
          setTimeout(async () => {
            await refetch();
            router.push("/dashboard?payment=success");
          }, 2000);
        },
        prefill: {
          name: user.full_name || user.email,
          email: user.email,
        },
        theme: {
          color: "#f59e0b", // amber-500
        },
      };

      const rzp1 = new Razorpay(options);
      
      rzp1.on("payment.failed", function (response: any) {
        alert("Payment failed. Please try again.");
      });
      
      rzp1.open();
      
    } catch (err: any) {
      alert("Failed to initiate payment: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] py-12 px-4 relative flex items-center justify-center">
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-3xl h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <Image className="dark:hidden" src="/images/logo/logo.svg" alt="CrackDSA" width={140} height={35} />
        <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="CrackDSA" width={140} height={35} />
      </div>

      <ExitIntentModal 
        isOpen={showExitModal} 
        onAccept={handleAcceptExitOffer}
        onDecline={() => {
          setShowExitModal(false);
          router.push("/courses");
        }}
      />

      <div className="w-full max-w-6xl mx-auto mt-12 md:mt-8">
        <button onClick={handleBackClick} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8 cursor-pointer">
          <ChevronLeft size={20} />
          <span className="text-sm font-bold">Back to Academy</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10 items-stretch">
          
          {/* Left: Summary */}
          <div className="flex-1 space-y-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/20 mb-4"
              >
                <Crown size={14} /> PRO Subscription
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                Unlock Everything.
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Get full access to all current and future premium courses, 1:1 mentorship sessions, and exclusive AI roadmap generations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Access to 20+ specialized tracks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Monthly 1:1 Doubt Support Sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Unlimited AI Roadmaps</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Early access to new modules</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Select Plan Duration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.entries(PLANS) as [keyof typeof PLANS, any][]).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedPlan(key); removeCoupon(); }}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedPlan === key 
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-amber-200 dark:hover:border-gray-700'
                    }`}
                  >
                    {selectedPlan === key && (
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{plan.title}</div>
                    <div className="text-lg font-black text-gray-900 dark:text-white">₹{plan.price}</div>
                    <div className="text-xs text-gray-400 line-through mt-1">₹{plan.original}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none backdrop-blur-xl h-full flex flex-col">
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="mb-6 space-y-4">
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
                  <span>Original Price</span>
                  <span className="font-medium line-through">₹{originalPrice}</span>
                </div>
                
                {platformDiscount > 0 && (
                  <div className="flex justify-between items-center text-gray-900 dark:text-gray-200 text-sm">
                    <span>Platform Discount</span>
                    <span className="font-medium">-₹{platformDiscount}</span>
                  </div>
                )}
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-sm">
                    <span className="flex items-center gap-1.5"><Tag size={14} /> Coupon ({appliedCoupon.code})</span>
                    <span className="font-medium">-₹{basePrice - finalPrice}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-bold">Total to pay</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-white">₹{finalPrice}</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-8">
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Have a coupon?"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none uppercase placeholder:normal-case placeholder:font-medium transition-all"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponCode.trim()}
                        className="px-5 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        {isApplying ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-xs font-semibold text-rose-500 pl-1">{couponError}</p>}
                    
                    {/* Eligible Coupons */}
                    {eligibleCoupons.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {eligibleCoupons.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => applySpecificCoupon(c.code)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer"
                          >
                            <Tag size={12} /> {c.code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3.5">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-bold uppercase tracking-wide">'{appliedCoupon.code}' applied</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4">
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none transition-all"
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <><CreditCard size={20} /> Proceed to Pay</>}
                </button>
                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                  <ShieldCheck size={14} />
                  <span>Secure 256-bit SSL encryption by Razorpay</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
