import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Problems Catalog | CrackDSA",
  description: "Configure practice problems, code solutions, external platform links, and metadata tags.",
};

export default function ProblemsCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
