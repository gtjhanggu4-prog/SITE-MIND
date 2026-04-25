import type { DecisionBand, JobStatus, OutputMode, ZoningDecision } from "./enums";

export interface CategoryComparisonRow {
  category_code: string;
  band: DecisionBand;
  suitability_score: number;
  saturation_score: number;
  opportunity_score: number;
  risk_level: string;
  preferred_floor_type?: string;
  preferred_unit_size?: string;
  reason_summary: string;
  confidence: number;
  suggested_alternative?: string | null;
}

export interface UnsuitableCategoryCard {
  category_code: string;
  rejection_level: "reject" | "high_caution" | "watchlist";
  poor_fit_reason: string;
  saturation_reason?: string;
  demographic_mismatch_reason?: string;
  location_unit_mismatch_reason?: string;
  zoning_caution?: string;
  pricing_burden_warning?: string;
  alternatives: string[];
  operator_explanation: string;
  customer_explanation: string;
  confidence: number;
}

export interface ReliabilityIndicator {
  module_name: string;
  overall_confidence_score: number;
  freshness_score: number;
  source_quality_score: number;
  coverage_score: number;
  model_stability_score: number;
  missing_data_warning: boolean;
  observed_ratio: number;
  estimated_ratio: number;
  manual_review_recommended: boolean;
  explanation_note: string;
}

export interface ValidationAssessment {
  assessment_id: string;
  tenant_validation_score: number;
  decision_band: DecisionBand;
  risk_level: string;
  suitability_score: number;
  saturation_score: number;
  opportunity_score: number;
}

export interface PricingRecommendation {
  unit_id: string;
  recommended_deposit_krw: number;
  recommended_monthly_rent_krw: number;
  lower_bound_krw?: number;
  upper_bound_krw?: number;
  pricing_confidence_score: number;
  assumptions: Record<string, unknown>;
}

export interface ZoningScreeningResult {
  rule_id: string;
  decision_status: ZoningDecision;
  operator_message: string;
  customer_message: string;
  legal_basis_text?: string;
  legal_reference_code?: string;
  review_required: boolean;
  review_owner_user_id?: string | null;
}

export interface CRMLeadSummary {
  lead_id: string;
  lead_type: string;
  lead_stage: string;
  lead_score: number;
  validation_assessment_id?: string | null;
  report_run_id?: string | null;
  next_followup_at?: string | null;
}

export interface ReportSummary {
  report_run_id: string;
  mode: OutputMode;
  status: JobStatus;
  section_status: { section_key: string; ready: boolean }[];
  evidence_coverage_ratio: number;
  html_uri?: string;
  pdf_uri?: string;
}

export interface AnalysisJobStatus {
  job_id: string;
  module: string;
  status: JobStatus;
  percent_progress: number;
  partial_available: boolean;
  partial_payload_uri?: string;
  retry_token?: string;
  error?: { code: string; message: string; retryable: boolean } | null;
}
