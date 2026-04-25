-- 003_project_tables.sql
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text,
  parcel_number text,
  asset_type text,
  completion_date date,
  floors_above integer,
  floors_below integer,
  private_area_py numeric(12,2),
  common_area_py numeric(12,2),
  gross_area_py numeric(12,2),
  positioning text,
  near_station boolean default false,
  station_name text,
  industrial_demand boolean default false,
  parking_memo text,
  notes text,
  status text not null default 'draft',
  is_archived boolean not null default false,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_tags (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  tag_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, tag_name)
);

create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_category text,
  mime_type text,
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz not null default now(),
  analysis_status text not null default 'uploaded',
  preview_url text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists uploaded_file_analysis_status (
  id uuid primary key default gen_random_uuid(),
  project_file_id uuid not null references project_files(id) on delete cascade,
  status text not null,
  summary text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists floor_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  floor_label text not null,
  floor_order integer not null default 0,
  role text,
  area_py numeric(12,2),
  size_mix text,
  rationale text,
  risk_note text,
  suitability_score numeric(5,2),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, floor_label)
);

create table if not exists unit_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  floor_plan_id uuid not null references floor_plans(id) on delete cascade,
  unit_label text not null,
  exclusive_area_py numeric(12,2),
  common_area_py numeric(12,2),
  gross_area_py numeric(12,2),
  visibility_score numeric(5,2),
  accessibility_score numeric(5,2),
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (floor_plan_id, unit_label)
);

create table if not exists similar_locations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  rank_order integer,
  region_name text,
  subregion_name text,
  similarity_score numeric(5,2),
  similarity_reason text,
  benchmark_type text,
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists positioning_summaries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  summary_type text,
  title text,
  content text,
  source_type text,
  confidence_score numeric(5,2),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tenant_recommendations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  floor_plan_id uuid references floor_plans(id) on delete set null,
  floor_label text,
  recommendation_type text not null,
  tenant_category text not null,
  tenant_size text,
  score numeric(5,2),
  tag text,
  rationale text,
  condition_note text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tenant_risks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  floor_plan_id uuid references floor_plans(id) on delete set null,
  risk_title text,
  risk_description text,
  severity text,
  mitigation_note text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists marketing_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  budget numeric(14,2),
  objective text,
  duration_months integer,
  summary text,
  recommended_order jsonb not null default '[]'::jsonb,
  avoided_channels jsonb not null default '[]'::jsonb,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists marketing_channels (
  id uuid primary key default gen_random_uuid(),
  marketing_plan_id uuid not null references marketing_plans(id) on delete cascade,
  channel_name text not null,
  fitness_score numeric(5,2),
  budget_level text,
  target_goal text,
  description text,
  estimated_leads integer,
  estimated_cpl numeric(12,2),
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cost_models (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references projects(id) on delete cascade,
  land_cost numeric(14,2),
  build_cost numeric(14,2),
  design_cost numeric(14,2),
  permit_cost numeric(14,2),
  finance_cost numeric(14,2),
  marketing_cost numeric(14,2),
  other_cost numeric(14,2),
  maintenance_cost numeric(14,2),
  total_deposit_income numeric(14,2),
  monthly_rent_income numeric(14,2),
  vacancy_rate numeric(5,2),
  occupancy_rate numeric(5,2),
  expected_interest_rate numeric(5,2),
  target_yield numeric(5,2),
  cap_rate numeric(5,2),
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists revenue_scenarios (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  cost_model_id uuid not null references cost_models(id) on delete cascade,
  scenario_name text not null,
  occupancy_rate numeric(5,2),
  effective_monthly_income numeric(14,2),
  annual_income numeric(14,2),
  payback_years numeric(8,2),
  estimated_asset_value numeric(14,2),
  warning_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dashboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  snapshot_date date not null,
  metrics jsonb not null default '{}'::jsonb,
  alerts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, snapshot_date)
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  level text not null,
  text text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
