# Stage 1 Hardening Specification (Execution Contracts)

## 1. Stage 1 hardening summary
This specification hardens the existing Stage 1 blueprint into implementation-ready contracts without changing architecture. It freezes: canonical DB schema, zoning decision enums, API v1 JSON contracts, async job model, scoring governance, confidence computation, Korean leasing CRM stages, report schema/mode matrix, manual override governance, and acceptance criteria.

**Scope discipline**
- Keep modular architecture and dual-mode output approach.
- Harden only Stage 1 capabilities required for engineering kickoff.
- Defer digital twin/advanced ML automation to Stage 2+.

---

## 2. Canonical DB schema pack
PostgreSQL 16 + PostGIS.

### 2.1 Shared enum contracts (DDL)
```sql
create type core.lead_type as enum ('investor','owner_operator','franchise','exploratory','broker_introduced');
create type core.lead_stage as enum (
  'lead_new','lead_qualified','site_fit_review','tenant_validation_reviewed','proposal_prepared',
  'proposal_sent','negotiation','conditional_approval','contract_pending','won','lost','on_hold'
);
create type core.decision_band as enum ('recommended','neutral','risky');
create type zoning.zoning_decision as enum ('permitted','prohibited','caution','manual_review');
create type report.output_mode as enum ('internal','customer');
create type data.ingestion_status as enum ('queued','running','succeeded','partial_failed','failed');
create type ai.job_status as enum ('queued','running','partial','succeeded','failed','cancelled');
```

### 2.2 DDL table pack (purpose + columns + constraints + indexes)

#### `core.organizations` (tenant boundary)
```sql
create table core.organizations (
  id uuid primary key,
  name_ko text not null,
  business_no text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index uq_org_business_no on core.organizations(business_no) where business_no is not null;
```

#### `core.users` (RBAC principals)
```sql
create table core.users (
  id uuid primary key,
  organization_id uuid not null references core.organizations(id),
  email citext not null,
  name_ko text not null,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, email)
);
```

#### `core.roles`
```sql
create table core.roles (
  id uuid primary key,
  role_code text not null unique,
  role_name text not null,
  is_system boolean not null default false
);
```

#### `core.user_roles`
```sql
create table core.user_roles (
  user_id uuid not null references core.users(id) on delete cascade,
  role_id uuid not null references core.roles(id),
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);
```

#### `core.projects`
```sql
create table core.projects (
  id uuid primary key,
  organization_id uuid not null references core.organizations(id),
  project_name_ko text not null,
  project_code text not null,
  status text not null default 'planning',
  start_date date,
  end_date date,
  created_by uuid not null references core.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, project_code)
);
```

#### `core.sites`
```sql
create table core.sites (
  id uuid primary key,
  project_id uuid not null references core.projects(id) on delete cascade,
  road_address_ko text,
  jibun_address_ko text,
  legal_dong_code text,
  pnu_code text,
  geom geometry(Point,4326) not null,
  land_area_m2 numeric(12,2),
  gross_floor_area_m2 numeric(12,2),
  created_at timestamptz not null default now()
);
create index idx_sites_project on core.sites(project_id);
create index idx_sites_geom on core.sites using gist(geom);
```

#### `core.buildings`
```sql
create table core.buildings (
  id uuid primary key,
  site_id uuid not null references core.sites(id) on delete cascade,
  building_name_ko text,
  usage_code text,
  floors_above int,
  floors_below int,
  created_at timestamptz not null default now()
);
create index idx_buildings_site on core.buildings(site_id);
```

#### `core.floors`
```sql
create table core.floors (
  id uuid primary key,
  building_id uuid not null references core.buildings(id) on delete cascade,
  floor_label text not null,
  floor_order int not null,
  area_m2 numeric(12,2),
  created_at timestamptz not null default now(),
  unique (building_id, floor_order)
);
```

#### `core.units`
```sql
create table core.units (
  id uuid primary key,
  floor_id uuid not null references core.floors(id) on delete cascade,
  unit_code text not null,
  area_m2 numeric(12,2) not null,
  frontage_m numeric(8,2),
  visibility_score numeric(5,2),
  status text not null default 'vacant',
  created_at timestamptz not null default now(),
  unique (floor_id, unit_code)
);
```

#### `core.file_assets`
```sql
create table core.file_assets (
  id uuid primary key,
  organization_id uuid not null references core.organizations(id),
  project_id uuid references core.projects(id),
  uploader_user_id uuid not null references core.users(id),
  file_kind text not null,
  storage_uri text not null,
  mime_type text not null,
  size_bytes bigint not null,
  checksum_sha256 text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index idx_file_assets_project on core.file_assets(project_id);
```

