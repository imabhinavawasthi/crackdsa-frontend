import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contest Editorials | crackDSA",
  description: "Detailed video and text editorials for LeetCode, Codeforces, and CodeChef contests.",
  alternates: {
    canonical: "https://crackdsa.com/contests/editorials",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
