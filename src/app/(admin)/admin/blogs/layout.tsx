import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles & Blogs Catalog | CrackDSA",
  description: "Configure articles, concept blogs, publication status, and metadata tags.",
};

export default function BlogsCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