#### `zoning.rule_sets`
```sql
create table zoning.rule_sets (
  id uuid primary key,
  jurisdiction_code text not null,
  name text not null,
  version int not null,
  status text not null check (status in ('draft','published','retired')),
  effective_from date not null,
  effective_to date,
  created_by uuid not null references core.users(id),
  created_at timestamptz not null default now(),
  unique (jurisdiction_code, version)
);
```

#### `zoning.rules`
```sql
create table zoning.rules (
  id uuid primary key,
  rule_set_id uuid not null references zoning.rule_sets(id) on delete cascade,
  rule_code text not null,
  rule_name text not null,
  condition_expr jsonb not null,
  output_decision zoning.zoning_decision not null,
  legal_basis_text text,
  legal_reference_code text,
  severity int not null default 50,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (rule_set_id, rule_code)
);
create index idx_rules_set_enabled on zoning.rules(rule_set_id, enabled);
```

#### `zoning.screening_runs`
```sql
create table zoning.screening_runs (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  site_id uuid not null references core.sites(id),
  rule_set_id uuid not null references zoning.rule_sets(id),
  run_mode report.output_mode not null,
  requested_by uuid not null references core.users(id),
  status ai.job_status not null,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_screening_runs_site on zoning.screening_runs(site_id, created_at desc);
```

#### `zoning.screening_results`
```sql
create table zoning.screening_results (
  id uuid primary key,
  screening_run_id uuid not null references zoning.screening_runs(id) on delete cascade,
  rule_id uuid not null references zoning.rules(id),
  decision_status zoning.zoning_decision not null,
  operator_message text not null,
  customer_message text not null,
  legal_basis_text text,
  legal_reference_code text,
  review_required boolean not null default false,
  review_owner_user_id uuid references core.users(id),
  override_applied boolean not null default false,
  override_reason text,
  evidence_refs jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index idx_screening_results_run on zoning.screening_results(screening_run_id);
```

#### `market.catchment_areas`
```sql
create table market.catchment_areas (
  id uuid primary key,
  site_id uuid not null references core.sites(id) on delete cascade,
  method text not null check (method in ('radius','walk_isochrone','drive_isochrone','transit_isochrone')),
  metric_value int not null,
  geom geometry(Polygon,4326) not null,
  created_at timestamptz not null default now()
);
create index idx_catchment_geom on market.catchment_areas using gist(geom);
```

#### `market.demographic_snapshots`
```sql
create table market.demographic_snapshots (
  id uuid primary key,
  catchment_area_id uuid not null references market.catchment_areas(id) on delete cascade,
  snapshot_date date not null,
  population_total int,
  households_total int,
  age_band_json jsonb not null default '{}',
  worker_resident_ratio numeric(8,4),
  income_proxy_index numeric(8,2),
  source_id uuid not null,
  created_at timestamptz not null default now(),
  unique (catchment_area_id, snapshot_date)
);
```

#### `market.competitor_pois`
```sql
create table market.competitor_pois (
  id uuid primary key,
  catchment_area_id uuid not null references market.catchment_areas(id) on delete cascade,
  category_code text not null,
  brand_name text,
  price_segment text,
  geom geometry(Point,4326) not null,
  source_id uuid not null,
  observed_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_competitor_geom on market.competitor_pois using gist(geom);
create index idx_competitor_cat on market.competitor_pois(catchment_area_id, category_code);
```

#### `market.category_comparison_rows`
```sql
create table market.category_comparison_rows (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  scenario_id uuid,
  category_code text not null,
  band core.decision_band not null,
  suitability_score numeric(5,2) not null,
  saturation_score numeric(5,2) not null,
  opportunity_score numeric(5,2) not null,
  risk_level text not null,
  preferred_floor_type text,
  preferred_unit_size_range text,
  reason_summary text not null,
  confidence_score numeric(5,2) not null,
  suggested_alternative_category_code text,
  created_at timestamptz not null default now()
);
create index idx_category_rows_proj on market.category_comparison_rows(project_id, created_at desc);
```

#### `leasing.tenant_proposals`
```sql
create table leasing.tenant_proposals (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  lead_id uuid,
  proposed_category_code text not null,
  brand_name text,
  expected_ticket_krw numeric(12,2),
  operating_hours text,
  desired_area_m2 numeric(12,2),
  requested_floor_pref text,
  requested_deposit_krw numeric(14,2),
  requested_rent_krw numeric(14,2),
  created_by uuid not null references core.users(id),
  created_at timestamptz not null default now()
);
```

#### `leasing.validation_assessments`
```sql
create table leasing.validation_assessments (
  id uuid primary key,
  tenant_proposal_id uuid not null references leasing.tenant_proposals(id) on delete cascade,
  project_id uuid not null references core.projects(id),
  suitability_score numeric(5,2) not null,
  saturation_score numeric(5,2) not null,
  opportunity_score numeric(5,2) not null,
  tenant_validation_score numeric(5,2) not null,
  decision_band core.decision_band not null,
  risk_level text not null,
  reliability_indicator_id uuid,
  manual_review_required boolean not null default false,
  explanation_payload jsonb not null default '{}',
  model_version text not null,
  score_version text not null,
  created_at timestamptz not null default now()
);
create index idx_validation_proj on leasing.validation_assessments(project_id, created_at desc);
```

