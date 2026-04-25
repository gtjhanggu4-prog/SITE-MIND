# Korean Commercial Development Operating System — Master Blueprint

## 1) Product Definition
### 1.1 Product Name (working)
- **K-COMOS (Korean Commercial Operating System)**

### 1.2 One-line Definition
A **Korean-first AI and geospatial operating system** for end-to-end commercial real estate development, leasing, tenant mix planning, legal/zoning screening, pricing, sales enablement, and predictive simulation.

### 1.3 Core Product Modes
1. **Proposal Mode** (supply-side planning)
   - “What business categories should this site attract?”
   - Output: recommended tenant mix, unit plan, target brands, pricing, marketing plan.
2. **Validation Mode** (demand-side qualification)
   - “A prospect wants to open category X here—should we accept?”
   - Output: suitability score, risk factors, expected performance bands, negotiation guidance.

### 1.4 North-Star Outcomes
- Increase occupancy speed and quality.
- Reduce poor-fit tenant placements.
- Improve rent optimization and portfolio NOI.
- Standardize decisions across projects with explainable AI.

---

## 2) Business Goals
### 2.1 Strategic Goals
- Build a reusable intelligence layer for Korean CRE decisions.
- Shorten feasibility-to-launch cycle for new commercial projects.
- Convert internal tacit know-how into auditable data/rules/AI assets.

### 2.2 Measurable KPIs
- Time-to-first-proposal: target < 30 minutes from site registration.
- Vacancy duration reduction: target -20% in 12 months.
- Tenant acceptance quality: increase 6/12-month survival rate by +15%.
- Pricing accuracy: reduce achieved-vs-recommended rent gap to < 10%.
- Sales productivity: +25% qualified lead conversion.

### 2.3 Revenue & Monetization
- SaaS per project / per asset / per seat.
- Add-on data packages (premium mobility, card spending, franchise benchmarks).
- Enterprise deployment + advisory modules.

---

## 3) User Roles
### 3.1 Admin
- Manages tenants, orgs, data providers, rule sets, permissions, audit.
- Edits zoning rule DSL and report templates.

### 3.2 Analyst
- Runs GIS, demographic, competitor, pricing, and simulation analyses.
- Builds scenario packages and model overrides.

### 3.3 Sales/Leasing Operator
- Handles leads, prospects, pipeline, proposal generation.
- Uses AI coach for objection handling and tailored pitches.

### 3.4 Executive
- Portfolio KPI dashboard, risk summary, approval workflows.
- Compares assets and tracks strategy execution.

### 3.5 Client (Owner/Investor/Prospect)
- Accesses controlled project room and generated reports.
- Views recommendations and rationale (no raw sensitive internals).

---

## 4) Full Feature Map
### 4.1 Project/Site Registration
- Korean address search (도로명/지번), parcel linkage, coordinate validation.
- Asset metadata: GFA, floor plans, timeline, CAPEX assumptions.
- Multi-site portfolio management.

### 4.2 GIS/Map Analysis Engine
- Isochrone/catchment generation (walk, drive, transit).
- Footfall proxies, visibility index, frontage scoring, POI layers.
- Street-level competition heatmaps.

### 4.3 Zoning/Legal First-Screening
- Rule-based checks: use district, floor constraints, setbacks, parking, prohibited uses.
- Result tiers: pass / conditional / fail with article-level rationale.
- Admin-editable rule packs by jurisdiction.

### 4.4 Demographic & Trade Area Analysis
- Population, age bands, households, income proxies, worker/resident split.
- Daytime/nighttime population dynamics.
- Trade area demand-supply balance per business category.

### 4.5 Business Category Mapping
- Korean taxonomy aligned with KSIC + internal leasing categories.
- Category-level demand potential and cannibalization risk.

### 4.6 Competitor Density Analysis
- Nearby competitor count by category/brand/price segment.
- Saturation and white-space indicators.

### 4.7 Incoming Tenant Validation Engine
- Input prospect profile (category, concept, expected ticket, hours, capex).
- Output suitability score + acceptance recommendation + risk decomposition.

### 4.8 Unit Division Strategy Engine
- Space partition optimizer by floor and frontage.
- Objective options: max rent, risk-adjusted occupancy, balanced tenant mix.

### 4.9 Tenant Mix / MD Engine
- Mix composition by anchor/traffic-builder/convenience/specialty roles.
- Cross-tenant synergy graph and cannibalization constraints.

### 4.10 Deposit/Monthly Rent Recommendation
- Rent curve by floor, unit size, visibility, and market comps.
- Deposit-to-rent ratio guidance (Korean leasing conventions).

