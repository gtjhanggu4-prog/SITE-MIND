from app.schemas.common import OutputMode
from app.schemas.contracts import (
    AnalysisJobStatus,
    CRMLeadSummary,
    CategoryComparisonResponse,
    CategoryComparisonRow,
    ManualAdjustmentCreateRequest,
    ManualAdjustmentCreateResponse,
    PricingRecommendation,
    ReliabilityIndicator,
    ReportSummary,
    UnsuitableCategoryCard,
    ValidationAssessment,
    ValidationResultResponse,
    ZoningScreeningResponse,
    ZoningScreeningResult,
)


class StubService:
    def reliability(self, module_name: str = "tenant_validation") -> ReliabilityIndicator:
        return ReliabilityIndicator(
            module_name=module_name,
            overall_confidence_score=72.8,
            freshness_score=70,
            source_quality_score=78,
            coverage_score=69,
            model_stability_score=75,
            missing_data_warning=True,
            observed_ratio=61,
            estimated_ratio=39,
            manual_review_recommended=True,
            explanation_note="일부 데이터 결측으로 수동 검토 권장",
        )

    def category_comparison(self, project_id: str, mode: OutputMode) -> CategoryComparisonResponse:
        return CategoryComparisonResponse(
            project_id=project_id,
            scenario_id=None,
            mode=mode,
            rows=[
                CategoryComparisonRow(
                    category_code="FNB_CAFE",
                    band="recommended",
                    suitability_score=82.5,
                    saturation_score=41.3,
                    opportunity_score=78.4,
                    risk_level="low",
                    preferred_floor_type="1F_street",
                    preferred_unit_size="66-99m2",
                    reason_summary="유동인구/가시성 대비 카페 수요 우위",
                    confidence=79.1,
                )
            ],
            pagination={"page": 1, "page_size": 20, "total": 1},
            reliability_indicator=self.reliability("market"),
        )

    def unsuitable_cards(self) -> list[UnsuitableCategoryCard]:
        return [
            UnsuitableCategoryCard(
                category_code="FNB_DESSERT",
                rejection_level="high_caution",
                poor_fit_reason="동일권역 디저트 과밀",
                saturation_reason="500m 내 동종 18개",
                demographic_mismatch_reason="핵심 연령대 소비 빈도 낮음",
                location_unit_mismatch_reason="해당 유닛 전면폭 부족",
                zoning_caution="층별 제한 검토 필요",
                pricing_burden_warning="예상 임대료 대비 매출 민감도 높음",
                alternatives=["FNB_BAKERY"],
                operator_explanation="초기 공실 리스크가 높아 보수적 접근 필요",
                customer_explanation="현재 위치에서는 디저트 업종은 경쟁이 과해 권장되지 않습니다.",
                confidence=64.2,
            )
        ]

    def validation(self) -> ValidationResultResponse:
        return ValidationResultResponse(
            assessment=ValidationAssessment(
                assessment_id="00000000-0000-0000-0000-000000000001",
                tenant_validation_score=68.4,
                decision_band="neutral",
                risk_level="medium",
                suitability_score=70.1,
                saturation_score=62.0,
                opportunity_score=66.2,
            ),
            unsuitable_category_cards=self.unsuitable_cards(),
            alternatives=["FNB_BAKERY"],
            reliability_indicator=self.reliability(),
            manual_adjustment_effects=[],
            zoning_summary={"decision_status": "caution", "message": "주차 기준 검토 필요"},
        )

    def pricing(self) -> list[PricingRecommendation]:
        return [
            PricingRecommendation(
                unit_id="00000000-0000-0000-0000-000000000101",
                recommended_deposit_krw=100000000,
                recommended_monthly_rent_krw=4500000,
                lower_bound_krw=4200000,
                upper_bound_krw=4800000,
                pricing_confidence_score=71.0,
                assumptions={"comp_count": 5},
            )
        ]

    def create_adjustment(self, req: ManualAdjustmentCreateRequest) -> ManualAdjustmentCreateResponse:
        _ = req
        return ManualAdjustmentCreateResponse(
            adjustment_id="00000000-0000-0000-0000-00000000a001",
            approval_required=True,
            recompute_job_id="job_01KOMOS0001",
        )

    def zoning(self, run_id: str) -> ZoningScreeningResponse:
        return ZoningScreeningResponse(
            run_id=run_id,
            status="succeeded",
            results=[
                ZoningScreeningResult(
                    rule_id="00000000-0000-0000-0000-00000000z001",
                    decision_status="caution",
                    operator_message="주차대수 산정 추가 검토",
                    customer_message="일부 조건 확인 후 진행 가능합니다.",
                    legal_basis_text="서울시 조례 제xx조",
                    legal_reference_code="SEOUL-XX-01",
                    review_required=True,
                    review_owner_user_id="00000000-0000-0000-0000-00000000u001",
                )
            ],
        )

    def lead_summary(self, lead_id: str) -> CRMLeadSummary:
        return CRMLeadSummary(
            lead_id=lead_id,
            lead_type="franchise",
            lead_stage="proposal_sent",
            lead_score=74.3,
            validation_assessment_id="00000000-0000-0000-0000-000000000001",
            report_run_id="00000000-0000-0000-0000-00000000r001",
            next_followup_at="2026-04-22T09:00:00Z",
        )

    def report_summary(self, report_run_id: str) -> ReportSummary:
        return ReportSummary(
            report_run_id=report_run_id,
            mode="customer",
            status="succeeded",
            section_status=[{"section_key": "executive_summary", "ready": True}],
            evidence_coverage_ratio=0.92,
            html_uri="s3://reports/sample.html",
            pdf_uri="s3://reports/sample.pdf",
        )

    def job_status(self, job_id: str) -> AnalysisJobStatus:
        return AnalysisJobStatus(
            job_id=job_id,
            module="tenant_validation",
            status="running",
            percent_progress=57,
            partial_available=True,
            partial_payload_uri="s3://partial/job.json",
            retry_token="rt_abc",
            error=None,
        )


stub_service = StubService()
