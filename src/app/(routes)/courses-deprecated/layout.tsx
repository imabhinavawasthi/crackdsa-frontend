import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | CrackDSA",
  description: "Explore premium courses to master Data Structures, Algorithms, and System Design.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
