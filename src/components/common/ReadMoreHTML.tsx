"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReadMoreHTMLProps {
  content: string;
  maxHeight?: number;
}

export default function ReadMoreHTML({ content, maxHeight = 160 }: ReadMoreHTMLProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  React.useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > maxHeight) {
      setNeedsTruncation(true);
    }
  }, [content, maxHeight]);

  return (
    <div className="relative">
      <motion.div
        animate={{ height: isExpanded || !needsTruncation ? "auto" : maxHeight }}
        initial={false}
        className="overflow-hidden"
      >
        <div 
          ref={contentRef}
          className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium prose-p:my-2 prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-ul:my-2 prose-li:my-0.5" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </motion.div>
      
      {needsTruncation && !isExpanded && (
        <div className="absolute bottom-10 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
      )}
      
      {needsTruncation && (
        <div className="relative pt-3 flex justify-center border-t border-gray-100 dark:border-gray-800/60 mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 text-xs font-bold uppercase tracking-wider transition-all shadow-sm border border-gray-200 dark:border-gray-700 hover:border-brand-500/30 dark:hover:border-brand-500/30"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span> <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Read More</span> <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
