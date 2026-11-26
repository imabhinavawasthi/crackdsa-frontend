import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Resume Builder | crackDSA",
  description: "Craft FAANG-vetted ATS software engineering resumes with battle-tested templates and keyword suggestions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