#### `leasing.unsuitable_category_cards`
```sql
create table leasing.unsuitable_category_cards (
  id uuid primary key,
  validation_assessment_id uuid references leasing.validation_assessments(id) on delete cascade,
  project_id uuid not null references core.projects(id),
  category_code text not null,
  rejection_level text not null check (rejection_level in ('reject','high_caution','watchlist')),
  poor_fit_reason text not null,
  saturation_reason text,
  demographic_mismatch_reason text,
  location_unit_mismatch_reason text,
  zoning_caution text,
  pricing_burden_warning text,
  alternatives jsonb not null default '[]',
  operator_explanation text not null,
  customer_explanation text not null,
  reliability_indicator_id uuid,
  created_at timestamptz not null default now()
);
create index idx_unsuitable_proj on leasing.unsuitable_category_cards(project_id, created_at desc);
```

#### `pricing.rent_recommendations`
```sql
create table pricing.rent_recommendations (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  unit_id uuid not null references core.units(id),
  scenario_id uuid,
  recommended_deposit_krw numeric(14,2) not null,
  recommended_monthly_rent_krw numeric(14,2) not null,
  lower_bound_krw numeric(14,2),
  upper_bound_krw numeric(14,2),
  pricing_confidence_score numeric(5,2) not null,
  assumptions jsonb not null default '{}',
  reliability_indicator_id uuid,
  created_at timestamptz not null default now()
);
create index idx_pricing_proj on pricing.rent_recommendations(project_id, created_at desc);
```

#### `crm.leads`
```sql
create table crm.leads (
  id uuid primary key,
  organization_id uuid not null references core.organizations(id),
  project_id uuid references core.projects(id),
  lead_type core.lead_type not null,
  lead_stage core.lead_stage not null default 'lead_new',
  source_channel text,
  company_name text,
  contact_name text,
  contact_phone text,
  contact_email citext,
  external_ref text,
  owner_user_id uuid references core.users(id),
  lead_score numeric(5,2),
  next_followup_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, external_ref)
);
create index idx_leads_stage on crm.leads(project_id, lead_stage, next_followup_at);
```

#### `crm.activities`
```sql
create table crm.activities (
  id uuid primary key,
  lead_id uuid not null references crm.leads(id) on delete cascade,
  activity_type text not null check (activity_type in ('call','meeting','site_visit','email','note','task')),
  content text not null,
  due_at timestamptz,
  done_at timestamptz,
  created_by uuid not null references core.users(id),
  created_at timestamptz not null default now()
);
create index idx_activities_lead on crm.activities(lead_id, created_at desc);
```

#### `crm.consultation_notes`
```sql
create table crm.consultation_notes (
  id uuid primary key,
  lead_id uuid not null references crm.leads(id) on delete cascade,
  project_id uuid not null references core.projects(id),
  validation_assessment_id uuid references leasing.validation_assessments(id),
  note_mode report.output_mode not null,
  operator_summary text not null,
  customer_summary text,
  objection_points jsonb not null default '[]',
  next_actions jsonb not null default '[]',
  created_by uuid not null references core.users(id),
  created_at timestamptz not null default now()
);
```

#### `crm.opportunities`
```sql
create table crm.opportunities (
  id uuid primary key,
  lead_id uuid not null references crm.leads(id) on delete cascade,
  project_id uuid not null references core.projects(id),
  validation_assessment_id uuid references leasing.validation_assessments(id),
  primary_report_run_id uuid,
  stage core.lead_stage not null,
  expected_close_date date,
  expected_deposit_krw numeric(14,2),
  expected_rent_krw numeric(14,2),
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_opportunities_stage on crm.opportunities(project_id, stage, expected_close_date);
```

#### `report.report_runs`
```sql
create table report.report_runs (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  mode report.output_mode not null,
  title text not null,
  status ai.job_status not null,
  generated_by uuid not null references core.users(id),
  html_uri text,
  pdf_uri text,
  generated_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_report_runs_proj on report.report_runs(project_id, mode, created_at desc);
```

#### `report.report_sections`
```sql
create table report.report_sections (
  id uuid primary key,
  report_run_id uuid not null references report.report_runs(id) on delete cascade,
  section_key text not null,
  section_order int not null,
  payload jsonb not null,
  evidence_refs jsonb not null default '[]',
  redaction_applied boolean not null default false,
  created_at timestamptz not null default now(),
  unique (report_run_id, section_key)
);
```

