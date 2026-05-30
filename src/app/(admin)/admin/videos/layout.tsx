import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Catalog Management | CrackDSA",
  description: "Configure reusable cohort video assets and connect problems, blogs, or coding assignments.",
};

export default function VideosCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
