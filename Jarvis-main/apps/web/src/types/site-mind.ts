export type RecommendationType = "추천" | "중립" | "위험";

export interface Project {
  id: string;
  name: string;
  address: string;
  parcelNumber: string;
  assetType: string;
  completionDate: string;
  floorsAbove: number;
  floorsBelow: number;
  privateAreaPy: number;
  commonAreaPy: number;
  grossAreaPy: number;
  positioning: string;
  nearStation: boolean;
  stationName: string;
  industrialDemand: boolean;
  parkingMemo: string;
  notes: string;
}

export interface ProjectSummary {
  vacancyRate: number;
  coreCategories: string;
  similarType: string;
  totalCost: number;
  effectiveMonthlyIncome: number;
  paybackYears: number;
  uploadedFiles: number;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: "분석 대기중" | "분석 준비중" | "업로드 완료";
  category: "개발계획 맵" | "평면도/PDF" | "면적표" | "참고자료";
  previewUrl?: string;
}

export interface DevelopmentPlanFile extends ProjectFile {
  analysisNote: string;
}

export interface FloorPlan {
  id: string;
  projectId: string;
  floorLabel: string;
  role: string;
  areaPy: number;
  sizeMix: string;
  recommendedTypes: string[];
  neutralTypes: string[];
  riskyTypes: string[];
  score: number;
  rationale: string;
  riskNote: string;
}

export interface UnitPlan {
  id: string;
  floorLabel: string;
  unitName: string;
  areaPy: number;
  suggestedUse: string;
}

export interface TenantRecommendation {
  id: string;
  floorLabel: string;
  category: string;
  size: "소형" | "중형" | "대형" | "중대형";
  score: number;
  tag: string;
  rationale: string;
  recommendationType: RecommendationType;
}

export interface TenantRiskItem {
  id: string;
  text: string;
  severity: "low" | "medium" | "high";
}

export interface PositioningSummary {
  projectId: string;
  headline: string;
  objectiveConclusion: string;
  demandInterpretation: string;
  suitability: Record<"생활밀착형" | "메디컬" | "교육" | "오피스", number>;
  repeatVisitMarket: boolean;
}

export interface SimilarLocation {
  id: string;
  projectId: string;
  name: string;
  similarityScore: number;
  summary: string;
  typeLabel: string;
}

export interface MarketingChannel {
  id: string;
  name: string;
  fit: number;
  budgetIntensity: "저" | "중" | "고";
  goal: string;
  description: string;
}

export interface MarketingPlan {
  id: string;
  projectId: string;
  budget: number;
  objective: "문의 확보" | "방문예약" | "임차인 유치" | "분양 인지도";
  periodWeeks: number;
  channels: MarketingChannel[];
  recommendedOrder: string[];
  avoidedChannels: string[];
  summary: string;
  memo: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  source: string;
  interestedFloor: string;
  interestedType: string;
  status: "신규" | "상담중" | "방문예정" | "조건협의" | "계약임박" | "종료";
  probability: number;
  lastContactDate: string;
  nextAction: string;
  notes: string;
}

export interface LeadMemo {
  id: string;
  leadId: string;
  createdAt: string;
  content: string;
}

export interface ContractDraft {
  id: string;
  projectName?: string;
  contractType: "상가 임대차계약서" | "입점의향서" | "제안협약서" | "마케팅 대행 계약서";
  tenantType: string;
  floorLabel: string;
  deposit: number;
  monthlyRent: number;
  managementFee: number;
  termMonths: number;
  rentFreeMonths: number;
  specialClauses: string[];
  status: "초안" | "검토중" | "수정중" | "완료";
  version: number;
}

export interface ContractTemplate {
  id: string;
  contractType: ContractDraft["contractType"];
  bodyTemplate: string;
  recommendedClauses: string[];
}

export interface CostModel {
  projectId: string;
  landCost: number;
  buildCost: number;
  designCost: number;
  permitCost: number;
  financeCost: number;
  marketingCost: number;
  otherCost: number;
  maintenanceCost: number;
  totalDepositIncome: number;
  monthlyRentIncome: number;
  vacancyRate: number;
  occupancyRate: number;
  rentFreeMonths: number;
  expectedInterestRate: number;
  targetYield: number;
  capRate: number;
}

export interface RevenueScenario {
  scenarioName: "보수형" | "기준형" | "공격형";
  occupancyRate: number;
  effectiveMonthlyIncome: number;
  annualIncome: number;
  paybackYears: number;
  estimatedValue: number;
  warningMessage: string;
}

export interface ProfitSummary {
  totalCost: number;
  effectiveMonthlyIncome: number;
  annualIncome: number;
  paybackYears: number;
  breakEvenYears: number;
  vacancyAdjustedIncome: number;
  estimatedValue: number;
  warnings: string[];
}

export interface ReportItem {
  id: string;
  projectId: string;
  type: "건축주 보고서" | "내부 전략 리포트" | "임차인 유치 제안서" | "수익성 요약 리포트" | "계약 진행 리포트";
  summary: string;
  keySentences: string[];
}

export interface DashboardMetric {
  id: string;
  projectId: string;
  label: string;
  value: string;
  sub: string;
}

export interface AlertItem {
  id: string;
  projectId: string;
  level: "info" | "warning" | "critical";
  text: string;
}
