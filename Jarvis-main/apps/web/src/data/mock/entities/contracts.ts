import type { ContractDraft, ContractTemplate } from "@/src/types/site-mind";

export const contractTemplates: ContractTemplate[] = [
  { id: "ct1", contractType: "상가 임대차계약서", bodyTemplate: "[상가 임대차계약서]\n프로젝트: {{projectName}}\n업종: {{tenantType}}\n층: {{floorLabel}}\n보증금: {{deposit}}\n월세: {{monthlyRent}}\n관리비: {{managementFee}}\n기간: {{termMonths}}개월\n렌트프리: {{rentFreeMonths}}개월\n{{specialClauses}}", recommendedClauses: ["업종 제한 준수", "간판 가이드 준수", "원상복구 조건"] },
  { id: "ct2", contractType: "입점의향서", bodyTemplate: "[입점의향서]\n업종: {{tenantType}}\n희망층: {{floorLabel}}\n조건: 보증금 {{deposit}} / 월세 {{monthlyRent}}\n{{specialClauses}}", recommendedClauses: ["우선협상권 30일", "자료 비밀유지"] },
  { id: "ct3", contractType: "제안협약서", bodyTemplate: "[제안협약서]\n제안 조건 및 협약 범위\n{{specialClauses}}", recommendedClauses: ["협약 유효기간", "위약 조항"] },
  { id: "ct4", contractType: "마케팅 대행 계약서", bodyTemplate: "[마케팅 대행 계약서]\n목표 업종: {{tenantType}}\n{{specialClauses}}", recommendedClauses: ["성과 리포트 월 1회", "예산 집행 승인"] },
];

export const defaultContractDrafts: (ContractDraft & { projectId: string })[] = [
  { id: "cd1", projectId: "p-001", contractType: "상가 임대차계약서", tenantType: "프랜차이즈 카페", floorLabel: "1F", deposit: 100000000, monthlyRent: 4500000, managementFee: 500000, termMonths: 36, rentFreeMonths: 1, specialClauses: ["간판 디자인 가이드 준수"], status: "초안", version: 1 },
  { id: "cd2", projectId: "p-002", contractType: "입점의향서", tenantType: "약국", floorLabel: "1F", deposit: 80000000, monthlyRent: 3200000, managementFee: 350000, termMonths: 24, rentFreeMonths: 1, specialClauses: ["메디컬 시너지 존 우선배치"], status: "검토중", version: 2 },
];
