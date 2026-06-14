"use client";

import { COMMUNITY_LINKS } from "@/constants/landing";
import { Reveal } from "./Reveal";

export default function CommunitySection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* Header */}
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400 mb-3">
            Community
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Learn together. Grow faster.
          </h2>
          <p className="mx-auto max-w-xl text-gray-400 mb-12">
            Join thousands of learners across platforms. Get help, share
            progress, and stay motivated with the CrackDSA community.
          </p>
        </Reveal>

        {/* Social links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {COMMUNITY_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <Reveal key={link.label} delay={0.08 * i}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 ${link.accent} hover:bg-white/[0.05]`}
                >
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  {link.label}
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
