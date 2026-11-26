"use client";

import { useEffect, useState } from "react";
import { Play, Quote, X } from "lucide-react";
import type { Masterclass } from "@/types/masterclass";

type Reviews = Masterclass["reviews"];

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function ReviewsSection({ reviews }: { reviews: Reviews }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const count = reviews.featured.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  const current = reviews.featured[active];

  return (
    <section className="mb-12">
      <h2 className="text-center text-3xl font-bold text-blue-900 dark:text-white sm:text-4xl">
        {reviews.heading}
      </h2>

      {current && (
        <div
          className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-10 lg:p-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rotate-45 bg-white/5" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rotate-45 bg-white/5" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
            <div key={active}>
              <h3 className="text-2xl font-bold text-white sm:text-4xl">{current.headline}</h3>
              <p className="mt-4 max-w-xl text-base text-blue-50 sm:text-lg">{current.quote}</p>
              <p className="mt-5 font-semibold text-white">{current.name}</p>
              <p className="text-sm text-blue-200">{current.subtitle}</p>
            </div>

            <div className="hidden justify-center md:flex">
              {current.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.photo} alt={current.name} className="h-56 w-56 rounded-full object-cover" />
              ) : (
                <div className="flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-white/10 text-5xl font-semibold text-white lg:h-52 lg:w-52">
                  {initials(current.name)}
                </div>
              )}
            </div>
          </div>

          <div className="relative mt-8 flex gap-2">
            {reviews.featured.map((item, i) => (
              <button
                key={item.name}
                onClick={() => setActive(i)}
                aria-label={`Show review ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_2fr]">
        {reviews.videos.map((video) => (
          <button
            key={video.name}
            onClick={() => video.url && setPlayingUrl(video.url)}
            aria-label={`Play review from ${video.name}`}
            className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-b from-blue-200 to-blue-400 text-left dark:from-blue-500/30 dark:to-[#0B1F3F] sm:aspect-[3/4] lg:aspect-auto"
          >
            {video.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.thumbnail} alt={video.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-blue-700/60 dark:text-blue-200/50">
                {initials(video.name)}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 text-sm font-medium text-white">
              {video.name}
            </span>
            <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-blue-700 transition group-hover:scale-110">
              <Play className="h-4 w-4 fill-current" />
            </span>
          </button>
        ))}

        <div className="relative col-span-full flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-[#1E2A6B] p-6 sm:p-8 lg:col-span-1">
          <p className="text-xl font-semibold leading-snug text-white sm:text-2xl">{reviews.quoteCard.quote}</p>
          <div className="mt-6 flex items-end justify-between">
            <p className="text-sm font-semibold text-white">{reviews.quoteCard.name}</p>
            <Quote className="h-14 w-14 fill-white/20 text-transparent" />
          </div>
        </div>
      </div>

      {playingUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPlayingUrl(null)}
        >
          <div className="relative aspect-video w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={playingUrl}
              title="Student review"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="h-full w-full rounded-xl"
            />
            <button
              onClick={() => setPlayingUrl(null)}
              aria-label="Close video"
              className="absolute -top-10 right-0 rounded-full bg-white/10 p-1.5 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
