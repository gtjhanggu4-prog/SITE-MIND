import { useCallback, useEffect, useMemo, useState } from "react";
import { contractTemplates as seedContractTemplates, costModels, marketingPlans, positioningSummaries, projects, reports as seedReports, similarLocations as seedSimilarLocations, tenantRisks as seedTenantRisks } from "@/src/data/mock";
import { defaultContractDraft } from "@/src/data/mock/siteMindMock";
import { getSiteMindRepository } from "@/src/repositories/siteMindRepository";
import { buildContractPreview } from "@/src/lib/contractTemplates";
import { calculateProfitSummary, generateScenarios } from "@/src/lib/calculations";
import { defaultDesktopSettings } from "@/src/lib/localPersistence";
import type { DesktopSettings } from "@/src/lib/storage/types";
import { persistenceService } from "@/src/services/persistenceService";
import { desktopBridgeService } from "@/src/services/desktopBridgeService";
import { prepareExport } from "@/src/lib/export/exportService";
import { buildContractFileName, buildProfitFileName, buildReportFileName } from "@/src/lib/export/fileNaming";
import { buildContractExportPayload, buildCrmExportPayload, buildProfitExportPayload, buildReportExportPayload } from "@/src/lib/export/payloadBuilders";
import type { ContractDraft, Lead, MarketingPlan, Project, ProjectFile, ReportItem } from "@/src/types/site-mind";

