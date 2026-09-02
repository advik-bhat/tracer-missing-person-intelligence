import type { Case, CaseEvent, LeadScore, Person, Sighting } from '@/lib/types';

const personId = 'person-aarav';
const caseId = 'case-1042';
const base = '2026-09-02T';

export const demoPerson: Person = { id: personId, name: 'Aarav Mehta', age: 19, height: '175 cm', description: 'Young adult male, slim build.', clothing: 'Red hoodie, dark trousers', accessories: 'Black backpack', reference_image_url: null, created_at: `${base}08:40:00` };
export const demoCase: Case = { id: caseId, case_number: 'TR-1042', status: 'ACTIVE', priority: 'HIGH', person_id: personId, person: demoPerson, last_known_location: 'Central Station', last_known_latitude: 40.7122, last_known_longitude: -74.0061, last_seen_at: `${base}08:40:00`, created_at: `${base}08:40:00`, updated_at: `${base}09:20:00` };

export const demoSightings: Sighting[] = [
  { id: 'sighting-1040', sighting_number: 1040, case_id: caseId, reported_at: `${base}08:52:00`, latitude: 40.7130, longitude: -74.0048, location_name: 'Central Station', description: 'Young man wearing a red hoodie and carrying a black backpack.', source_type: 'Witness', image_url: null, status: 'REVIEWED', created_at: `${base}08:52:00` },
  { id: 'sighting-1041', sighting_number: 1041, case_id: caseId, reported_at: `${base}09:03:00`, latitude: 40.7200, longitude: -74.0000, location_name: 'Metro Junction', description: 'Young adult wearing a red hoodie and dark backpack.', source_type: 'Field Team', image_url: null, status: 'FLAGGED', created_at: `${base}09:03:00` },
  { id: 'sighting-1042', sighting_number: 1042, case_id: caseId, reported_at: `${base}09:14:00`, latitude: 40.7280, longitude: -73.9940, location_name: 'Bus Terminal', description: 'Young person wearing a red sweatshirt with black backpack.', source_type: 'Witness', image_url: null, status: 'FLAGGED', created_at: `${base}09:14:00` },
];

export const additionalCases: Case[] = [
  { id: 'case-1037', case_number: 'TR-1037', status: 'ACTIVE', priority: 'REVIEW', person_id: 'p-1037', person: { id: 'p-1037', name: 'Mina Park', age: 27, height: '163 cm', description: 'Adult woman, medium build.', clothing: 'Green jacket, jeans', accessories: 'Canvas tote', reference_image_url: null, created_at: `${base}07:20:00` }, last_known_location: 'Riverside Market', last_known_latitude: 40.716, last_known_longitude: -74.012, last_seen_at: `${base}07:20:00`, created_at: `${base}07:20:00`, updated_at: `${base}09:05:00` },
  { id: 'case-1039', case_number: 'TR-1039', status: 'OPEN', priority: 'LOW', person_id: 'p-1039', person: { id: 'p-1039', name: 'Jon Bell', age: 34, height: '180 cm', description: 'Adult male, athletic build.', clothing: 'Blue windbreaker, khaki pants', accessories: 'Gray cap', reference_image_url: null, created_at: `${base}06:15:00` }, last_known_location: 'North Pier', last_known_latitude: 40.731, last_known_longitude: -73.997, last_seen_at: `${base}06:15:00`, created_at: `${base}06:15:00`, updated_at: `${base}08:30:00` },
  { id: 'case-1041', case_number: 'TR-1041', status: 'ACTIVE', priority: 'HIGH', person_id: 'p-1041', person: { id: 'p-1041', name: 'Elena Ortiz', age: 16, height: '158 cm', description: 'Teenager, petite build.', clothing: 'Yellow raincoat, dark leggings', accessories: 'Red umbrella', reference_image_url: null, created_at: `${base}05:40:00` }, last_known_location: 'East Loop', last_known_latitude: 40.705, last_known_longitude: -74.013, last_seen_at: `${base}05:40:00`, created_at: `${base}05:40:00`, updated_at: `${base}08:50:00` },
  { id: 'case-1032', case_number: 'TR-1032', status: 'COLD', priority: 'LOW', person_id: 'p-1032', person: { id: 'p-1032', name: 'Noah Reed', age: 42, height: '176 cm', description: 'Adult male, average build.', clothing: 'Black coat, gray scarf', accessories: 'Leather satchel', reference_image_url: null, created_at: `${base}04:10:00` }, last_known_location: 'West Avenue', last_known_latitude: 40.720, last_known_longitude: -74.018, last_seen_at: `${base}04:10:00`, created_at: `${base}04:10:00`, updated_at: `${base}07:45:00` },
  { id: 'case-1040', case_number: 'TR-1040', status: 'CLOSED', priority: 'LOW', person_id: 'p-1040', person: { id: 'p-1040', name: 'Samira Cole', age: 22, height: '168 cm', description: 'Young adult woman.', clothing: 'White sweater, blue jeans', accessories: 'Black purse', reference_image_url: null, created_at: `${base}03:30:00` }, last_known_location: 'Library District', last_known_latitude: 40.724, last_known_longitude: -74.009, last_seen_at: `${base}03:30:00`, created_at: `${base}03:30:00`, updated_at: `${base}06:30:00` },
];

