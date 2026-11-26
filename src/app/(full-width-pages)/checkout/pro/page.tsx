"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function ProCheckoutRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan") || "yearly";
    const coupon = searchParams.get("coupon") || "";
    router.replace(`/pro?checkout=true&plan=${plan}${coupon ? `&coupon=${coupon}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#070B14]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );
}

export default function ProCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <ProCheckoutRedirect />
    </Suspense>
  );
}
