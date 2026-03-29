import React from "react";
import Image from "next/image";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Notification } from "@/functions/notification";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onItemClick?: () => void;
  className?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onItemClick,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        No notifications yet.
      </div>
    );
  }

  return (
    <ul className={`flex flex-col h-auto overflow-y-auto custom-scrollbar ${className}`}>
      {notifications.map((notif) => (
        <li key={notif.id} className="last:border-none">
          <DropdownItem
            onItemClick={onItemClick}
            className="flex gap-4 rounded-xl border-b border-gray-100 p-4 transition-all hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
          >
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5">
              <Image
                width={48}
                height={48}
                src={notif.senderAvatar}
                alt={notif.senderName}
                className="w-full h-full object-contain"
              />
              {notif.isOnline && (
                <span className="absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-2 border-white bg-success-500 dark:border-gray-900"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-white mr-1.5">
                  {notif.senderName}
                </span>
                {notif.message}
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-500 font-medium">
                <span className="uppercase tracking-wider text-[10px] text-brand-500 dark:text-brand-400">
                  {notif.category}
                </span>
                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                <span>{notif.time}</span>
              </div>
            </div>
          </DropdownItem>
        </li>
      ))}
    </ul>
  );
};
