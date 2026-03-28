import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Roadmap | CrackDSA",
  description:
    "Your personalized DSA learning roadmap — track your progress, see what's next, and crush your interview prep.",
};

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
