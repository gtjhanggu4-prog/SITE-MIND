import type { PositioningSummary, SimilarLocation } from "@/src/types/site-mind";

export const positioningSummaries: PositioningSummary[] = [
  {
    projectId: "p-001",
    headline: "산업배후 역세권 생활복합 상업지",
    objectiveConclusion: "외식 중심보다 반복 방문형 복합 빌딩이 유리",
    demandInterpretation: "메디컬/교육/생활서비스 반복 수요가 안정적으로 형성",
    suitability: { 생활밀착형: 91, 메디컬: 94, 교육: 88, 오피스: 78 },
    repeatVisitMarket: true,
  },
  {
    projectId: "p-002",
    headline: "주거 배후형 메디컬 생활상권",
    objectiveConclusion: "소형 생활밀착+메디컬 중심 구성이 유리",
    demandInterpretation: "역세권 수요보다 생활권 반복 방문 수요 우위",
    suitability: { 생활밀착형: 93, 메디컬: 89, 교육: 71, 오피스: 64 },
    repeatVisitMarket: true,
  },
];

export const similarLocations: SimilarLocation[] = [
  { id: "s1", projectId: "p-001", name: "평택 고덕국제신도시", similarityScore: 91, summary: "산업배후 역세권 생활복합 코너 상업지", typeLabel: "고덕형" },
  { id: "s2", projectId: "p-001", name: "동탄2 상업지", similarityScore: 84, summary: "신도시 교육/생활 혼합 상권", typeLabel: "동탄형" },
  { id: "s3", projectId: "p-001", name: "세종 나성동", similarityScore: 80, summary: "행정+주거 복합 수요", typeLabel: "세종형" },
  { id: "s4", projectId: "p-002", name: "천안 불당동", similarityScore: 83, summary: "주거배후 생활밀착 상권", typeLabel: "불당형" },
  { id: "s5", projectId: "p-002", name: "세종 소담동", similarityScore: 77, summary: "메디컬/생활형 수요", typeLabel: "소담형" },
];
