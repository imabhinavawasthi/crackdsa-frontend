import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Details | CrackDSA",
  description: "View video lecture details, stream mockup, and check connected FAANG curation problems.",
};

export default function ViewVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
