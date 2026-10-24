import { Onest } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import ClientLayout, { ThemeScript } from './ClientLayout';
import { Analytics } from "@vercel/analytics/next";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://crackdsa.com' : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s',
    default: 'crackDSA - Master Data Structures, Algorithms & System Design',
  },
  description: 'CrackDSA is the ultimate platform to master Data Structures, Algorithms, and System Design. Prepare for FAANG interviews with curated roadmaps, problems, and courses.',
  keywords: [
    'DSA',
    'Data Structures',
    'Algorithms',
    'System Design',
    'Interview Prep',
    'LeetCode',
    'FAANG',
    'CrackDSA',
    'DSA Sheets',
    'Competitive Programming',
    'CS Fundamentals'
  ],
  authors: [{ name: 'crackDSA Team' }],
  alternates: {
    canonical: 'https://crackdsa.com',
  },
  openGraph: {
    title: 'crackDSA - Master Algorithms & System Design',
    description: 'The ultimate platform to master Data Structures, Algorithms, and System Design.',
    url: 'https://crackdsa.com',
    siteName: 'crackDSA',
    images: [
      {
        url: '/crackdsa-og-image.png',
        width: 1200,
        height: 630,
        alt: 'crackDSA Preview Image',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'crackDSA - Master Algorithms & System Design',
    description: 'The ultimate platform to master Data Structures, Algorithms, and System Design.',
    images: ['/crackdsa-og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={onest.variable}>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${onest.className} dark:bg-gray-900 transition-colors duration-300`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
