"use client";

import React, { useState, useMemo } from "react";
import { Button, AIOrb } from "@/components/ui/button";
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Code2,
  Sliders,
  Palette,
  Layers,
  MousePointerClick,
  Download,
  Search,
  ExternalLink,
  Plus,
  Zap,
  RefreshCw,
} from "lucide-react";

// --- Brand Color Tokens ---
interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  description: string;
  category: "blue" | "sky" | "slate" | "accent";
  isDarkText?: boolean;
}

const BRAND_COLORS: ColorToken[] = [
  // Blue (includes navy shades)
  {
    name: "Blue 50",
    variable: "--color-blue-50",
    hex: "#eff6ff",
    description: "tw pill & badge backgrounds",
    category: "blue",
    isDarkText: true,
  },
  {
    name: "Blue 100",
    variable: "--color-blue-100",
    hex: "#dbeafe",
    description: "tw · hero paragraph text, soft hover",
    category: "blue",
    isDarkText: true,
  },
  {
    name: "Blue 200",
    variable: "--color-blue-200",
    hex: "#bedbff",
    description: "tw · horizon glow in the hero",
    category: "blue",
    isDarkText: true,
  },
  {
    name: "Blue 300",
    variable: "--color-blue-300",
    hex: "#9db4ff",
    description: "links & blue text on navy, light illustration squares",
    category: "blue",
    isDarkText: true,
  },
  {
    name: "Blue 400",
    variable: "--color-blue-400",
    hex: "#5b7dfb",
    description: "hero gradient, orbs",
    category: "blue",
    isDarkText: false,
  },
  {
    name: "Blue 600",
    variable: "--color-blue-600",
    hex: "#2446f0",
    description: "BRAND · buttons, icons, badge text",
    category: "blue",
    isDarkText: false,
  },
  {
    name: "Blue 700",
    variable: "--color-blue-700",
    hex: "#1b36cb",
    description: "hover / pressed on blue",
    category: "blue",
    isDarkText: false,
  },
  {
    name: "Blue 800",
    variable: "--color-blue-800",
    hex: "#0f1a5c",
    description: "hero gradient, raised controls on navy",
    category: "blue",
    isDarkText: false,
  },
  {
    name: "Blue 900",
    variable: "--color-blue-900",
    hex: "#0b1134",
    description: "navy section background",
    category: "blue",
    isDarkText: false,
  },
  {
    name: "Blue 950",
    variable: "--color-blue-950",
    hex: "#060a22",
    description: "hero top, page frame",
    category: "blue",
    isDarkText: false,
  },

  // Sky
  {
    name: "Sky 100",
    variable: "--color-sky-100",
    hex: "#dff2fe",
    description: "tw · bottom of the hero gradient",
    category: "sky",
    isDarkText: true,
  },
  {
    name: "Sky 300",
    variable: "--color-sky-300",
    hex: "#74d4ff",
    description: "tw · light-blue illustration accents",
    category: "sky",
    isDarkText: true,
  },

  // Neutral (slate)
  {
    name: "Slate 100",
    variable: "--color-slate-100",
    hex: "#f1f5f9",
    description: "tw · wells inside cards",
    category: "slate",
    isDarkText: true,
  },
  {
    name: "Slate 200",
    variable: "--color-slate-200",
    hex: "#e2e8f0",
    description: "tw · light section background, lines inside cards",
    category: "slate",
    isDarkText: true,
  },
  {
    name: "Slate 300",
    variable: "--color-slate-300",
    hex: "#cad5e2",
    description: "tw · borders on light; muted text on navy",
    category: "slate",
    isDarkText: true,
  },
  {
    name: "Slate 600",
    variable: "--color-slate-600",
    hex: "#45556c",
    description: "tw · secondary text on light",
    category: "slate",
    isDarkText: false,
  },
  {
    name: "Slate 950",
    variable: "--color-slate-950",
    hex: "#020618",
    description: "tw · headlines and body text",
    category: "slate",
    isDarkText: false,
  },

  // Accents (illustration only)
  {
    name: "Violet 200",
    variable: "--color-violet-200",
    hex: "#ddd6ff",
    description: "tw · lavender haze in hero corners",
    category: "accent",
    isDarkText: true,
  },
  {
    name: "Pink 300",
    variable: "--color-pink-300",
    hex: "#f2a3c3",
    description: "the single warm pop",
    category: "accent",
    isDarkText: true,
  },
];

// --- Brand Gradients Data ---
interface GradientToken {
  className: string;
  name: string;
  purpose: string;
  cssRule: string;
}

