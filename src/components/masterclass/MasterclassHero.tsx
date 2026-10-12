"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Columns3, Play, X } from "lucide-react";
import type { Masterclass, MasterclassBadgeIcon } from "@/types/masterclass";

const BADGE_ICONS: Record<MasterclassBadgeIcon, typeof Clock> = {
  layout: Columns3,
  calendar: CalendarDays,
  clock: Clock,
};

export default function MasterclassHero({ hero }: { hero: Masterclass["hero"] }) {
  const [playing, setPlaying] = useState(false);
  const { video } = hero;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0B1F3F] p-6 sm:p-10 lg:p-14">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {hero.heading}
          </h1>
          <p className="mt-5 max-w-xl text-base text-blue-100/80">{hero.subheading}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {hero.badges.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon];
              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium uppercase tracking-wide text-[#0B1F3F]"
                >
                  <Icon className="h-4 w-4" />
                  {badge.label}
                </span>
              );
            })}
          </div>

          <Link
            href={hero.cta.href}
            className="mt-8 inline-block rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            {hero.cta.label}
          </Link>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-blue-300/20 bg-gradient-to-br from-blue-500/40 via-[#16356b] to-[#0B1F3F]">
          {video.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={video.thumbnail} alt={video.instructorName} className="absolute inset-0 h-full w-full object-cover" />
          )}
          {playing && video.url ? (
            <>
              <iframe
                src={video.url}
                title={hero.heading}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
              <button
                onClick={() => setPlaying(false)}
                aria-label="Close video"
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => video.url && setPlaying(true)}
              aria-label="Play preview"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-white/10 text-white backdrop-blur transition hover:scale-105"
            >
              <Play className="h-7 w-7 fill-white" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
