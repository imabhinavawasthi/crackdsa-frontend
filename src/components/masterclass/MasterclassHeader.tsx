"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import type { Masterclass } from "@/types/masterclass";

export const SECTION_LINKS = [
  { id: "success-stories", label: "Success Stories" },
  { id: "who-is-it-for", label: "Who is it for" },
  { id: "outcomes", label: "Outcomes" },
  { id: "curriculum", label: "Curriculum" },
  { id: "instructor", label: "Instructor" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

export default function MasterclassHeader({ cta }: { cta: Masterclass["stickyBar"]["cta"] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTION_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/85 backdrop-blur-xl dark:border-gray-800/80 dark:bg-[#080C14]/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/" priority width={130} height={30} />

        <nav className="hidden items-center gap-1 lg:flex">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={goTo(link.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeId === link.id
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <Link
            href={cta.href}
            className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 sm:inline-block"
          >
            {cta.label}
          </Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-gray-700 dark:text-gray-300 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-[#080C14] lg:hidden">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={goTo(link.id)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