### 4.11 Franchise/Brand Suitability
- Brand targeting shortlist by category fit + expansion propensity.
- Outreach prioritization and negotiation notes.

### 4.12 CRM + Lead Scoring
- Lead capture, stage transitions, tasking, reminders, SLA alerts.
- AI lead score: close likelihood + fit quality.

### 4.13 AI Consultation Coach
- Korean-language script generation for calls/meetings.
- Objection-response suggestions tied to analysis outputs.

### 4.14 Marketing Strategy Engine
- Channel recommendation (Naver, Kakao, signage, broker network, local events).
- Budget allocation and expected lead volume.

### 4.15 Reporting/Proposal Engine
- Korean HTML report composition first; PDF export compatible.
- Section-level toggles for client type and sensitivity policy.

### 4.16 Voice Briefing Output
- Text-to-speech Korean executive brief.
- Role-tailored scripts (analyst vs sales vs executive).

### 4.17 Digital Twin & Simulation-ready
- Building + district state model with time-stepped events.
- Hooks for pedestrian flow simulation and macro shock scenarios.

### 4.18 Impact Simulation Engine
- What-if scenarios: rent changes, tenant replacement, marketing spend, nearby competitor opening.
- Outcome projections: occupancy, revenue, risk percentile bands.

---

## 5) Modular System Architecture
### 5.1 Architectural Style
- **Modular monolith (Phase 1/2) → service extraction (Phase 3)**.
- Clean boundaries with domain-driven modules and event contracts.

### 5.2 Core Layers
1. **Presentation Layer**: Next.js web + admin console.
2. **Application Layer**: FastAPI BFF + orchestration services.
3. **Domain Layer**: business rules, scoring, optimization, simulation logic.
4. **Infrastructure Layer**: provider adapters, DB, cache, queue, storage.
5. **AI Layer** (separate): feature store access, model serving, explanation composer.

### 5.3 Key Architectural Principles
- Locale `ko-KR` default across UX, NLP prompts, templates.
- Provider abstraction via adapter interfaces (no direct API coupling in domain).
- Rule engines and scoring weights configurable and versioned.
- Every recommendation must have explanation payload.

---

## 6) Service Boundaries
### 6.1 Domain Services (logical)
- `site-service`
- `gis-analysis-service`
- `zoning-rule-service`
- `market-intel-service`
- `tenant-validation-service`
- `unit-strategy-service`
- `pricing-service`
- `franchise-targeting-service`
- `crm-service`
- `report-service`
- `simulation-service`
- `ai-coach-service`
- `identity-access-service`
- `audit-compliance-service`

### 6.2 Cross-cutting Services
- `event-bus`
- `notification-service`
- `file-render-service`
- `observability-service`

---

## 7) Suggested Tech Stack
### 7.1 Frontend
- Next.js (App Router), TypeScript, Tailwind, React Query, Zustand (UI state).
- Charting: ECharts/Recharts.
- Mapping: MapLibre GL + deck.gl.

### 7.2 Backend
- FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic.
- Celery or RQ workers (Redis-backed) for async jobs.
- gRPC optional for internal high-throughput scoring.

### 7.3 Data
- PostgreSQL 16 + PostGIS.
- Redis (cache, queue, distributed lock).
- OpenSearch optional for full-text + geosearch ranking.
- S3-compatible object storage for reports, artifacts, datasets.

### 7.4 AI/ML
- Separate AI service with model registry + feature store table schemas.
- Online inference via FastAPI model endpoints.
- Batch retraining pipelines via Airflow/Prefect (Phase 2+).

### 7.5 DevOps
- Docker + docker-compose (local), Kubernetes (prod recommended).
- CI/CD: GitHub Actions.
- IaC: Terraform (cloud-agnostic modules).

---

## 8) Monorepo Structure
```text
/apps
  /web                # Next.js product UI
  /admin              # Next.js admin console
  /api                # FastAPI gateway/BFF
  /worker             # async jobs
/packages
  /domain             # pure domain logic (python package)
  /providers          # adapter interfaces + implementations
  /schemas            # shared DTOs/contracts
  /ai-orchestrator    # prompting, model routing, explanation formatting
  /ui-kit             # design system components
  /analytics          # event taxonomy helpers
/infrastructure
  /docker
  /k8s
  /terraform
  /monitoring
/data
  /seed
  /migrations
/docs
  /architecture
  /product
```

---

