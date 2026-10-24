import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSA Sheets | CrackDSA",
  description: "Curated collections of must-do problems to crack top product companies.",
  alternates: {
    canonical: "https://crackdsa.com/dsa-sheet",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
