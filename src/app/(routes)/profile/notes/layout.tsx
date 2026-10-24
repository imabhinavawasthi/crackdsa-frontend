import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Study Notes | crackDSA",
  description: "Access your personalized problem notes and classroom takeaways.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