export function useSiteMindState() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState(persistenceService.loadDesktopContext().lastProjectId || "p-001");
  const [dataSource, setDataSource] = useState<"mock" | "supabase">("mock");
  const repository = useMemo(() => getSiteMindRepository(dataSource), [dataSource]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [project, setProject] = useState<Project>(projects[0]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [fileFilter, setFileFilter] = useState("전체");
  const [floorPlans, setFloorPlans] = useState<any[]>([]);
  const [tenantRisks, setTenantRisks] = useState<any[]>(seedTenantRisks);
  const [tenantRecommendations, setTenantRecommendations] = useState<any[]>([]);
  const [tenantQuery, setTenantQuery] = useState("");
  const [similarLocations, setSimilarLocations] = useState<any[]>(seedSimilarLocations);
  const [positioningSummary, setPositioningSummary] = useState<any>(positioningSummaries[0]);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan>(marketingPlans[0]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadFilter, setLeadFilter] = useState("전체");
  const [leadSearch, setLeadSearch] = useState("");
  const [costModel, setCostModel] = useState<any>(costModels[0]);
  const [contractDraft, setContractDraft] = useState<ContractDraft>(defaultContractDraft);
  const [reports, setReports] = useState<ReportItem[]>(seedReports);
  const [selectedReportId, setSelectedReportId] = useState<string>(seedReports[0].id);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [contractTemplates, setContractTemplates] = useState<any[]>(seedContractTemplates);

  const [settings, setSettings] = useState<DesktopSettings>(persistenceService.loadDesktopContext().settings);
  const [recentProjects, setRecentProjects] = useState(persistenceService.loadDesktopContext().recentProjects);
  const [recentFiles, setRecentFiles] = useState(persistenceService.loadDesktopContext().recentFiles);
  const [recentReports, setRecentReports] = useState(persistenceService.loadDesktopContext().recentReports);
  const [recentContracts, setRecentContracts] = useState(persistenceService.loadDesktopContext().recentContracts);
  const [lastBackupAt, setLastBackupAt] = useState(persistenceService.loadDesktopContext().lastBackupAt);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [saveState, setSaveState] = useState<"saved" | "saving" | "dirty">("saved");
  const [exportMessage, setExportMessage] = useState("");
  const [savedProject, setSavedProject] = useState<Project>(projects[0]);
  const [projectValidation, setProjectValidation] = useState<string[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [selectedStrategy, setSelectedStrategy] = useState<"빠른 소진형" | "기준형" | "수익 극대화형">("기준형");

  const loadProjectBundle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const bundle = await repository.loadBundle(selectedProjectId);
      setProject(bundle.project);
      setSavedProject(bundle.project);
      setFiles(bundle.files);
      setFloorPlans(bundle.floorPlans);
      setTenantRecommendations(bundle.tenantRecommendations);
      setCostModel(bundle.costModel);
      setLeads(bundle.leads);
      setContractDraft(bundle.contractDraft);
      setReports(bundle.reports);
      setSelectedReportId(bundle.reports[0]?.id ?? "");
      setPositioningSummary(bundle.positioningSummary);
      setSimilarLocations(bundle.similarLocations);
      setTenantRisks(bundle.tenantRisks);
      setAlerts(bundle.alerts);
      setContractTemplates(bundle.contractTemplates);
      setSelectedFileId(bundle.files[0]?.id ?? "");

      const localSnapshot = persistenceService.loadProjectState(selectedProjectId);
      if (localSnapshot) {
        setProject(localSnapshot.project);
        setFiles(localSnapshot.files);
        setLeads(localSnapshot.leads);
        setCostModel(localSnapshot.costModel);
        setContractDraft(localSnapshot.contractDraft);
        setReports(localSnapshot.reports);
        setSelectedReportId(localSnapshot.selectedReportId);
      }
      setRecentProjects(persistenceService.loadDesktopContext().recentProjects);
      setRecentFiles(persistenceService.loadDesktopContext().recentFiles);
      setRecentReports(persistenceService.loadDesktopContext().recentReports);
      setRecentContracts(persistenceService.loadDesktopContext().recentContracts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [repository, selectedProjectId]);

  useEffect(() => {
    void loadProjectBundle();
  }, [loadProjectBundle]);

  const [isElectronConnected, setIsElectronConnected] = useState(false);

  useEffect(() => {
    const bridge = typeof window !== "undefined" ? window.siteMind : undefined;
    setIsElectronConnected(Boolean(bridge));
    if (!bridge?.getAppSettings) return;
    void bridge.getAppSettings().then((stored) => {
      if (!stored || typeof stored !== "object") return;
      setSettings((prev) => ({ ...prev, ...(stored as Partial<DesktopSettings>) }));
    });
    void persistenceService.loadElectronRecentProjects().then((items) => {
      if (items.length > 0) setRecentProjects(items);
    });
  }, []);

  const filteredTenants = useMemo(
    () => tenantRecommendations.filter((t: any) => `${t.floorLabel} ${t.category} ${t.tag}`.toLowerCase().includes(tenantQuery.toLowerCase())),
    [tenantQuery, tenantRecommendations],
  );
  const filteredFiles = useMemo(() => (fileFilter === "전체" ? files : files.filter((f) => f.category === fileFilter)), [files, fileFilter]);
  const filteredLeads = useMemo(
    () =>
      leads.filter(
        (lead) => (leadFilter === "전체" || lead.status === leadFilter) && `${lead.name} ${lead.interestedType} ${lead.interestedFloor}`.includes(leadSearch),
      ),
    [leadFilter, leadSearch, leads],
  );

  const profitSummary = useMemo(() => calculateProfitSummary(costModel), [costModel]);
  const revenueScenarios = useMemo(() => generateScenarios(costModel), [costModel]);

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? reports[0];
  const template = contractTemplates.find((t: any) => t.contractType === contractDraft.contractType) ?? contractTemplates[0];
  const contractPreview = buildContractPreview({ ...contractDraft, projectName: project.name }, template);

  const projectSummary = useMemo(
    () => ({
      vacancyRate: costModel?.vacancyRate ?? 0,
      coreCategories: "메디컬·교육·생활",
      similarType: similarLocations[0]?.typeLabel ?? "-",
      totalCost: profitSummary.totalCost,
      effectiveMonthlyIncome: profitSummary.effectiveMonthlyIncome,
      paybackYears: profitSummary.paybackYears,
      uploadedFiles: files.length,
    }),
    [costModel?.vacancyRate, files.length, profitSummary, similarLocations],
  );
  const selectedFile = useMemo(() => files.find((f) => f.id === selectedFileId) ?? null, [files, selectedFileId]);

  const strategyCards = useMemo(() => {
    const base = {
      "빠른 소진형": {
        summary: "1층/2층 앵커 선점으로 초기 공실을 빠르게 축소",
        risk: "초기 할인폭 증가로 단기 수익률 하락 가능",
        pricingDirection: "초기 6개월 임대료 보수적, 공실률 우선 안정화",
      },
      "기준형": {
        summary: "메디컬·교육·생활 업종 균형 배치로 안정 운영",
        risk: "특정 앵커 부재 시 중층 흡수 속도 저하",
        pricingDirection: "기준 임대료 유지 + 층별 차등 조건 적용",
      },
      "수익 극대화형": {
        summary: "상층부 고정수익 임차 비중 확대",
        risk: "초기 리드 전환속도 저하 가능",
        pricingDirection: "핵심층 임대료 상향, 특약 강화",
      },
    };
    return base;
  }, []);

  const projectDirty = useMemo(() => JSON.stringify(project) !== JSON.stringify(savedProject), [project, savedProject]);

  useEffect(() => {
    const budget = marketingPlan.budget;
    const ranked = [...marketingPlan.channels]
      .map((c) => ({ ...c, score: c.fit + (budget > 1200 ? (c.budgetIntensity === "중" ? 6 : 2) : c.budgetIntensity === "저" ? 7 : 1) }))
      .sort((a, b) => b.score - a.score);
    const recommendedOrder = ranked.slice(0, 3).map((c) => c.name);
    const avoidedChannels = ranked.slice(-2).map((c) => c.name);
    setMarketingPlan((prev) => ({
      ...prev,
      recommendedOrder,
      avoidedChannels,
      summary: `${prev.objective} 중심 ${selectedStrategy} 전략 · 예산 ${prev.budget.toLocaleString()}만원`,
    }));
  }, [marketingPlan.budget, marketingPlan.objective, selectedStrategy]);

  const addLead = async (lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
    setSaveState("dirty");
    // TODO(supabase): lead_memos 연동 이후 메모 동시 저장
    await repository.saveLead(selectedProjectId, lead);
  };

  const updateLeadStatus = (id: string, status: Lead["status"]) => setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  const updateLeadStatusWithDirty = (id: string, status: Lead["status"]) => {
    setSaveState("dirty");
    updateLeadStatus(id, status);
  };
  const removeFile = (id: string) => {
    setSaveState("dirty");
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };
  const addFile = async (file: ProjectFile) => {
    setSaveState("dirty");
    setFiles((prev) => [file, ...prev]);
    await repository.saveProjectFile(selectedProjectId, file);
  };

  const saveCurrentMenu = async () => {
    setSaving(true);
    setSaveState("saving");
    setError(null);
    try {
      if (activeMenu === "project") {
        const errors: string[] = [];
        if (!project.name.trim()) errors.push("프로젝트명은 필수입니다.");
        if (!project.address.trim()) errors.push("주소는 필수입니다.");
        if (project.floorsAbove < 1) errors.push("지상층 수는 1 이상이어야 합니다.");
        setProjectValidation(errors);
        if (errors.length > 0) throw new Error(errors[0]);
        await repository.saveProject(project);
        setSavedProject(project);
      }
      if (activeMenu === "tenant") await repository.saveTenantRecommendations(selectedProjectId, tenantRecommendations);
      if (activeMenu === "profit") await repository.saveCostModel(costModel);
      if (activeMenu === "contracts") await repository.saveContractDraft(selectedProjectId, contractDraft);
      if (activeMenu === "reports" && selectedReport) await repository.saveReport(selectedProjectId, selectedReport);
      if (activeMenu === "plan" && files[0]) await repository.saveProjectFile(selectedProjectId, files[0]);
      if (activeMenu === "crm" && leads[0]) await repository.saveLead(selectedProjectId, leads[0]);
      if (activeMenu === "project") await repository.saveFloorPlans(selectedProjectId, floorPlans);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
      setSaveState("saved");
    }
  };

  useEffect(() => {
    setSaveState("dirty");
  }, [project, files, leads, costModel, contractDraft, reports, selectedReportId]);

  useEffect(() => {
    if (!selectedFile) return;
    persistenceService.pushRecentFile({ id: selectedFile.id, projectId: selectedProjectId, fileName: selectedFile.name, openedAt: new Date().toISOString() });
    setRecentFiles(persistenceService.loadDesktopContext().recentFiles);
  }, [selectedFile, selectedProjectId]);

  const saveSettings = async () => {
    await persistenceService.saveDesktopSettings(settings);
  };

  const resetSettings = () => {
    setSettings(defaultDesktopSettings);
  };

  useEffect(() => {
    setSaveState("saving");
    const timer = setTimeout(() => {
      persistenceService.saveProjectState(selectedProjectId, {
        project,
        files,
        leads,
        costModel,
        contractDraft,
        reports,
        selectedReportId,
        lastSavedAt: new Date().toISOString(),
      });
      setRecentProjects(persistenceService.loadDesktopContext().recentProjects);
      setLastSavedAt(new Date().toISOString());
      setSaveState("saved");
    }, settings.autosaveIntervalSec * 1000);
    return () => clearTimeout(timer);
  }, [selectedProjectId, project, files, leads, costModel, contractDraft, reports, selectedReportId, settings.autosaveIntervalSec]);

  const runExport = async (target: "report" | "contract" | "profit" | "crm", format: "pdf" | "xlsx" | "docx" | "copy") => {
    let fileName = "";
    let payload: unknown = {};

    if (target === "report") {
      fileName = buildReportFileName(project.name, selectedReport.type);
      payload = buildReportExportPayload(project, selectedReport, { profitSummary, leadCount: leads.length, topTenant: filteredTenants[0]?.category, contractDraft });
      persistenceService.pushRecentReport({ id: selectedReport.id, projectId: project.id, reportType: selectedReport.type, viewedAt: new Date().toISOString() });
      setRecentReports(persistenceService.loadDesktopContext().recentReports);
    }
    if (target === "contract") {
      fileName = buildContractFileName(project.name, contractDraft.floorLabel, contractDraft.tenantType);
      payload = buildContractExportPayload(project, contractDraft, contractPreview);
      persistenceService.pushRecentContract({ id: contractDraft.id, projectId: project.id, contractType: contractDraft.contractType, viewedAt: new Date().toISOString() });
      setRecentContracts(persistenceService.loadDesktopContext().recentContracts);
    }
    if (target === "profit") {
      fileName = buildProfitFileName(project.name);
      payload = buildProfitExportPayload(project, profitSummary);
    }
    if (target === "crm") {
      fileName = buildReportFileName(project.name, "CRM_리드목록");
      payload = buildCrmExportPayload(project, leads);
    }
    const result = await prepareExport(format, fileName, payload, target);
    setExportMessage(`${result.message} (${result.fileName})`);
    return result;
  };

  const runBackup = () => {
    persistenceService.markBackupNow();
    setLastBackupAt(persistenceService.loadDesktopContext().lastBackupAt);
  };

  const chooseDirectory = async () => {
    return desktopBridgeService.selectDirectory();
  };

  // TODO(supabase): 프로젝트 저장 upsert 결과를 조직/사용자 기준으로 서버 검증 API와 연결
  // TODO(storage): 파일 업로드를 Supabase Storage signed URL 업로드로 교체
  // TODO(engine): 추천 엔진 결과(tenant_recommendations)를 서버 계산 결과로 대체
  // TODO(report): 리포트 export PDF 실제 생성 API 연결
  // TODO(contract): 계약서 PDF/DOCX 생성 파이프라인 연결
  // TODO(auth): Supabase Auth + organization_members 기반 권한 제어 연동
  // TODO(crm): lead_memos 포함 CRM 영속화 확장
  // TODO(analysis): similar_locations/positioning_summaries 분석 결과 저장 자동화

  return {
    activeMenu,
    setActiveMenu,
    selectedProjectId,
    setSelectedProjectId,
    dataSource,
    setDataSource,
    repositorySource: repository.source,
    loading,
    saving,
    error,
    projectDirty,
    projectValidation,
    selectedFileId,
    setSelectedFileId,
    selectedFile,
    selectedStrategy,
    setSelectedStrategy,
    strategyCards,
    reload: loadProjectBundle,
    saveCurrentMenu,
    project,
    setProject,
    projectSummary,
    files,
    filteredFiles,
    fileFilter,
    setFileFilter,
    removeFile,
    addFile,
    floorPlans,
    tenantRisks,
    tenantQuery,
    setTenantQuery,
    filteredTenants,
    similarLocations,
    positioningSummary,
    marketingPlan,
    setMarketingPlan,
    leads,
    filteredLeads,
    leadFilter,
    setLeadFilter,
    leadSearch,
    setLeadSearch,
    addLead,
    updateLeadStatus: updateLeadStatusWithDirty,
    costModel,
    setCostModel,
    profitSummary,
    revenueScenarios,
    contractDraft,
    setContractDraft,
    contractPreview,
    template,
    reports,
    selectedReportId,
    setSelectedReportId,
    selectedReport,
    settings,
    setSettings,
    alerts,
    resetProject: () => setProject(savedProject),
    recentProjects,
    recentFiles,
    recentReports,
    recentContracts,
    lastBackupAt,
    lastSavedAt,
    saveState,
    exportMessage,
    runExport,
    runBackup,
    chooseDirectory,
    saveSettings,
    resetSettings,
    isElectronConnected,
  };
}
