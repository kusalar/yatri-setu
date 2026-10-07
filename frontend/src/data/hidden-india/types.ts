export type HiddenPlaceCategory =
  | 'Nature'
  | 'Heritage'
  | 'Culture'
  | 'Village'
  | 'Adventure'
  | 'Wildlife'
  | 'Food'
  | 'Craft'
  | 'Spiritual'
  | 'Architecture'
  | 'Community';

export type ExperienceType =
  | 'Walk'
  | 'Taste'
  | 'Meet'
  | 'Explore'
  | 'Learn'
  | 'Photograph'
  | 'Trek'
  | 'Craft'
  | 'Conservation';

export interface ExperienceItem {
  type: ExperienceType;
  title: string;
  description: string;
}

export interface ResponsibleTravelGuideline {
  title: string;
  description: string;
}

export interface LocalStory {
  headline?: string;
  paragraphs: string[];
  culturalSignificance?: string;
  communityConnection?: string;
}

export interface MoreAboutPlace {
  history?: string;
  culture?: string;
  nature?: string;
  localLife?: string;
  food?: string;
  crafts?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface HiddenPlace {
  id: string;
  name: string;
  slug: string;
  stateSlug: string;
  stateName: string;
  districtSlug: string;
  districtName: string;
  shortDescription: string;
  image: string;
  imageAlt?: string;
  gallery?: GalleryImage[];
  category: HiddenPlaceCategory;
  tags: string[];
  isUnmapped?: boolean;
  localStory?: LocalStory;
  whyVisit?: string[];
  experiences?: ExperienceItem[];
  bestTime?: string;
  duration?: string;
  accessibility?: string;
  idealFor?: string;
  coordinates?: [number, number]; // [lng, lat]
  elevation?: string;
  moreAbout?: MoreAboutPlace;
  responsibleTravel?: ResponsibleTravelGuideline[];
  nearbyPlaceSlugs?: string[];
}

export interface DistrictInfo {
  id: string;
  name: string;
  slug: string;
  stateSlug: string;
  stateName: string;
  description: string;
  heroImage: string;
  categories?: HiddenPlaceCategory[];
  aliases?: string[];
}

export interface StateInfo {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  districts: DistrictInfo[];
}