const BRAND_GRADIENTS: GradientToken[] = [
  {
    className: "bg-hero",
    name: "1. Hero Background",
    purpose:
      "Night sky to daylight, top to bottom, with lavender haze in both lower corners.",
    cssRule: `background:
  radial-gradient(40% 35% at 0% 88%, var(--color-violet-200) 0%, transparent 100%),
  radial-gradient(40% 35% at 100% 88%, var(--color-violet-200) 0%, transparent 100%),
  linear-gradient(180deg,
    var(--color-blue-950) 0%,
    var(--color-blue-800) 22%,
    var(--color-blue-600) 50%,
    var(--color-blue-400) 64%,
    var(--color-blue-200) 82%,
    var(--color-sky-100) 100%);`,
  },
  {
    className: "bg-night",
    name: "2. Night Section",
    purpose: "Navy with a faint lighter glow radiating from the top.",
    cssRule: `background:
  radial-gradient(70% 45% at 50% 0%, var(--color-blue-800) 0%, transparent 100%),
  var(--color-blue-900);`,
  },
  {
    className: "bg-meter",
    name: "3. Progress / Skill Bar",
    purpose: 'The "Figma skills 100%" gradient fill bar.',
    cssRule: `background: linear-gradient(90deg,
  var(--color-blue-800) 0%,
  var(--color-blue-600) 45%,
  var(--color-sky-300) 80%,
  var(--color-pink-300) 100%);`,
  },
  {
    className: "bg-strip",
    name: "4. Colour Strip",
    purpose: "Small blue-to-pink accent bar floating in hero banners.",
    cssRule: `background: linear-gradient(90deg,
  var(--color-blue-400) 0%,
  var(--color-sky-300) 55%,
  var(--color-pink-300) 100%);`,
  },
  {
    className: "bg-orb",
    name: "5. Orb Disc",
    purpose: "Glossy sphere for icons, Figma logo circle, AI icon disc.",
    cssRule: `background: radial-gradient(circle at 30% 28%,
  var(--color-sky-300) 0%,
  var(--color-blue-400) 38%,
  var(--color-blue-600) 72%,
  var(--color-blue-700) 100%);`,
  },
  {
    className: "bg-glass-tile",
    name: "6. Glass Tile",
    purpose:
      "Frosted blue squares (Figma tile in hero, texture pack, badge containers).",
    cssRule: `background:
  linear-gradient(160deg, rgb(255 255 255 / 0.45) 0%, transparent 45%),
  linear-gradient(135deg, var(--color-blue-300) 0%, var(--color-blue-400) 45%, var(--color-blue-600) 100%);`,
  },
  {
    className: "bg-glow-ring",
    name: "7. Glow Ring",
    purpose:
      'Blue-to-sky outline around AI chips ("Ask AI"). Put on wrapper with p-[1.5px] rounded-full; inner chip is bg-white.',
    cssRule: `background: linear-gradient(90deg, var(--color-blue-600) 0%, var(--color-sky-300) 50%, var(--color-blue-400) 100%);`,
  },
  {
    className: "bg-rim",
    name: "8. Card Rim",
    purpose: "Blue-to-pink edge light on hero card borders and vertical trims.",
    cssRule: `background: linear-gradient(180deg, var(--color-blue-400) 0%, var(--color-pink-300) 100%);`,
  },
  {
    className: "bg-well",
    name: "9. Card Well",
    purpose: "Soft radial panel behind feature illustrations and cards.",
    cssRule: `background: radial-gradient(120% 90% at 50% 100%, var(--color-white) 0%, var(--color-slate-100) 60%);`,
  },
  {
    className: "bg-swatch-a",
    name: "10a. Swatch Tile A",
    purpose: "Blue-300 to Blue-600 diagonal gradient swatch.",
    cssRule: `background: linear-gradient(135deg, var(--color-blue-300), var(--color-blue-600));`,
  },
  {
    className: "bg-swatch-b",
    name: "10b. Swatch Tile B",
    purpose: "Sky-300 to Blue-400 diagonal gradient swatch.",
    cssRule: `background: linear-gradient(135deg, var(--color-sky-300), var(--color-blue-400));`,
  },
  {
    className: "bg-swatch-c",
    name: "10c. Swatch Tile C",
    purpose: "Violet-200 to Blue-400 diagonal gradient swatch.",
    cssRule: `background: linear-gradient(135deg, var(--color-violet-200), var(--color-blue-400));`,
  },
];

type ButtonVariant =
  | "default"
  | "brand"
  | "white"
  | "secondary"
  | "outline"
  | "ghost"
  | "glass"
  | "ai"
  | "destructive"
  | "link";

type ButtonSize =
  "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

