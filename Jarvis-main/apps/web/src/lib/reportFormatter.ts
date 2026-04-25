import type { ContractDraft, ProfitSummary, Project, ReportItem } from "@/src/types/site-mind";

interface ReportContext {
  profitSummary?: ProfitSummary;
  leadCount?: number;
  topTenant?: string;
  contractDraft?: ContractDraft;
}

export function formatReportSummary(project: Project, report: ReportItem, context: ReportContext = {}): string {
  const profitLine = context.profitSummary
    ? `총사업비 ${Math.round(context.profitSummary.totalCost / 100000000)}억, 예상 회수 ${context.profitSummary.paybackYears.toFixed(1)}년`
    : "수익 데이터 준비중";

  const leadLine = typeof context.leadCount === "number" ? `CRM 리드 ${context.leadCount}건 추적` : "CRM 데이터 준비중";
  const tenantLine = context.topTenant ? `핵심 추천 업종: ${context.topTenant}` : "업종 추천 데이터 준비중";
  const contractLine = context.contractDraft
    ? `계약 초안 ${context.contractDraft.contractType} / 상태 ${context.contractDraft.status}`
    : "계약 데이터 준비중";

  return [
    `${project.name} (${project.address})`,
    `${report.type}: ${report.summary}`,
    `포지셔닝: ${project.positioning}`,
    profitLine,
    tenantLine,
    leadLine,
    contractLine,
  ].join("\n");
}
