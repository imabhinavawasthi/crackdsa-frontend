import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topic-wise DSA Practice Sheets | crackDSA",
  description: "Master algorithms pattern-by-pattern with topic-wise DSA practice sheets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
