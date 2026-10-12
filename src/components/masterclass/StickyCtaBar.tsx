"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Masterclass } from "@/types/masterclass";

const pad = (n: number) => String(n).padStart(2, "0");

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}d ${clock}` : clock;
}

export default function StickyCtaBar({ bar }: { bar: Masterclass["stickyBar"] }) {
  // Null until mounted so server and client markup match.
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    const end = new Date(bar.offerEndsAt).getTime();
    const tick = () => setRemaining(formatRemaining(end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [bar.offerEndsAt]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blue-400/20 bg-[#0B1F3F] shadow-[0_-8px_30px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="hidden text-lg font-semibold text-white md:block lg:text-2xl">{bar.title}</p>

        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end md:gap-6">
          <Link
            href={bar.cta.href}
            className="rounded-md bg-sky-400 px-5 py-3 text-sm font-semibold text-[#0B1F3F] transition hover:bg-sky-300 sm:px-6"
          >
            {bar.cta.label}
          </Link>

          <div className="border-l border-white/20 pl-4 md:pl-6">
            <p className="text-base font-semibold text-white sm:text-lg">
              <span className="mr-1.5 text-white/60 line-through">{bar.originalPrice}</span>
              {bar.price}
            </p>
            <p className="text-xs text-blue-100/70 sm:text-sm">
              Offer expires in <span className="tabular-nums">{remaining ?? "--:--:--"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
