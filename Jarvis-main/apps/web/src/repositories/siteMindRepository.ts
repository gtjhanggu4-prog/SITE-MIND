import {
  alerts as mockAlerts,
  contractTemplates,
  costModels,
  defaultContractDraft,
  developmentFiles,
  floorPlans as mockFloorPlans,
  leads as mockLeads,
  positioningSummaries,
  projects,
  reports as mockReports,
  seedTenantRecommendations,
  similarLocations,
  tenantRisks,
} from "@/src/data/mock";
import { getSupabaseClient, isSupabaseConfigured } from "@/src/lib/supabase/client";
import type {
  AlertItem,
  ContractDraft,
  ContractTemplate,
  CostModel,
  FloorPlan,
  Lead,
  PositioningSummary,
  Project,
  ReportItem,
  SimilarLocation,
  TenantRecommendation,
  TenantRiskItem,
  ProjectFile,
} from "@/src/types/site-mind";

export interface SiteMindBundle {
  project: Project;
  floorPlans: FloorPlan[];
  tenantRecommendations: TenantRecommendation[];
  costModel: CostModel;
  leads: Lead[];
  contractDraft: ContractDraft;
  reports: ReportItem[];
  files: ProjectFile[];
  positioningSummary: PositioningSummary;
  similarLocations: SimilarLocation[];
  tenantRisks: TenantRiskItem[];
  alerts: AlertItem[];
  contractTemplates: ContractTemplate[];
}

export interface SiteMindRepository {
  source: "mock" | "supabase";
  loadBundle(projectId: string): Promise<SiteMindBundle>;
  saveProject(project: Project): Promise<void>;
  saveFloorPlans(projectId: string, plans: FloorPlan[]): Promise<void>;
  saveTenantRecommendations(projectId: string, rows: TenantRecommendation[]): Promise<void>;
  saveCostModel(model: CostModel): Promise<void>;
  saveLead(projectId: string, lead: Lead): Promise<void>;
  saveContractDraft(projectId: string, draft: ContractDraft): Promise<void>;
  saveReport(projectId: string, report: ReportItem): Promise<void>;
  saveProjectFile(projectId: string, file: ProjectFile): Promise<void>;
}

function getMockBundle(projectId: string): SiteMindBundle {
  const project = projects.find((p) => p.id === projectId) ?? projects[0];
  return {
    project,
    floorPlans: mockFloorPlans.filter((p) => p.projectId === project.id),
    tenantRecommendations: seedTenantRecommendations,
    costModel: costModels.find((m) => m.projectId === project.id) ?? costModels[0],
    leads: mockLeads.filter((l) => l.projectId === project.id).map((lead) => ({
      id: lead.id,
      name: lead.name,
      contact: lead.contact,
      source: lead.source,
      interestedFloor: lead.interestedFloor,
      interestedType: lead.interestedType,
      status: lead.status,
      probability: lead.probability,
      lastContactDate: lead.lastContactDate,
      nextAction: lead.nextAction,
      notes: lead.notes,
    })),
    contractDraft: defaultContractDraft,
    reports: mockReports.filter((r) => r.projectId === project.id),
    files: developmentFiles.filter((f) => f.projectId === project.id),
    positioningSummary: positioningSummaries.find((r) => r.projectId === project.id) ?? positioningSummaries[0],
    similarLocations: similarLocations.filter((s) => s.projectId === project.id),
    tenantRisks,
    alerts: mockAlerts.filter((a) => a.projectId === project.id),
    contractTemplates,
  };
}

const mockRepository: SiteMindRepository = {
  source: "mock",
  async loadBundle(projectId) {
    return getMockBundle(projectId);
  },
  async saveProject() {},
  async saveFloorPlans() {},
  async saveTenantRecommendations() {},
  async saveCostModel() {},
  async saveLead() {},
  async saveContractDraft() {},
  async saveReport() {},
  async saveProjectFile() {},
};

