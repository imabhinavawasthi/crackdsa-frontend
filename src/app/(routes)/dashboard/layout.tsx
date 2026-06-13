import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CrackDSA",
  description: "View your progress, recent activity, and personalized recommendations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
