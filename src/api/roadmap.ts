import { getStoredToken } from "@/functions/auth";
import { BACKEND_URL } from "@/config/api";
import { RoadmapDBRecord, RoadmapUserInput } from "@/components/roadmap/types";

export async function generateRoadmapApi(prefs: RoadmapUserInput): Promise<RoadmapDBRecord> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prefs),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to generate roadmap");
  }

  return res.json();
}

export async function fetchUserRoadmapsApi(): Promise<RoadmapDBRecord[]> {
  const token = getStoredToken();
  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch roadmaps");

  return res.json();
}

export async function fetchActiveRoadmapApi(): Promise<RoadmapDBRecord | null> {
  const token = getStoredToken();
  if (!token) return null;

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch active roadmap");
  }

  const data = await res.json();
  return data || null;
}

export async function fetchRoadmapByIdApi(roadmapId: string): Promise<RoadmapDBRecord> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/${roadmapId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch roadmap by ID");

  return res.json();
}

export async function activateRoadmapApi(roadmapId: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/${roadmapId}/activate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok;
}

export async function renameRoadmapApi(roadmapId: string, title: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/${roadmapId}/rename`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Rename failed:", res.status, errorText);
    return false;
  }
  return true;
}

export async function deleteRoadmapApi(roadmapId: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  const res = await fetch(`${BACKEND_URL}/api/v1/roadmap/${roadmapId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok;
}

export async function fetchAdminRoadmapsApi(): Promise<any[]> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BACKEND_URL}/api/v1/admin/roadmaps`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch admin roadmaps list");

  return res.json();
}

export async function fetchAdminRoadmapByIdApi(roadmapId: string): Promise<any> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BACKEND_URL}/api/v1/admin/roadmaps/${roadmapId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch admin roadmap detail");

  return res.json();
}

export async function updateAdminRoadmapApi(
  roadmapId: string,
  data: { title: string; is_active: boolean; structure: any; user_input?: any }
): Promise<any> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BACKEND_URL}/api/v1/admin/roadmaps/${roadmapId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to update admin roadmap");
  }

  return res.json();
}

export async function deleteAdminRoadmapApi(roadmapId: string): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  const res = await fetch(`${BACKEND_URL}/api/v1/admin/roadmaps/${roadmapId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok;
}
