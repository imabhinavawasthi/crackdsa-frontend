import { Metadata } from "next";
import JsonLd from "@/components/common/JsonLd";

export const metadata: Metadata = {
  title: "CrackDSA Pro Membership | All-Access Mentorship & Placement Pass",
  description: "Get unlimited access to all courses, live mentorship classes, CP sheets, and 1:1 interview prep with CrackDSA Pro.",
  alternates: {
    canonical: "https://crackdsa.com/pro",
  },
};

const proSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "CrackDSA Pro Membership",
  description: "All-Access Pass to CrackDSA: live weekend classes, 150+ hours DSA video library, doubt solving sessions, and CS fundamentals.",
  brand: {
    "@type": "Brand",
    name: "CrackDSA",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "799",
    highPrice: "5999",
    offerCount: "3",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={proSchema} />
      {children}
    </>
  );
}
