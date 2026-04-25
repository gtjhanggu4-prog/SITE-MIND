from typing import Any
from pydantic import BaseModel

from app.schemas.common import DecisionBand, OutputMode, ZoningDecision


class ReliabilityIndicator(BaseModel):
    module_name: str
    overall_confidence_score: float
    freshness_score: float
    source_quality_score: float
    coverage_score: float
    model_stability_score: float
    missing_data_warning: bool
    observed_ratio: float
    estimated_ratio: float
    manual_review_recommended: bool
    explanation_note: str


class CategoryComparisonRow(BaseModel):
    category_code: str
    band: DecisionBand
    suitability_score: float
    saturation_score: float
    opportunity_score: float
    risk_level: str
    preferred_floor_type: str | None = None
    preferred_unit_size: str | None = None
    reason_summary: str
    confidence: float
    suggested_alternative: str | None = None


class CategoryComparisonResponse(BaseModel):
    project_id: str
    scenario_id: str | None = None
    mode: OutputMode
    rows: list[CategoryComparisonRow]
    pagination: dict[str, int]
    reliability_indicator: ReliabilityIndicator


class UnsuitableCategoryCard(BaseModel):
    category_code: str
    rejection_level: str
    poor_fit_reason: str
    saturation_reason: str | None = None
    demographic_mismatch_reason: str | None = None
    location_unit_mismatch_reason: str | None = None
    zoning_caution: str | None = None
    pricing_burden_warning: str | None = None
    alternatives: list[str] = []
    operator_explanation: str
    customer_explanation: str
    confidence: float


class ValidationAssessment(BaseModel):
    assessment_id: str
    tenant_validation_score: float
    decision_band: DecisionBand
    risk_level: str
    suitability_score: float
    saturation_score: float
    opportunity_score: float


class ValidationResultResponse(BaseModel):
    assessment: ValidationAssessment
    unsuitable_category_cards: list[UnsuitableCategoryCard]
    alternatives: list[str]
    reliability_indicator: ReliabilityIndicator
    manual_adjustment_effects: list[dict[str, Any]]
    zoning_summary: dict[str, Any]


class PricingRecommendation(BaseModel):
    unit_id: str
    recommended_deposit_krw: float
    recommended_monthly_rent_krw: float
    lower_bound_krw: float | None = None
    upper_bound_krw: float | None = None
    pricing_confidence_score: float
    assumptions: dict[str, Any]


class ManualAdjustmentCreateRequest(BaseModel):
    module_name: str
    field_name: str
    target_entity_type: str
    target_entity_id: str
    after_value: Any
    reason_code: str
    reason_note: str | None = None


class ManualAdjustmentCreateResponse(BaseModel):
    adjustment_id: str
    approval_required: bool
    recompute_job_id: str


class ZoningScreeningResult(BaseModel):
    rule_id: str
    decision_status: ZoningDecision
    operator_message: str
    customer_message: str
    legal_basis_text: str | None = None
    legal_reference_code: str | None = None
    review_required: bool
    review_owner_user_id: str | None = None


class ZoningScreeningResponse(BaseModel):
    run_id: str
    status: str
    results: list[ZoningScreeningResult]


class CRMLeadSummary(BaseModel):
    lead_id: str
    lead_type: str
    lead_stage: str
    lead_score: float
    validation_assessment_id: str | None = None
    report_run_id: str | None = None
    next_followup_at: str | None = None


class ReportSummary(BaseModel):
    report_run_id: str
    mode: OutputMode
    status: str
    section_status: list[dict[str, Any]]
    evidence_coverage_ratio: float
    html_uri: str | None = None
    pdf_uri: str | None = None


class AnalysisJobStatus(BaseModel):
    job_id: str
    module: str
    status: str
    percent_progress: int
    partial_available: bool
    partial_payload_uri: str | None = None
    retry_token: str | None = None
    error: dict[str, Any] | None = None
