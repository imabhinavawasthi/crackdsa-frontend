import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";

export interface UserAssetState {
  id: string;
  user_id: string;
  asset_id: string;
  asset_type: "problem" | "video" | "article";
  status: "pending" | "done" | "revision";
  is_bookmarked: boolean;
  notes?: any[];
  updated_at?: string;
}

export interface UpdateAssetStatePayload {
  status?: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  notes?: any[];
}

/**
 * Fetches all asset states for the currently authenticated user.
 */
export async function fetchUserAssetStates(): Promise<UserAssetState[]> {
  const token = getStoredToken();
  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/api/v1/user/assets/states`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user asset states");
  }

  return res.json();
}

/**
 * Updates the asset state for a specific asset (problem, video, article).
 */
export async function updateUserAssetState(
  assetType: "problem" | "video" | "article",
  assetId: string,
  payload: UpdateAssetStatePayload
): Promise<UserAssetState> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/user/assets/states/${assetType}/${assetId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Failed to update asset state for ${assetType} ${assetId}`);
  }

  return res.json();
}
