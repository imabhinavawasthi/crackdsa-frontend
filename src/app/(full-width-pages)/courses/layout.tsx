import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses & Academy | crackDSA',
  description: 'Browse premium courses, masterclasses, and specialized algorithmic deep dives.',
  alternates: {
    canonical: 'https://crackdsa.com/courses',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
