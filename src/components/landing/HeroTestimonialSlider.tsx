"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { LANDING_CONFIG } from "@/config/landing.config";

export default function HeroTestimonialSlider() {
  const testimonials = LANDING_CONFIG.hero.testimonials;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <div className="pt-6 border-t border-gray-200/80 dark:border-gray-800/80 w-full">
      <div className="flex items-start gap-3 min-h-[3rem]">
        <Quote size={16} className="text-brand-500/40 dark:text-brand-400/30 shrink-0 mt-0.5 rotate-180" />
        <div className="overflow-hidden relative flex-1">
          <p
            key={index}
            className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed animate-fade-in"
          >
            &ldquo;{current.quote}&rdquo;
            <span className="not-italic text-xs text-gray-400 dark:text-gray-500 ml-2 font-semibold">
              — {current.name}, {current.role}
            </span>
          </p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5 mt-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index
                ? "w-5 bg-brand-500 dark:bg-brand-400"
                : "w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