#### `ai.reliability_indicators`
```sql
create table ai.reliability_indicators (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  module_name text not null,
  overall_confidence_score numeric(5,2) not null,
  freshness_score numeric(5,2) not null,
  source_quality_score numeric(5,2) not null,
  coverage_score numeric(5,2) not null,
  model_stability_score numeric(5,2) not null,
  missing_data_warning boolean not null default false,
  observed_ratio numeric(5,2) not null,
  estimated_ratio numeric(5,2) not null,
  manual_review_recommended boolean not null default false,
  explanation_note text not null,
  created_at timestamptz not null default now()
);
create index idx_reliability_proj on ai.reliability_indicators(project_id, module_name, created_at desc);
```

#### `audit.manual_adjustment_records`
```sql
create table audit.manual_adjustment_records (
  id uuid primary key,
  project_id uuid not null references core.projects(id),
  module_name text not null,
  field_name text not null,
  target_entity_type text not null,
  target_entity_id uuid not null,
  before_value jsonb not null,
  after_value jsonb not null,
  reason_code text not null,
  reason_note text,
  created_by_user_id uuid not null references core.users(id),
  approval_required boolean not null,
  approved_by_user_id uuid references core.users(id),
  approved_at timestamptz,
  reset_at timestamptz,
  impact_delta jsonb not null default '{}',
  report_affects boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_adjustments_proj on audit.manual_adjustment_records(project_id, module_name, created_at desc);
```

#### `audit.audit_logs`
```sql
create table audit.audit_logs (
  id bigserial primary key,
  organization_id uuid not null references core.organizations(id),
  user_id uuid references core.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_value jsonb,
  after_value jsonb,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index idx_audit_org_time on audit.audit_logs(organization_id, created_at desc);
```

#### `data.source_registry`
```sql
create table data.source_registry (
  id uuid primary key,
  provider_name text not null,
  source_name text not null,
  source_type text not null,
  license_scope text,
  update_frequency text not null,
  quality_tier int not null check (quality_tier between 1 and 5),
  owner_team text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (provider_name, source_name)
);
```

#### `data.ingestion_runs`
```sql
create table data.ingestion_runs (
  id uuid primary key,
  source_id uuid not null references data.source_registry(id),
  status data.ingestion_status not null,
  run_type text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  records_in int not null default 0,
  records_out int not null default 0,
  error_count int not null default 0,
  dq_score numeric(5,2),
  freshness_effective_at timestamptz,
  run_log_uri text,
  created_at timestamptz not null default now()
);
create index idx_ingestion_source_time on data.ingestion_runs(source_id, started_at desc);
```

#### `data.ingestion_run_items`
```sql
create table data.ingestion_run_items (
  id bigserial primary key,
  ingestion_run_id uuid not null references data.ingestion_runs(id) on delete cascade,
  item_key text not null,
  status text not null,
  error_code text,
  error_message text,
  normalized_record jsonb,
  created_at timestamptz not null default now()
);
create index idx_ingestion_items_run on data.ingestion_run_items(ingestion_run_id, id);
```

---

## 3. Zoning decision contract
### 3.1 Enum meanings
- `permitted`: use is allowed under active rules; no blocking legal issue.
- `prohibited`: use is legally disallowed; cannot proceed unless legal basis changes.
- `caution`: conditionally possible, but risk/constraint exists (parking, floor restriction, area cap, etc.).
- `manual_review`: automated rule engine cannot conclude safely; legal analyst review required.

### 3.2 Required fields per state
- All states: `decision_status`, `operator_message`, `customer_message`, `legal_basis_text`, `legal_reference_code`, `evidence_refs`.
- `prohibited`: must include `blocking_reason_code`, `review_required=false`.
- `caution`: must include `caution_items[]`, `review_required` may be true.
- `manual_review`: must include `review_required=true`, `review_owner_user_id` not null, `review_due_at`.
- `permitted`: may include `advisory_notes[]`.

### 3.3 Operator/customer messaging rules
- Operator message: full legal and risk language.
- Customer message: simplified non-legal-jargon summary.
- No direct legal article text in customer mode unless marked public-safe.

### 3.4 Override trail behavior
- Any change to zoning outcome creates `audit.manual_adjustment_records` row with `module_name='zoning'` and immutable before/after.
- `prohibited -> permitted` requires approval by `admin` or `legal_reviewer` role.

### 3.5 Serialization rules
- Internal mode includes all legal fields + rule IDs + review ownership.
- Customer mode includes status label + simplified summary + allowed next steps; hides rule IDs/internal reviewer identity.

---

## 4. API v1 JSON contracts
Base path: `/v1`

