-- Stage 1 Report + AI + Audit + Data Migration

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

create table ai.analysis_jobs (
  id uuid primary key,
  job_id text not null unique,
  module_name text not null,
  project_id uuid not null references core.projects(id),
  requested_by uuid not null references core.users(id),
  status ai.job_status not null,
  percent_progress int not null default 0 check (percent_progress >= 0 and percent_progress <= 100),
  request_payload jsonb not null default '{}',
  result_payload jsonb,
  partial_payload jsonb,
  retry_token text,
  error_payload jsonb,
  attempt_no int not null default 1,
  max_attempts int not null default 3,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_analysis_jobs_project on ai.analysis_jobs(project_id, created_at desc);
create index idx_analysis_jobs_status on ai.analysis_jobs(status, created_at desc);

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
