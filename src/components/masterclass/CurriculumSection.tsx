import { Clock } from "lucide-react";
import type { Masterclass } from "@/types/masterclass";

export default function CurriculumSection({ curriculum }: { curriculum: Masterclass["curriculum"] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{curriculum.heading}</h2>
      <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">{curriculum.subheading}</p>

      <ol className="relative mt-8 space-y-5">
        <span className="absolute bottom-4 left-5 top-4 w-px bg-gradient-to-b from-blue-500 via-blue-400/40 to-transparent" />
        {curriculum.modules.map((module, i) => (
          <li key={module.title} className="relative pl-16">
            <span className="absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/30 ring-4 ring-gray-50 dark:ring-[#0B0F19]">
              {i + 1}
            </span>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-white/3 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{module.title}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Clock className="h-3.5 w-3.5" />
                  {module.duration}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {module.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
