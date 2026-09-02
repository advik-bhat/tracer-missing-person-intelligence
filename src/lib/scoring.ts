import type { Case, ConvergenceGroup, LeadPriority, Person, Sighting, SourceType, VisualAttributes } from '@/lib/types';

const sourceReliability: Record<SourceType, number> = {
  Witness: 4,
  Investigator: 5,
  'Call Center': 3,
  'Field Team': 4,
  Other: 2,
};

const toRadians = (value: number): number => (value * Math.PI) / 180;

export const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const normalize = (value: string): string => value.toLowerCase();

export const extractAttributes = (description: string, person: Person): Record<string, string> => {
  const text = normalize(description);
  const attributes: Record<string, string> = {};
  const clothingTerms = person.clothing.split(/,| and /i).map((term) => term.trim()).filter(Boolean);
  const accessoryTerms = person.accessories.split(/,| and /i).map((term) => term.trim()).filter(Boolean);
  const ageMatch = text.match(/\b(young adult|young person|young man|teen|teenager|adult|child|elderly)\b/);
  const locationMatch = text.match(/\b(central station|metro junction|bus terminal|metro entrance|station|terminal|platform)\b/);
  const timeMatch = text.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/);

  if (ageMatch) attributes.age_category = ageMatch[1];
  const matchedClothing = clothingTerms.find((term) => text.includes(normalize(term)) || text.includes(normalize(term.replace('dark ', ''))));
  if (matchedClothing) attributes.clothing = matchedClothing;
  const matchedAccessory = accessoryTerms.find((term) => text.includes(normalize(term)) || text.includes(normalize(term.replace('black ', ''))));
  if (matchedAccessory) attributes.accessory = matchedAccessory;
  if (locationMatch) attributes.location_context = locationMatch[1];
  if (timeMatch) attributes.reported_time = timeMatch[0];
  return attributes;
};

export const getMatchingAttributes = (description: string, person: Person): string[] => {
  const text = normalize(description);
  const matches: string[] = [];
  if (text.includes('young') && person.age < 25) matches.push('young adult');
  if (text.includes('red hoodie') || text.includes('red sweatshirt') || text.includes('red')) matches.push('red hoodie');
  if (text.includes('backpack') && normalize(person.accessories).includes('backpack')) matches.push('black backpack');
  if (text.includes('dark trouser') || text.includes('dark pant')) matches.push('dark trousers');
  return [...new Set(matches)];
};

export const getConflictingAttributes = (description: string, person: Person): string[] => {
  const text = normalize(description);
  const conflicts: string[] = [];
  if (text.includes('blue') && normalize(person.clothing).includes('red')) conflicts.push('blue clothing reported');
  if (text.includes('white backpack') && normalize(person.accessories).includes('black')) conflicts.push('white backpack reported');
  return conflicts;
};

export const demoVisualAttributes: VisualAttributes = {
  upper_clothing_color: 'red',
  upper_clothing_type: 'hoodie / sweatshirt',
  lower_clothing_color: 'dark',
  backpack_present: 'yes',
  backpack_color: 'black',
  visible_accessories: 'backpack',
};

export const analyzeVisualDemo = (person: Person): {
  attributes: VisualAttributes;
  matching: string[];
  conflicts: string[];
  score: number;
} => {
  const attributes = demoVisualAttributes;
  const caseClothing = normalize(person.clothing);
  const caseAccessories = normalize(person.accessories);
  const matching: string[] = [];
  const conflicts: string[] = [];
  if (caseClothing.includes('red') && attributes.upper_clothing_color === 'red') matching.push('Red upper garment');
  else if (!caseClothing.includes(attributes.upper_clothing_color)) conflicts.push(`${attributes.upper_clothing_color} upper garment vs case profile`);
  if (caseClothing.includes('dark') && attributes.lower_clothing_color === 'dark') matching.push('Dark trousers');
  else if (!caseClothing.includes(attributes.lower_clothing_color)) conflicts.push(`${attributes.lower_clothing_color} lower garment vs case profile`);
  if (caseAccessories.includes('backpack') && attributes.backpack_present === 'yes') {
    if (caseAccessories.includes('black') && attributes.backpack_color === 'black') matching.push('Black backpack');
    else matching.push('Backpack present');
  } else if (attributes.backpack_present === 'yes' && !caseAccessories.includes('backpack')) {
    conflicts.push('Backpack not in case profile');
  }
  const score = Math.min(20, matching.length * 6 + (matching.length >= 3 ? 2 : 0) - conflicts.length * 4);
  return { attributes, matching, conflicts: conflicts.length > 0 ? conflicts : [], score: Math.max(0, score) };
};

