import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | CrackDSA",
  description: "Manage your account settings and personal information.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
