// src/functions/notification.ts

export type Notification = {
  id: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  target?: string;
  time: string;
  category: string;
  isOnline?: boolean;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
const USE_MOCK = true;

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001",
    senderName: "CrackDSA Admin",
    senderAvatar: "/images/logo/logo-icon.svg",
    message: "Welcome to CrackDSA! Start your learning journey today.",
    target: "System",
    time: "Just now",
    category: "Welcome",
    isOnline: true,
  },
];

export async function fetchNotifications(): Promise<Notification[]> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_NOTIFICATIONS;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/user/notification`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
    const data = await res.json();
    return data.notifications as Notification[];
  } catch (err) {
    console.error("[fetchNotifications] error:", err);
    return [];
  }
}
