import React from "react";
import { getDsaSyllabus } from "@/utils/mdxLoader";
import DsaDocsHomeClient from "@/components/learn/DsaDocsHomeClient";

export default async function DsaDocsHomePage() {
  // Load syllabus structure dynamically on the server from MDX folders and files
  const syllabus = getDsaSyllabus();

  return <DsaDocsHomeClient syllabus={syllabus} />;
}