## 9) Database Architecture
### 9.1 Pattern
- Single PostgreSQL cluster with schema-based domain separation in MVP.
- Core schemas: `core`, `gis`, `market`, `leasing`, `pricing`, `crm`, `ai`, `audit`.

### 9.2 GIS Design
- Geometry columns with SRID 4326 for canonical storage.
- Derived materialized views for fast map layers (hex bins, isochrone aggregates).
- Spatial indexes (GIST) on geometry and geography fields.

### 9.3 Time-series & Versioning
- Snapshot tables for external datasets (`*_snapshot`, `valid_from`, `valid_to`).
- Rules and models version tables for reproducibility.

---

## 10) Core Entities & Relationships
### 10.1 Organization/Access
- `Organization` 1:N `User`
- `User` N:M `Role`
- `Role` N:M `Permission`

### 10.2 Project/Site
- `Project` 1:N `Site`
- `Site` 1:N `Building`
- `Building` 1:N `Floor`
- `Floor` 1:N `Unit`

### 10.3 Market & GIS
- `Site` 1:N `CatchmentArea`
- `CatchmentArea` 1:N `DemographicSnapshot`
- `CatchmentArea` 1:N `CompetitorPOI`
- `BusinessCategory` 1:N `CategoryDemandScore`

### 10.4 Leasing/Validation
- `Prospect` 1:N `TenantProposal`
- `TenantProposal` 1:1 `ValidationAssessment`
- `ValidationAssessment` 1:N `AssessmentReason`

### 10.5 Strategy/Pricing
- `UnitPlanScenario` N:M `Unit` (via `UnitAllocation`)
- `Unit` 1:N `RentRecommendation`
- `TenantMixScenario` N:M `BusinessCategory`

### 10.6 CRM
- `Lead` 1:N `Activity`
- `Lead` 1:N `Opportunity`
- `Opportunity` 1:N `ProposalDocument`

### 10.7 AI/Audit
- `Recommendation` 1:N `RecommendationExplanation`
- `InferenceRun` links to `ModelVersion`, `FeatureSnapshot`, `PromptVersion`
- `AuditLog` captures create/update/delete and decision approvals.

---

## 11) API Domain Breakdown
### 11.1 API Style
- REST for transactional operations.
- Async job endpoints for heavy analysis.
- Webhooks/events for completion notifications.

### 11.2 Domain APIs
- `/auth/*` identity, SSO, RBAC.
- `/projects/*`, `/sites/*`, `/buildings/*`, `/units/*`.
- `/gis/*` isochrones, map layers, spatial stats.
- `/zoning/*` legal screening checks.
- `/market/*` demographics, trade area, competition.
- `/tenant-validation/*` proposal input + assessment.
- `/unit-strategy/*` space optimization scenarios.
- `/pricing/*` rent/deposit recommendations.
- `/franchise/*` brand targeting lists.
- `/crm/*` leads, pipeline, activities, scoring.
- `/reports/*` HTML generation/export jobs.
- `/simulations/*` what-if and impact outputs.
- `/ai-coach/*` consultation script and Q&A assistance.
- `/admin/*` rules, providers, templates, policies.

### 11.3 Contract Governance
- OpenAPI-first; DTOs shared via `/packages/schemas`.
- Backward compatible versioning (`/v1`, `/v2`) with deprecation policy.

---

## 12) UI Sitemap / Route Map
### 12.1 Product App (`/web`)
- `/dashboard`
- `/projects`
- `/projects/:projectId/overview`
- `/projects/:projectId/site-analysis`
- `/projects/:projectId/zoning-screening`
- `/projects/:projectId/proposal-mode`
- `/projects/:projectId/validation-mode`
- `/projects/:projectId/unit-strategy`
- `/projects/:projectId/tenant-mix`
- `/projects/:projectId/pricing`
- `/projects/:projectId/franchise-targeting`
- `/projects/:projectId/simulations`
- `/projects/:projectId/reports`
- `/crm/leads`
- `/crm/opportunities`
- `/coach`
- `/settings`

### 12.2 Client Portal
- `/client/:shareToken/summary`
- `/client/:shareToken/recommendations`
- `/client/:shareToken/report`

---

## 13) Admin Console Structure
### 13.1 Data & Providers
- Provider credentials and connector health.
- Data sync schedules and freshness monitor.

### 13.2 Zoning Rule Management
- Rule DSL editor with test harness.
- Rule versioning, approval workflow, rollback.

### 13.3 Taxonomy Management
- Business category tree editor (Korean labels, synonyms).
- Mapping to external classification systems.

### 13.4 Model & Prompt Governance
- Model registry view, active model per task.
- Prompt template versions and A/B outcomes.

