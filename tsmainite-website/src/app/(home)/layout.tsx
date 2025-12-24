import type { Metadata } from 'next';
import { homeMetadata } from '@/app/metadata';

export const metadata: Metadata = homeMetadata;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