### 4.1 Category comparison
- **Method/Path**: `GET /v1/projects/{project_id}/category-comparison`
- **Query**: `scenario_id`, `mode=internal|customer`, `page`, `page_size`, `band`
- **Permissions**: analyst/sales/executive/admin/client(read-only customer mode)
- **200 Response**:
```json
{
  "project_id": "uuid",
  "scenario_id": "uuid",
  "mode": "internal",
  "rows": [{
    "category_code": "FNB_CAFE",
    "band": "recommended",
    "suitability_score": 82.5,
    "saturation_score": 41.3,
    "opportunity_score": 78.4,
    "risk_level": "low",
    "preferred_floor_type": "1F_street",
    "preferred_unit_size": "66-99m2",
    "reason_summary": "...",
    "confidence": 79.1,
    "suggested_alternative": null
  }],
  "pagination": {"page":1,"page_size":20,"total":132},
  "reliability_indicator": {"id":"uuid","overall_confidence_score":79.1}
}
```
- **Status codes**: `200`, `400`, `403`, `404`.

### 4.2 Unsuitable category cards
- **Method/Path**: `GET /v1/projects/{project_id}/unsuitable-cards`
- **Query**: `assessment_id`, `mode`
- **200 Response**:
```json
{
  "cards": [{
    "category_code":"FNB_DESSERT",
    "rejection_level":"high_caution",
    "poor_fit_reason":"...",
    "saturation_reason":"...",
    "demographic_mismatch_reason":"...",
    "location_unit_mismatch_reason":"...",
    "zoning_caution":"...",
    "pricing_burden_warning":"...",
    "alternatives":["FNB_BAKERY"],
    "operator_explanation":"...",
    "customer_explanation":"...",
    "confidence": 64.2
  }]
}
```
- **Status codes**: `200`, `404`.

### 4.3 Reliability indicators
- **Method/Path**: `GET /v1/projects/{project_id}/reliability`
- **Query**: `module_name`, `target_id`
- **200 Response**:
```json
{
  "module_name":"tenant_validation",
  "overall_confidence_score":72.8,
  "freshness_score":70.0,
  "source_quality_score":78.0,
  "coverage_score":69.0,
  "model_stability_score":75.0,
  "missing_data_warning":true,
  "observed_ratio":61.0,
  "estimated_ratio":39.0,
  "manual_review_recommended":true,
  "explanation_note":"..."
}
```

### 4.4 Tenant validation result
- **Method/Path**: `GET /v1/projects/{project_id}/validation/{assessment_id}`
- **200 Response** includes:
`assessment`, `unsuitable_category_cards`, `alternatives`, `reliability_indicator`, `manual_adjustment_effects`, `zoning_summary`.
- **Status codes**: `200`, `404`.

### 4.5 Pricing recommendation
- **Method/Path**: `GET /v1/projects/{project_id}/pricing-recommendations`
- **Query**: `unit_id`, `scenario_id`, `mode`
- **200 Response** returns recommendation range, confidence, assumptions, evidence_refs.

### 4.6 Manual adjustments
- **POST /v1/projects/{project_id}/manual-adjustments**
- **Permissions**: analyst/admin (sales limited by module policy)
- **Request**:
```json
{
  "module_name":"pricing",
  "field_name":"recommended_monthly_rent_krw",
  "target_entity_type":"unit",
  "target_entity_id":"uuid",
  "after_value": 4800000,
  "reason_code":"local_market_override",
  "reason_note":"최근 권리금 조건 반영"
}
```
- **Response 202**:
```json
{"adjustment_id":"uuid","approval_required":true,"recompute_job_id":"job_01J..."}
```
- **Reset**: `POST /v1/projects/{project_id}/manual-adjustments/{adjustment_id}/reset`.

### 4.7 Zoning screening result
- **Method/Path**: `GET /v1/projects/{project_id}/zoning-screening/{run_id}`
- **200 Response**: run summary + `results[]` with strict `decision_status` enum and legal fields.

### 4.8 CRM lead summary
- **Method/Path**: `GET /v1/projects/{project_id}/crm/leads/{lead_id}/summary`
- **Response**: lead profile, stage, lead_score, latest validation link, latest report link, next follow-up.

### 4.9 Report summary
- **Method/Path**: `GET /v1/projects/{project_id}/reports/{report_run_id}/summary`
- **Response**: section status, mode, evidence coverage ratio, artifact links.

### 4.10 Analysis job status
- **Method/Path**: `GET /v1/analysis/jobs/{job_id}`
- **Response**:
```json
{
  "job_id":"job_01J8X9...",
  "module":"tenant_validation",
  "status":"running",
  "percent_progress":57,
  "partial_available":true,
  "partial_payload_uri":"s3://.../partial.json",
  "retry_token":"rt_...",
  "error": null,
  "started_at":"2026-04-19T12:00:00Z"
}
```

---

