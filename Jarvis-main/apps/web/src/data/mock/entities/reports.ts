import type { AlertItem, DashboardMetric, ReportItem } from "@/src/types/site-mind";

export const reports: ReportItem[] = [
  { id: "rep1", projectId: "p-001", type: "건축주 보고서", summary: "포지셔닝 및 층별 MD 구조 최종안", keySentences: [] },
  { id: "rep2", projectId: "p-001", type: "내부 전략 리포트", summary: "임대전략/마케팅/리스크 관리 중심", keySentences: [] },
  { id: "rep3", projectId: "p-001", type: "임차인 유치 제안서", summary: "입지 장점 및 업종 시너지 제안", keySentences: [] },
  { id: "rep4", projectId: "p-001", type: "수익성 요약 리포트", summary: "보수/기준/공격 시나리오 비교", keySentences: [] },
  { id: "rep5", projectId: "p-001", type: "계약 진행 리포트", summary: "리드 상태와 계약 단계 추적", keySentences: [] },
  { id: "rep6", projectId: "p-002", type: "건축주 보고서", summary: "생활밀착 메디컬 중심안", keySentences: [] },
];

export const dashboardMetrics: DashboardMetric[] = [
  { id: "dm1", projectId: "p-001", label: "예상 공실률", value: "18%", sub: "초기 안정화 기준" },
  { id: "dm2", projectId: "p-002", label: "예상 공실률", value: "14%", sub: "생활권 안정형" },
];

export const alerts: AlertItem[] = [
  { id: "a1", projectId: "p-001", level: "warning", text: "상층부 일반 리테일 구성 시 공실 리스크 증가" },
  { id: "a2", projectId: "p-002", level: "info", text: "주거 배후 수요 기반 생활밀착형 유리" },
];
