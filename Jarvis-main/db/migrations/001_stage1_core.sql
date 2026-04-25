-- Stage 1 Core Migration
-- PostgreSQL 16 + PostGIS

create extension if not exists postgis;
create extension if not exists citext;

create schema if not exists core;
create schema if not exists zoning;
create schema if not exists market;
create schema if not exists leasing;
create schema if not exists pricing;
create schema if not exists crm;
create schema if not exists report;
create schema if not exists ai;
create schema if not exists audit;
create schema if not exists data;

-- Enums
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

create table core.organizations (
  id uuid primary key,
  name_ko text not null,
  business_no text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index uq_org_business_no on core.organizations(business_no) where business_no is not null;

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

create table core.roles (
  id uuid primary key,
  role_code text not null unique,
  role_name text not null,
  is_system boolean not null default false
);

create table core.user_roles (
  user_id uuid not null references core.users(id) on delete cascade,
  role_id uuid not null references core.roles(id),
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

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

create table core.floors (
  id uuid primary key,
  building_id uuid not null references core.buildings(id) on delete cascade,
  floor_label text not null,
  floor_order int not null,
  area_m2 numeric(12,2),
  created_at timestamptz not null default now(),
  unique (building_id, floor_order)
);

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
