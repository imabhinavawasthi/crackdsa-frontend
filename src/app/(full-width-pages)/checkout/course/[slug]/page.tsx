"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, ShieldCheck, PlayCircle, BookOpen, Tag, Loader2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useRazorpay } from "react-razorpay";
import { CourseSummary } from "@/types/course";
import { fetchCourseDetail } from "@/api/courses";
import { applyCoupon, createOrder, fetchEligibleCoupons } from "@/functions/checkout";
import { useAuth } from "@/context/AuthContext";
import ExitIntentModal from "@/components/common/ExitIntentModal";

export default function CourseCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { user, refetch } = useAuth();
  const { Razorpay } = useRazorpay();
  
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchCourse() {
      if (!slug) return;
      try {
        const data = await fetchCourseDetail(slug);
        setCourse(data);
        const couponsData = await fetchEligibleCoupons("course", data.id);
        setEligibleCoupons(couponsData.coupons || []);
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [slug]);

  // Exit Intent logic
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShownExitModal && !isProcessing) {
        e.preventDefault();
        e.returnValue = ''; // Standard way to trigger browser's native exit warning
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
      router.push(`/courses/${course?.slug}`);
    }
  };

  const handleAcceptExitOffer = () => {
    setShowExitModal(false);
    applySpecificCoupon("SPECIAL20");
  };

  const originalPrice = course?.original_price || 0;
  const platformDiscount = Math.max(0, originalPrice - (course?.price || 0));
  const basePrice = course?.price || 0;
  
  const finalPrice = useMemo(() => {
    if (!appliedCoupon) return basePrice;
    if (appliedCoupon.type === "percentage") {
      return basePrice - (basePrice * appliedCoupon.value) / 100;
    }
    return Math.max(0, basePrice - appliedCoupon.value);
  }, [basePrice, appliedCoupon]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course not found</h1>
        <Link href="/courses" className="text-brand-500 hover:underline">
          Return to Courses
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !course) return;
    setIsApplying(true);
    setCouponError("");
    
    try {
      // Pass the course ID to the backend validation
      const res = await applyCoupon(couponCode, "course", course.id);
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
    if (!course) return;
    setIsApplying(true);
    setCouponError("");
    try {
      const res = await applyCoupon(code, "course", course.id);
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
      alert("Please log in to purchase.");
      return;
    }
    if (!course) return;
    
    setIsProcessing(true);
    try {
      const order = await createOrder("course", course.id, appliedCoupon?.code);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", 
        amount: order.amount * 100, // paise
        currency: order.currency,
        order_id: order.razorpay_order_id,
        name: "CrackDSA",
        description: `Course - ${course.title}`,
        handler: async function (response: any) {
          setTimeout(async () => {
            await refetch();
            router.push(`/courses/${slug}/learn?payment=success`);
          }, 2000);
        },
        prefill: {
          name: user.full_name || user.email,
          email: user.email,
        },
        theme: {
          color: "#4f46e5", // brand-600
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
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-3xl h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

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
          router.push(`/courses/${course.slug}`);
        }}
      />

      <div className="w-full max-w-6xl mx-auto mt-12 md:mt-8">
        <button onClick={handleBackClick} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8 cursor-pointer">
          <ChevronLeft size={20} />
          <span className="text-sm font-bold">Back to Course Details</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10 items-stretch">
          
          {/* Left: Summary */}
          <div className="flex-1 space-y-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-widest border border-brand-500/20 mb-4"
              >
                Standalone Purchase
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
                {course.title}
              </h1>
              <div 
                className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3 prose prose-sm prose-gray dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PlayCircle className="text-brand-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Full access to {course.total_videos || 0} lectures</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="text-brand-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{course.total_problems || 0} curated practice problems</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-brand-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Lifetime access & future updates</span>
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
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none uppercase placeholder:normal-case placeholder:font-medium transition-all"
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-500/20 bg-brand-500/5 hover:bg-brand-500/10 transition-colors text-xs font-bold text-brand-600 dark:text-brand-400 cursor-pointer"
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
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:bg-brand-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none"
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