## 5. Async analysis job model
### 5.1 Job entity (`ai.analysis_jobs`)
Fields:
- `id uuid pk`, `job_id text unique` (`job_` + ULID), `module_name`, `project_id`, `requested_by`,
- `status ai.job_status`, `percent_progress int check (0<=x and x<=100)`,
- `request_payload jsonb`, `result_payload jsonb`, `partial_payload jsonb`,
- `retry_token text`, `error_payload jsonb`, `attempt_no int`, `max_attempts int default 3`,
- `started_at`, `finished_at`, `created_at`.

### 5.2 Error payload contract
```json
{
  "code":"PROVIDER_TIMEOUT",
  "message":"...",
  "retryable":true,
  "source":"kakao_map",
  "details": {"timeout_ms": 5000}
}
```

### 5.3 Rerun logic
- `POST /v1/analysis/jobs/{job_id}/rerun` requires valid `retry_token` and same input hash.
- Non-retryable errors require new request.

### 5.4 Modules using async jobs
- GIS catchment generation
- zoning screening
- demographic/competitor aggregation
- category recommendation and comparison table
- tenant validation
- pricing recommendation generation
- report generation/export

### 5.5 UI partial rendering rules
- Status `partial` or `running+partial_available=true`: show provisional tiles with “partial data” badge.
- Provisional values cannot be exported as customer report.

---

## 6. Scoring governance specification
### 6.1 Governance metadata (all scores)
- `score_name`, `score_version`, `model_version`, `feature_snapshot_id`, `computed_at`.
- Stored per output in `explanation_payload` and report appendix.

### 6.2 Score families

#### A) Site commercial potential
- Inputs: catchment demand index, accessibility, frontage, zoning permissiveness.
- Weights: demand 40 / accessibility 25 / visibility 20 / legal 15.
- Bands: `>=80 high`, `60-79 medium`, `<60 low`.
- Sparse fallback: if missing mobility, substitute proxy footfall with -10 penalty.
- Editable: band thresholds admin-editable; weight constants code-fixed Stage 1.

#### B) Category suitability
- Inputs: demand match, demographic fit, floor-unit fit, competitor pressure.
- Weights: 35/25/20/20.
- Bands: recommended >=75, neutral 55-74, risky <55.

#### C) Saturation
- Inputs: competitor density, same-category brand concentration, vacancy absorption.
- Higher score = more saturated.

#### D) Opportunity
- Inputs: underserved demand, adjacency synergy, price headroom.

#### E) Tenant validation
- Inputs: proposal-category fit 45, operator profile fit 20, zoning pass 20, pricing viability 15.
- Hard stop: if zoning `prohibited`, decision band cannot be `recommended`.

#### F) Pricing confidence
- Inputs: comparables recency, comparables count, unit similarity quality, macro volatility.

#### G) Lead score
- Inputs: category fit, budget fit, response engagement, timeline urgency, validation score link.

### 6.3 Calibration/drift
- Weekly calibration checks for pricing and lead score.
- Monthly drift review for category/validation scores.
- Alert if score distribution shifts >15% month-over-month for same region/category.

---

## 7. Confidence computation specification
### 7.1 Formula
`confidence = 0.40*source_quality + 0.30*freshness + 0.20*coverage + 0.10*model_stability`
(0–100 bounded).

### 7.2 Freshness decay
- Score per source: `freshness = max(0, 100 - decay_rate_days * age_days)`.
- Default decay rates:
  - zoning: 0.5/day after 30 days,
  - POI: 1.0/day after 7 days,
  - demographics: 0.2/day after 90 days,
  - comparables: 1.2/day after 14 days.

### 7.3 Missing data penalties
- Missing critical zoning/legal input: -25 and `manual_review_recommended=true`.
- Missing comparables for pricing (<3): -20 and confidence cap 65.
- Missing demographic coverage (>30% zone gaps): -15.

### 7.4 Observed vs estimated
- `observed_ratio` = observed_points / total_points.
- If observed_ratio < 50%, force `estimated_heavy=true` badge and customer-safe wording.

### 7.5 Manual review triggers
- `confidence < 60` OR `missing_data_warning=true` OR zoning state `manual_review`.

### 7.6 UI/report fields
- UI required: confidence score, freshness badge, source count/type, missing warning, manual-review flag, note.
- Report required: same plus factor breakdown and data timestamp table (internal full, customer simplified).

---

## 8. Korean leasing CRM stage model
### 8.1 Lead types
`investor`, `owner_operator`, `franchise`, `exploratory`, `broker_introduced`.

### 8.2 Stage contract (entry/exit artifacts)
- `lead_new` → requires minimal contact record.
- `lead_qualified` → requires lead type + budget range + target opening period.
- `site_fit_review` → requires site brief and initial category fit snapshot.
- `tenant_validation_reviewed` → requires linked `validation_assessment_id`.
- `proposal_prepared` → requires draft report run.
- `proposal_sent` → requires final report artifact (`report_run_id`) and send log activity.
- `negotiation` → requires at least one negotiation activity + updated pricing scenario.
- `conditional_approval` → requires zoning not prohibited + override approvals complete.
- `contract_pending` → requires final expected deposit/rent values.
- terminal `won/lost/on_hold` → requires closure reason code.