export const calculateLeadScore = (
  sighting: Sighting,
  person: Person,
  caseData: Case,
  convergence?: ConvergenceGroup,
  hasImage?: boolean,
): {
  descriptionScore: number;
  visualScore: number;
  locationScore: number;
  temporalScore: number;
  reliabilityScore: number;
  convergenceScore: number;
  totalScore: number;
  priority: LeadPriority;
  explanation: string;
  matchingAttributes: string[];
  conflictingAttributes: string[];
  attributes: Record<string, string>;
  visualAttributes: VisualAttributes | null;
  visualMatching: string[];
  visualConflicts: string[];
} => {
  const matchingAttributes = getMatchingAttributes(sighting.description, person);
  const conflictingAttributes = getConflictingAttributes(sighting.description, person);
  const descriptionScore = Math.min(30, matchingAttributes.length * 9 + (matchingAttributes.length >= 3 ? 3 : 0) - conflictingAttributes.length * 4);
  const distance = sighting.latitude !== null && sighting.longitude !== null && caseData.last_known_latitude !== null && caseData.last_known_longitude !== null
    ? distanceKm(sighting.latitude, sighting.longitude, caseData.last_known_latitude, caseData.last_known_longitude)
    : 5;
  const locationScore = Math.max(0, Math.min(20, Math.round(20 - distance * 3.5)));
  const timeDiff = Math.abs(new Date(sighting.reported_at).getTime() - new Date(caseData.last_seen_at).getTime()) / 60000;
  const temporalScore = Math.max(0, Math.min(15, Math.round(15 - timeDiff / 12)));
  const reliabilityScore = sourceReliability[sighting.source_type];
  const convergenceScore = convergence && convergence.sightingIds.includes(sighting.id) ? 10 : 0;
  const visual = hasImage ? analyzeVisualDemo(person) : null;
  const visualScore = visual?.score ?? 0;
  const totalScore = Math.max(0, Math.min(100, descriptionScore + visualScore + locationScore + temporalScore + reliabilityScore + convergenceScore));
  const priority: LeadPriority = totalScore >= 80 ? 'HIGH' : totalScore >= 50 ? 'REVIEW' : 'LOW';
  const visualNote = hasImage && visual && visual.matching.length > 0
    ? ` The uploaded image shows ${visual.matching.join(', ').toLowerCase()}.`
    : '';
  const explanation = matchingAttributes.length >= 2
    ? `High priority because the sighting report and uploaded image contain multiple attributes consistent with the case profile, including ${matchingAttributes.join(', ')}. The sighting is also geographically and temporally relevant.${visualNote}`
    : `The report contains limited matching attributes and should be assessed alongside other available evidence.${visualNote}`;
  return {
    descriptionScore, visualScore, locationScore, temporalScore, reliabilityScore, convergenceScore, totalScore, priority, explanation,
    matchingAttributes, conflictingAttributes, attributes: extractAttributes(sighting.description, person),
    visualAttributes: visual?.attributes ?? null, visualMatching: visual?.matching ?? [], visualConflicts: visual?.conflicts ?? [],
  };
};

export const detectConvergence = (sightings: Sighting[], person: Person): ConvergenceGroup | null => {
  if (sightings.length < 3) return null;
  const sorted = [...sightings].filter((sighting) => sighting.latitude !== null && sighting.longitude !== null).sort((a, b) => new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime());
  if (sorted.length < 3) return null;
  const group = sorted.slice(0, 3);
  const first = group[0];
  const last = group[group.length - 1];
  const timeSpanMinutes = Math.round((new Date(last.reported_at).getTime() - new Date(first.reported_at).getTime()) / 60000);
  const spatialSpanKm = Math.round(Math.max(...group.map((sighting) => distanceKm(first.latitude as number, first.longitude as number, sighting.latitude as number, sighting.longitude as number))) * 10) / 10;
  const shared = group.map((sighting) => getMatchingAttributes(sighting.description, person));
  const overlappingAttributes = [...new Set(shared.flat())].filter((attribute) => shared.filter((items) => items.includes(attribute)).length >= 2);
  if (timeSpanMinutes > 60 || spatialSpanKm > 5 || overlappingAttributes.length < 2) return null;
  const correlationScore = Math.min(99, 65 + overlappingAttributes.length * 8 + Math.max(0, 20 - timeSpanMinutes / 2));
  return {
    sightingIds: group.map((sighting) => sighting.id),
    timeSpanMinutes, spatialSpanKm, correlationScore: Math.round(correlationScore), overlappingAttributes,
    explanation: `${group.length} sightings occurred within ${timeSpanMinutes} minutes and ${spatialSpanKm} km, with overlapping ${overlappingAttributes.join(' and ')} descriptions.`,
  };
};
