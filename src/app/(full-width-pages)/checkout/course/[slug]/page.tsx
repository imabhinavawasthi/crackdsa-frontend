"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  Lock,
  Loader2,
  Sparkles,
  Star,
  Check,
  Shield,
  Video,
  BookOpen,
  MessageCircle,
  AlertCircle,
  Crown,
} from "lucide-react";
import { CourseSummary } from "@/types/course";
import { PRO_PRICING_CONFIG } from "@/config/pro-pricing";
import { fetchCourseDetail } from "@/api/courses";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/common/Logo";
import {
  applyCoupon,
  createOrder,
  verifyPayment,
  loadRazorpaySDK,
} from "@/functions/checkout";
import PaymentProcessingOverlay, { PaymentStage } from "@/components/checkout/PaymentProcessingOverlay";

function CourseCheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const initialCoupon = searchParams.get("coupon") || "";

  const { user, isLoggedIn, isLoading: isAuthLoading, refetch } = useAuth();

  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [loading, setLoading] = useState(true);

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
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // 1. Fetch Course Data
  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      try {
        const data = await fetchCourseDetail(slug);
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course details", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  // 2. Auto-apply coupon from URL if passed
  useEffect(() => {
    if (course && initialCoupon && !appliedCoupon) {
      handleApplyCoupon(initialCoupon);
    }
  }, [course, initialCoupon]);

  const basePrice = course?.price || 0;
  const originalPrice = course?.original_price || basePrice * 1.5;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = Math.round((basePrice * appliedCoupon.discount_value) / 100);
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  }
  const finalPrice = Math.max(1, basePrice - discountAmount);

  // Coupon Application Handler
  async function handleApplyCoupon(codeToApply?: string) {
    if (!course) return;
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await applyCoupon(code, "course", course.id);

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
    if (!course) return;
    setPaymentError(null);

    if (!isLoggedIn) {
      const currentUrl = `/checkout/course/${slug}${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ""}`;
      if (typeof window !== "undefined") {
        localStorage.setItem("crackdsa_login_redirect", currentUrl);
      }
      router.push(`/login?redirect_to=${encodeURIComponent(currentUrl)}`);
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
        "course",
        course.id,
        appliedCoupon?.code,
        course.title
      );

      const razorpayKey = orderData.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKey,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "CrackDSA",
        description: course.title,
        image: "/images/logo/logo-icon.png",
        order_id: orderData.order_id?.startsWith("order_mock_")
          ? undefined
          : orderData.order_id,
        handler: async function (response: any) {
          setPaymentStage("verifying");
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
              console.warn("Post-purchase auth refetch warning:", authErr);
            }

            setPaymentStage("success");

            // Redirect user to the course page with access unlocked
            setTimeout(() => {
              const targetSlug = course.slug || slug;
              router.push(`/course/${targetSlug}?enrolled=true`);
            }, 1200);
          } catch (verifyErr: any) {
            console.error("Payment verification failed:", verifyErr);
            setPaymentError(
              verifyErr.message ||
                "Payment was processed, but verification failed. Please contact WhatsApp support with your payment receipt."
            );
            setPaymentStage("error");
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
        },
        notes: {
          course_id: course.id,
          slug: course.slug,
          transaction_id: orderData.transaction_id,
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            setPaymentStage("idle");
          },
        },
      };

      // Mock test mode fallback if local mock order ID is returned
      if (orderData.order_id?.startsWith("order_mock_")) {
        setPaymentStage("awaiting_payment");
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
          setPaymentStage("idle");
          return;
        }
      }

      setPaymentStage("awaiting_payment");
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setPaymentError(response.error.description || "Payment failed. Please try again or reach out on WhatsApp.");
        setPaymentStage("error");
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setPaymentError(err.message || "Failed to initialize payment gateway. Please try again.");
      setPaymentStage("error");
      setIsProcessingPayment(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#070B14]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#070B14] p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h1>
        <p className="text-sm text-gray-500 mb-6">The course you are attempting to purchase does not exist.</p>
        <Link
          href="/courses"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
        >
          Browse All Courses
        </Link>
      </div>
    );
  }

  const discountPercent =
    originalPrice > basePrice ? Math.round(((originalPrice - basePrice) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B14] text-gray-900 dark:text-gray-100 selection:bg-blue-500/20 selection:text-blue-600">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/course/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Course</span>
            </Link>
          </div>

          <Logo href="/" />

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Secure</span>
          </div>
        </div>
      </header>

      {/* ── Top Urgency Notice ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
        <span>Instant lifetime access unlocked upon enrollment • Self-paced HD video lectures & notes</span>
      </div>

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center space-y-2 mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Enroll in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:to-indigo-300">
              {course.title}
            </span>
          </h1>
        </div>

        {/* ── 2-Column Layout ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Course Overview, What's Included, Pro Banner, Policy */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Course Highlights Card */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1.5">
                    {course.category || "Full Course"}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    {course.title}
                  </h2>
                </div>
                {course.metadata?.rating && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs shrink-0">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{course.metadata.rating} / 5.0</span>
                  </div>
                )}
              </div>

              {/* Course deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20 space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                    <Video className="w-4 h-4" />
                    <span>{course.total_videos || 150}+ Curated Lectures</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    High-definition whiteboard intuitions, algorithm patterns, and clean code.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-1">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>Complete Practice Problems</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Interactive coding problems with automated testcases, runtime evaluation, and hints.
                  </p>
                </div>
              </div>

              {/* Features list */}
              {course.metadata?.features && (
                <div className="pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Included in this Course:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {course.metadata.features.map((feat: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. CrackDSA Pro Upsell Banner */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Recommendation: CrackDSA Pro
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    Want this course + Weekly Live Classes & 1:1 Doubt Solving?
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    CrackDSA Pro includes this complete course, all future courses, weekly live problem solving, CS fundamentals notes, and private community access starting at just ₹{PRO_PRICING_CONFIG.monthly.price}/month.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/checkout/pro?plan=yearly"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Explore Pro Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-gray-400 font-medium">
                  (Or proceed below to buy only this single course)
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Order Summary, Coupon, Razorpay Checkout */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-7 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Order Summary</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Single Course Enrollment</p>
                </div>
                {discountPercent > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {discountPercent}% Off Applied
                  </span>
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span>Have a Coupon Code?</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
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
                      placeholder="e.g. WELCOME500"
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
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-mono font-bold tracking-wider text-gray-900 dark:text-white placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !couponCodeInput.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
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
              <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
                {originalPrice > basePrice && (
                  <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>Original Price</span>
                    <span className="line-through font-mono">₹{originalPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                  <span>Course Price</span>
                  <span className="font-mono font-semibold">₹{basePrice.toLocaleString("en-IN")}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">-₹{appliedCoupon.discount_amount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-black text-gray-900 dark:text-white">Total Payable</span>
                    <p className="text-[10px] text-gray-400">Lifetime access • Taxes included</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Error Alert */}
              {paymentError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Payment Alert</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{paymentError}</p>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleProceedToPayment}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Secure Gateway...</span>
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

              {/* Trust & WhatsApp Fallback */}
              <div className="pt-3 space-y-3 text-center border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    UPI / Card / NetBanking
                  </span>
                  <span>•</span>
                  <span>Instant Activation</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                  <p className="font-semibold mb-1">Facing any payment failure or issue?</p>
                  <a
                    href={`https://wa.me/919956217210?text=${encodeURIComponent(
                      `Hi CrackDSA team, I need help with payment for ${course.title} at ₹${finalPrice}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp with Mentors (24/7 Support)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Payment Waiting & Processing Overlay */}
      <PaymentProcessingOverlay
        isOpen={paymentStage !== "idle"}
        stage={paymentStage}
        itemName={course.title}
        amount={finalPrice}
        errorMessage={paymentError}
        onRetry={handleProceedToPayment}
        onCancel={() => {
          setPaymentStage("idle");
          setIsProcessingPayment(false);
        }}
      />
    </div>
  );
}

export default function CourseCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#070B14]">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      }
    >
      <CourseCheckoutContent />
    </Suspense>
  );
}
