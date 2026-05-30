import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Video Lecture | CrackDSA",
  description: "Configure and adjust a dynamic video lecture asset.",
};

export default function EditVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
