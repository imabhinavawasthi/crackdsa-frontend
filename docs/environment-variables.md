# Environment Variables & Configuration Guide

This document explains the architecture, purpose, and usage of the centralized environment configuration system in **CrackDSA Frontend** located at [`src/config/env.ts`](../src/config/env.ts).

---

## 1. Overview

In standard Next.js development, developers often read variables directly from `process.env.NEXT_PUBLIC_*`. In a production-grade application, this introduces subtle bugs and security risks. 

CrackDSA adopts a **centralized, schema-validated environment configuration** powered by [Zod](https://zod.dev).

```text
.env / .env.local (Disk / Deployment)
          │
          ▼
   src/config/env.ts (Zod Schema Validation & Default Fallbacks)
          │
          ▼
   Import { env } across Components, APIs & Utils
```

---

## 2. Why Use `env.ts` Instead of Raw `process.env`?

### A. Prevents Silent Runtime Crashes
In TypeScript, `process.env.SOME_KEY` is typed as `string | undefined`. If an environment variable is omitted in Vercel, Render, or a colleague's local machine:
- **Raw `process.env`**: The application builds and starts silently. When a user triggers an action (e.g., clicking "Sign in with Google"), the browser attempts to redirect to `undefined/auth` and throws a fatal runtime exception.
- **With `env.ts`**: The schema parses environment variables at application initialization. If a required URL is missing or malformed, it immediately logs a clear diagnostic error (`❌ Invalid environment variables`).

### B. Format & URL Validation
Typing `NEXT_PUBLIC_BACKEND_URL=crackdsa-backend.onrender.com` (forgetting `https://`) in deployment settings causes all browser `fetch` requests to fail. 
`z.string().url()` ensures the protocol (`http://` or `https://`) is present before any network request is attempted.

### C. Single Source of Truth for Defaults (DRY Principle)
Default fallback values (such as `NEXT_PUBLIC_DSA_COURSE_SLUG="data-structures-algorithms-mastery-program"`) are defined in one place. If the default slug changes, you only update it inside `env.ts` rather than searching and replacing it across multiple page components.

### D. Full IDE Autocomplete & Strict Typing
- Typing `env.` in VS Code immediately provides autocomplete for all registered variables.
- Values are guaranteed to be typed as `string` rather than `string | undefined`, removing the need for manual non-null assertions (`!`) or fallback chains (`|| ""`).

---

## 3. How to Use `env` in Code

Import the `env` object from `@/config/env`:

```typescript
import { env } from "@/config/env";

// Access variables with full type safety
const backendUrl = env.NEXT_PUBLIC_BACKEND_URL;
const googleAuthUrl = env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
const razorpayKey = env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const defaultDsaSlug = env.NEXT_PUBLIC_DSA_COURSE_SLUG;
```

### Real Codebase Examples

#### In API Services (`src/config/api.ts`)
```typescript
import { env } from "@/config/env";

export const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;
```

#### In Authentication Functions (`src/functions/auth.ts`)
```typescript
import { env } from "@/config/env";

export function getGoogleAuthUrl(redirectTo?: string): string {
  const baseUrl = env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
  if (!baseUrl) return "";
  // ... construct redirect URL
}
```

#### In Route Pages (`src/app/(routes)/dsa/page.tsx`)
```typescript
import { env } from "@/config/env";

export default function DsaPage() {
  const activeSlug = env.NEXT_PUBLIC_DSA_COURSE_SLUG;
  // ...
}
```

---

## 4. How to Add a New Environment Variable

When introducing a new environment variable (for example, `NEXT_PUBLIC_ALGOLIA_APP_ID`), follow this 3-step workflow:

### Step 1: Add to Your Local `.env`
Open your local `.env` (or `.env.local`):
```bash
NEXT_PUBLIC_ALGOLIA_APP_ID=abc123xyz
```

### Step 2: Add a Placeholder to `.env.example`
Update `.env.example` so teammates and CI environments know this variable exists:
```bash
# Algolia Search Application ID
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
```

### Step 3: Register in `src/config/env.ts`
Add the variable and its validation rule to `envSchema`:
```typescript
const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_GOOGLE_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_DSA_COURSE_SLUG: z.string().default("data-structures-algorithms-mastery-program"),

  // 👉 New variable added here:
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().default(""),
});
```

---

## 5. Security & Git Guidelines

1. **Prefix Convention**:
   - Variables accessed by client-side browser code **MUST** start with `NEXT_PUBLIC_`.
   - Variables without `NEXT_PUBLIC_` are private to the Node.js server runtime and are never bundled into client JavaScript.
2. **Never Commit Secrets**:
   - The `.env` file contains sensitive live endpoints and keys. It is ignored by `.gitignore`.
   - Never remove `.env` from `.gitignore`.
   - Always keep `.env.example` updated with safe, non-sensitive dummy values.
