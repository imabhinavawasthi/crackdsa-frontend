"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DSATopicModule } from "@/config/dsa-catalog";
import { DSATopicCard } from "./DSATopicCard";
import { fadeInUp } from "@/utils/animations";

interface DSACarouselSectionProps {
  title: string;
  description: string;
  modules: DSATopicModule[];
  isLoading?: boolean;
}

export function DSACarouselSection({
  title,
  description,
  modules,
  isLoading,
}: DSACarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -330 : 330;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="space-y-4"
    >
      {/* Section Header with Left / Right Scroll Controls */}
      <div className="flex items-end justify-between border-b border-gray-200/50 dark:border-gray-800/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121722] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121722] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all shadow-xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-1 px-1 -mx-1"
      >
        {isLoading
          ? [1, 2, 3, 4].map((idx) => (
              <DSATopicCard
                key={idx}
                module={modules[0] || { id: "skeleton" }}
                isLoading
              />
            ))
          : modules.map((module) => (
              <DSATopicCard key={module.id} module={module} />
            ))}
      </div>
    </motion.section>
  );
}
