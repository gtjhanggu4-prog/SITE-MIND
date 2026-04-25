import type { FloorPlan, TenantRecommendation, TenantRiskItem } from "@/src/types/site-mind";

export const floorPlans: FloorPlan[] = [
  { id: "f1", projectId: "p-001", floorLabel: "1F", role: "생활 브랜드", areaPy: 80, sizeMix: "소형+중형", recommendedTypes: ["카페","약국"], neutralTypes: ["소형 F&B"], riskyTypes: ["대형 외식"], score: 93, rationale: "유입 앵커", riskNote: "간판 정책" },
  { id: "f2", projectId: "p-001", floorLabel: "2F", role: "메디컬 코어", areaPy: 70, sizeMix: "중대형", recommendedTypes: ["내과","치과"], neutralTypes: ["피부"], riskyTypes: ["리테일"], score: 94, rationale: "반복 방문", riskNote: "주차 연계" },
  { id: "f3", projectId: "p-002", floorLabel: "1F", role: "생활밀착", areaPy: 75, sizeMix: "소형", recommendedTypes: ["편의점","약국"], neutralTypes: ["베이커리"], riskyTypes: ["대형 카페"], score: 88, rationale: "생활배후", riskNote: "체류형 약함" },
];

export const seedTenantRecommendations: TenantRecommendation[] = [
  { id: "tr1", floorLabel: "1F", category: "프랜차이즈 카페", size: "중형", score: 93, tag: "유입 앵커", rationale: "동선 흡수", recommendationType: "추천" },
  { id: "tr2", floorLabel: "2F", category: "내과", size: "중대형", score: 94, tag: "핵심 수익층", rationale: "반복 내원", recommendationType: "추천" },
];

export const tenantRisks: TenantRiskItem[] = [
  { id: "r1", text: "외식 대형 앵커 단독 의존 리스크", severity: "high" },
  { id: "r2", text: "상층부 일반 리테일 장기 공실 가능성", severity: "high" },
  { id: "r3", text: "간판 난립 시 이미지 저하", severity: "medium" },
  { id: "r4", text: "임대료 과도 설정 위험", severity: "medium" },
];
