import type { Metadata } from 'next';
import { getStateBySlug } from '@/data/hidden-india';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);

  if (!state) {
    return {
      title: 'Hidden India | Yatri Setu',
      description: 'Explore offbeat sanctuaries and living heritage across India.'
    };
  }

  return {
    title: `Hidden ${state.name} | Hidden India | Yatri Setu`,
    description: state.description || `Discover the districts, craft traditions and serene sanctuaries of ${state.name}.`,
    openGraph: {
      title: `Hidden ${state.name} | Hidden India | Yatri Setu`,
      description: state.description,
    }
  };
}

export default function StateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
