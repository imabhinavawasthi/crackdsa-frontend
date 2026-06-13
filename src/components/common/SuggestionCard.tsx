import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SuggestionCardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  icon?: React.ReactNode;
}

export default function SuggestionCard({ title, description, buttonText, href, icon }: SuggestionCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-3xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-900/10 p-10 text-center border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{description}</p>
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 px-6 py-3 bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 border border-gray-100 dark:border-gray-700"
      >
        {buttonText} <ChevronRight size={16} />
      </a>
    </motion.div>
  );
}
