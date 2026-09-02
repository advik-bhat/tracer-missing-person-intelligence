/*
# Add visual analysis columns to lead_scores

1. Changes
- Add `visual_score` (integer, default 0) — visual relevance sub-score (max 20)
- Add `visual_attributes` (jsonb) — structured visual attributes extracted from sighting image
- Add `visual_matching` (text[]) — matching visual attributes vs case profile
- Add `visual_conflicts` (text[]) — conflicting visual attributes vs case profile

2. Scoring model update
The lead scoring model is rebalanced to 6 factors:
  Description relevance: 30
  Visual relevance: 20
  Location proximity: 20
  Temporal relevance: 15
  Source reliability: 5
  Trail convergence: 10
  Total: 100

3. Security
- No RLS changes needed — existing policies cover new columns automatically.
*/

ALTER TABLE lead_scores ADD COLUMN IF NOT EXISTS visual_score integer NOT NULL DEFAULT 0;
ALTER TABLE lead_scores ADD COLUMN IF NOT EXISTS visual_attributes jsonb;
ALTER TABLE lead_scores ADD COLUMN IF NOT EXISTS visual_matching text[];
ALTER TABLE lead_scores ADD COLUMN IF NOT EXISTS visual_conflicts text[];
