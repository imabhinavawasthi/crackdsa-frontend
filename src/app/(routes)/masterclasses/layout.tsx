import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masterclasses | CrackDSA",
  description: "Attend live sessions and exclusive masterclasses from industry experts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
