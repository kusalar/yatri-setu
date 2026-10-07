import { StateInfo, DistrictInfo, HiddenPlace, HiddenPlaceCategory } from './types';
import { STATES_DATA } from './states';
import { HIDDEN_PLACES_DATA } from './places';

export * from './types';
export * from './states';
export * from './places';

/**
 * Returns all 28 states
 */
export function getAllStates(): StateInfo[] {
  return STATES_DATA;
}

/**
 * Find state by slug (case-insensitive)
 */
export function getStateBySlug(stateSlug: string): StateInfo | undefined {
  const normalized = stateSlug.toLowerCase().trim();
  return STATES_DATA.find((s) => s.slug.toLowerCase() === normalized || s.id.toLowerCase() === normalized);
}

/**
 * Get all districts for a state
 */
export function getDistrictsForState(stateSlug: string): DistrictInfo[] {
  const state = getStateBySlug(stateSlug);
  return state ? state.districts : [];
}

/**
 * Find district by slug or alias (e.g. kutch vs kachchh)
 */
export function getDistrictBySlug(stateSlug: string, districtSlug: string): DistrictInfo | undefined {
  const districts = getDistrictsForState(stateSlug);
  const normalized = districtSlug.toLowerCase().trim();

  return districts.find((d) => {
    if (d.slug.toLowerCase() === normalized) return true;
    if (d.id.toLowerCase() === normalized) return true;
    if (d.aliases && d.aliases.some((a) => a.toLowerCase() === normalized)) return true;
    return false;
  });
}

/**
 * Get all hidden places for a given district
 */
export function getPlacesForDistrict(stateSlug: string, districtSlug: string): HiddenPlace[] {
  const district = getDistrictBySlug(stateSlug, districtSlug);
  const targetDistrictSlug = district ? district.slug.toLowerCase() : districtSlug.toLowerCase().trim();
  const targetStateSlug = stateSlug.toLowerCase().trim();

  return HIDDEN_PLACES_DATA.filter((p) => {
    const matchesState = p.stateSlug.toLowerCase() === targetStateSlug;
    const matchesDistrict =
      p.districtSlug.toLowerCase() === targetDistrictSlug ||
      (district?.aliases && district.aliases.some((a) => a.toLowerCase() === p.districtSlug.toLowerCase()));
    return matchesState && matchesDistrict;
  });
}

/**
 * Get all hidden places for a whole state
 */
export function getPlacesForState(stateSlug: string): HiddenPlace[] {
  const targetState = stateSlug.toLowerCase().trim();
  return HIDDEN_PLACES_DATA.filter((p) => p.stateSlug.toLowerCase() === targetState);
}

/**
 * Find a specific place
 */
export function getPlaceBySlug(stateSlug: string, districtSlug: string, placeSlug: string): HiddenPlace | undefined {
  const districtPlaces = getPlacesForDistrict(stateSlug, districtSlug);
  const normalizedPlace = placeSlug.toLowerCase().trim();

  return districtPlaces.find(
    (p) => p.slug.toLowerCase() === normalizedPlace || p.id.toLowerCase() === normalizedPlace
  );
}

/**
 * Count places in a state
 */
export function getStatePlaceCount(stateSlug: string): number {
  return getPlacesForState(stateSlug).length;
}

/**
 * Count places in a district
 */
export function getDistrictPlaceCount(stateSlug: string, districtSlug: string): number {
  return getPlacesForDistrict(stateSlug, districtSlug).length;
}

/**
 * Get related places for a place (by same district first, then same state, then category)
 */
export function getRelatedPlaces(currentPlace: HiddenPlace, limit = 4): HiddenPlace[] {
  // If specific slugs are configured
  if (currentPlace.nearbyPlaceSlugs && currentPlace.nearbyPlaceSlugs.length > 0) {
    const curated = HIDDEN_PLACES_DATA.filter(
      (p) => p.id !== currentPlace.id && currentPlace.nearbyPlaceSlugs?.includes(p.slug)
    );
    if (curated.length >= limit) return curated.slice(0, limit);
  }

  const others = HIDDEN_PLACES_DATA.filter((p) => p.id !== currentPlace.id);

  // Score relevance
  const scored = others.map((p) => {
    let score = 0;
    if (p.districtSlug === currentPlace.districtSlug && p.stateSlug === currentPlace.stateSlug) score += 10;
    else if (p.stateSlug === currentPlace.stateSlug) score += 5;
    if (p.category === currentPlace.category) score += 3;
    return { place: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.place);
}

/**
 * Search places, districts and states
 */
export function searchHiddenEntities(query?: string, category?: string) {
  const cleanQ = (query || '').toLowerCase().trim();
  const cleanCat = (category || 'ALL').toUpperCase();

  let filteredPlaces = HIDDEN_PLACES_DATA;

  if (cleanCat !== 'ALL') {
    filteredPlaces = filteredPlaces.filter((p) => p.category.toUpperCase() === cleanCat);
  }

  if (cleanQ) {
    filteredPlaces = filteredPlaces.filter((p) => {
      return (
        p.name.toLowerCase().includes(cleanQ) ||
        p.districtName.toLowerCase().includes(cleanQ) ||
        p.districtSlug.toLowerCase().includes(cleanQ) ||
        p.stateName.toLowerCase().includes(cleanQ) ||
        p.stateSlug.toLowerCase().includes(cleanQ) ||
        p.shortDescription.toLowerCase().includes(cleanQ) ||
        p.tags.some((t) => t.toLowerCase().includes(cleanQ))
      );
    });
  }

  const matchingStates = STATES_DATA.filter((s) => {
    if (!cleanQ) return true;
    return (
      s.name.toLowerCase().includes(cleanQ) ||
      s.description.toLowerCase().includes(cleanQ) ||
      s.tagline.toLowerCase().includes(cleanQ)
    );
  });

  return {
    places: filteredPlaces,
    states: matchingStates,
  };
}
