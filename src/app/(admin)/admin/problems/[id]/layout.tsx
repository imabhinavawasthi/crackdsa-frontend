import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem Detail Management | CrackDSA",
  description: "View and configure practice problem attributes and parameters.",
};

export default function ProblemDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
