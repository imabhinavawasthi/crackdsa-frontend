import { z } from "zod";

/**
 * Schema definition for client- and server-accessible environment variables.
 * Variables exposed to the browser must be prefixed with `NEXT_PUBLIC_`.
 */
const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z
    .string()
    .url("NEXT_PUBLIC_BACKEND_URL must be a valid URL")
    .default("http://localhost:8000"),
  NEXT_PUBLIC_GOOGLE_AUTH_URL: z
    .string()
    .url("NEXT_PUBLIC_GOOGLE_AUTH_URL must be a valid URL")
    .optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z
    .string()
    .optional(),
  NEXT_PUBLIC_DSA_COURSE_SLUG: z
    .string()
    .default("data-structures-algorithms-mastery-program"),
});

/**
 * Validated environment object.
 * Safe fallback in non-browser or test environments.
 */
function parseEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_GOOGLE_AUTH_URL: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_DSA_COURSE_SLUG: process.env.NEXT_PUBLIC_DSA_COURSE_SLUG,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    return {
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
      NEXT_PUBLIC_GOOGLE_AUTH_URL: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || "",
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      NEXT_PUBLIC_DSA_COURSE_SLUG: process.env.NEXT_PUBLIC_DSA_COURSE_SLUG || "data-structures-algorithms-mastery-program",
    };
  }

  return parsed.data;
}

export const env = parseEnv();
