export type CaseStatus = 'ACTIVE' | 'OPEN' | 'CLOSED' | 'COLD';
export type CasePriority = 'HIGH' | 'REVIEW' | 'LOW';
export type LeadPriority = 'HIGH' | 'REVIEW' | 'LOW';
export type SightingStatus = 'NEW' | 'ANALYZED' | 'REVIEWED' | 'FLAGGED' | 'UNRELATED';
export type SourceType = 'Witness' | 'Investigator' | 'Call Center' | 'Field Team' | 'Other';

export interface VisualAttributes {
  upper_clothing_color: string;
  upper_clothing_type: string;
  lower_clothing_color: string;
  backpack_present: string;
  backpack_color: string;
  visible_accessories: string;
}

export interface Person {
  id: string;
  name: string;
  age: number;
  height: string;
  description: string;
  clothing: string;
  accessories: string;
  reference_image_url: string | null;
  created_at: string;
}

export interface Case {
  id: string;
  case_number: string;
  status: CaseStatus;
  priority: CasePriority;
  person_id: string;
  person?: Person;
  last_known_location: string | null;
  last_known_latitude: number | null;
  last_known_longitude: number | null;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export interface Sighting {
  id: string;
  sighting_number: number;
  case_id: string;
  reported_at: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  description: string;
  source_type: SourceType;
  image_url: string | null;
  status: SightingStatus;
  created_at: string;
}

export interface LeadScore {
  id: string;
  sighting_id: string;
  description_score: number;
  visual_score: number;
  location_score: number;
  temporal_score: number;
  reliability_score: number;
  convergence_score: number;
  total_score: number;
  priority: LeadPriority;
  ai_explanation: string | null;
  extracted_attributes: Record<string, string> | null;
  visual_attributes: VisualAttributes | null;
  visual_matching: string[] | null;
  visual_conflicts: string[] | null;
  matching_attributes: string[] | null;
  conflicting_attributes: string[] | null;
  created_at: string;
}

export interface CaseEvent {
  id: string;
  case_id: string;
  event_type: string;
  message: string;
  created_at: string;
}

export interface InvestigatorNote {
  id: string;
  case_id: string;
  sighting_id: string | null;
  content: string;
  created_by: string;
  created_at: string;
}

export interface ConvergenceGroup {
  sightingIds: string[];
  timeSpanMinutes: number;
  spatialSpanKm: number;
  correlationScore: number;
  overlappingAttributes: string[];
  explanation: string;
}

export interface LeadWithDetails extends LeadScore {
  sighting?: Sighting;
  case?: Case;
  person?: Person;
}
