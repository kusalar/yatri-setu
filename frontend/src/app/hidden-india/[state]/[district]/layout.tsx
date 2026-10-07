import type { Metadata } from 'next';
import { getStateBySlug, getDistrictBySlug } from '@/data/hidden-india';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; district: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, district: districtSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const district = state ? getDistrictBySlug(state.slug, districtSlug) : undefined;

  if (!state || !district) {
    return {
      title: 'Hidden District | Hidden India | Yatri Setu',
      description: 'Explore offbeat sanctuaries and local stories.'
    };
  }

  return {
    title: `Hidden ${district.name} | Hidden ${state.name} | Yatri Setu`,
    description: district.description || `Discover hidden places and living culture in ${district.name}, ${state.name}.`,
    openGraph: {
      title: `Hidden ${district.name} | Hidden ${state.name} | Yatri Setu`,
      description: district.description,
    }
  };
}

export default function DistrictLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
