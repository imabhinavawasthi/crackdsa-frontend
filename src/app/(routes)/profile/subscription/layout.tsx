import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription & Pro Membership | crackDSA",
  description: "Manage your crackDSA Pro subscription and membership perks.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
