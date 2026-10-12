import { Briefcase, Compass, GraduationCap, RefreshCw, Rocket, Target } from "lucide-react";
import type { AudienceIcon, Masterclass } from "@/types/masterclass";

const ICONS: Record<AudienceIcon, typeof Target> = {
  graduation: GraduationCap,
  briefcase: Briefcase,
  compass: Compass,
  refresh: RefreshCw,
  target: Target,
  rocket: Rocket,
};

export default function AudienceSection({ audience }: { audience: Masterclass["audience"] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{audience.heading}</h2>
      <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">{audience.subheading}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {audience.items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <article
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