### 13.5 Template Management
- Report section templates (HTML components).
- Voice briefing template scripts by persona.

### 13.6 Security & Audit
- RBAC matrix UI.
- Audit explorer with filter/export.

---

## 14) Analytics / Event Tracking Design
### 14.1 Event Taxonomy
- Product events: `project_created`, `analysis_run`, `proposal_generated`, `validation_submitted`, `recommendation_accepted`, `lead_stage_changed`.
- System events: `provider_sync_failed`, `model_drift_alert`, `rule_override_applied`.

### 14.2 Event Envelope
- `event_id`, `event_name`, `occurred_at`, `org_id`, `user_id`, `project_id`, `session_id`, `payload_json`, `schema_version`.

### 14.3 Measurement Layer
- Funnel dashboards for proposal and validation modes.
- Model efficacy dashboard: precision/recall and business lift proxies.

---

## 15) Data Ingestion Architecture
### 15.1 Ingestion Types
- Batch ETL (daily/weekly): demographics, transaction stats, zoning updates.
- Near-real-time pulls: POI updates, lead events.
- Manual upload: broker lists, project-specific comps.

### 15.2 Pipeline Pattern
1. Raw landing (`object storage` + metadata).
2. Validation/quality checks.
3. Standardization to canonical schemas.
4. Upsert into Postgres/PostGIS.
5. Derived aggregates/materialized views.
6. Feature extraction for AI models.

### 15.3 Data Quality
- Freshness SLAs per source.
- Completeness, uniqueness, outlier checks.
- Data lineage tracking (`source`, `ingest_run_id`, checksum).

---

## 16) External Provider Abstraction Strategy
### 16.1 Adapter Interfaces
- `MapProvider`, `GeocoderProvider`, `POIProvider`, `DemographicsProvider`, `MobilityProvider`, `MessagingProvider`.

### 16.2 Anti-Corruption Layer
- External response mapped into internal canonical DTOs.
- Provider-specific quirks isolated from domain services.

### 16.3 Fallback & Resilience
- Priority provider chain (primary/secondary).
- Cached responses for non-critical stale-read scenarios.
- Circuit breakers and retry policies with idempotency keys.

---

## 17) Explainability Strategy for AI Recommendations
### 17.1 Explanation Contract (required output)
Every recommendation includes:
- `recommendation`
- `confidence_score`
- `top_positive_factors[]`
- `top_risk_factors[]`
- `counterfactuals[]` (what would change outcome)
- `data_freshness_summary`
- `applicable_rules[]`

### 17.2 Methods
- Hybrid explainability: SHAP-like feature attribution + rule trace.
- Human-readable Korean narrative generation.
- Evidence links to source tables/map layers.

### 17.3 Governance
- Store inference context for replay/audit.
- “Why not” explanations for rejected categories/prospects.

---

## 18) Security / Permissions Model
### 18.1 AuthN/AuthZ
- OIDC/SAML SSO for enterprise; JWT for API sessions.
- RBAC + attribute-based constraints (organization, project scope, data sensitivity).

### 18.2 Data Isolation
- Multi-tenant row-level security in PostgreSQL.
- Object storage path isolation by `org_id/project_id`.

### 18.3 Sensitive Data Controls
- PII minimization/encryption-at-rest (KMS).
- Column-level encryption for sensitive prospect data.
- Audit logging for all export/share operations.

### 18.4 Operational Security
- Secrets manager integration.
- WAF, rate limiting, IP allowlists for admin endpoints.

---

## 19) MVP Scope (Phase 1)
### 19.1 Included
- Site registration + Korean geocoding.
- Core GIS catchment analysis.
- Basic zoning first-screening (rule pack v1 for priority municipalities).
- Proposal mode (category suggestions + initial tenant mix).
- Validation mode (single prospect suitability scoring).
- Unit strategy v1 (rule/heuristic optimizer).
- Rent/deposit recommendation v1.
- CRM basic pipeline + lead scoring v1.
- HTML proposal report generation.
- RBAC, audit logs, admin rule editor v1.

### 19.2 Excluded
- Full digital twin simulation.
- Advanced ML retraining automation.
- Voice briefing personalization depth > basic.

### 19.3 MVP Delivery Goal
- 4–6 months with one cross-functional product squad.

---

## 20) Phase 2 Scope
- Expanded zoning coverage nationwide + richer legal constraints.
- Simulation engine v1 (scenario runs for occupancy/revenue risk).
- Franchise targeting with historical expansion propensity.
- Marketing budget optimizer with channel attribution loop.
- Enhanced AI coach with role-based playbooks and objection libraries.
- OpenSearch integration for faster semantic retrieval/report evidence.

