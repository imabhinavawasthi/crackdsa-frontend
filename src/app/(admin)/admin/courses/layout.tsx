import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalog | CrackDSA Admin",
  description: "Manage CrackDSA Academy courses, syllabus, and metadata.",
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
