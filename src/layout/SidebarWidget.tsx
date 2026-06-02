import { Rocket } from "lucide-react";

export default function SidebarCTA() {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-[30px] bg-linear-to-r from-brand-500 via-purple-500 to-cyan-400 p-[1.5px]">
      <div className="rounded-[28px] border border-white/80 bg-white/95 p-4 backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-gray-950/90">
        <p className="mb-2 text-[10px] font-semibold uppercase text-brand-500 dark:text-brand-400">
          crackdsa pro
        </p>
        <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          Join premium guidance for every interview.
        </h3>
        <p className="mb-4 text-sm leading-5 text-gray-500 dark:text-gray-400">
          Get expert-backed roadmaps, real interview prompts, and faster prep in one place.
        </p>
        <a
          href="/pro"
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Explore Pro <Rocket size={14} className="ml-2" />
        </a>
      </div>
    </div>
  );
}
