"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import React from "react";

interface LoginButtonProps {
  redirectTo?: string;
  className?: string;
  label?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  redirectTo,
  className = "",
  label = "Login",
}) => {
  const pathname = usePathname();
  const redirectTarget = redirectTo ?? pathname;
  const href = `/login?redirect_to=${encodeURIComponent(redirectTarget)}`;

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={`group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gray-900 px-4 py-1.5 text-[13px] font-bold text-white shadow-sm transition-all hover:shadow-gray-900/10 dark:bg-white dark:text-gray-900 ${className}`}
      >
        <span>{label}</span>
        <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
};

export default LoginButton;