const supabaseRepository: SiteMindRepository = {
  source: "supabase",
  async loadBundle(projectId) {
    const sb = getSupabaseClient();
    if (!sb) return getMockBundle(projectId);

    const [{ data: projectRow }, { data: floorPlanRows }, { data: tenantRows }, { data: costRows }, { data: leadRows }, { data: contractRows }, { data: reportRows }, { data: fileRows }] = await Promise.all([
      sb.from("projects").select("*").eq("id", projectId).maybeSingle(),
      sb.from("floor_plans").select("*").eq("project_id", projectId).order("floor_order", { ascending: true }),
      sb.from("tenant_recommendations").select("*").eq("project_id", projectId),
      sb.from("cost_models").select("*").eq("project_id", projectId).limit(1),
      sb.from("leads").select("*").eq("project_id", projectId),
      sb.from("contract_drafts").select("*").eq("project_id", projectId).limit(1),
      sb.from("reports").select("*").eq("project_id", projectId),
      sb.from("project_files").select("*").eq("project_id", projectId),
    ]);

    const fallback = getMockBundle(projectId);

    return {
      ...fallback,
      project: projectRow
        ? {
            id: projectRow.id,
            name: projectRow.name,
            address: projectRow.address,
            parcelNumber: projectRow.parcel_number ?? "",
            assetType: projectRow.asset_type ?? "",
            completionDate: projectRow.completion_date ?? "",
            floorsAbove: projectRow.floors_above ?? 0,
            floorsBelow: projectRow.floors_below ?? 0,
            privateAreaPy: Number(projectRow.private_area_py ?? 0),
            commonAreaPy: Number(projectRow.common_area_py ?? 0),
            grossAreaPy: Number(projectRow.gross_area_py ?? 0),
            positioning: projectRow.positioning ?? "",
            nearStation: Boolean(projectRow.near_station),
            stationName: projectRow.station_name ?? "",
            industrialDemand: Boolean(projectRow.industrial_demand),
            parkingMemo: projectRow.parking_memo ?? "",
            notes: projectRow.notes ?? "",
          }
        : fallback.project,
      floorPlans: (floorPlanRows ?? []).map((row) => ({
        id: row.id,
        projectId: row.project_id,
        floorLabel: row.floor_label,
        role: row.role ?? "",
        areaPy: Number(row.area_py ?? 0),
        sizeMix: row.size_mix ?? "",
        recommendedTypes: [],
        neutralTypes: [],
        riskyTypes: [],
        score: Number(row.suitability_score ?? 0),
        rationale: row.rationale ?? "",
        riskNote: row.risk_note ?? "",
      })),
      tenantRecommendations: (tenantRows ?? []).map((row) => ({
        id: row.id,
        floorLabel: row.floor_label ?? "",
        category: row.tenant_category,
        size: row.tenant_size,
        score: Number(row.score ?? 0),
        tag: row.tag ?? "",
        rationale: row.rationale ?? "",
        recommendationType: row.recommendation_type === "recommended" ? "추천" : row.recommendation_type === "neutral" ? "중립" : "위험",
      })),
      costModel: costRows?.[0]
        ? {
            projectId,
            landCost: Number(costRows[0].land_cost ?? 0),
            buildCost: Number(costRows[0].build_cost ?? 0),
            designCost: Number(costRows[0].design_cost ?? 0),
            permitCost: Number(costRows[0].permit_cost ?? 0),
            financeCost: Number(costRows[0].finance_cost ?? 0),
            marketingCost: Number(costRows[0].marketing_cost ?? 0),
            otherCost: Number(costRows[0].other_cost ?? 0),
            maintenanceCost: Number(costRows[0].maintenance_cost ?? 0),
            totalDepositIncome: Number(costRows[0].total_deposit_income ?? 0),
            monthlyRentIncome: Number(costRows[0].monthly_rent_income ?? 0),
            vacancyRate: Number(costRows[0].vacancy_rate ?? 0),
            occupancyRate: Number(costRows[0].occupancy_rate ?? 0),
            rentFreeMonths: 0,
            expectedInterestRate: Number(costRows[0].expected_interest_rate ?? 0),
            targetYield: Number(costRows[0].target_yield ?? 0),
            capRate: Number(costRows[0].cap_rate ?? 0),
          }
        : fallback.costModel,
      leads: (leadRows ?? []).map((row) => ({
        id: row.id,
        name: row.lead_name,
        contact: row.contact_phone ?? row.contact_email ?? "",
        source: row.source ?? "",
        interestedFloor: row.interested_floor ?? "",
        interestedType: row.interested_tenant_type ?? "",
        status: row.status ?? "신규",
        probability: Number(row.probability ?? 0),
        lastContactDate: row.last_contact_date ?? new Date().toISOString().slice(0, 10),
        nextAction: row.next_action ?? "",
        notes: row.notes ?? "",
      })),
      contractDraft: contractRows?.[0]
        ? {
            id: contractRows[0].id,
            contractType: contractRows[0].contract_type,
            tenantType: contractRows[0].tenant_type ?? "",
            floorLabel: contractRows[0].floor_label ?? "",
            deposit: Number(contractRows[0].deposit ?? 0),
            monthlyRent: Number(contractRows[0].monthly_rent ?? 0),
            managementFee: Number(contractRows[0].management_fee ?? 0),
            termMonths: Number(contractRows[0].term_months ?? 0),
            rentFreeMonths: Number(contractRows[0].rent_free_months ?? 0),
            specialClauses: contractRows[0].special_clauses ?? [],
            status: contractRows[0].status ?? "초안",
            version: Number(contractRows[0].current_version ?? 1),
          }
        : fallback.contractDraft,
      reports: (reportRows ?? []).map((row) => ({ id: row.id, projectId, type: row.report_type, summary: row.summary_text ?? "", keySentences: [] })),
      files: (fileRows ?? []).map((row) => ({
        id: row.id,
        projectId,
        name: row.file_name,
        type: row.file_type ?? "",
        uploadedAt: row.uploaded_at ?? "",
        status: row.analysis_status ?? "분석 대기중",
        category: row.file_category ?? "참고자료",
        previewUrl: row.preview_url ?? undefined,
      })),
    };
  },
  async saveProject(project) {
    const sb = getSupabaseClient();
    if (!sb) return;

    await sb.from("projects").upsert({
      id: project.id,
      name: project.name,
      address: project.address,
      parcel_number: project.parcelNumber,
      asset_type: project.assetType,
      completion_date: project.completionDate,
      floors_above: project.floorsAbove,
      floors_below: project.floorsBelow,
      private_area_py: project.privateAreaPy,
      common_area_py: project.commonAreaPy,
      gross_area_py: project.grossAreaPy,
      positioning: project.positioning,
      near_station: project.nearStation,
      station_name: project.stationName,
      industrial_demand: project.industrialDemand,
      parking_memo: project.parkingMemo,
      notes: project.notes,
    });
  },
  async saveFloorPlans(projectId, plans) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("floor_plans").upsert(plans.map((p, index) => ({ id: p.id, project_id: projectId, floor_label: p.floorLabel, floor_order: index, role: p.role, area_py: p.areaPy, size_mix: p.sizeMix, rationale: p.rationale, risk_note: p.riskNote, suitability_score: p.score })));
  },
  async saveTenantRecommendations(projectId, rows) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("tenant_recommendations").upsert(rows.map((r) => ({ id: r.id, project_id: projectId, floor_label: r.floorLabel, recommendation_type: r.recommendationType === "추천" ? "recommended" : r.recommendationType === "중립" ? "neutral" : "risky", tenant_category: r.category, tenant_size: r.size, score: r.score, tag: r.tag, rationale: r.rationale })));
  },
  async saveCostModel(model) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("cost_models").upsert({
      project_id: model.projectId,
      land_cost: model.landCost,
      build_cost: model.buildCost,
      design_cost: model.designCost,
      permit_cost: model.permitCost,
      finance_cost: model.financeCost,
      marketing_cost: model.marketingCost,
      other_cost: model.otherCost,
      maintenance_cost: model.maintenanceCost,
      total_deposit_income: model.totalDepositIncome,
      monthly_rent_income: model.monthlyRentIncome,
      vacancy_rate: model.vacancyRate,
      occupancy_rate: model.occupancyRate,
      expected_interest_rate: model.expectedInterestRate,
      target_yield: model.targetYield,
      cap_rate: model.capRate,
    }, { onConflict: "project_id" });
  },
  async saveLead(projectId, lead) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("leads").upsert({ id: lead.id, project_id: projectId, lead_name: lead.name, contact_phone: lead.contact, source: lead.source, interested_floor: lead.interestedFloor, interested_tenant_type: lead.interestedType, status: lead.status, probability: lead.probability, last_contact_date: lead.lastContactDate, next_action: lead.nextAction, notes: lead.notes });
  },
  async saveContractDraft(projectId, draft) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("contract_drafts").upsert({ id: draft.id, project_id: projectId, contract_type: draft.contractType, tenant_type: draft.tenantType, floor_label: draft.floorLabel, deposit: draft.deposit, monthly_rent: draft.monthlyRent, management_fee: draft.managementFee, term_months: draft.termMonths, rent_free_months: draft.rentFreeMonths, special_clauses: draft.specialClauses, status: draft.status, current_version: draft.version });
  },
  async saveReport(projectId, report) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("reports").upsert({ id: report.id, project_id: projectId, report_type: report.type, title: report.type, summary_text: report.summary, body_text: report.keySentences.join("\n"), status: "draft" });
  },
  async saveProjectFile(projectId, file) {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.from("project_files").upsert({ id: file.id, project_id: projectId, file_name: file.name, file_path: file.previewUrl ?? file.name, file_type: file.type, file_category: file.category, uploaded_at: file.uploadedAt, analysis_status: file.status, preview_url: file.previewUrl ?? null });
  },
};

export function getSiteMindRepository(mode: "mock" | "supabase") {
  if (mode === "supabase" && isSupabaseConfigured()) {
    return supabaseRepository;
  }
  return mockRepository;
}