---

## 21) Phase 3 Scope
- Service extraction for high-scale modules (simulation, AI inference).
- Digital twin pedestrian flow coupling.
- Real-time event-driven decisioning (near-live competition shifts).
- Portfolio-wide optimization across multiple assets.
- Advanced causal inference and policy simulation.

---

## 22) Risks & Implementation Notes
### 22.1 Key Risks
- Data licensing and quality inconsistency across Korean providers.
- Legal rule complexity and frequent regulatory changes.
- Model drift due to shifting consumer patterns.
- Over-automation risk without transparent rationale.

### 22.2 Mitigations
- Provider abstraction + quality scoring and failover strategy.
- Rule version governance with legal reviewer workflow.
- Drift monitoring and scheduled recalibration.
- Explainability-by-default and human approval gates.

### 22.3 Implementation Notes
- Start with deterministic rule + scoring hybrids before deep ML dependence.
- Keep domain logic in pure modules, provider SDK calls only in adapters.
- Build report engine as HTML component system to preserve flexibility.
- Instrument everything from day one for model and UX feedback loops.

---

## 23) Strengthened Stage 1 Enhancement Package (Differentiators)
This section upgrades Stage 1 to include five first-class capabilities: unsuitable category explanation cards, data reliability indicators, manual adjustment architecture, recommended-vs-risky comparison output, and dual-mode presentation.

### 23.1 Capability A — Unsuitable Category Explanation Cards
#### A) Reusable Card Schema (`UnsuitableCategoryCard`)
- `category_name`
- `decision_level` (`reject` | `high_caution` | `watchlist`)
- `poor_fit_summary`
- `saturation_reason`
- `demographic_mismatch_reason`
- `location_floor_unit_mismatch_reason`
- `zoning_legal_caution` (nullable)
- `pricing_rent_burden_warning` (nullable)
- `alternative_categories[]`
- `operator_explanation` (internal detailed)
- `customer_explanation` (simplified persuasive)
- `evidence_refs[]` (layer IDs, dataset IDs, rule IDs)
- `confidence_payload_id` (FK to reliability object)

#### B) Usage Surfaces
- Proposal mode: shown beside recommended category shortlist.
- Tenant validation mode: shown whenever submitted category is non-ideal.
- Reports: included as “Not Recommended / Caution Categories” section.
- Consultation screens: quick switch between operator and customer wording.

### 23.2 Capability B — Data Reliability / Confidence Display Model
#### A) Reusable Confidence Model (`ReliabilityIndicator`)
- `overall_confidence_score` (0–100)
- `data_freshness_status` (`fresh` | `aging` | `stale`)
- `source_count`
- `source_type_summary` (public/open, provider premium, internal observed, manual)
- `missing_data_warning` (boolean + text)
- `estimated_vs_observed_breakdown` (percent split)
- `manual_review_recommended` (boolean)
- `confidence_explanation_note` (human-readable Korean)

#### B) Mandatory Display Locations
- Map analysis result panels.
- Zoning first-screening output.
- Business category recommendations (including unsuitable cards).
- Tenant validation results.
- Pricing recommendation by unit/scenario.
- All exported reports (summary and appendix variants).

### 23.3 Capability C — Manual Adjustment / Override Architecture
#### A) Override Inputs (Stage 1)
- `local_market_judgment_adjustment`
- `anchor_tenant_effect_adjustment`
- `hidden_competitor_input`
- `manual_comparables_input`
- `future_development_effect_adjustment`
- `visibility_access_correction`
- `custom_rent_assumptions`
- `custom_unit_strategy_assumptions`

#### B) Override Record Design (`ManualAdjustmentRecord`)
- `adjustment_id`, `project_id`, `scenario_id`, `module_name`
- `field_name`, `before_value`, `after_value`, `reason_note`
- `created_by_user_id`, `created_at`, `approved_by_user_id` (optional)
- `impact_delta_json` (score/rent/risk changes)
- `resettable` (boolean), `reset_at` (nullable)

#### C) Behavior Requirements
- Every override triggers recomputation and impact preview.
- Before/after comparison panel is mandatory.
- User attribution and immutable audit trail mandatory.
- One-click “Reset to System Default” per field and per scenario.

### 23.4 Capability D — Recommended vs Risky Category Comparison Table
#### A) Core Output Table (`CategoryComparisonRow`)
For every category row:
- `category`
- `band` (`recommended` | `neutral` | `risky`)
- `suitability_score`
- `saturation_score`
- `opportunity_score`
- `risk_level`
- `preferred_floor_type`
- `preferred_unit_size`
- `reason_summary`
- `confidence`
- `suggested_alternative` (nullable)

