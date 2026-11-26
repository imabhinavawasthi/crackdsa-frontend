export type MasterclassBadgeIcon = "layout" | "calendar" | "clock";

export type AudienceIcon = "graduation" | "briefcase" | "compass" | "refresh" | "target" | "rocket";

export type OutcomeIcon = "map" | "zap" | "calendar" | "chart" | "shield" | "rocket";

export type SocialPlatform = "linkedin" | "instagram" | "twitter" | "youtube";

export interface Masterclass {
  slug: string;
  title: string;
  hero: {
    heading: string;
    subheading: string;
    badges: { icon: MasterclassBadgeIcon; label: string }[];
    cta: { label: string; href: string };
    video: {
      thumbnail: string | null;
      url: string | null;
      instructorName: string;
    };
  };
  placements: {
    heading: string;
    subheading: string;
    students: {
      name: string;
      photo: string | null;
      role: string;
      company: string;
      package: string;
    }[];
  };
  audience: {
    heading: string;
    subheading: string;
    items: { icon: AudienceIcon; title: string; description: string }[];
  };
  outcomes: {
    badge: string;
    heading: string;
    subheading: string;
    items: { icon: OutcomeIcon; title: string; description: string; metric: string | null }[];
  };
  instructor: {
    heading: string;
    name: string;
    title: string;
    photo: string | null;
    /** Paragraphs; wrap text in **double asterisks** to bold it. */
    bio: string[];
    socials: { platform: SocialPlatform; stats: { value: string; label: string }[] }[];
  };
  reviews: {
    heading: string;
    featured: {
      headline: string;
      quote: string;
      name: string;
      subtitle: string;
      photo: string | null;
    }[];
    videos: { name: string; thumbnail: string | null; url: string | null }[];
    quoteCard: { quote: string; name: string };
  };
  faq: {
    badge: string;
    heading: string;
    items: { question: string; answer: string }[];
  };
  stickyBar: {
    title: string;
    cta: { label: string; href: string };
    originalPrice: string;
    price: string;
    /** ISO 8601 timestamp when the offer ends. */
    offerEndsAt: string;
  };
  description: string;
  level: string;
  curriculum: {
    heading: string;
    subheading: string;
    modules: { title: string; duration: string; description: string; topics: string[] }[];
  };
}
