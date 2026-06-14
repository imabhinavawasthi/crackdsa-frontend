import { BACKEND_URL } from "@/config/api";
import { getStoredToken } from "./auth";

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export async function fetchEligibleCoupons(purchaseType: string, targetId?: string) {
  const url = new URL(`${BACKEND_URL}/api/v1/checkout/coupons`);
  url.searchParams.append("purchase_type", purchaseType);
  if (targetId) url.searchParams.append("target_id", targetId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: authHeaders(),
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
    headers: authHeaders(),
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

export async function createOrder(purchaseType: string, targetId?: string, couponCode?: string) {
  const res = await fetch(`${BACKEND_URL}/api/v1/checkout/create-order`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "omit",
    body: JSON.stringify({
      purchase_type: purchaseType,
      target_id: targetId,
      coupon_code: couponCode,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to create order");
  }

  return res.json();
}



