import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company-wise DSA Practice Sheets | crackDSA",
  description: "Prepare for Google, Amazon, Microsoft, and Uber technical interview loops with company-specific DSA sheets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
