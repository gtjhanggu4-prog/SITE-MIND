# Stage 1 Acceptance Test Matrix

| Feature | Scenario | Input | Expected Output | Latency | Fallback | Audit Requirement | Owner | Test Type |
|---|---|---|---|---|---|---|---|---|
| Project registration | Korean address valid | org/project/address | project_id/site_id created | p95 < 2s | manual coordinate entry | create log row | Backend | API integration |
| Map analysis | catchment request | site_id/method | polygon + metrics | < 60s async | cached layer + warning | run log + source IDs | Data Eng | Worker integration |
| Zoning first-screening | rule run | site_id/rule_set_id | enum decision rows | < 30s async | unresolved->manual_review | run + result logs | Backend | Contract/API |
| Demographic analysis | snapshot load | catchment_area_id | demand summary | < 45s async | stale allowed with warning | ingestion linkage | Data Eng | Data quality |
| Category recommendation | comparison table | project/scenario | rows with 3 scores + band | < 60s async | neutral+low confidence | score version logged | Backend | Contract/API |
| Unsuitable card | risky category exists | assessment_id | card shown with alternatives | bundled | one-line reason fallback | evidence refs required | Frontend | UI/E2E |
| Tenant validation | proposal submit | tenant proposal payload | validation + reliability + alternatives | p95 < 90s | manual review required | lead/opportunity link | Backend | API integration |
| Pricing recommendation | unit pricing | unit/scenario | deposit/rent + bounds/confidence | < 60s async | cap confidence if comps<3 | comp refs stored | Backend | API integration |
| Reliability display | low confidence case | module output | badge + warning + note | sync read | penalty mode | indicator stored | Frontend | UI/E2E |
| Manual adjustment | override request | module/field/value/reason | adjustment + recompute job | write<2s | 403 unauthorized | immutable before/after | Backend | Security/API |
| Category table | band filter | band=risky | filtered rows | < 1s read | explicit empty state | report linkage | Frontend | UI/E2E |
| Mode switch | customer mode | mode=customer | redacted payload | < 500ms read | 400 invalid mode | export mode logged | Frontend | Contract/E2E |
| CRM pipeline | stage transition | lead_stage update | valid transition and reminders | < 1s | 409 invalid transition | transition audit | Sales Ops | Workflow test |
| Report generation | full report run | project/mode/sections | 8 sections + html/pdf uri | p95 < 120s async | internal partial report | report run + evidence coverage | Backend | Worker integration |
| Source/ingestion logging | source sync | source_id/run_type | run + items + dq score | continuous | fail+quarantine | full run log URI | Data Eng | ETL integration |
