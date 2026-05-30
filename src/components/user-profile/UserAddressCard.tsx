"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  formatProfileDate,
  formatProfileDateTime,
} from "./profileUtils";

export default function UserAddressCard() {
  const { user } = useAuth();

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Account Details
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Member Since
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {formatProfileDate(user?.created_at)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Last Sign In
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {formatProfileDateTime(user?.last_sign_in_at)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Last Updated
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {formatProfileDateTime(user?.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
