"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Masterclass } from "@/types/masterclass";

const INITIAL_COUNT = 5;

export default function FaqSection({ faq }: { faq: Masterclass["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? faq.items : faq.items.slice(0, INITIAL_COUNT);

  return (
    <section className="mb-12 grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          {faq.badge}
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
          {faq.heading}
        </h2>
      </div>

      <div>
        <ul className="space-y-4">
          {visible.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={item.question}
                className={`rounded-lg border bg-white transition-colors dark:bg-white/3 ${
                  isOpen ? "border-blue-400/60" : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{item.question}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-gray-900 dark:text-white" />
                  )}
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {!showAll && faq.items.length > INITIAL_COUNT && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-6 rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Load More
          </button>
        )}
      </div>
    </section>
  );
}
