import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CrackDSA PRO',
  description: 'Unlock premium courses, 1-on-1 mentorship, and exclusive interview resources with PRO.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
