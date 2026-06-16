import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Roadmaps',
  description: 'Follow structured, AI-generated learning paths tailored for your target company and role.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
