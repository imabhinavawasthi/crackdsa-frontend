import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Video Lecture | CrackDSA",
  description: "Configure a new cohort video asset in the CrackDSA database.",
};

export default function AddVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
