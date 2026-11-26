import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles & Course Notes Catalog | CrackDSA Admin",
  description: "Configure articles, concept notes, publication status, and course assignments.",
};

export default function ArticlesAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
