-- 007_rls.sql
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from organization_members om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  );
$$;

create or replace function public.has_org_role(org_id uuid, roles text[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from organization_members om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and om.member_role = any(roles)
  );
$$;

alter table profiles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table app_settings enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table floor_plans enable row level security;
alter table unit_plans enable row level security;
alter table similar_locations enable row level security;
alter table positioning_summaries enable row level security;
alter table tenant_recommendations enable row level security;
alter table tenant_risks enable row level security;
alter table marketing_plans enable row level security;
alter table marketing_channels enable row level security;
alter table cost_models enable row level security;
alter table revenue_scenarios enable row level security;
alter table leads enable row level security;
alter table lead_memos enable row level security;
alter table contract_drafts enable row level security;
alter table contract_versions enable row level security;
alter table reports enable row level security;
alter table dashboard_snapshots enable row level security;
alter table activity_logs enable row level security;
alter table alerts enable row level security;

create policy profiles_select_self on profiles for select using (id = auth.uid());
create policy profiles_update_self on profiles for update using (id = auth.uid());

create policy org_select_member on organizations for select using (public.is_org_member(id));
create policy org_update_owner_admin on organizations for update using (public.has_org_role(id, array['owner','admin']));

create policy org_member_select_member on organization_members for select using (public.is_org_member(organization_id));
create policy org_member_manage_owner_admin on organization_members for all using (public.has_org_role(organization_id, array['owner','admin'])) with check (public.has_org_role(organization_id, array['owner','admin']));

create policy project_select_member on projects for select using (public.is_org_member(organization_id));
create policy project_write_editor on projects for all using (public.has_org_role(organization_id, array['owner','admin','editor'])) with check (public.has_org_role(organization_id, array['owner','admin','editor']));

-- 하위 테이블 공통 규칙: project_id -> projects.organization_id를 통해 역할 확인
create policy floor_plans_access on floor_plans for all
using (exists (select 1 from projects p where p.id = floor_plans.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor','viewer'])))
with check (exists (select 1 from projects p where p.id = floor_plans.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor'])));

create policy tenant_recommendations_access on tenant_recommendations for all
using (exists (select 1 from projects p where p.id = tenant_recommendations.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor','viewer'])))
with check (exists (select 1 from projects p where p.id = tenant_recommendations.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor'])));

create policy cost_models_access on cost_models for all
using (exists (select 1 from projects p where p.id = cost_models.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor','viewer'])))
with check (exists (select 1 from projects p where p.id = cost_models.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor'])));

create policy leads_access on leads for all
using (public.has_org_role(organization_id, array['owner','admin','editor','viewer']))
with check (public.has_org_role(organization_id, array['owner','admin','editor']));

create policy contract_drafts_access on contract_drafts for all
using (exists (select 1 from projects p where p.id = contract_drafts.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor','viewer'])))
with check (exists (select 1 from projects p where p.id = contract_drafts.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor'])));

create policy reports_access on reports for all
using (exists (select 1 from projects p where p.id = reports.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor','viewer'])))
with check (exists (select 1 from projects p where p.id = reports.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor'])));

create policy project_files_access on project_files for all
using (exists (select 1 from projects p where p.id = project_files.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor','viewer'])))
with check (exists (select 1 from projects p where p.id = project_files.project_id and public.has_org_role(p.organization_id, array['owner','admin','editor'])));

create policy read_only_tables_member on similar_locations for select using (exists (select 1 from projects p where p.id = similar_locations.project_id and public.is_org_member(p.organization_id)));
create policy read_only_tables_member_2 on positioning_summaries for select using (exists (select 1 from projects p where p.id = positioning_summaries.project_id and public.is_org_member(p.organization_id)));
create policy read_only_tables_member_3 on dashboard_snapshots for select using (exists (select 1 from projects p where p.id = dashboard_snapshots.project_id and public.is_org_member(p.organization_id)));
create policy read_only_tables_member_4 on alerts for select using (exists (select 1 from projects p where p.id = alerts.project_id and public.is_org_member(p.organization_id)));

-- TODO(rls): marketing_channels, contract_versions, lead_memos, activity_logs, unit_plans 정책을 프로젝트 조인 기반으로 세분화
