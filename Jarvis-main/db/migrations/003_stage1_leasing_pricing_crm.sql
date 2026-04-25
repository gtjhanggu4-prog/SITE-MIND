-- Stage 1 Leasing + Pricing + CRM Migration

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
