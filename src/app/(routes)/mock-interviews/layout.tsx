import { Metadata } from "next";

export const metadata: Metadata = {
  title: "1:1 Mock DSA Interviews | crackDSA",
  description: "Book 1:1 live mock interviews with FAANG engineers. Realistic simulation, detailed feedback scorecard, and personalized action plan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
