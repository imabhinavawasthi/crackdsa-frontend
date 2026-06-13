import React from "react";
import { Instructor } from "@/types/course";
import { InstructorCard } from "./InstructorCard";
import { Users } from "lucide-react";

export function InstructorSection({ instructors }: { instructors: Instructor[] }) {
  if (!instructors || instructors.length === 0) return null;

  return (
    <section className="px-4 max-w-4xl mx-auto pt-24 pb-12">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest border border-gray-200 dark:border-gray-700">
          <Users size={14} /> Expert Mentors
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Learn from the Best
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
          Our instructors are industry veterans who have cracked top product-based companies and know exactly what it takes to succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instructors.map((instructor, idx) => (
          <InstructorCard key={idx} instructor={instructor} />
        ))}
      </div>
    </section>
  );
}
