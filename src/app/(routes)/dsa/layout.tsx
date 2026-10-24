import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn DSA | crackDSA",
  description:
    "Master Data Structures & Algorithms with our structured, comprehensive course — from fundamentals to advanced patterns.",
  alternates: {
    canonical: "https://crackdsa.com/dsa",
  },
};

export default function DsaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
