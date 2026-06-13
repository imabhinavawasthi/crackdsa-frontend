import React from "react";
import CrackDSAAgent from "@/components/common/CrackDSAAgent";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <CrackDSAAgent />
    </div>
  );
}
