import { BACKEND_URL } from "@/config/api";
import { getValidAccessToken } from "./auth";

async function authHeaders(): Promise<HeadersInit> {
  const token = await getValidAccessToken();
  return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export async function fetchEligibleCoupons(purchaseType: string, targetId?: string) {
  const url = new URL(`${BACKEND_URL}/api/v1/checkout/coupons`);
  url.searchParams.append("purchase_type", purchaseType);
  if (targetId) url.searchParams.append("target_id", targetId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: await authHeaders(),
    credentials: "omit",
  });

  if (!res.ok) {
    return { coupons: [] }; // silent fail, just no coupons
  }

  return res.json();
}

export async function applyCoupon(code: string, purchaseType: string, targetId?: string) {
  const res = await fetch(`${BACKEND_URL}/api/v1/checkout/apply-coupon`, {
    method: "POST",
    headers: await authHeaders(),
    credentials: "omit",
    body: JSON.stringify({
      code,
      purchase_type: purchaseType,
      target_id: targetId,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to apply coupon");
  }

  return res.json();
}

export async function createOrder(purchaseType: string, targetId?: string, couponCode?: string, targetName?: string) {
  const res = await fetch(`${BACKEND_URL}/api/v1/checkout/create-order`, {
    method: "POST",
    headers: await authHeaders(),
    credentials: "omit",
    body: JSON.stringify({
      purchase_type: purchaseType,
      target_id: targetId,
      target_name: targetName,
      coupon_code: couponCode,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to create order");
  }

  return res.json();
}




export async function verifyPayment(payload: {
  transaction_id: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}) {
  const res = await fetch(`${BACKEND_URL}/api/v1/checkout/verify`, {
    method: "POST",
    headers: await authHeaders(),
    credentials: "omit",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Payment verification failed");
  }

  return res.json();
}

/**
 * Dynamically loads the official Razorpay checkout.js SDK
 */
export function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.getElementById("razorpay-checkout-sdk") as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as any).Razorpay) {
        return resolve(true);
      }
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      // Fallback check after 500ms in case load event already fired
      setTimeout(() => {
        if ((window as any).Razorpay) resolve(true);
      }, 500);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function fetchMyTransactions() {
  const res = await fetch(`${BACKEND_URL}/api/v1/checkout/transactions`, {
    method: "GET",
    headers: await authHeaders(),
    credentials: "omit",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to fetch transactions");
  }

  return res.json();
}
