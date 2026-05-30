import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Practice Problem | CrackDSA",
  description: "Configure code solutions, test cases, and meta attributes for practice problems.",
};

export default function EditProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
