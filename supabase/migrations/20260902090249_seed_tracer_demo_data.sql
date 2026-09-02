/*
# Seed TRACER demo workspace

1. Demo data
- Adds fictional person Aarav Mehta and case TR-1042.
- Adds three correlated sightings (#1040, #1041, #1042).
- Adds transparent lead scores matching the UI demo values.
- Adds the case timeline events shown in the investigator workspace.

2. Safety
- Uses fixed IDs and `ON CONFLICT DO NOTHING` so the seed is safe to re-run.
- All records are explicitly fictional demo data.
*/

INSERT INTO persons (id, name, age, height, description, clothing, accessories, created_at)
VALUES ('11111111-1111-4111-8111-111111111111', 'Aarav Mehta', 19, '175 cm', 'Young adult male, slim build.', 'Red hoodie, dark trousers', 'Black backpack', '2026-09-02T08:40:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cases (id, case_number, status, priority, person_id, last_known_location, last_known_latitude, last_known_longitude, last_seen_at, created_at, updated_at)
VALUES ('22222222-2222-4222-8222-222222222222', 'TR-1042', 'ACTIVE', 'HIGH', '11111111-1111-4111-8111-111111111111', 'Central Station', 40.7122, -74.0061, '2026-09-02T08:40:00Z', '2026-09-02T08:40:00Z', '2026-09-02T09:20:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sightings (id, sighting_number, case_id, reported_at, latitude, longitude, location_name, description, source_type, status, created_at)
VALUES
('33333333-3333-4333-8333-333333333330', 1040, '22222222-2222-4222-8222-222222222222', '2026-09-02T08:52:00Z', 40.7130, -74.0048, 'Central Station', 'Young man wearing a red hoodie and carrying a black backpack.', 'Witness', 'REVIEWED', '2026-09-02T08:52:00Z'),
('33333333-3333-4333-8333-333333333331', 1041, '22222222-2222-4222-8222-222222222222', '2026-09-02T09:03:00Z', 40.7200, -74.0000, 'Metro Junction', 'Young adult wearing a red hoodie and dark backpack.', 'Field Team', 'FLAGGED', '2026-09-02T09:03:00Z'),
('33333333-3333-4333-8333-333333333332', 1042, '22222222-2222-4222-8222-222222222222', '2026-09-02T09:14:00Z', 40.7280, -73.9940, 'Bus Terminal', 'Young person wearing a red sweatshirt with black backpack.', 'Witness', 'FLAGGED', '2026-09-02T09:14:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lead_scores (id, sighting_id, description_score, location_score, temporal_score, reliability_score, convergence_score, total_score, priority, ai_explanation, extracted_attributes, matching_attributes, conflicting_attributes, created_at)
VALUES
('44444444-4444-4444-8444-444444444440', '33333333-3333-4333-8333-333333333330', 35, 24, 19, 8, 10, 96, 'HIGH', 'The report strongly matches the case clothing and backpack attributes and aligns with the emerging corridor.', '{"age_category":"young adult","clothing":"red hoodie","accessory":"black backpack"}', ARRAY['young adult','red hoodie','black backpack'], ARRAY[]::text[], '2026-09-02T08:55:00Z'),
('44444444-4444-4444-8444-444444444441', '33333333-3333-4333-8333-333333333331', 32, 21, 18, 9, 10, 90, 'HIGH', 'The report strongly matches multiple case attributes and aligns with other recent sightings.', '{"age_category":"young adult","clothing":"red hoodie","accessory":"dark backpack"}', ARRAY['young adult','red hoodie','black backpack'], ARRAY[]::text[], '2026-09-02T09:05:00Z'),
('44444444-4444-4444-8444-444444444442', '33333333-3333-4333-8333-333333333332', 32, 21, 18, 8, 10, 89, 'HIGH', 'The report strongly matches the case clothing and backpack attributes. The sighting is geographically close to the last known location, occurred within the active search window, and aligns with other recent sightings.', '{"age_category":"young person","clothing":"red sweatshirt","accessory":"black backpack"}', ARRAY['young adult','red hoodie','black backpack'], ARRAY[]::text[], '2026-09-02T09:14:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO case_events (id, case_id, event_type, message, created_at)
VALUES
('55555555-5555-4555-8555-555555555550', '22222222-2222-4222-8222-222222222222', 'Case created', 'Case TR-1042 opened for investigator review.', '2026-09-02T08:40:00Z'),
('55555555-5555-4555-8555-555555555551', '22222222-2222-4222-8222-222222222222', 'Sighting received', 'Sighting #1040 received at Central Station.', '2026-09-02T08:52:00Z'),
('55555555-5555-4555-8555-555555555552', '22222222-2222-4222-8222-222222222222', 'AI analysis completed', 'Relevant clothing and accessory attributes extracted.', '2026-09-02T08:55:00Z'),
('55555555-5555-4555-8555-555555555553', '22222222-2222-4222-8222-222222222222', 'Lead prioritized', 'Lead #1042 received a high-priority score of 89.', '2026-09-02T08:56:00Z'),
('55555555-5555-4555-8555-555555555554', '22222222-2222-4222-8222-222222222222', 'Trail convergence detected', 'Three correlated sightings identified across a 2.8 km corridor.', '2026-09-02T09:14:00Z'),
('55555555-5555-4555-8555-555555555555', '22222222-2222-4222-8222-222222222222', 'Lead assigned for investigator review', 'Lead #1042 flagged for investigation.', '2026-09-02T09:20:00Z')
ON CONFLICT (id) DO NOTHING;
