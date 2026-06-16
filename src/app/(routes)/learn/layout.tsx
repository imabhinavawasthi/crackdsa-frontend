import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Modules',
  description: 'Read through interactive documentation, time complexities, and coding patterns.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