### 8.3 Required activities per stage
- Minimum one activity per stage transition.
- `proposal_sent` must include activity type `email` or `meeting` with artifact link.
- Reminder SLA: if no activity 7 days in active stages, auto-create follow-up task.

### 8.4 Linkage rules
- One opportunity can reference latest validation and primary report.
- New validation with materially changed decision (`band` change) triggers opportunity review task.

---

## 9. Report section schema + mode matrix
### 9.1 Section schema definitions
Each section in `report.report_sections.payload` uses:
- `summary_cards[]`, `detail_rows[]`, `charts[]`, `evidence_refs[]`, `last_updated_at`.

#### 1) Executive summary
- Required: key verdicts, top 3 opportunities, top 3 risks, overall confidence.
- Optional: scenario comparison highlights.

#### 2) Site & catchment summary
- Required: address, catchment method, access metrics, footfall proxy, map snapshot refs.

#### 3) Zoning first-screening
- Required: decision counts by enum, blocking issues list, caution list.

#### 4) Category comparison + unsuitable cards
- Required: comparison table rows, unsuitable cards for risky/rejected categories.

#### 5) Tenant validation summary
- Required: submitted proposal summary, validation band, key factors, alternatives.

#### 6) Pricing recommendation summary
- Required: deposit/rent recommendation per target unit, confidence, bounds.

#### 7) CRM/leasing status summary
- Required: lead stage, owner, next follow-up, opportunity status.

#### 8) Reliability & evidence appendix
- Required: source list, freshness table, confidence factors, evidence trace table.

### 9.2 Mode matrix (internal vs customer)
- Internal: all fields visible including scoring internals, source IDs, override history, legal references.
- Customer: hide internal IDs, model versions, raw rule traces, sensitive notes.
- Redaction rule object:
```json
{"field":"legal_reference_code","internal":true,"customer":false,"reason":"internal_legal_trace"}
```

### 9.3 Summary card rules
- max 5 summary cards per section.
- customer mode card text <= 120 Korean chars each.

---

## 10. Manual override authorization matrix
| Module | Who can override | Overridable fields | Reason codes required | Approval mandatory | Approver roles | Reset behavior | Report impact | Audit requirements |
|---|---|---|---|---|---|---|---|---|
| Category recommendation | analyst, admin | category band threshold, local demand adjustment | `market_anomaly`,`local_event`,`hidden_supply` | yes if band changes | admin, executive_approver | restore latest system calc | yes | before/after + score delta + user |
| Tenant validation | analyst, admin | factor weights (limited), proposal fit adjustment | `operator_context`,`document_evidence` | yes always | admin | recompute assessment, preserve history | yes | immutable trail + approval timestamp |
| Pricing | analyst, admin | comp selection, rent/deposit multiplier | `manual_comparable`,`special_term`,`market_override` | yes if >10% delta | admin, pricing_reviewer | reset to scenario default | yes | before/after + impact on confidence |
| Map/business density interpretation | analyst | hidden competitor flags, map correction notes | `field_observation`,`source_gap` | no (unless affects band) | admin if escalated | clear manual flags | yes (internal appendix) | geo evidence + user attribution |
| Future development assumptions | analyst, executive | future supply/demand multipliers | `approved_pipeline`,`municipal_plan` | yes | executive_approver | reset assumption set | yes | requires document attachment |
| Unit strategy assumptions | analyst, admin | min unit size, split ratio constraints | `design_constraint`,`leasing_strategy` | yes | admin | revert to default optimizer config | yes | config diff + recompute job id |

**Storage**
- All overrides in `audit.manual_adjustment_records`.
- Any approved override writes corresponding `audit.audit_logs` record.

---

## 11. Stage 1 acceptance criteria
Format: **Input / Output / Required fields / Latency / Fallback / Audit / Test**

1. **Project registration**
- Input: org, project meta, Korean address.
- Output: project/site IDs.
- Required: road+jibun, geom.
- Latency: p95 < 2s.
- Fallback: geocode fail -> manual coordinate entry.
- Audit: create log.
- Test: invalid address returns 422 with code.

2. **Map analysis**
- Input: site_id, catchment method.
- Output: catchment polygon + layer metrics.
- Required: method, metric_value, geom.
- Latency: async complete < 60s.
- Fallback: provider fail -> cached layer + warning.
- Audit: run log + source IDs.
- Test: partial status shown in UI.

3. **Zoning first-screening**
- Input: site_id, rule_set_id.
- Output: decision rows with enum.
- Required: decision_status, legal fields, messages.
- Latency: async < 30s.
- Fallback: unresolved rules -> manual_review.
- Audit: screening_run + results + overrides.
- Test: prohibited cannot serialize as permitted in same run.