#### B) Stage 1 Requirement
- This comparison table is a mandatory default output in both Proposal and Validation mode.
- Exportable to report, CRM opportunity notes, and proposal attachments.

### 23.5 Capability E — Dual-Mode Presentation (First-class)
#### A) Internal Analysis Mode
- Full reasoning trace, warnings, source notes, reliability mechanics.
- Adjustment controls, diagnostics, rule article references.
- Detailed factor-level decompositions and scenario deltas.

#### B) Customer-facing Mode
- Simplified persuasive messaging in Korean.
- Reduced technical clutter and selected insights only.
- Consultation-ready scorecards, explanation cards, and summary narratives.
- Report-ready layout with strong visuals and concise rationale.

#### C) Mode Governance
- Same underlying recommendation object, two serializer policies.
- Field-level visibility policy table by role + mode.
- Watermarking and redaction rules for customer exports.

### 23.6 Cross-Layer Placement Map (Where each capability lives)
#### A) Domain Model
- New value objects/entities:
  - `UnsuitableCategoryCard`
  - `ReliabilityIndicator`
  - `ManualAdjustmentRecord`
  - `CategoryComparisonRow`
  - `PresentationModePolicy`
- Domain services updated:
  - `tenant-validation-service` emits unsuitable cards + reliability payload.
  - `pricing-service` and `unit-strategy-service` consume manual adjustments.
  - `report-service` supports internal/customer render pipelines.

#### B) Database / Schema
- New tables (suggested schemas):
  - `leasing.unsuitable_category_cards`
  - `ai.reliability_indicators`
  - `audit.manual_adjustment_records`
  - `market.category_comparison_rows`
  - `core.presentation_mode_policies`
- Indexes:
  - `(project_id, scenario_id, category)` on comparison rows.
  - `(project_id, module_name, created_at)` on adjustment records.

#### C) API Structure
- `POST /analysis/:projectId/category-comparison`
- `GET /analysis/:projectId/category-comparison?mode=internal|customer`
- `GET /analysis/:projectId/unsuitable-cards`
- `POST /analysis/:projectId/manual-adjustments`
- `POST /analysis/:projectId/manual-adjustments/:id/reset`
- `GET /analysis/:projectId/reliability-summary`
- `GET /reports/:reportId?mode=internal|customer`

#### D) UI Screens
- Proposal Mode:
  - Comparison table panel + unsuitable card drawer + reliability strip.
- Validation Mode:
  - Submitted category verdict + alternatives + override panel.
- Analysis Workspace:
  - Before/after override impact diff.
- Report Builder:
  - Mode toggle (`internal` / `customer`) with live preview.

#### E) Reports
- Internal report pack:
  - Full confidence appendix, source notes, adjustment history, diagnostics.
- Customer report pack:
  - Simplified scorecards, alternatives, consultation language, clean visuals.
- Both include the comparison table; only internal includes full raw mechanics.

#### F) CRM Workflow
- Opportunity record stores:
  - selected category band, confidence, key risks, alternatives.
- Task automation:
  - if `manual_review_recommended=true`, auto-create analyst follow-up task.
- Sales coaching:
  - inject operator-facing vs customer-facing explanation variants.

#### G) Explainability Layer
- Explainability contract extended with:
  - `unsuitable_category_cards[]`
  - `reliability_indicator`
  - `manual_adjustment_effects[]`
  - `comparison_band_reasoning`
  - `presentation_mode` metadata for serializer policy.

### 23.7 Stage 1 MVP Scope Update (Explicit)
Stage 1 now explicitly **includes**:
1. Unsuitable category explanation cards.
2. Reliability/confidence indicators on all major outputs.
3. Manual adjustments with audit, attribution, and reset controls.
4. Recommended/neutral/risky category comparison table as core output.
5. Internal vs customer-facing dual-mode presentation in UI and reports.

---

## 24) Stage 1 Hardening Patch (Targeted, Implementation-Ready)
This patch converts the highest-priority audit gaps into executable Stage 1 contracts without changing the existing architecture.

### 24.1 Product/Workflow Hardening (Stage 1)
#### A) Tenant Validation as Flagship Flow
- Validation mode becomes a primary KPI workflow with SLA:
  - Input-to-first-verdict target: **< 90 seconds** (async job with progressive result states).
  - Mandatory outputs: suitability band, risk decomposition, unsuitable-card (if non-recommended), alternatives, reliability indicator, and operator/customer explanation pair.
