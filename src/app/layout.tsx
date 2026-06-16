import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import ClientLayout, { ThemeScript } from './ClientLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | CrackDSA',
    default: 'CrackDSA - Master Algorithms & System Design',
  },
  description: 'CrackDSA is the ultimate platform to master Data Structures, Algorithms, and System Design. Prepare for FAANG interviews with curated roadmaps, problems, and courses.',
  keywords: ['DSA', 'Data Structures', 'Algorithms', 'System Design', 'Interview Prep', 'LeetCode', 'FAANG', 'CrackDSA'],
  authors: [{ name: 'CrackDSA Team' }],
  openGraph: {
    title: 'CrackDSA - Master Algorithms & System Design',
    description: 'The ultimate platform to master Data Structures, Algorithms, and System Design.',
    url: 'https://crackdsa.com',
    siteName: 'CrackDSA',
    images: [
      {
        url: 'https://crackdsa.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CrackDSA Preview Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrackDSA - Master Algorithms & System Design',
    description: 'The ultimate platform to master Data Structures, Algorithms, and System Design.',
    images: ['https://crackdsa.com/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 transition-colors duration-300`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
