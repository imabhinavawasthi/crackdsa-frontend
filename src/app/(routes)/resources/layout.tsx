import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | CrackDSA",
  description: "Explore a curated collection of premium resources.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
