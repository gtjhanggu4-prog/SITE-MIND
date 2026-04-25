-- 004_crm_contracts_reports.sql
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  lead_name text not null,
  contact_phone text,
  contact_email text,
  source text,
  interested_floor text,
  interested_unit text,
  interested_tenant_type text,
  status text not null default 'new',
  probability numeric(5,2),
  last_contact_date date,
  next_action text,
  assigned_to uuid references profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lead_memos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author_id uuid references profiles(id),
  memo text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contract_clause_templates (
  id uuid primary key default gen_random_uuid(),
  clause_type text not null,
  tenant_type text,
  title text not null,
  clause_text text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contract_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  floor_plan_id uuid references floor_plans(id) on delete set null,
  unit_plan_id uuid references unit_plans(id) on delete set null,
  contract_type text not null,
  tenant_type text,
  floor_label text,
  deposit numeric(14,2),
  monthly_rent numeric(14,2),
  management_fee numeric(14,2),
  term_months integer,
  rent_free_months integer,
  special_clauses jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  current_version integer not null default 1,
  preview_text text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contract_versions (
  id uuid primary key default gen_random_uuid(),
  contract_draft_id uuid not null references contract_drafts(id) on delete cascade,
  version_no integer not null,
  snapshot jsonb not null default '{}'::jsonb,
  preview_text text,
  changed_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contract_draft_id, version_no)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  report_type text not null,
  title text,
  summary_text text,
  body_text text,
  generated_by uuid references profiles(id),
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists report_exports (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  export_format text not null,
  storage_path text not null,
  exported_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  user_id uuid references profiles(id),
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
