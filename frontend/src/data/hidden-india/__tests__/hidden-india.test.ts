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
    assert.ok(dholavira.localStory.paragraphs.length >= 2, 'Must have detailed local story');
    assert.ok(dholavira.whyVisit.length >= 3, 'Must have at least 3 reasons to visit');
    assert.ok(dholavira.experiences.length >= 2, 'Must have experience cards');
    assert.ok(dholavira.responsibleTravel.length >= 2, 'Must have responsible travel guidelines');
    assert.ok(Array.isArray(dholavira.coordinates), 'Coordinates must be valid array');
  });

  it('verifies Chatakpur in Darjeeling, West Bengal', () => {
    const chatakpur = getPlaceBySlug('west-bengal', 'darjeeling', 'chatakpur');
    assert.ok(chatakpur, 'Chatakpur must exist in Darjeeling');
    assert.strictEqual(chatakpur.name, 'Chatakpur');
    assert.strictEqual(chatakpur.category, 'Village');
    assert.ok(chatakpur.elevation, 'Chatakpur must specify elevation');
    assert.ok(chatakpur.bestTime, 'Chatakpur must specify best season');
  });

  it('gracefully handles invalid state, district and place queries', () => {
    assert.strictEqual(getStateBySlug('nonexistent-state'), undefined);
    assert.strictEqual(getDistrictBySlug('gujarat', 'nonexistent-district'), undefined);
    assert.strictEqual(getDistrictBySlug('nonexistent-state', 'kutch'), undefined);
    assert.strictEqual(getPlaceBySlug('gujarat', 'kutch', 'nonexistent-place'), undefined);
  });

  it('handles districts with no mapped places as empty arrays', () => {
    // Bhavnagar is in Gujarat but currently awaiting place curation
    const places = getPlacesForDistrict('gujarat', 'bhavnagar');
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
  });
});
