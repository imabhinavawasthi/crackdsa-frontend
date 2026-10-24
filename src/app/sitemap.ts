import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://crackdsa.com";
  const now = new Date();

  // Core Static Landing & Academy Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/course/dsa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dsa-sheet`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dsa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cp/newbie-to-expert`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cs-fundamentals`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contests/editorials`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/live-classes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/masterclasses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pro`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mock-interviews`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic DSA Sheets
  const sheetSlugs = [
    "pattern-mastery",
    "crackdsa-revision-sprint",
    "0-to-hero-dsa",
  ];
  const sheetRoutes: MetadataRoute.Sitemap = sheetSlugs.map((slug) => ({
    url: `${baseUrl}/dsa-sheet/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic CS Fundamentals Hubs
  const csSlugs = [
    "operating-system",
    "oops",
    "computer-network",
    "dbms",
  ];
  const csRoutes: MetadataRoute.Sitemap = csSlugs.map((slug) => ({
    url: `${baseUrl}/cs-fundamentals/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Topic Hubs
  const topicSlugs = [
    "array",
    "string",
    "binary-search",
    "dynamic-programming",
    "graph",
  ];
  const topicRoutes: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: `${baseUrl}/practice/topics/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // Dynamic Company Hubs
  const companySlugs = [
    "google",
    "amazon",
    "microsoft",
    "meta",
    "apple",
  ];
  const companyRoutes: MetadataRoute.Sitemap = companySlugs.map((slug) => ({
    url: `${baseUrl}/practice/companies/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...sheetRoutes,
    ...csRoutes,
    ...topicRoutes,
    ...companyRoutes,
  ];
}