- CRM integration is required at verdict time:
  - Auto-link validation result to lead/opportunity.
  - Auto-create follow-up task when `manual_review_required=true`.

#### B) Korean Leasing Workflow Fit (Stage 1 canonical stages)
- `lead_new`
- `lead_qualified`
- `site_fit_review`
- `tenant_validation_reviewed`
- `proposal_prepared`
- `proposal_sent`
- `negotiation`
- `conditional_approval`
- `contract_pending`
- `won` / `lost` / `on_hold`
- Stage transition guardrails:
  - `proposal_sent` requires attached report artifact.
  - `conditional_approval` requires zoning status not `prohibited`.
  - `contract_pending` requires approved pricing scenario ID.

### 24.2 Domain + Database Hardening (Stage 1 canonical tables)
#### A) Mandatory Core Tables (minimum)
1. `core.organizations`
2. `core.users`
3. `core.roles`
4. `core.user_roles`
5. `core.projects`
6. `core.sites`
7. `core.buildings`
8. `core.floors`
9. `core.units`
10. `core.file_assets`
11. `zoning.rule_sets`
12. `zoning.rules`
13. `zoning.screening_runs`
14. `zoning.screening_results`
15. `market.catchment_areas`
16. `market.demographic_snapshots`
17. `market.competitor_pois`
18. `market.category_comparison_rows`
19. `leasing.tenant_proposals`
20. `leasing.validation_assessments`
21. `leasing.unsuitable_category_cards`
22. `pricing.rent_recommendations`
23. `crm.leads`
24. `crm.activities`
25. `crm.consultation_notes`
26. `crm.opportunities`
27. `report.report_runs`
28. `report.report_sections`
29. `ai.reliability_indicators`
30. `audit.manual_adjustment_records`
31. `audit.audit_logs`
32. `data.source_registry`
33. `data.ingestion_runs`
34. `data.ingestion_run_items`

#### B) Must-have Column Contracts (selected)
- `zoning.screening_results`
  - `id`, `screening_run_id`, `site_id`, `rule_id`,
  - `decision_status` (`permitted|prohibited|caution|manual_review`),
  - `legal_basis_text`, `legal_reference_code`,
  - `message_operator`, `message_customer`,
  - `review_required` (bool), `review_owner_user_id` (nullable),
  - `evidence_refs` (jsonb), `created_at`.
- `leasing.validation_assessments`
  - `id`, `tenant_proposal_id`, `project_id`,
  - `suitability_score`, `saturation_score`, `opportunity_score`,
  - `risk_level`, `decision_band` (`recommended|neutral|risky`),
  - `manual_review_required` (bool),
  - `reliability_indicator_id`, `explanation_payload` (jsonb),
  - `model_version`, `rule_set_version`, `created_at`.
- `pricing.rent_recommendations`
  - `id`, `unit_id`, `scenario_id`,
  - `recommended_deposit_krw`, `recommended_monthly_rent_krw`,
  - `lower_bound_krw`, `upper_bound_krw`,
  - `confidence_score`, `assumption_payload` (jsonb), `created_at`.
- `audit.manual_adjustment_records`
  - `id`, `project_id`, `scenario_id`, `module_name`, `field_name`,
  - `before_value` (jsonb), `after_value` (jsonb), `reason_code`, `reason_note`,
  - `created_by_user_id`, `approved_by_user_id` (nullable),
  - `impact_delta_json` (jsonb), `reset_at` (nullable), `created_at`.
- `data.ingestion_runs`
  - `id`, `source_id`, `run_type`, `status`,
  - `started_at`, `finished_at`, `records_in`, `records_out`, `error_count`,
  - `freshness_effective_at`, `dq_score`, `run_log_uri`.

#### C) Stage 1 Constraints & Indexes
- Unique constraints:
  - `crm.leads(org_id, external_ref)`
  - `zoning.rules(rule_set_id, rule_code, version)`
- Indexes:
  - `validation_assessments(project_id, created_at desc)`
  - `manual_adjustment_records(project_id, module_name, created_at desc)`
  - `report_runs(project_id, mode, created_at desc)`
  - spatial GIST on site/catchment/competitor geometries.

### 24.3 API Hardening (Stage 1 v1 contracts)
#### A) Analysis Job Lifecycle
- Every heavy run returns `202 Accepted` + `job_id`.
- Job states: `queued|running|partial|succeeded|failed|cancelled`.
- Standard endpoints:
  - `POST /v1/analysis/jobs`
  - `GET /v1/analysis/jobs/{job_id}`
  - `POST /v1/analysis/jobs/{job_id}/cancel`

