-- 006_triggers.sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','organizations','organization_members','app_settings',
    'projects','project_tags','project_files','uploaded_file_analysis_status',
    'floor_plans','unit_plans','similar_locations','positioning_summaries',
    'tenant_recommendations','tenant_risks','marketing_plans','marketing_channels',
    'cost_models','revenue_scenarios','dashboard_snapshots','alerts',
    'leads','lead_memos','contract_clause_templates','contract_drafts',
    'contract_versions','reports','report_exports','activity_logs'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on %I;', t, t);
    execute format('create trigger trg_%I_updated_at before update on %I for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;
