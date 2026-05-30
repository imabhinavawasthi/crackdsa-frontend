import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article Detail Management | CrackDSA",
  description: "View and configure article attributes and parameters.",
};

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
