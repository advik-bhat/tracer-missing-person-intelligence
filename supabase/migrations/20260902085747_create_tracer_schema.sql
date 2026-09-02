/*
# TRACER — Missing Person Intelligence & Rescue Platform Schema

## Overview
Creates the full relational schema for TRACER: cases, persons, sightings,
lead scores, case events, and investigator notes. Single-tenant demo app
(no auth) — all policies allow anon + authenticated CRUD.

## Tables

1. **persons** — missing person profiles (name, age, description, clothing, accessories, reference image, coordinates)
2. **cases** — investigation cases linked to a person, with status, priority, last-known location/coords, last-seen timestamp
3. **sightings** — incoming sighting reports linked to a case, with location, description, source type, status, coordinates
4. **lead_scores** — deterministic lead priority scores per sighting (description, location, temporal, reliability, convergence sub-scores + total + priority + AI explanation)
5. **case_events** — timeline events for a case (event_type, message, timestamp)
6. **investigator_notes** — notes attached to a case and optionally a sighting

## Security
- RLS enabled on every table.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` — this is a single-tenant demo workspace with intentionally shared demo data.
*/

-- Persons
CREATE TABLE IF NOT EXISTS persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer,
  height text,
  description text,
  clothing text,
  accessories text,
  reference_image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_persons" ON persons;
CREATE POLICY "anon_select_persons" ON persons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_persons" ON persons;
CREATE POLICY "anon_insert_persons" ON persons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_persons" ON persons;
CREATE POLICY "anon_update_persons" ON persons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_persons" ON persons;
CREATE POLICY "anon_delete_persons" ON persons FOR DELETE TO anon, authenticated USING (true);

-- Cases
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE',
  priority text NOT NULL DEFAULT 'REVIEW',
  person_id uuid REFERENCES persons(id) ON DELETE CASCADE,
  last_known_location text,
  last_known_latitude double precision,
  last_known_longitude double precision,
  last_seen_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_cases" ON cases;
CREATE POLICY "anon_select_cases" ON cases FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_cases" ON cases;
CREATE POLICY "anon_insert_cases" ON cases FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_cases" ON cases;
CREATE POLICY "anon_update_cases" ON cases FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_cases" ON cases;
CREATE POLICY "anon_delete_cases" ON cases FOR DELETE TO anon, authenticated USING (true);

-- Sightings
CREATE TABLE IF NOT EXISTS sightings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sighting_number integer NOT NULL DEFAULT 0,
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  reported_at timestamptz NOT NULL DEFAULT now(),
  latitude double precision,
  longitude double precision,
  location_name text,
  description text,
  source_type text NOT NULL DEFAULT 'Witness',
  image_url text,
  status text NOT NULL DEFAULT 'NEW',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_sightings" ON sightings;
CREATE POLICY "anon_select_sightings" ON sightings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sightings" ON sightings;
CREATE POLICY "anon_insert_sightings" ON sightings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_sightings" ON sightings;
CREATE POLICY "anon_update_sightings" ON sightings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_sightings" ON sightings;
CREATE POLICY "anon_delete_sightings" ON sightings FOR DELETE TO anon, authenticated USING (true);

-- Lead Scores
CREATE TABLE IF NOT EXISTS lead_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sighting_id uuid REFERENCES sightings(id) ON DELETE CASCADE,
  description_score integer NOT NULL DEFAULT 0,
  location_score integer NOT NULL DEFAULT 0,
  temporal_score integer NOT NULL DEFAULT 0,
  reliability_score integer NOT NULL DEFAULT 0,
  convergence_score integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  priority text NOT NULL DEFAULT 'LOW',
  ai_explanation text,
  extracted_attributes jsonb,
  matching_attributes text[],
  conflicting_attributes text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_lead_scores" ON lead_scores;
CREATE POLICY "anon_select_lead_scores" ON lead_scores FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_lead_scores" ON lead_scores;
CREATE POLICY "anon_insert_lead_scores" ON lead_scores FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_lead_scores" ON lead_scores;
CREATE POLICY "anon_update_lead_scores" ON lead_scores FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_lead_scores" ON lead_scores;
CREATE POLICY "anon_delete_lead_scores" ON lead_scores FOR DELETE TO anon, authenticated USING (true);

-- Case Events (Timeline)
CREATE TABLE IF NOT EXISTS case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_case_events" ON case_events;
CREATE POLICY "anon_select_case_events" ON case_events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_case_events" ON case_events;
CREATE POLICY "anon_insert_case_events" ON case_events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_case_events" ON case_events;
CREATE POLICY "anon_update_case_events" ON case_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_case_events" ON case_events;
CREATE POLICY "anon_delete_case_events" ON case_events FOR DELETE TO anon, authenticated USING (true);

-- Investigator Notes
CREATE TABLE IF NOT EXISTS investigator_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  sighting_id uuid REFERENCES sightings(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_by text NOT NULL DEFAULT 'Demo Investigator',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investigator_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_investigator_notes" ON investigator_notes;
CREATE POLICY "anon_select_investigator_notes" ON investigator_notes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_investigator_notes" ON investigator_notes;
CREATE POLICY "anon_insert_investigator_notes" ON investigator_notes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_investigator_notes" ON investigator_notes;
CREATE POLICY "anon_update_investigator_notes" ON investigator_notes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_investigator_notes" ON investigator_notes;
CREATE POLICY "anon_delete_investigator_notes" ON investigator_notes FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_person_id ON cases(person_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_sightings_case_id ON sightings(case_id);
CREATE INDEX IF NOT EXISTS idx_sightings_status ON sightings(status);
CREATE INDEX IF NOT EXISTS idx_lead_scores_sighting_id ON lead_scores(sighting_id);
CREATE INDEX IF NOT EXISTS idx_case_events_case_id ON case_events(case_id);
CREATE INDEX IF NOT EXISTS idx_investigator_notes_case_id ON investigator_notes(case_id);
