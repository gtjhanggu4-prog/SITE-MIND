import type { MarketingChannel, MarketingPlan } from "@/src/types/site-mind";

export const marketingChannels: MarketingChannel[] = [
  { id: "m1", name: "인근 부동산 네트워크", fit: 96, budgetIntensity: "중", goal: "임차 유치", description: "실전 전환율 높음" },
  { id: "m2", name: "네이버 플레이스/검색", fit: 88, budgetIntensity: "중", goal: "인지도", description: "지역 검색 유입" },
  { id: "m3", name: "지역 인스타 광고", fit: 76, budgetIntensity: "중", goal: "브랜드 노출", description: "초기 확산" },
  { id: "m4", name: "현수막/현장 배너", fit: 84, budgetIntensity: "저", goal: "현장 유입", description: "오프라인 유입" },
  { id: "m5", name: "분양/상업 전문 플랫폼", fit: 73, budgetIntensity: "중", goal: "투자 문의", description: "광역 잠재수요" },
  { id: "m6", name: "지역 커뮤니티/맘카페", fit: 72, budgetIntensity: "저", goal: "교육 수요", description: "타겟 커뮤니티" },
  { id: "m7", name: "문자/DB 마케팅", fit: 68, budgetIntensity: "중", goal: "방문예약", description: "기존 DB 재활용" },
];

export const marketingPlans: MarketingPlan[] = [
  {
    id: "mp1",
    projectId: "p-001",
    budget: 1500,
    objective: "임차인 유치",
    periodWeeks: 8,
    channels: marketingChannels,
    recommendedOrder: ["인근 부동산 네트워크", "네이버 플레이스/검색", "현수막/현장 배너"],
    avoidedChannels: ["문자/DB 마케팅"],
    summary: "임차인 유치 중심 혼합전략",
    memo: "초기 4주 집중",
  },
  {
    id: "mp2",
    projectId: "p-002",
    budget: 900,
    objective: "문의 확보",
    periodWeeks: 6,
    channels: marketingChannels,
    recommendedOrder: ["네이버 플레이스/검색", "지역 커뮤니티/맘카페"],
    avoidedChannels: ["분양/상업 전문 플랫폼"],
    summary: "생활권 중심 문의 확보",
    memo: "주거 수요 타깃",
  },
];
