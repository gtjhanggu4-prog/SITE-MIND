-- Stage1 demo seed data

insert into core.organizations (id, name_ko, business_no) values
('10000000-0000-0000-0000-000000000001', '코모스 데모 조직', '123-45-67890');

insert into core.users (id, organization_id, email, name_ko) values
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'admin@komos.kr', '관리자');

insert into core.roles (id, role_code, role_name, is_system) values
('30000000-0000-0000-0000-000000000001', 'admin', '관리자', true);

insert into core.user_roles (user_id, role_id) values
('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001');

insert into core.projects (id, organization_id, project_name_ko, project_code, created_by) values
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '강남역 상업시설 개발', 'GAN-001', '20000000-0000-0000-0000-000000000001');

insert into core.sites (id, project_id, road_address_ko, jibun_address_ko, geom, land_area_m2, gross_floor_area_m2)
values ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001',
'서울특별시 강남구 테헤란로 123', '서울특별시 강남구 역삼동 123-45',
ST_SetSRID(ST_MakePoint(127.0286, 37.4979),4326), 850.00, 2200.00);

insert into core.buildings (id, site_id, building_name_ko, floors_above, floors_below)
values ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'K-COMOS 타워', 8, 2);

insert into core.floors (id, building_id, floor_label, floor_order, area_m2)
values ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '1F', 1, 300.00);

insert into core.units (id, floor_id, unit_code, area_m2, frontage_m, visibility_score)
values
('71000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'U-101', 85.00, 8.50, 82.00),
('71000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001', 'U-102', 65.00, 6.20, 74.00);

insert into zoning.rule_sets (id, jurisdiction_code, name, version, status, effective_from, created_by)
values ('80000000-0000-0000-0000-000000000001', 'SEOUL-GANGNAM', '강남구 상업지구 룰셋', 1, 'published', '2026-01-01', '20000000-0000-0000-0000-000000000001');

insert into zoning.rules (id, rule_set_id, rule_code, rule_name, condition_expr, output_decision, legal_basis_text, legal_reference_code)
values ('81000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'PARKING-CHK', '주차대수 조건', '{"min":10}', 'caution', '서울시 조례 제xx조', 'SEOUL-XX-01');

insert into zoning.screening_runs (id, project_id, site_id, rule_set_id, run_mode, requested_by, status)
values ('82000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'internal', '20000000-0000-0000-0000-000000000001', 'succeeded');

insert into zoning.screening_results (id, screening_run_id, rule_id, decision_status, operator_message, customer_message, legal_basis_text, legal_reference_code, review_required)
values ('83000000-0000-0000-0000-000000000001', '82000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000001', 'caution', '주차 산정 추가 검토 필요', '일부 조건 확인 후 진행 가능합니다.', '서울시 조례 제xx조', 'SEOUL-XX-01', true);

insert into market.category_comparison_rows (id, project_id, category_code, band, suitability_score, saturation_score, opportunity_score, risk_level, preferred_floor_type, preferred_unit_size_range, reason_summary, confidence_score)
values
('90000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'FNB_CAFE', 'recommended', 82.5, 41.3, 78.4, 'low', '1F_street', '66-99m2', '유동인구 대비 카페 수요 우세', 79.1),
('90000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'FNB_DESSERT', 'risky', 52.1, 88.0, 35.2, 'high', '1F_inner', '50-70m2', '경쟁 과밀로 신규 진입 리스크 높음', 64.2);

insert into leasing.tenant_proposals (id, project_id, proposed_category_code, brand_name, expected_ticket_krw, desired_area_m2, requested_deposit_krw, requested_rent_krw, created_by)
values ('a0000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'FNB_DESSERT', 'SweetLab', 9800, 65.0, 90000000, 4300000, '20000000-0000-0000-0000-000000000001');

insert into ai.reliability_indicators (id, project_id, module_name, overall_confidence_score, freshness_score, source_quality_score, coverage_score, model_stability_score, missing_data_warning, observed_ratio, estimated_ratio, manual_review_recommended, explanation_note)
values ('b0000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'tenant_validation', 72.8, 70, 78, 69, 75, true, 61, 39, true, '일부 결측 데이터로 수동 검토 권장');

insert into leasing.validation_assessments (id, tenant_proposal_id, project_id, suitability_score, saturation_score, opportunity_score, tenant_validation_score, decision_band, risk_level, reliability_indicator_id, manual_review_required, explanation_payload, model_version, score_version)
values ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 70.1, 62.0, 66.2, 68.4, 'neutral', 'medium', 'b0000000-0000-0000-0000-000000000001', true, '{"top_risk_factors":["포화도"]}', 'tvm-1', 'score-v1');

insert into pricing.rent_recommendations (id, project_id, unit_id, recommended_deposit_krw, recommended_monthly_rent_krw, lower_bound_krw, upper_bound_krw, pricing_confidence_score, assumptions, reliability_indicator_id)
values ('d0000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '71000000-0000-0000-0000-000000000001', 100000000, 4500000, 4200000, 4800000, 71.0, '{"comp_count":5}', 'b0000000-0000-0000-0000-000000000001');

insert into crm.leads (id, organization_id, project_id, lead_type, lead_stage, source_channel, company_name, contact_name, owner_user_id, lead_score)
values ('e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'franchise', 'proposal_sent', 'broker', 'SweetLab', '홍길동', '20000000-0000-0000-0000-000000000001', 74.3);
