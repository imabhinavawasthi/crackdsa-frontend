import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem Solver | crackDSA",
  description: "Interactive online coding problem solver workspace with syntax highlighting, testcase execution, and editorials.",
};

export default function SolveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-[#1a1a1a] text-neutral-200 min-h-screen overflow-hidden antialiased">
      {children}
    </div>
  );
}
