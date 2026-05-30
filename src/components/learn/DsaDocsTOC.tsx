"use client";

import React, { useEffect, useState } from "react";
import { Link2, Sparkles } from "lucide-react";

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

interface DsaDocsTOCProps {
  headings: TOCHeading[];
}

export default function DsaDocsTOC({ headings }: DsaDocsTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");

  // Setup scroll listener using Intersection Observer
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -60% 0px", // Trigger when heading scrolls into the top 40% of viewport
        threshold: 0.1
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const handleScrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Find main stage scrolling element (our classroom scroll container has id 'classroom-main-stage' or is window)
      // Standard docs page layout scroll is either the page window or an overflow container.
      // Let's use simple scrollIntoView with smooth scroll!
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      
      // Update hash in URL cleanly
      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  const handleCopyAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const anchorUrl = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(anchorUrl);
    
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId("");
    }, 1500);
  };

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-60 shrink-0 sticky top-20 h-[fit-content] max-h-[80vh] overflow-y-auto custom-scrollbar p-5 border-l border-gray-150 dark:border-gray-800 bg-transparent">
      
      <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <Sparkles size={10} className="text-brand-500" />
        <span>On This Page</span>
      </h3>

      <nav className="space-y-2.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const isCopied = copiedId === heading.id;
          const paddingLeft = heading.level === 3 ? "pl-4" : heading.level === 4 ? "pl-8" : "pl-1";
          
          return (
            <div
              key={heading.id}
              className={`group flex items-center justify-between text-[11px] font-bold ${paddingLeft}`}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleScrollToHeading(e, heading.id)}
                className={`flex-1 hover:text-brand-500 dark:hover:text-brand-400 transition-colors leading-relaxed select-none ${
                  isActive
                    ? "text-brand-500 dark:text-brand-400 font-extrabold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {heading.text}
              </a>

              {/* Hover Copy link button */}
              <button
                onClick={(e) => handleCopyAnchor(e, heading.id)}
                className={`opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-300 hover:text-brand-500 dark:text-gray-600 dark:hover:text-brand-400 transition-all ${
                  isCopied ? "!opacity-100 text-emerald-500 dark:text-emerald-400" : ""
                }`}
                title={isCopied ? "Anchor Link Copied!" : "Copy Heading Link"}
              >
                {isCopied ? (
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wide px-1 select-none">
                    Copied
                  </span>
                ) : (
                  <Link2 size={10} />
                )}
              </button>

            </div>
          );
        })}
      </nav>

    </aside>
  );
}
