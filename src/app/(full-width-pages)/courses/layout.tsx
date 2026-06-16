import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academy',
  description: 'Browse premium courses, masterclasses, and specialized algorithmic deep dives.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