export const demoEvents: CaseEvent[] = [
  { id: 'event-1', case_id: caseId, event_type: 'Case created', message: 'Case TR-1042 opened for investigator review.', created_at: `${base}08:40:00` },
  { id: 'event-2', case_id: caseId, event_type: 'Sighting received', message: 'Sighting #1040 received at Central Station.', created_at: `${base}08:52:00` },
  { id: 'event-3', case_id: caseId, event_type: 'AI analysis completed', message: 'Relevant clothing and accessory attributes extracted.', created_at: `${base}08:55:00` },
  { id: 'event-4', case_id: caseId, event_type: 'Lead prioritized', message: 'Lead #1042 received a high-priority score of 89.', created_at: `${base}08:56:00` },
  { id: 'event-5', case_id: caseId, event_type: 'Trail convergence detected', message: 'Three correlated sightings identified across a 2.8 km corridor.', created_at: `${base}09:14:00` },
  { id: 'event-6', case_id: caseId, event_type: 'Lead assigned for investigator review', message: 'Lead #1042 flagged for investigation.', created_at: `${base}09:20:00` },
];

const demoVisual = {
  upper_clothing_color: 'red',
  upper_clothing_type: 'hoodie / sweatshirt',
  lower_clothing_color: 'dark',
  backpack_present: 'yes',
  backpack_color: 'black',
  visible_accessories: 'backpack',
};

export const demoLeadScores: LeadScore[] = [
  { id: 'score-1040', sighting_id: 'sighting-1040', description_score: 27, visual_score: 17, location_score: 18, temporal_score: 13, reliability_score: 4, convergence_score: 10, total_score: 89, priority: 'HIGH', ai_explanation: 'High priority because the sighting report and uploaded image contain multiple attributes consistent with the case profile, including red hoodie, black backpack. The sighting is also geographically and temporally relevant. The uploaded image shows red upper garment, black backpack, dark trousers.', extracted_attributes: { age_category: 'young adult', clothing: 'red hoodie', accessory: 'black backpack' }, visual_attributes: demoVisual, visual_matching: ['Red upper garment', 'Black backpack', 'Dark trousers'], visual_conflicts: [], matching_attributes: ['young adult', 'red hoodie', 'black backpack'], conflicting_attributes: [], created_at: `${base}08:55:00` },
  { id: 'score-1041', sighting_id: 'sighting-1041', description_score: 27, visual_score: 17, location_score: 18, temporal_score: 13, reliability_score: 4, convergence_score: 10, total_score: 89, priority: 'HIGH', ai_explanation: 'High priority because the sighting report and uploaded image contain multiple attributes consistent with the case profile, including red hoodie, black backpack. The sighting is also geographically and temporally relevant. The uploaded image shows red upper garment, black backpack, dark trousers.', extracted_attributes: { age_category: 'young adult', clothing: 'red hoodie', accessory: 'dark backpack' }, visual_attributes: demoVisual, visual_matching: ['Red upper garment', 'Black backpack', 'Dark trousers'], visual_conflicts: [], matching_attributes: ['young adult', 'red hoodie', 'black backpack'], conflicting_attributes: [], created_at: `${base}09:05:00` },
  { id: 'score-1042', sighting_id: 'sighting-1042', description_score: 27, visual_score: 17, location_score: 18, temporal_score: 13, reliability_score: 4, convergence_score: 10, total_score: 89, priority: 'HIGH', ai_explanation: 'High priority because the sighting report and uploaded image contain multiple attributes consistent with the case profile, including red hoodie, black backpack. The sighting is also geographically and temporally relevant. The uploaded image shows red upper garment, black backpack, dark trousers.', extracted_attributes: { age_category: 'young person', clothing: 'red sweatshirt', accessory: 'black backpack' }, visual_attributes: demoVisual, visual_matching: ['Red upper garment', 'Black backpack', 'Dark trousers'], visual_conflicts: [], matching_attributes: ['young adult', 'red hoodie', 'black backpack'], conflicting_attributes: [], created_at: `${base}09:14:00` },
];
