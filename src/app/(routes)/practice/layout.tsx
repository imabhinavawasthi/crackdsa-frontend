import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice | CrackDSA",
  description: "Solve curated problems across top platforms. Browse editorial solutions and track your progress.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
