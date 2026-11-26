import { Metadata } from "next";
import LandingPage from "@/components/landing-page/landing-page";
import JsonLd from "@/components/common/JsonLd";

export const metadata: Metadata = {
  title: "crackDSA - Master Data Structures, Algorithms & System Design",
  description: "CrackDSA is the ultimate platform to master Data Structures, Algorithms, and System Design. Prepare for FAANG interviews with curated roadmaps, problems, and courses.",
  alternates: {
    canonical: "https://crackdsa.com",
  },
};

const rootSchemas = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://crackdsa.com/#organization",
      name: "CrackDSA",
      url: "https://crackdsa.com",
      logo: {
        "@type": "ImageObject",
        url: "https://crackdsa.com/new-logos/crackdsa-logo-new-white-background.png",
        caption: "CrackDSA Logo",
      },
      sameAs: [
        "https://www.linkedin.com/company/crackdsa",
        "https://twitter.com/crackdsa",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://crackdsa.com/#website",
      url: "https://crackdsa.com",
      name: "CrackDSA",
      description: "Master Data Structures, Algorithms & System Design for FAANG and Top Tech Interviews",
      publisher: {
        "@id": "https://crackdsa.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://crackdsa.com/dsa?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd schema={rootSchemas} />
      <LandingPage />
    </>
  );
}