4. **Demographic/needs analysis**
- Input: catchment_area_id.
- Output: demand indicators.
- Required: snapshot date, population, source_id.
- Latency: async < 45s.
- Fallback: stale snapshot allowed with warning.
- Audit: ingestion linkage.
- Test: stale data badge appears.

5. **Category recommendation**
- Input: project/scenario.
- Output: category comparison rows.
- Required: suitability/saturation/opportunity, band.
- Latency: async < 60s.
- Fallback: sparse data -> neutral default + low confidence.
- Audit: score version logged.
- Test: pagination/filter works.

6. **Unsuitable category cards**
- Input: assessment or category run.
- Output: cards for risky/rejected categories.
- Required: poor-fit + alternatives + operator/customer text.
- Latency: included with recommendation response.
- Fallback: if unavailable, provide minimum one-line reason.
- Audit: evidence refs required.
- Test: cards visible in proposal/validation/report.

7. **Tenant validation**
- Input: tenant proposal.
- Output: validation assessment + band + reliability.
- Required: tenant_validation_score, decision_band, reliability.
- Latency: async p95 < 90s.
- Fallback: low confidence => manual review required.
- Audit: link to lead/opportunity.
- Test: zoning prohibited never yields recommended.

8. **Pricing recommendation**
- Input: unit/scenario.
- Output: deposit/rent recommendation + bounds/confidence.
- Required: deposit, rent, confidence, assumptions.
- Latency: async < 60s.
- Fallback: <3 comps -> capped confidence.
- Audit: comp source refs.
- Test: confidence cap rule enforced.

9. **Reliability indicator display**
- Input: module output.
- Output: indicator object.
- Required: overall confidence + freshness + warning.
- Latency: synchronous with output read.
- Fallback: missing factors -> computed with penalty.
- Audit: stored indicator row.
- Test: manual_review flag triggers banner.

10. **Manual adjustment**
- Input: override request.
- Output: adjustment record + recompute job.
- Required: before/after, reason code, user.
- Latency: write < 2s + async recompute.
- Fallback: unauthorized -> 403.
- Audit: immutable record + approval.
- Test: reset restores system values.

11. **Category comparison table**
- Input: scenario.
- Output: paginated rows by band.
- Required: score triad + confidence + reason.
- Latency: read < 1s after compute.
- Fallback: no data -> explicit empty state.
- Audit: report section linkage.
- Test: risky rows require reason_summary.

12. **Internal/customer mode switch**
- Input: mode selector.
- Output: mode-specific serialized payload.
- Required: output mode metadata.
- Latency: read < 500ms.
- Fallback: unknown mode -> 400.
- Audit: export mode logged.
- Test: redacted fields absent in customer mode.

13. **CRM lead pipeline**
- Input: lead create/update/stage transition.
- Output: updated lead/opportunity state.
- Required: lead_type, lead_stage.
- Latency: < 1s.
- Fallback: invalid transition -> 409.
- Audit: stage transition log.
- Test: proposal_sent requires report link.

14. **Report generation**
- Input: report request (project, mode, sections).
- Output: report_run + section payloads + html/pdf uri.
- Required: 8 mandatory sections.
- Latency: async p95 < 120s.
- Fallback: section failure -> partial report internal-only.
- Audit: report run + evidence coverage.
- Test: customer mode hides internal fields.

15. **Source/ingestion logging**
- Input: ingestion job.
- Output: ingestion run + run items + dq score.
- Required: source_id, status, records_in/out.
- Latency: continuous.
- Fallback: schema mismatch -> failed + quarantine.
- Audit: full run log URI.
- Test: retry policy max 3 enforced.

---

## 12. Final list of implementation artifacts the engineering team must now create
1. `db/migrations/001_stage1_core.sql` (schemas + enums + core tables)
2. `db/migrations/002_stage1_zoning_market.sql`
3. `db/migrations/003_stage1_leasing_pricing_crm.sql`
4. `db/migrations/004_stage1_report_ai_audit_data.sql`
5. `openapi/stage1-v1.yaml` (all endpoint contracts + examples)
6. `docs/contracts/zoning-decision-contract.md`
7. `docs/contracts/async-job-contract.md`
8. `docs/contracts/scoring-governance-v1.md`
9. `docs/contracts/confidence-computation-v1.md`
10. `docs/contracts/crm-stage-model-korea-v1.md`
11. `docs/contracts/report-section-schema-v1.md`
12. `docs/contracts/manual-override-policy-v1.md`
13. `docs/qa/stage1-acceptance-test-matrix.md`
14. `apps/api/tests/contract/` JSON schema contract tests
15. `apps/web/tests/e2e/` mode redaction + workflow gate tests
