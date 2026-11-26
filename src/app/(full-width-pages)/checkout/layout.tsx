import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout | crackDSA',
  description: 'Complete your purchase and start mastering your coding interviews today.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