export default function DesignSystemPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Playground States
  const [pgVariant, setPgVariant] = useState<ButtonVariant>("brand");
  const [pgSize, setPgSize] = useState<ButtonSize>("default");
  const [pgBg, setPgBg] = useState<"light" | "slate" | "night" | "hero">(
    "light",
  );
  const [pgDisabled, setPgDisabled] = useState(false);
  const [pgIconLeading, setPgIconLeading] = useState<
    "none" | "orb" | "sparkles" | "plus" | "download"
  >("none");
  const [pgIconTrailing, setPgIconTrailing] = useState<
    "none" | "arrow" | "chevron" | "external"
  >("none");
  const [pgLabel, setPgLabel] = useState("Enroll in the Intensive");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const filteredColors = useMemo(() => {
    return BRAND_COLORS.filter((color) => {
      const matchesCategory =
        selectedCategory === "all" || color.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        color.name.toLowerCase().includes(query) ||
        color.hex.toLowerCase().includes(query) ||
        color.variable.toLowerCase().includes(query) ||
        color.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const buttonVariantsList: {
    id: ButtonVariant;
    title: string;
    description: string;
    suggestedBg: "light" | "night" | "hero";
  }[] = [
    {
      id: "brand",
      title: "brand",
      description:
        'Always brand blue (#2446f0). Used for main CTA: "Enroll in the intensive".',
      suggestedBg: "light",
    },
    {
      id: "ai",
      title: "ai",
      description:
        "White rounded pill with glow shadow and blue text. Pair with <AIOrb />.",
      suggestedBg: "night",
    },
    {
      id: "glass",
      title: "glass",
      description:
        "Translucent navy pill with frosted backdrop blur for hero & dark sections.",
      suggestedBg: "hero",
    },
    {
      id: "white",
      title: "white",
      description:
        "Crisp white with dark text, optimal for dark/night nav bars & action chips.",
      suggestedBg: "night",
    },
    {
      id: "default",
      title: "default",
      description:
        "Primary theme action. Adapts automatically according to system theme.",
      suggestedBg: "light",
    },
    {
      id: "secondary",
      title: "secondary",
      description:
        "Raised control with subtle border: clean neutral on Day, navy-800 on Night.",
      suggestedBg: "light",
    },
    {
      id: "outline",
      title: "outline",
      description:
        "Transparent body with border outline; shifts background on hover.",
      suggestedBg: "light",
    },
    {
      id: "ghost",
      title: "ghost",
      description:
        "Borderless transparent button with subtle hover background tint.",
      suggestedBg: "light",
    },
    {
      id: "destructive",
      title: "destructive",
      description:
        "Subtle warning/danger tint with strong red text for destructive actions.",
      suggestedBg: "light",
    },
    {
      id: "link",
      title: "link",
      description: "Clean text button with underline-on-hover style.",
      suggestedBg: "light",
    },
  ];

  const buttonSizesList: {
    id: ButtonSize;
    label: string;
    height: string;
    usage: string;
  }[] = [
    {
      id: "xs",
      label: "Extra Small (xs)",
      height: "28px / h-7",
      usage: "Compact badges, filter tags, inline tables",
    },
    {
      id: "sm",
      label: "Small (sm)",
      height: "32px / h-8",
      usage: "Card action headers, secondary toolbars",
    },
    {
      id: "default",
      label: "Default",
      height: "40px / h-10",
      usage: "Standard forms, standard CTAs, modals",
    },
    {
      id: "lg",
      label: "Large (lg)",
      height: "52px / h-13",
      usage: "Hero primary CTAs, pill action highlights",
    },
    {
      id: "icon-xs",
      label: "Icon XS",
      height: "28x28px",
      usage: "Tiny inline action buttons",
    },
    {
      id: "icon-sm",
      label: "Icon SM",
      height: "32x32px",
      usage: "Card header utility icons",
    },
    {
      id: "icon",
      label: "Icon Default",
      height: "40x40px",
      usage: "Standard floating actions, toolbar buttons",
    },
    {
      id: "icon-lg",
      label: "Icon LG",
      height: "52x52px",
      usage: "Pill avatar buttons, hero modal toggles",
    },
  ];

  return (
    <div className="font-onest space-y-12 pb-20 text-slate-950 dark:text-slate-100">
      {/* =========================================================
          HERO BANNER
      ========================================================= */}
      <div className="bg-hero relative overflow-hidden rounded-3xl border border-white/10 p-8 text-white shadow-2xl md:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-blue-950/70 px-3.5 py-1 text-xs font-medium text-blue-200 backdrop-blur-md">
            <Sparkles className="size-3.5 text-sky-300" />
            <span>Horizon Design System · v1.0</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Brand Styleguide &amp; UI System
          </h1>

          <p className="max-w-2xl text-base leading-relaxed font-normal text-blue-100 md:text-lg">
            Official design language for CrackDSA. Complete specification of
            brand palettes, multi-stop hero gradients, ambient glows, and all
            variant configurations of the Horizon Button component.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 rounded-xl border border-blue-400/20 bg-blue-900/60 px-3.5 py-2 backdrop-blur-sm">
              <Palette className="size-4 text-blue-300" />
              <span>{BRAND_COLORS.length} Color Swatches</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-blue-400/20 bg-blue-900/60 px-3.5 py-2 backdrop-blur-sm">
              <Layers className="size-4 text-sky-300" />
              <span>10 Brand Gradients</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-blue-400/20 bg-blue-900/60 px-3.5 py-2 backdrop-blur-sm">
              <MousePointerClick className="size-4 text-pink-300" />
              <span>10 Button Variants &amp; 8 Sizes</span>
            </div>
          </div>
        </div>

        {/* Ambient Floating Elements in Hero Header */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-12 hidden flex-col items-center gap-3 lg:flex">
          <div className="bg-strip h-1.5 w-36 rounded-full shadow-lg" />
          <div className="flex items-center gap-3">
            <div className="bg-orb flex size-14 items-center justify-center rounded-full text-white shadow-xl">
              <Sparkles className="size-7" />
            </div>
            <div className="bg-glass-tile flex size-14 items-center justify-center rounded-2xl border border-white/30 text-white shadow-xl backdrop-blur-md">
              <Code2 className="size-7" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          STICKY / QUICK NAVIGATION PILLS
      ========================================================= */}
      <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-2.5 shadow-sm backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <a
            href="#colors"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Palette className="size-3.5" />
            <span>Brand Colors</span>
          </a>
          <a
            href="#gradients"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Layers className="size-3.5" />
            <span>Gradients &amp; Utilities</span>
          </a>
          <a
            href="#buttons"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <MousePointerClick className="size-3.5" />
            <span>Button Variants</span>
          </a>
          <a
            href="#playground"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Sliders className="size-3.5" />
            <span>Live Playground</span>
          </a>
          <a
            href="#tokens"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Code2 className="size-3.5" />
            <span>CSS Variables</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              copyToClipboard(
                BRAND_COLORS.map((c) => `${c.variable}: ${c.hex};`).join("\n"),
                "all-vars",
              )
            }
          >
            {copiedItem === "all-vars" ? (
              <>
                <Check className="size-3 text-emerald-600" />
                <span>Copied All CSS</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy All CSS</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: BRAND COLORS
      ========================================================= */}
      <section id="colors" className="scroll-mt-36 space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-end dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
              <Palette className="size-4" />
              <span>Palette &amp; Tones</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
              Brand Color Palette
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Curated blue/navy hierarchy, sky highlights, slate neutrals, and
              warm illustration pops.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search color name, hex..."
                className="h-8 rounded-lg border border-slate-200 bg-white pr-3 pl-8 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
              {(["all", "blue", "sky", "slate", "accent"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                      selectedCategory === cat
                        ? "bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredColors.map((color) => {
            const isCopied = copiedItem === color.variable;
            return (
              <div
                key={color.variable}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900"
              >
                {/* Swatch Preview Block */}
                <div
                  className="relative flex h-28 w-full flex-col justify-between rounded-xl p-3 shadow-inner transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Category Pill */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                        color.isDarkText
                          ? "bg-black/10 text-slate-900"
                          : "bg-white/20 text-white backdrop-blur-xs"
                      }`}
                    >
                      {color.category}
                    </span>

                    {/* Brand Primary Badge */}
                    {color.variable === "--color-blue-600" && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-blue-600 shadow-sm">
                        PRIMARY
                      </span>
                    )}
                  </div>

                  {/* Contrast Legibility Text */}
                  <div className="flex items-end justify-between">
                    <span
                      className={`font-mono text-xs font-bold uppercase ${
                        color.isDarkText ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {color.hex}
                    </span>
                    <button
                      onClick={() => copyToClipboard(color.hex, color.variable)}
                      className={`rounded-lg p-1.5 opacity-80 transition-all hover:opacity-100 ${
                        color.isDarkText
                          ? "bg-black/10 text-slate-900 hover:bg-black/20"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                      title="Copy Hex Code"
                    >
                      {isCopied ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata & Details */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {color.name}
                    </h3>
                  </div>

                  <code className="inline-block rounded border border-blue-200/50 bg-blue-50 px-1.5 py-0.5 font-mono text-[11px] text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-400">
                    {color.variable}
                  </code>

                  <p className="line-clamp-2 text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                    {color.description}
                  </p>
                </div>

                {/* Quick Copy Footer Action */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
                  <button
                    onClick={() =>
                      copyToClipboard(color.variable, `${color.variable}-var`)
                    }
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
                  >
                    {copiedItem === `${color.variable}-var` ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <Check className="size-3" /> Copied Var
                      </span>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Var</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => copyToClipboard(color.hex, color.variable)}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
                  >
                    {isCopied ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <Check className="size-3" /> Copied Hex
                      </span>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Hex</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 2: BRAND GRADIENTS & VISUAL UTILITIES
      ========================================================= */}
      <section id="gradients" className="scroll-mt-36 space-y-8">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-600 uppercase dark:text-sky-400">
            <Layers className="size-4" />
            <span>Horizon Gradients &amp; Surfaces</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Brand Gradients &amp; Visual Utilities
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Standardized @utility classes configured for hero sections, night
            backdrops, skill bars, orbs, and glass effects.
          </p>
        </div>

        {/* Highlight 1: Hero Gradient Feature Card */}
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                Primary Showcase
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Hero Background (
                <code className="text-blue-600 dark:text-blue-400">
                  bg-hero
                </code>
                )
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Night sky to daylight, top to bottom, with lavender haze in both
                lower corners.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard("bg-hero", "grad-hero")}
            >
              {copiedItem === "grad-hero" ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>Copy Class</span>
            </Button>
          </div>

          {/* Live Preview Canvas */}
          <div className="bg-hero relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-xl">
            <div className="z-10 flex items-center justify-between">
              <div className="bg-glow-ring inline-block rounded-full p-[1.5px]">
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
                  <AIOrb />
                  <span>Interactive Hero Demo</span>
                </div>
              </div>
              <div className="bg-strip h-1.5 w-24 rounded-full" />
            </div>

            <div className="z-10 my-4 max-w-lg space-y-2">
              <h4 className="text-2xl font-black text-white">
                Master DSA with Precision
              </h4>
              <p className="text-xs leading-relaxed text-blue-100">
                Experience high-performance learning workflows engineered with
                mathematical consistency and modern aesthetics.
              </p>
            </div>

            <div className="z-10 flex flex-wrap items-center gap-3">
              <Button variant="brand" size="sm">
                Enroll Now <ArrowRight className="size-3.5" />
              </Button>
              <Button variant="glass" size="sm">
                Explore Syllabus
              </Button>
            </div>
          </div>
        </div>

        {/* Highlight 2: Night Section Showcase */}
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-800 uppercase dark:text-blue-300">
                Dark Mode Shell
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Night Section (
                <code className="text-blue-600 dark:text-blue-400">
                  bg-night
                </code>
                )
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Navy with a faint lighter radial glow from the top.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard("bg-night", "grad-night")}
            >
              {copiedItem === "grad-night" ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>Copy Class</span>
            </Button>
          </div>

          <div className="bg-night flex min-h-[160px] w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-900/50 p-6 text-white shadow-xl">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">
                Curated Problem Modules
              </h4>
              <p className="text-xs text-blue-200">
                Navy backdrop with ambient top glow providing deep contrast.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button variant="white" size="sm">
                Start Practicing
              </Button>
              <Button variant="glass" size="sm">
                View Roadmap
              </Button>
            </div>
          </div>
        </div>

        {/* Gradients 3 to 10 Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BRAND_GRADIENTS.slice(2).map((grad) => {
            const isCopied = copiedItem === grad.className;
            return (
              <div
                key={grad.className}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900"
              >
                <div className="space-y-3">
                  {/* Header & Copy */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {grad.name}
                      </h4>
                      <code className="font-mono text-xs text-blue-600 dark:text-blue-400">
                        .{grad.className}
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(grad.className, grad.className)
                      }
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                      title="Copy Class Name"
                    >
                      {isCopied ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {grad.purpose}
                  </p>

                  {/* Interactive Visual Representation */}
                  <div className="flex min-h-[100px] items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-slate-950">
                    {grad.className === "bg-meter" && (
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          <span>Progress Mastery</span>
                          <span>100%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div className="bg-meter h-full w-full rounded-full" />
                        </div>
                      </div>
                    )}

                    {grad.className === "bg-strip" && (
                      <div className="flex w-full flex-col items-center gap-2">
                        <div className="bg-strip h-2 w-full max-w-[200px] rounded-full shadow-sm" />
                        <span className="font-mono text-[10px] text-slate-400">
                          Accent Strip Indicator
                        </span>
                      </div>
                    )}

                    {grad.className === "bg-orb" && (
                      <div className="flex items-center gap-4">
                        <div className="bg-orb flex size-14 items-center justify-center rounded-full text-white shadow-xl">
                          <Sparkles className="size-6" />
                        </div>
                        <div className="bg-orb flex size-10 items-center justify-center rounded-full text-white shadow-md">
                          <Zap className="size-4" />
                        </div>
                        <div className="bg-orb flex size-8 items-center justify-center rounded-full text-white shadow-sm">
                          <Check className="size-3.5" />
                        </div>
                      </div>
                    )}

                    {grad.className === "bg-glass-tile" && (
                      <div className="flex items-center gap-3">
                        <div className="bg-glass-tile flex size-16 items-center justify-center rounded-2xl border border-white/40 text-white shadow-lg backdrop-blur-md">
                          <Code2 className="size-8" />
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-slate-800 dark:text-white">
                            Frosted Tile
                          </div>
                          <div className="text-[11px] text-slate-500">
                            160° Glass Shine
                          </div>
                        </div>
                      </div>
                    )}

                    {grad.className === "bg-glow-ring" && (
                      <div className="bg-glow-ring rounded-full p-[1.5px]">
                        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-blue-600 dark:bg-slate-900 dark:text-blue-400">
                          <Sparkles className="size-3.5 text-blue-600" />
                          <span>Glow Ring AI Chip</span>
                        </div>
                      </div>
                    )}

                    {grad.className === "bg-rim" && (
                      <div className="relative flex h-16 w-full max-w-[180px] items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="bg-rim absolute top-0 right-0 bottom-0 w-1.5" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Right Rim Light
                        </span>
                      </div>
                    )}

                    {grad.className === "bg-well" && (
                      <div className="bg-well flex h-16 w-full items-center justify-center rounded-xl border border-slate-200 shadow-inner dark:border-slate-800">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Feature Radial Well
                        </span>
                      </div>
                    )}

                    {grad.className.startsWith("bg-swatch") && (
                      <div className="flex w-full items-center gap-3">
                        <div
                          className={`${grad.className} size-14 rounded-xl shadow-md`}
                        />
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                          135° diagonal
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CSS snippet trigger */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
                  <span>Tailwind v4 Utility</span>
                  <button
                    onClick={() =>
                      copyToClipboard(grad.cssRule, `${grad.className}-css`)
                    }
                    className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    {copiedItem === `${grad.className}-css` ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Check className="size-3" /> Copied CSS
                      </span>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy CSS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 3: BUTTON COMPONENT VARIATIONS
      ========================================================= */}
      <section id="buttons" className="scroll-mt-36 space-y-10">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
            <MousePointerClick className="size-4" />
            <span>Horizon Components</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Button Component Variations
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Complete showcase of all 10 variants, 8 size steps, icon slots, and
            compound AI tokens from{" "}
            <code className="text-blue-600 dark:text-blue-400">
              @/components/ui/button.tsx
            </code>
            .
          </p>
        </div>

        {/* Variant Matrix Table / Cards */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span>1. All Variants Matrix</span>
            <span className="text-xs font-normal text-slate-400">
              (10 Variants)
            </span>
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {buttonVariantsList.map((item) => {
              return (
                <div
                  key={item.id}
                  className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                          variant=&quot;{item.id}&quot;
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        copyToClipboard(
                          `<Button variant="${item.id}">Action</Button>`,
                          `btn-${item.id}`,
                        )
                      }
                      title="Copy JSX"
                    >
                      {copiedItem === `btn-${item.id}` ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>

                  {/* Surface Presentation: Render on Light & Dark surfaces */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Light Surface */}
                    <div className="flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-center">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                        Day Surface
                      </span>
                      {item.id === "ai" ? (
                        <Button variant="ai" size="sm">
                          <AIOrb />
                          Ask AI
                        </Button>
                      ) : (
                        <Button variant={item.id} size="sm">
                          Click Me
                        </Button>
                      )}
                    </div>

                    {/* Dark/Night Surface */}
                    <div className="flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-xl border border-blue-900/40 bg-blue-950 p-3 text-center">
                      <span className="font-mono text-[10px] font-bold text-blue-400 uppercase">
                        Night Surface
                      </span>
                      {item.id === "ai" ? (
                        <Button variant="ai" size="sm">
                          <AIOrb />
                          Ask AI
                        </Button>
                      ) : (
                        <Button variant={item.id} size="sm">
                          Click Me
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Size Scale Matrix */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span>2. Size Hierarchy</span>
            <span className="text-xs font-normal text-slate-400">
              (8 Distinct Sizes)
            </span>
          </h3>

          <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Standard Button Sizes
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-1.5 text-center">
                  <Button variant="brand" size="xs">
                    size=&quot;xs&quot; (28px)
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    h-7 · text-xs
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <Button variant="brand" size="sm">
                    size=&quot;sm&quot; (32px)
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    h-8 · text-[13px]
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <Button variant="brand" size="default">
                    size=&quot;default&quot; (40px)
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    h-10 · text-sm
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <Button variant="brand" size="lg">
                    size=&quot;lg&quot; (52px Pill)
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    h-13 · text-base
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Square &amp; Pill Icon Sizes
              </h4>
              <div className="flex flex-wrap items-center gap-5">
                <div className="space-y-1.5 text-center">
                  <Button variant="secondary" size="icon-xs">
                    <Sparkles className="size-3" />
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    icon-xs (28px)
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <Button variant="secondary" size="icon-sm">
                    <Plus className="size-3.5" />
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    icon-sm (32px)
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <Button variant="secondary" size="icon">
                    <Search className="size-4" />
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    icon (40px)
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <Button variant="secondary" size="icon-lg">
                    <Download className="size-5" />
                  </Button>
                  <div className="font-mono text-[11px] text-slate-400">
                    icon-lg (52px)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special AI Button & AIOrb Compound Variants */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <span>3. AI Button &amp; AIOrb Specials</span>
              <span className="text-xs font-normal text-slate-400">
                (Compound Variants &amp; Glow Rings)
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* AI Buttons on Night Background */}
            <div className="bg-night space-y-5 rounded-3xl border border-blue-900 p-6 text-white shadow-xl">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-wider text-sky-400 uppercase">
                  Compound Padding &amp; AIOrb Integration
                </span>
                <h4 className="mt-1 text-base font-bold text-white">
                  AI Action Buttons with &lt;AIOrb /&gt;
                </h4>
                <p className="text-xs text-blue-200">
                  AI buttons automatically adjust horizontal padding to balance
                  the leading orb disc.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="ai" size="sm">
                  <AIOrb />
                  Ask AI
                </Button>

                <Button variant="ai" size="default">
                  <AIOrb />
                  Analyze Code
                </Button>

                <Button variant="ai" size="lg">
                  <AIOrb />
                  Generate Roadmap
                </Button>
              </div>

              <div className="rounded-xl border border-blue-900 bg-blue-950/80 p-3 font-mono text-xs text-blue-200">
                &lt;Button variant=&quot;ai&quot; size=&quot;default&quot;&gt;
                <br />
                &nbsp;&nbsp;&lt;AIOrb /&gt;
                <br />
                &nbsp;&nbsp;Analyze Code
                <br />
                &lt;/Button&gt;
              </div>
            </div>

            {/* AI Buttons with Glow Ring Wrapper */}
            <div className="space-y-5 rounded-3xl border border-blue-900 bg-blue-950 p-6 text-white shadow-xl">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-wider text-pink-300 uppercase">
                  Ambient Highlighter
                </span>
                <h4 className="mt-1 text-base font-bold text-white">
                  AI Chip with &lt;div className=&quot;bg-glow-ring&quot;&gt;
                </h4>
                <p className="text-xs text-blue-200">
                  Wrap AI buttons in a 1.5px gradient glow ring for high-intent
                  conversion actions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-glow-ring inline-block rounded-full p-[1.5px]">
                  <Button variant="ai" size="sm">
                    <AIOrb />
                    Ask AI
                  </Button>
                </div>

                <div className="bg-glow-ring inline-block rounded-full p-[1.5px]">
                  <Button variant="ai" size="default">
                    <AIOrb />
                    Make it beautiful
                  </Button>
                </div>

                <div className="bg-glow-ring inline-block rounded-full p-[1.5px]">
                  <Button variant="ai" size="lg">
                    <AIOrb />
                    Supercharge
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-blue-800 bg-blue-900/60 p-3 font-mono text-xs text-blue-200">
                &lt;div className=&quot;bg-glow-ring p-[1.5px] rounded-full
                inline-block&quot;&gt;
                <br />
                &nbsp;&nbsp;&lt;Button variant=&quot;ai&quot;&gt;&lt;AIOrb
                /&gt;Ask AI&lt;/Button&gt;
                <br />
                &lt;/div&gt;
              </div>
            </div>
          </div>
        </div>

        {/* Button States: Disabled, Loading, With Icons */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span>4. Button States &amp; Icon Slots</span>
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Disabled States */}
            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Disabled State (disabled)
              </h4>
              <p className="text-xs text-slate-500">
                Maintains shape, sets opacity to 50% and disables pointer
                events.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="brand" disabled>
                  Brand Disabled
                </Button>
                <Button variant="secondary" disabled>
                  Secondary Disabled
                </Button>
                <Button variant="outline" disabled>
                  Outline Disabled
                </Button>
              </div>
            </div>

            {/* Loading / Spinner State */}
            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Loading / Async States
              </h4>
              <p className="text-xs text-slate-500">
                Spinners automatically scale according to button size token.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="brand">
                  <RefreshCw className="size-4 animate-spin" />
                  Processing
                </Button>
                <Button variant="secondary">
                  <RefreshCw className="size-4 animate-spin" />
                  Saving
                </Button>
              </div>
            </div>

            {/* Leading & Trailing Icons */}
            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Leading &amp; Trailing Icons
              </h4>
              <p className="text-xs text-slate-500">
                Lucide icons automatically resize to fit the button height.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="brand">
                  <Plus className="size-4" /> Add Question
                </Button>
                <Button variant="secondary">
                  Continue <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline">
                  <Download className="size-4" /> Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: INTERACTIVE PLAYGROUND
      ========================================================= */}
      <section id="playground" className="scroll-mt-36 space-y-6">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
            <Sliders className="size-4" />
            <span>Live Sandbox</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Interactive Button Playground
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Test any combination of variant, size, background surface, icons,
            and disabled state in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg lg:grid-cols-12 dark:border-slate-800/80 dark:bg-slate-900">
          {/* Controls Column */}
          <div className="space-y-5 lg:col-span-5">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
              Configure Props
            </h3>

            {/* Variant Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Variant
              </label>
              <select
                value={pgVariant}
                onChange={(e) => setPgVariant(e.target.value as ButtonVariant)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {buttonVariantsList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} — {v.description.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Size
              </label>
              <select
                value={pgSize}
                onChange={(e) => setPgSize(e.target.value as ButtonSize)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {buttonSizesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.height})
                  </option>
                ))}
              </select>
            </div>

            {/* Background Surface Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Background Surface
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "light" as const, label: "Day Light" },
                  { id: "slate" as const, label: "Slate Well" },
                  { id: "night" as const, label: "Night Navy" },
                  { id: "hero" as const, label: "Hero Sky" },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setPgBg(bg.id)}
                    className={`rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                      pgBg === bg.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icons Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Leading Icon
                </label>
                <select
                  value={pgIconLeading}
                  onChange={(e) =>
                    setPgIconLeading(
                      e.target.value as
                        "none" | "orb" | "sparkles" | "plus" | "download",
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="none">None</option>
                  <option value="orb">AIOrb</option>
                  <option value="sparkles">Sparkles</option>
                  <option value="plus">Plus</option>
                  <option value="download">Download</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Trailing Icon
                </label>
                <select
                  value={pgIconTrailing}
                  onChange={(e) =>
                    setPgIconTrailing(
                      e.target.value as
                        "none" | "arrow" | "chevron" | "external",
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="none">None</option>
                  <option value="arrow">Arrow Right</option>
                  <option value="chevron">Chevron Right</option>
                  <option value="external">External Link</option>
                </select>
              </div>
            </div>

            {/* Text & Disabled Toggles */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Button Label
              </label>
              <input
                type="text"
                value={pgLabel}
                onChange={(e) => setPgLabel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="disabled-toggle"
                checked={pgDisabled}
                onChange={(e) => setPgDisabled(e.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="disabled-toggle"
                className="cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Disabled state (<code className="text-blue-600">disabled</code>)
              </label>
            </div>
          </div>

          {/* Live Preview Canvas Column */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
            <div className="space-y-1">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                Live Interactive Canvas
              </h3>
              <p className="text-xs text-slate-500">
                Rendered with real props on selected surface backdrop.
              </p>
            </div>

            {/* Canvas Surface */}
            <div
              className={`flex min-h-[220px] items-center justify-center rounded-2xl border p-8 transition-all duration-300 ${
                pgBg === "light"
                  ? "border-slate-200 bg-white"
                  : pgBg === "slate"
                    ? "border-slate-300 bg-slate-100"
                    : pgBg === "night"
                      ? "bg-night border-blue-900"
                      : "bg-hero border-blue-950"
              }`}
            >
              <Button variant={pgVariant} size={pgSize} disabled={pgDisabled}>
                {pgIconLeading === "orb" && <AIOrb />}
                {pgIconLeading === "sparkles" && <Sparkles />}
                {pgIconLeading === "plus" && <Plus />}
                {pgIconLeading === "download" && <Download />}

                {!pgSize.startsWith("icon") && pgLabel}
                {pgSize.startsWith("icon") && !pgIconLeading && <Sparkles />}

                {pgIconTrailing === "arrow" && <ArrowRight />}
                {pgIconTrailing === "chevron" && <ChevronRight />}
                {pgIconTrailing === "external" && <ExternalLink />}
              </Button>
            </div>

            {/* Generated Code Box */}
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200">
              <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  JSX Output
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `<Button variant="${pgVariant}" size="${pgSize}"${
                        pgDisabled ? " disabled" : ""
                      }>\n  ${
                        pgIconLeading === "orb" ? "<AIOrb />\n  " : ""
                      }${pgLabel}\n</Button>`,
                      "playground-jsx",
                    )
                  }
                  className="flex items-center gap-1 transition-colors hover:text-blue-400"
                >
                  {copiedItem === "playground-jsx" ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="size-3" /> Copied JSX
                    </span>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto text-blue-300">
                {`<Button
  variant="${pgVariant}"
  size="${pgSize}"${pgDisabled ? "\n  disabled" : ""}
>
${pgIconLeading === "orb" ? "  <AIOrb />\n" : ""}${pgIconLeading === "sparkles" ? '  <Sparkles className="size-4" />\n' : ""}${pgIconLeading === "plus" ? '  <Plus className="size-4" />\n' : ""}${pgIconLeading === "download" ? '  <Download className="size-4" />\n' : ""}  ${pgSize.startsWith("icon") ? "<Sparkles />" : pgLabel}
${pgIconTrailing === "arrow" ? '  <ArrowRight className="size-4" />\n' : ""}${pgIconTrailing === "chevron" ? '  <ChevronRight className="size-4" />\n' : ""}${pgIconTrailing === "external" ? '  <ExternalLink className="size-4" />\n' : ""}</Button>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: CSS VARIABLES REFERENCE TABLE
      ========================================================= */}
      <section id="tokens" className="scroll-mt-36 space-y-6">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
            <Code2 className="size-4" />
            <span>Developer Guide</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            CSS Variable Tokens &amp; Tailwind Integration
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Global variables defined in{" "}
            <code className="text-blue-600 dark:text-blue-400">
              src/app/globals.css
            </code>{" "}
            for direct consumption.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Theme Tokens Block
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                copyToClipboard(
                  `/* Blue (includes the navy shades) */
--color-blue-50:  #eff6ff;     /* tw pill & badge backgrounds */
--color-blue-100: #dbeafe;     /* tw · hero paragraph text, soft hover */
--color-blue-200: #bedbff;     /* tw · horizon glow in the hero */
--color-blue-300: #9db4ff;     /* links & blue text on navy, light illustration squares */
--color-blue-400: #5b7dfb;     /* hero gradient, orbs */
--color-blue-600: #2446f0;     /* BRAND · buttons, icons, badge text */
--color-blue-700: #1b36cb;     /* hover / pressed on blue */
--color-blue-800: #0f1a5c;     /* hero gradient, raised controls on navy */
--color-blue-900: #0b1134;     /* navy section background */
--color-blue-950: #060a22;     /* hero top, page frame */

/* Sky */
--color-sky-100: #dff2fe;      /* tw · bottom of the hero gradient */
--color-sky-300: #74d4ff;      /* tw · light-blue illustration accents */

/* Neutral (slate) */
--color-slate-100: #f1f5f9;    /* tw · wells inside cards */
--color-slate-200: #e2e8f0;    /* tw · light section background, lines inside cards */
--color-slate-300: #cad5e2;    /* tw · borders on light; muted text on navy */
--color-slate-600: #45556c;    /* tw · secondary text on light */
--color-slate-950: #020618;    /* tw · headlines and body text */

/* Accents (illustration only, small doses) */
--color-violet-200: #ddd6ff;   /* tw · lavender haze in hero corners */
--color-pink-300: #f2a3c3;     /* the single warm pop */`,
                  "full-css-block",
                )
              }
            >
              {copiedItem === "full-css-block" ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>Copied All CSS</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy CSS Code</span>
                </>
              )}
            </Button>
          </div>

          <pre className="max-h-[380px] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-blue-200">
            {`/* Blue (includes the navy shades) */
--color-blue-50:  #eff6ff;     /* tw pill & badge backgrounds */
--color-blue-100: #dbeafe;     /* tw · hero paragraph text, soft hover */
--color-blue-200: #bedbff;     /* tw · horizon glow in the hero */
--color-blue-300: #9db4ff;     /* links & blue text on navy, light illustration squares */
--color-blue-400: #5b7dfb;     /* hero gradient, orbs */
--color-blue-600: #2446f0;     /* BRAND · buttons, icons, badge text */
--color-blue-700: #1b36cb;     /* hover / pressed on blue */
--color-blue-800: #0f1a5c;     /* hero gradient, raised controls on navy */
--color-blue-900: #0b1134;     /* navy section background */
--color-blue-950: #060a22;     /* hero top, page frame */

/* Sky */
--color-sky-100: #dff2fe;      /* tw · bottom of the hero gradient */
--color-sky-300: #74d4ff;      /* tw · light-blue illustration accents */

/* Neutral (slate) */
--color-slate-100: #f1f5f9;    /* tw · wells inside cards */
--color-slate-200: #e2e8f0;    /* tw · light section background, lines inside cards */
--color-slate-300: #cad5e2;    /* tw · borders on light; muted text on navy */
--color-slate-600: #45556c;    /* tw · secondary text on light */
--color-slate-950: #020618;    /* tw · headlines and body text */

/* Accents (illustration only, small doses) */
--color-violet-200: #ddd6ff;   /* tw · lavender haze in hero corners */
--color-pink-300: #f2a3c3;     /* the single warm pop */`}
          </pre>
        </div>
      </section>
    </div>
  );
}
