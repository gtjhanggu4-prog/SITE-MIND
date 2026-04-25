import type { ContractDraft, Lead, ProfitSummary, Project, ReportItem } from "@/src/types/site-mind";
import { formatReportSummary } from "@/src/lib/reportFormatter";

export function buildReportExportPayload(project: Project, report: ReportItem, context: { profitSummary: ProfitSummary; leadCount: number; topTenant?: string; contractDraft: ContractDraft }) {
  return {
    type: "report",
    generatedAt: new Date().toISOString(),
    project,
    report,
    previewText: formatReportSummary(project, report, context),
  };
}

export function buildContractExportPayload(project: Project, contractDraft: ContractDraft, previewText: string) {
  return {
    type: "contract",
    generatedAt: new Date().toISOString(),
    projectId: project.id,
    projectName: project.name,
    contractDraft,
    previewText,
  };
}

export function buildProfitExportPayload(project: Project, summary: ProfitSummary) {
  return {
    type: "profit",
    generatedAt: new Date().toISOString(),
    projectId: project.id,
    projectName: project.name,
    summary,
  };
}

export function buildCrmExportPayload(project: Project, leads: Lead[]) {
  return {
    type: "crm",
    generatedAt: new Date().toISOString(),
    projectId: project.id,
    projectName: project.name,
    leads,
  };
}

// TODO(jspdf): report/contract payload를 PDF 생성기로 연결
// TODO(exceljs): profit/crm payload를 XLSX 생성기로 연결
// TODO(docx-lib): 계약 초안을 DOCX 템플릿 생성기로 연결
// TODO(electron-save-dialog): desktop shell save dialog bridge 적용
