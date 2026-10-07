import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hidden India | Yatri Setu',
  description: 'Discover lesser-known natural destinations, rural heritage, living craft traditions and responsible sanctuaries across India.',
  openGraph: {
    title: 'Hidden India | Yatri Setu',
    description: 'Discover the places India has not put on every map yet.',
  }
};

export default function HiddenIndiaRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
