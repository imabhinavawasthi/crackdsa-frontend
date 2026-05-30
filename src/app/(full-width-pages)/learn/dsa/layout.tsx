import React from "react";
import DsaDocsSidebarWrapper from "@/components/learn/DsaDocsSidebarWrapper";
import { getDsaSyllabus } from "@/utils/mdxLoader";

export default function DsaDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read syllabus structure dynamically from the filesystem on the server!
  const syllabus = getDsaSyllabus();

  return (
    <DsaDocsSidebarWrapper syllabus={syllabus}>
      {children}
    </DsaDocsSidebarWrapper>
  );
}
