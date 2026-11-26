# CrackDSA Frontend — Agent Guidelines

## 1. Project Overview
- **Name**: CrackDSA Frontend
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, CSS Variables, PostCSS
- **UI & Icons**: shadcn/ui (Radix UI / Base UI), Lucide Icons (`lucide-react`), Framer Motion
- **Form & Validation**: React Hook Form (`react-hook-form`) + Zod
- **Tables & Charts**: TanStack Table, ApexCharts, FullCalendar

---

## 2. Essential Commands

### Development
```bash
npm run dev      # Start dev server on http://localhost:3000
```

### Build & Verification
```bash
npm run build    # Production build with Next.js type check & compilation
npm run lint     # Run ESLint validation
npm run start    # Start production build locally
```

---

## 3. Architecture & Directory Structure

```
crackdsa-frontend/
├── src/
│   ├── app/           # Next.js App Router (pages, layouts, globals.css)
│   ├── api/           # API request services & network endpoints
│   ├── components/    # Reusable UI components & shadcn primitives
│   │   └── ui/        # Headless/styled base components
│   ├── config/        # Environment and app configuration
│   ├── constants/     # Static constants and configurations
│   ├── context/       # React Context providers for global state
│   ├── functions/     # Reusable business logic & helper functions
│   ├── hooks/         # Custom React hooks
│   ├── layout/        # Page layout wrappers & navigation shells
│   ├── types/         # TypeScript type definitions and interfaces
│   ├── utils/         # Pure utility functions (e.g., cn helper)
│   └── middleware.ts  # Next.js edge middleware
├── public/            # Static assets (images, icons)
├── package.json       # Dependencies and npm scripts
├── tsconfig.json      # Path aliases (@/* -> ./src/*)
└── components.json    # shadcn/ui component configuration
```

---

## 4. Development & Coding Conventions

### TypeScript & Imports
- **Import Alias**: Always use `@/*` to reference paths inside `./src` (e.g., `@/components/...`, `@/utils/...`).
- **Typing**: Avoid `any`. Define interfaces and types in `src/types/` or co-locate component-specific prop types.

### Next.js & React Conventions
- **App Router**: Use React Server Components (RSC) by default. Add `"use client"` directive only when using React hooks (`useState`, `useEffect`), browser APIs, or event handlers.
- **Component Style**: Use functional components with explicit TypeScript interfaces for props.
- **State Management**: Leverage React Context in `src/context/` or local state where appropriate.
- **Forms**: Validate input schemas with `zod` and integrate with `react-hook-form`.

### Styling & UI
- **Tailwind CSS**: Use Tailwind v4 utility classes.
- **Class Merging**: Combine and override classes using `clsx` and `tailwind-merge` (typically via `cn()` in `src/utils` or `src/lib/utils`).
- **Icons**: Prefer `lucide-react` icons.

---

## 5. Safety & Environment
- Environment variables are defined in `.env`.
- Expose variables to the browser strictly via the `NEXT_PUBLIC_` prefix.
- Never commit secret keys, credentials, or private API tokens.
