import React from "react";
import { Quote, Star } from "lucide-react";

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
};

export function FeedbackCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300">
      <div className="flex gap-1 mb-6 text-amber-500">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      
      <div className="relative flex-1 mb-8">
        <Quote className="absolute -top-3 -left-3 w-8 h-8 text-gray-100 dark:text-gray-800 rotate-180 -z-10" />
        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed z-10 relative">
          "{testimonial.content}"
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto border-t border-gray-100 dark:border-gray-800/80 pt-6">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
          <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
          <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">{testimonial.role} @ {testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}
