import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getAllStates,
  getStateBySlug,
  getDistrictsForState,
  getDistrictBySlug,
  getPlacesForDistrict,
  getPlacesForState,
  getPlaceBySlug,
  getRelatedPlaces,
  searchHiddenEntities,
  STATES_DATA,
  HIDDEN_PLACES_DATA
} from '../index';

describe('Hidden India Architecture & Data Integrity', () => {
  it('supports all 28 states of India', () => {
    const states = getAllStates();
    assert.strictEqual(states.length, 28, 'Expected exactly 28 states');

    const expectedStates = [
      'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh',
      'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand',
      'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur',
      'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
      'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura',
      'uttar-pradesh', 'uttarakhand', 'west-bengal'
    ];

    for (const slug of expectedStates) {
      const state = getStateBySlug(slug);
      assert.ok(state, `State ${slug} must exist in STATES_DATA`);
      assert.ok(state.districts.length > 0, `State ${slug} must contain administrative districts`);
    }
  });

  it('contains all 33 official administrative districts of Gujarat', () => {
    const gujarat = getStateBySlug('gujarat');
    assert.ok(gujarat, 'Gujarat state must exist');
    assert.strictEqual(gujarat.districts.length, 33, 'Gujarat must have all 33 administrative districts');

    const expectedSample = [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
      'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
      'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda',
      'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
      'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
      'Tapi', 'Vadodara', 'Valsad'
    ];

    for (const name of expectedSample) {
      const found = gujarat.districts.some((d) => d.name.toLowerCase() === name.toLowerCase());
      assert.ok(found, `District ${name} must exist in Gujarat district list`);
    }
  });

  it('supports district alias resolution (e.g. kutch vs kachchh)', () => {
    const viaKutch = getDistrictBySlug('gujarat', 'kutch');
    const viaKachchh = getDistrictBySlug('gujarat', 'kachchh');

    assert.ok(viaKutch, 'Should resolve via slug "kutch"');
    assert.ok(viaKachchh, 'Should resolve via alias "kachchh"');
    assert.strictEqual(viaKutch.id, viaKachchh.id, 'Both slugs must resolve to the same district entity');
  });

  it('returns places for Kutch district correctly', () => {
    const kutchPlaces = getPlacesForDistrict('gujarat', 'kutch');
    assert.ok(kutchPlaces.length >= 3, 'Kutch must have at least 3 curated seed places');

    const slugs = kutchPlaces.map((p) => p.slug);
    assert.ok(slugs.includes('dholavira'), 'Kutch must include Dholavira');
    assert.ok(slugs.includes('nirona'), 'Kutch must include Nirona');
    assert.ok(slugs.includes('lakhpat'), 'Kutch must include Lakhpat');
  });

  it('verifies Dholavira place details and structured fields', () => {
    const dholavira = getPlaceBySlug('gujarat', 'kutch', 'dholavira');
    assert.ok(dholavira, 'Dholavira place detail must resolve');
    assert.strictEqual(dholavira.name, 'Dholavira');
    assert.strictEqual(dholavira.category, 'Heritage');
    assert.ok(dholavira.imageAlt, 'Dholavira must have imageAlt');
    assert.ok(dholavira.localStory && dholavira.localStory.paragraphs.length >= 2, 'Must have detailed local story');
    assert.ok(dholavira.whyVisit && dholavira.whyVisit.length >= 3, 'Must have at least 3 reasons to visit');
    assert.ok(dholavira.experiences && dholavira.experiences.length >= 2, 'Must have experience cards');
    assert.ok(dholavira.responsibleTravel && dholavira.responsibleTravel.length >= 2, 'Must have responsible travel guidelines');
    assert.ok(Array.isArray(dholavira.coordinates), 'Coordinates must be valid array');
  });

  it('verifies Chatakpur in Darjeeling, West Bengal', () => {
    const chatakpur = getPlaceBySlug('west-bengal', 'darjeeling', 'chatakpur');
    assert.ok(chatakpur, 'Chatakpur must exist in Darjeeling');
    assert.strictEqual(chatakpur.name, 'Chatakpur');
    assert.strictEqual(chatakpur.category, 'Village');
    assert.ok(chatakpur.imageAlt, 'Chatakpur must have imageAlt');
    assert.ok(chatakpur.elevation, 'Chatakpur must specify elevation');
    assert.ok(chatakpur.bestTime, 'Chatakpur must specify best season');
  });

  it('ensures every hidden place has an image and meaningful imageAlt', () => {
    for (const place of HIDDEN_PLACES_DATA) {
      assert.ok(place.image && place.image.trim().length > 0, `Place ${place.id} must have an image`);
      assert.ok(place.imageAlt && place.imageAlt.trim().length > 0, `Place ${place.id} must have imageAlt`);
      assert.ok(!place.imageAlt.toLowerCase().includes('image1'), `Place ${place.id} has invalid generic alt`);
      assert.ok(!place.imageAlt.toLowerCase().includes('travel image'), `Place ${place.id} has invalid generic alt`);
    }
  });

  it('supports Kendrapara in Odisha with unmapped status and zero fabricated claims', () => {
    const odisha = getStateBySlug('odisha');
    assert.ok(odisha, 'Odisha state must exist');

    const kendrapara = getDistrictBySlug('odisha', 'kendrapara');
    assert.ok(kendrapara, 'Kendrapara district must exist in Odisha');

    const kendraparaPlaces = getPlacesForDistrict('odisha', 'kendrapara');
    assert.ok(kendraparaPlaces.length >= 3, 'Kendrapara must have 3 unmapped places');

    const slugs = kendraparaPlaces.map((p) => p.slug);
    assert.ok(slugs.includes('bhitarkanika'), 'Must include Bhitarkanika');
    assert.ok(slugs.includes('gahirmatha'), 'Must include Gahirmatha');
    assert.ok(slugs.includes('hukitola'), 'Must include Hukitola');

    for (const place of kendraparaPlaces) {
      assert.strictEqual(place.isUnmapped, true, `${place.name} must be marked isUnmapped: true`);
      assert.strictEqual(place.localStory, undefined, `${place.name} must NOT contain fabricated localStory`);
      assert.strictEqual(place.whyVisit, undefined, `${place.name} must NOT contain fabricated whyVisit`);
      assert.strictEqual(place.experiences, undefined, `${place.name} must NOT contain fabricated experiences`);
      assert.strictEqual(place.coordinates, undefined, `${place.name} must NOT contain fabricated coordinates`);
      assert.ok(place.image, `${place.name} must have a destination image`);
      assert.ok(place.imageAlt, `${place.name} must have meaningful imageAlt`);
    }
  });

  it('gracefully handles invalid state, district and place queries', () => {
    assert.strictEqual(getStateBySlug('nonexistent-state'), undefined);
    assert.strictEqual(getDistrictBySlug('gujarat', 'nonexistent-district'), undefined);
    assert.strictEqual(getDistrictBySlug('nonexistent-state', 'kutch'), undefined);
    assert.strictEqual(getPlaceBySlug('gujarat', 'kutch', 'nonexistent-place'), undefined);
  });

  it('handles districts with no mapped places as empty arrays', () => {
    // Koraput is in Odisha but currently awaiting place curation
    const places = getPlacesForDistrict('odisha', 'koraput');
    assert.ok(Array.isArray(places), 'Must return an array');
    assert.strictEqual(places.length, 0, 'Unmapped district should return 0 places gracefully');
  });

  it('calculates related places correctly', () => {
    const dholavira = getPlaceBySlug('gujarat', 'kutch', 'dholavira');
    assert.ok(dholavira);
    const related = getRelatedPlaces(dholavira, 3);
    assert.ok(related.length > 0, 'Should return related places');
    assert.ok(!related.some((p) => p.id === dholavira.id), 'Must not include itself');
  });

  it('searches places and states accurately', () => {
    const searchRes = searchHiddenEntities('kutch');
    assert.ok(searchRes.places.length > 0, 'Should find places matching "kutch"');

    const craftRes = searchHiddenEntities('', 'Craft');
    assert.ok(craftRes.places.every((p) => p.category === 'Craft'), 'All results must match category Craft');

    const kendraparaSearch = searchHiddenEntities('kendrapara');
    assert.ok(kendraparaSearch.places.length >= 3, 'Should find Kendrapara places in search');
  });
});
