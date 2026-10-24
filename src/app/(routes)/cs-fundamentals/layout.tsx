import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS Fundamentals | crackDSA",
  description: "Operating Systems, DBMS, and Computer Networks interview cheatsheets and study guides.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
