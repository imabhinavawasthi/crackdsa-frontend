"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const ReferEarnButton: React.FC = () => (
  <Link href="/refer-earn" className="hidden lg:inline-flex">
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/5 border border-brand-200 dark:border-brand-500/10 text-brand-600 dark:text-brand-400 text-[11px] font-bold transition-all hover:bg-brand-100 dark:hover:bg-brand-500/10"
    >
      <Gift size={14} />
      <span>Refer & Earn</span>
    </motion.div>
  </Link>
);

export default ReferEarnButton;
