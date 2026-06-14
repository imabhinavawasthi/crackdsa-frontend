"use client";

import { TRUST_COMPANIES } from "@/constants/landing";
import { Reveal } from "./Reveal";

export default function TrustBar() {
  return (
    <section className="relative py-16 bg-gray-950 border-y border-gray-900/60">
      <Reveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Label */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">
            Mentors &amp; alumni from
          </p>

          {/* Company names */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUST_COMPANIES.map((company) => (
              <span
                key={company}
                className="text-lg sm:text-xl font-bold text-gray-600 hover:text-gray-400 transition-colors duration-300 select-none"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
