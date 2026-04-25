# SITE MIND Supabase 데이터 계층 설계 (MVP → 확장)

## 1) 전체 DB 구조 요약
- 조직(organizations) 중심 멀티테넌트 + 프로젝트(projects) 중심 도메인 분리.
- 화면 핵심 8개 저장 대상(프로젝트, 층구성, 추천업종, 비용모델, 리드, 계약초안, 리포트, 파일메타)을 우선 반영.
- 공통 규칙: `uuid` PK, `created_at/updated_at`, `status` + 일부 `is_archived`.
- RLS는 `organization_members`를 권한 기준 테이블로 사용.

## 2) 테이블별 설명
### 코어
- `profiles`: auth.users 확장 프로필.
- `organizations`: 회사/팀 단위.
- `organization_members`: owner/admin/editor/viewer 역할.
- `app_settings`: 조직 단위 민감 설정.

### 프로젝트/분석
- `projects`, `project_tags`, `project_files`, `uploaded_file_analysis_status`
- `floor_plans`, `unit_plans`
- `similar_locations`, `positioning_summaries`
- `tenant_recommendations`, `tenant_risks`
- `marketing_plans`, `marketing_channels`
- `cost_models`, `revenue_scenarios`
- `dashboard_snapshots`, `alerts`

### CRM/계약/리포트/감사
- `leads`, `lead_memos`
- `contract_drafts`, `contract_versions`, `contract_clause_templates`
- `reports`, `report_exports`
- `activity_logs`

## 3) create table SQL
- 파일 분리:
  - `db/migrations/supabase/001_extensions.sql`
  - `db/migrations/supabase/002_core_tables.sql`
  - `db/migrations/supabase/003_project_tables.sql`
  - `db/migrations/supabase/004_crm_contracts_reports.sql`

## 4) index SQL
- `db/migrations/supabase/005_indexes.sql`
- 주요 인덱스: `projects(organization_id)`, `floor_plans(project_id,floor_order)`, `tenant_recommendations(project_id,recommendation_type)`, `leads(project_id,status)`, `contract_drafts(project_id,status)`, `reports(project_id,report_type)`, `activity_logs(organization_id, created_at desc)`.

## 5) RLS 정책 방향
### 권한표
| role | 조회 | 프로젝트 수정 | CRM 수정 | 계약초안 수정 | 조직/설정 변경 |
|---|---|---|---|---|---|
| owner | 가능 | 가능 | 가능 | 가능 | 가능 |
| admin | 가능 | 가능 | 가능 | 가능 | 가능 |
| editor | 가능 | 가능 | 가능 | 가능 | 불가 |
| viewer | 가능 | 불가 | 불가 | 불가 | 불가 |

### 테이블별 읽기/쓰기 가능 역할
- 읽기: 같은 organization 소속 멤버(owner/admin/editor/viewer).
- 쓰기:
  - `projects`, `floor_plans`, `tenant_recommendations`, `cost_models`, `leads`, `contract_drafts`, `reports`, `project_files`: owner/admin/editor.
  - `organizations`, `organization_members`, `app_settings`: owner/admin.

### SQL 예시
- 정책 파일: `db/migrations/supabase/007_rls.sql`
- 핵심 함수:
  - `is_org_member(org_id)`
  - `has_org_role(org_id, roles)`

### current user 권한 판단 패턴
```sql
exists (
  select 1
  from organization_members om
  where om.organization_id = <target_org_id>
    and om.user_id = auth.uid()
    and om.status = 'active'
    and om.member_role = any(array['owner','admin','editor'])
)
```

### 보안 포인트
- Service Role key는 서버 전용(클라이언트 금지).
- RLS 미적용 테이블이 남지 않도록 migration 체계로 강제.
- `organization_id`를 직접 받는 insert는 검증 함수/정책으로 이중 보호.
- storage path도 organization/project 접두어 강제.

## 6) storage 설계
- 버킷:
  - `project-files`
  - `report-exports`
  - `contract-exports`
- 경로 규칙: `{organization_id}/{project_id}/{category}/{file_name}`
- `project_files.file_path`에 object path 저장, `preview_url`/signed url은 API에서 발급.

## 7) 프론트 연동 포인트
### 화면 ↔ 테이블
- 프로젝트 관리: `projects`, `floor_plans`
- 개발계획 분석: `project_files`, `uploaded_file_analysis_status`
- 업종 추천/검증: `tenant_recommendations`, `tenant_risks`
- 수익/자산: `cost_models`, `revenue_scenarios`
- CRM: `leads`, `lead_memos`
- 계약관리: `contract_drafts`, `contract_versions`, `contract_clause_templates`
- 리포트: `reports`, `report_exports`, `dashboard_snapshots`

### mock → DB 매핑
- `src/data/mock/entities/projects.ts` → `projects`
- `src/data/mock/entities/tenants.ts` → `floor_plans`, `tenant_recommendations`, `tenant_risks`
- `src/data/mock/entities/finance.ts` → `cost_models`
- `src/data/mock/entities/crm.ts` → `leads`, `lead_memos`
- `src/data/mock/entities/contracts.ts` → `contract_drafts`, `contract_clause_templates`
- `src/data/mock/entities/reports.ts` → `reports`, `alerts`
- `src/data/mock/entities/files.ts` → `project_files`

### 우선 연결 순서
1. `projects`
2. `floor_plans`
3. `tenant_recommendations`
4. `cost_models`
5. `revenue_scenarios`
6. `leads`
7. `contract_drafts`
8. `reports`
9. `project_files`

## 8) 다음 단계 추천
1. Supabase CLI로 migration 적용 + 최소 seed.
2. `supabase gen types typescript`로 `src/types/database.ts` 치환.
3. Repository 레이어에 `organization_id` 강제 전달.
4. `lead_memos`, `contract_versions`, `report_exports` 쓰기 액션 추가.
5. 파일 업로드 API route에서 signed URL + storage 정책 연결.
