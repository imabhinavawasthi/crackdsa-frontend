import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import { DSASheet, DetailedProblem } from "@/types/dsa-sheet";

/** Shared helper — builds auth headers if a token exists. */
function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetches the public DSA sheets library.
 */
export async function fetchSheets(): Promise<DSASheet[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/dsa-sheets`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch DSA sheets.");
  return res.json();
}

/**
 * Fetches a single DSA sheet by its ID/slug.
 */
export async function fetchSheetDetail(id: string): Promise<DSASheet> {
  const res = await fetch(`${BACKEND_URL}/api/v1/dsa-sheets/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Sheet not found" : "Failed to load sheet details");
  }
  return res.json();
}

/**
 * Fetches all detailed problems for a single DSA sheet.
 */
export async function fetchSheetProblems(id: string): Promise<DetailedProblem[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/dsa-sheets/${id}/problems`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Sheet not found" : "Failed to load sheet problems");
  }
  return res.json();
}

/**
 * [ADMIN] Fetches all DSA sheets (including inactive ones).
 */
export async function fetchAdminSheets(): Promise<DSASheet[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/dsa-sheets`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Unable to fetch admin DSA sheets.");
  return res.json();
}

/**
 * [ADMIN] Creates a new DSA sheet.
 */
export async function createSheet(data: Partial<DSASheet>): Promise<DSASheet> {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/dsa-sheets`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create DSA sheet.");
  }
  return res.json();
}

/**
 * [ADMIN] Updates an existing DSA sheet.
 */
export async function updateSheet(id: string, data: Partial<DSASheet>): Promise<DSASheet> {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/dsa-sheets/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update DSA sheet.");
  }
  return res.json();
}

/**
 * [ADMIN] Soft deletes a DSA sheet.
 */
export async function deleteSheet(id: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/v1/admin/dsa-sheets/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete DSA sheet.");
  }
}

