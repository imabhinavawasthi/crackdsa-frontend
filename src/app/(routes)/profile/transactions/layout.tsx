import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction History | crackDSA",
  description: "View your purchase history and invoices on crackDSA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
