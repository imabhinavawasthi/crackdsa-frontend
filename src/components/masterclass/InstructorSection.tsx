import type { ReactElement } from "react";
import type { Masterclass, SocialPlatform } from "@/types/masterclass";

// lucide-react no longer ships brand logos, so these are simple inline SVGs.
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-6 w-6",
} as const;

const SOCIAL_ICONS: Record<SocialPlatform, ReactElement> = {
  linkedin: (
    <svg {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v5M8 8v.01M12 16v-5M12 13c0-1.5 1-2 2-2s2 .8 2 2.2V16" />
    </svg>
  ),
  instagram: (
    <svg {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.01" />
    </svg>
  ),
  twitter: (
    <svg {...svgProps}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  ),
  youtube: (
    <svg {...svgProps}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  ),
};

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// Renders **bold** segments inside a bio paragraph.
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function InstructorSection({ instructor }: { instructor: Masterclass["instructor"] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{instructor.heading}</h2>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="aspect-[4/3.6] w-full overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-200 dark:border-gray-800 dark:from-blue-500/20 dark:to-[#0B1F3F]">
            {instructor.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={instructor.photo} alt={instructor.name} className="h-full w-full object-cover object-top" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-semibold text-blue-600/70 dark:text-blue-300/70">
                {initials(instructor.name)}
              </div>
            )}
          </div>
          <h3 className="mt-5 text-2xl font-semibold text-gray-900 dark:text-white">{instructor.name}</h3>
          <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">{instructor.title}</p>
        </div>

        <div>
          <div className="space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {instructor.bio.map((paragraph) => (
              <p key={paragraph}><RichText text={paragraph} /></p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {instructor.socials.map((social) => {
              return (
                <div
                  key={social.platform}
                  className="flex overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
                >
                  <span className="flex w-14 items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    {SOCIAL_ICONS[social.platform]}
                  </span>
                  <div className="flex gap-4 px-4 py-3">
                    {social.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