#### B) Core Response Contract Snippets (required fields)
- `GET /v1/projects/{project_id}/category-comparison`
  - `rows[] { category, band, suitability_score, saturation_score, opportunity_score, risk_level, preferred_floor_type, preferred_unit_size, reason_summary, confidence, suggested_alternative }`
  - `reliability_indicator`
- `GET /v1/projects/{project_id}/validation/{assessment_id}`
  - `assessment`
  - `unsuitable_category_cards[]`
  - `alternatives[]`
  - `reliability_indicator`
  - `manual_adjustment_effects[]`
- `POST /v1/projects/{project_id}/manual-adjustments`
  - input: `module_name, field_name, after_value, reason_code, reason_note`
  - output: `adjustment_id, recompute_job_id`
- `POST /v1/projects/{project_id}/manual-adjustments/{adjustment_id}/reset`
  - output: `reset=true, recompute_job_id`

#### C) Admin Rule Endpoints (editable + versioned)
- `POST /v1/admin/zoning/rule-sets`
- `POST /v1/admin/zoning/rules`
- `POST /v1/admin/zoning/rule-sets/{id}/publish`
- `GET /v1/admin/zoning/rules?jurisdiction=&status=&version=`

### 24.4 Reliability + Explainability Hardening
#### A) Confidence Computation (Stage 1 deterministic formula)
- `overall_confidence_score = 0.40*source_quality + 0.30*freshness + 0.20*coverage + 0.10*model_stability`
- Freshness score derived by source-type decay windows (configurable in admin):
  - demographics (monthly/quarterly), POI (weekly), zoning (event-driven), comps (daily/weekly).
- Missing critical inputs enforce:
  - `missing_data_warning=true`
  - `manual_review_recommended=true`
  - confidence ceiling (e.g., max 65).

#### B) Explainability Payload (mandatory)
- `top_positive_factors[]`
- `top_risk_factors[]`
- `counterfactuals[]`
- `applicable_rules[]`
- `evidence_refs[]`
- `unsuitable_category_cards[]`
- `operator_explanation`
- `customer_explanation`

### 24.5 UX + Reporting Hardening
#### A) Screen-level Must-have Components
- Proposal screen:
  - category comparison table (recommended/neutral/risky),
  - unsuitable card drawer,
  - reliability bar,
  - mode toggle (internal/customer).
- Validation screen:
  - verdict header, score block, unsuitable cards, alternatives,
  - manual adjustment panel with before/after diff,
  - review-required banner.
- CRM opportunity screen:
  - linked validation summary, linked report artifacts, leasing stage controls.

#### B) Report Section Contract (both modes)
1. Executive summary
2. Site & catchment summary
3. Zoning first-screening summary
4. Category comparison + unsuitable cards
5. Tenant validation summary
6. Pricing recommendation summary
7. CRM/leasing status summary
8. Reliability & evidence appendix (internal full / customer simplified)

#### C) Mode-based Redaction Rules
- Internal mode includes:
  - raw scoring factors, source notes, rule trace, manual adjustments.
- Customer mode includes:
  - simplified scorecards, selected reasons, curated alternatives, concise narrative.
- Export mode is explicit in report metadata: `mode=internal|customer`.

### 24.6 Data/Operations Hardening
#### A) Source Registry Contract
- `data.source_registry` fields:
  - `source_id`, `provider_name`, `source_type`, `license_scope`, `update_frequency`, `owner_team`, `active_flag`.

#### B) Ingestion Run Operational States
- `status`: `queued|running|succeeded|partial_failed|failed`.
- Retry policy:
  - transient provider errors: exponential backoff (max 3).
  - schema mismatch: fail-fast + alert + quarantine bucket.
- DQ checks (minimum): null ratio, duplicate ratio, geometry validity, outlier ratio.

#### C) Stage 1 Observability KPIs
- Validation turnaround p95.
- Zoning manual-review rate.
- Low-confidence output rate.
- Override usage rate by module.
- Report generation failure rate.

### 24.7 Stage 1 Implementation Priority (patched)
1. Freeze schema + API contracts in ADR/spec docs.
2. Implement zoning decision enum path end-to-end.
3. Implement validation flagship workflow with CRM linkage.
4. Ship comparison table + unsuitable cards + reliability strip in UI.
5. Ship manual override + reset + audit trail.
6. Ship dual-mode report generation with section contract.
7. Ship source/ingestion registry and DQ metrics.
