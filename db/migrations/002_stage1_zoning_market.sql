-- Stage 1 Zoning + Market Migration

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

create table market.catchment_areas (
  id uuid primary key,
  site_id uuid not null references core.sites(id) on delete cascade,
  method text not null check (method in ('radius','walk_isochrone','drive_isochrone','transit_isochrone')),
  metric_value int not null,
  geom geometry(Polygon,4326) not null,
  created_at timestamptz not null default now()
);
create index idx_catchment_geom on market.catchment_areas using gist(geom);

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
