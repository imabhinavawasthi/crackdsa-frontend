import { BarChart3, CalendarCheck, Map, Rocket, ShieldCheck, Zap } from "lucide-react";
import type { Masterclass, OutcomeIcon } from "@/types/masterclass";

const ICONS: Record<OutcomeIcon, typeof Map> = {
  map: Map,
  zap: Zap,
  calendar: CalendarCheck,
  chart: BarChart3,
  shield: ShieldCheck,
  rocket: Rocket,
};

export default function OutcomesSection({ outcomes }: { outcomes: Masterclass["outcomes"] }) {
  return (
    <section className="relative mb-12 overflow-hidden rounded-3xl bg-[#0B1F3F] p-6 sm:p-10 lg:p-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative max-w-2xl">
        <span className="inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
          {outcomes.badge}
        </span>
        <h2 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">{outcomes.heading}</h2>
        <p className="mt-3 text-base text-blue-100/70">{outcomes.subheading}</p>
      </div>

      <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {outcomes.items.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/10"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-4xl font-bold text-white/10">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-100/70">{item.description}</p>
              {item.metric && (
                <p className="mt-4 inline-block rounded-md bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
                  {item.metric}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
