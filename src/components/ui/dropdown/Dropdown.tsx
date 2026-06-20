"use client";
import type React from "react";
import { useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, (event) => {
    if (!(event.target as HTMLElement).closest(".dropdown-toggle")) {
      onClose();
    }
  });
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-40  right-0 mt-2  rounded-xl border border-gray-200 bg-white  shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </div>
  );
};
