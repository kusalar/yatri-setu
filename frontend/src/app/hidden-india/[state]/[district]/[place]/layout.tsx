import type { Metadata } from 'next';
import { getStateBySlug, getDistrictBySlug, getPlaceBySlug } from '@/data/hidden-india';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; district: string; place: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, district: districtSlug, place: placeSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const district = state ? getDistrictBySlug(state.slug, districtSlug) : undefined;
  const place = state && district ? getPlaceBySlug(state.slug, district.slug, placeSlug) : undefined;

  if (!place) {
    return {
      title: 'Hidden Place | Hidden India | Yatri Setu',
      description: 'Explore offbeat sanctuaries and local stories.'
    };
  }

  return {
    title: `${place.name} | Hidden ${place.districtName} | Yatri Setu`,
    description: place.shortDescription,
    openGraph: {
      title: `${place.name} | Hidden ${place.districtName} | Yatri Setu`,
      description: place.shortDescription,
      images: [place.image],
    }
  };
}

export default function PlaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
