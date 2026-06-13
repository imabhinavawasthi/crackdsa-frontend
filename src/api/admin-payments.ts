import { BACKEND_URL } from "@/config/api";
import { getStoredToken } from "@/functions/auth";

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export async function fetchAdminCoupons() {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/payments/coupons`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch coupons");
  return res.json();
}

export async function createAdminCoupon(data: any) {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/payments/coupons`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create coupon");
  }
  return res.json();
}

export async function updateAdminCoupon(id: string, data: any) {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/payments/coupons/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update coupon");
  }
  return res.json();
}

export async function deleteAdminCoupon(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/payments/coupons/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete coupon");
}

export async function fetchAdminTransactions(status?: string, purchaseType?: string) {
  const url = new URL(`${BACKEND_URL}/api/v1/admin/payments/transactions`);
  if (status) url.searchParams.append("status", status);
  if (purchaseType) url.searchParams.append("purchase_type", purchaseType);

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}
