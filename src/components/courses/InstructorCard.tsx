import React from "react";
import { Instructor } from "@/types/course";
import { Building2 } from "lucide-react";

export function InstructorCard({ instructor }: { instructor: Instructor }) {
  // Extract initials for avatar fallback
  const initials = instructor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-300">
      
      {/* Avatar */}
      <div 
        className={`w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-[1.5rem] bg-gradient-to-br ${instructor.color} flex items-center justify-center shadow-inner relative overflow-hidden group`}
      >
        <span className="text-3xl sm:text-5xl font-black text-white mix-blend-overlay group-hover:scale-110 transition-transform duration-500">
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1">
            {instructor.name}
          </h3>
          <p className="text-brand-600 dark:text-brand-400 font-bold text-sm">
            {instructor.role}
          </p>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 w-fit mx-auto md:mx-0 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 text-xs font-semibold">
          <Building2 size={14} />
          {instructor.company}
        </div>
      </div>

    </div>
  );
}
