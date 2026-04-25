import type {
  AlertItem,
  ContractDraft,
  ContractTemplate,
  CostModel,
  DevelopmentPlanFile,
  Lead,
  LeadMemo,
  MarketingChannel,
  PositioningSummary,
  Project,
  ReportItem,
  SimilarLocation,
  TenantRecommendation,
  TenantRiskItem,
  FloorPlan,
} from "@/src/types/site-mind";

export const defaultProject: Project = {
  id: "p-001",
  name: "북청주역 게이트 프리미엄 라이프 빌딩",
  address: "청주시 흥덕구 문암로177번길 7 맞은편",
  parcelNumber: "1186",
  assetType: "생활복합 상업시설",
  completionDate: "2028-12-31",
  floorsAbove: 5,
  floorsBelow: 2,
  privateAreaPy: 350,
  commonAreaPy: 120,
  grossAreaPy: 470,
  positioning: "역세권 생활복합 메디컬·에듀·라이프 빌딩",
  nearStation: true,
  stationName: "북청주역",
  industrialDemand: true,
  parkingMemo: "진출입 동선 분리 필요",
  notes: "산업배후 수요 유입 강함",
};

export const floorPlans: FloorPlan[] = [
  { id: "f-b2", projectId: "p-001", floorLabel: "B2", role: "주차/기계실/창고", areaPy: 90, sizeMix: "대형", recommendedTypes: ["주차", "창고"], neutralTypes: ["보조시설"], riskyTypes: ["리테일"], score: 72, rationale: "운영기반층", riskNote: "고객동선 분리 필요" },
  { id: "f-b1", projectId: "p-001", floorLabel: "B1", role: "주차/보조시설", areaPy: 90, sizeMix: "대형", recommendedTypes: ["주차", "보조시설"], neutralTypes: ["소형 서비스"], riskyTypes: ["메인 리테일"], score: 74, rationale: "접근성 보조", riskNote: "직관적 사인 필요" },
  { id: "f-1", projectId: "p-001", floorLabel: "1F", role: "생활 브랜드", areaPy: 80, sizeMix: "소형+중형", recommendedTypes: ["카페", "약국", "편의점"], neutralTypes: ["소형 F&B"], riskyTypes: ["대형 외식"], score: 93, rationale: "유입 앵커층", riskNote: "간판 정책 필요" },
  { id: "f-2", projectId: "p-001", floorLabel: "2F", role: "메디컬 코어", areaPy: 70, sizeMix: "중대형", recommendedTypes: ["내과", "치과", "소아과"], neutralTypes: ["피부/미용"], riskyTypes: ["일반 리테일"], score: 94, rationale: "반복 방문 핵심", riskNote: "주차 연계 중요" },
  { id: "f-3", projectId: "p-001", floorLabel: "3F", role: "교육·웰니스", areaPy: 70, sizeMix: "중대형", recommendedTypes: ["학원", "스터디", "필라테스"], neutralTypes: ["오피스"], riskyTypes: ["야간주점"], score: 88, rationale: "목적 방문 유리", riskNote: "방문 시간대 편차" },
  { id: "f-4", projectId: "p-001", floorLabel: "4F", role: "대형 교육/집객", areaPy: 70, sizeMix: "대형", recommendedTypes: ["대형 학원", "교육센터"], neutralTypes: ["중형 오피스"], riskyTypes: ["소규모 분절"], score: 82, rationale: "면적 활용 중요", riskNote: "공실시 전환 난이도" },
  { id: "f-5", projectId: "p-001", floorLabel: "5F", role: "오피스/예약형", areaPy: 70, sizeMix: "중형", recommendedTypes: ["상담센터", "오피스"], neutralTypes: ["교육"], riskyTypes: ["충동소비형"], score: 79, rationale: "안정 임차형", riskNote: "엘리베이터 체감" },
];

export const tenantRecommendations: TenantRecommendation[] = [
  { id: "t-1", floorLabel: "1F", category: "프랜차이즈 카페", size: "중형", score: 93, tag: "유입 앵커", rationale: "출근/퇴근 동선 흡수", recommendationType: "추천" },
  { id: "t-2", floorLabel: "1F", category: "약국", size: "소형", score: 91, tag: "메디컬 연계", rationale: "2층 메디컬 시너지", recommendationType: "추천" },
  { id: "t-3", floorLabel: "2F", category: "내과", size: "중대형", score: 94, tag: "핵심 수익층", rationale: "반복 내원형", recommendationType: "추천" },
  { id: "t-4", floorLabel: "3F", category: "스터디센터", size: "중대형", score: 86, tag: "학부모 수요", rationale: "교육 수요 흡수", recommendationType: "중립" },
  { id: "t-5", floorLabel: "4F", category: "대형 외식", size: "대형", score: 42, tag: "과도한 리스크", rationale: "상층부 외식 체류 리스크", recommendationType: "위험" },
];

export const tenantRisks: TenantRiskItem[] = [
  { id: "r1", text: "외식 대형 앵커 단독 의존 리스크", severity: "high" },
  { id: "r2", text: "상층부 일반 리테일 장기 공실 가능성", severity: "high" },
  { id: "r3", text: "간판 난립 시 건물 이미지 저하", severity: "medium" },
  { id: "r4", text: "역세권 기대감 과대반영 임대료 위험", severity: "medium" },
];

export const similarLocations: SimilarLocation[] = [
  { id: "s1", projectId: "p-001", name: "평택 고덕국제신도시", similarityScore: 91, summary: "산업배후 역세권 생활복합 코너 상업지", typeLabel: "고덕형" },
  { id: "s2", projectId: "p-001", name: "동탄2 상업지", similarityScore: 84, summary: "신도시 교육/생활 혼합 상권", typeLabel: "동탄형" },
  { id: "s3", projectId: "p-001", name: "세종 나성동", similarityScore: 80, summary: "행정+주거 복합 수요", typeLabel: "세종형" },
];

export const positioningSummary: PositioningSummary = {
  projectId: "p-001",
  headline: "산업배후 역세권 생활복합 상업지",
  objectiveConclusion: "외식 중심보다 반복 방문형 복합 빌딩이 유리",
  demandInterpretation: "메디컬/교육/생활서비스 반복 수요가 안정적으로 형성",
  suitability: { 생활밀착형: 91, 메디컬: 94, 교육: 88, 오피스: 78 },
  repeatVisitMarket: true,
};

export const marketingChannels: MarketingChannel[] = [
  { id: "m1", name: "인근 부동산 네트워크", fit: 96, budgetIntensity: "중", goal: "임차 유치", description: "실제 계약 전환율이 높은 채널" },
  { id: "m2", name: "네이버 플레이스/검색", fit: 88, budgetIntensity: "중", goal: "인지도", description: "지역 검색 기반 노출" },
  { id: "m3", name: "지역 인스타 광고", fit: 76, budgetIntensity: "중", goal: "브랜드 노출", description: "초기 인지도 확산" },
  { id: "m4", name: "현수막/현장 배너", fit: 84, budgetIntensity: "저", goal: "현장 유입", description: "오프라인 직접 유입" },
  { id: "m5", name: "분양/상업 전문 플랫폼", fit: 73, budgetIntensity: "중", goal: "투자 문의", description: "광역 잠재 수요 확보" },
  { id: "m6", name: "지역 커뮤니티/맘카페", fit: 72, budgetIntensity: "저", goal: "교육 수요", description: "타겟 커뮤니티 접근" },
  { id: "m7", name: "문자/DB 마케팅", fit: 68, budgetIntensity: "중", goal: "방문예약", description: "기존 DB 재활용" },
];

export const leads: Lead[] = [
  { id: "l1", name: "청주메디케어", contact: "010-1111-1111", source: "중개업소", interestedFloor: "2F", interestedType: "내과", status: "조건협의", probability: 82, lastContactDate: "2026-04-20", nextAction: "임대조건 조정안 전달", notes: "주차 확보 여부 문의" },
  { id: "l2", name: "스터디허브", contact: "010-2222-2222", source: "네이버", interestedFloor: "3F", interestedType: "스터디센터", status: "상담중", probability: 61, lastContactDate: "2026-04-21", nextAction: "현장 투어 일정 확정", notes: "오후 시간대 유입 확인 필요" },
  { id: "l3", name: "고덕약국 체인", contact: "010-3333-3333", source: "네트워크", interestedFloor: "1F", interestedType: "약국", status: "계약임박", probability: 93, lastContactDate: "2026-04-19", nextAction: "계약서 초안 검토", notes: "렌트프리 1개월 요구" },
];

export const leadMemos: LeadMemo[] = [
  { id: "lm1", leadId: "l1", createdAt: "2026-04-20", content: "주차 동선 자료 제공 요청" },
  { id: "lm2", leadId: "l2", createdAt: "2026-04-21", content: "면적표 전달 완료" },
];

export const developmentFiles: DevelopmentPlanFile[] = [
  { id: "file1", projectId: "p-001", name: "배치도_v1.pdf", type: "application/pdf", uploadedAt: "2026-04-20 10:10", status: "업로드 완료", category: "개발계획 맵", analysisNote: "유사입지 분석 대기" },
  { id: "file2", projectId: "p-001", name: "층별평면도.dwg", type: "application/acad", uploadedAt: "2026-04-20 11:00", status: "분석 준비중", category: "평면도/PDF", analysisNote: "도면 파싱 진행" },
  { id: "file3", projectId: "p-001", name: "면적표.xlsx", type: "application/xlsx", uploadedAt: "2026-04-20 11:20", status: "분석 대기중", category: "면적표", analysisNote: "면적 검증 대기" },
];

export const contractTemplates: ContractTemplate[] = [
  { id: "ct1", contractType: "상가 임대차계약서", bodyTemplate: "[상가 임대차계약서]\n임대인: SITE MIND\n임차인: {{tenantType}}\n층: {{floorLabel}}\n보증금: {{deposit}}원\n월세: {{monthlyRent}}원\n관리비: {{managementFee}}원\n계약기간: {{termMonths}}개월\n렌트프리: {{rentFreeMonths}}개월", recommendedClauses: ["업종 제한 준수", "간판 가이드 준수", "원상복구 조건"] },
  { id: "ct2", contractType: "입점의향서", bodyTemplate: "[입점의향서]\n입점희망 업종: {{tenantType}}\n희망층: {{floorLabel}}\n조건: 보증금 {{deposit}} / 월세 {{monthlyRent}}", recommendedClauses: ["우선협상권 30일", "자료 비밀유지"] },
  { id: "ct3", contractType: "제안협약서", bodyTemplate: "[제안협약서]\n양 당사자는 아래 조건으로 협약한다...", recommendedClauses: ["협약 유효기간", "위약 조항"] },
  { id: "ct4", contractType: "마케팅 대행 계약서", bodyTemplate: "[마케팅 대행 계약서]\n목표: {{tenantType}}", recommendedClauses: ["성과 리포트 월 1회", "예산 집행 승인"] },
];

export const defaultContractDraft: ContractDraft = {
  id: "cd1",
  contractType: "상가 임대차계약서",
  tenantType: "프랜차이즈 카페",
  floorLabel: "1F",
  deposit: 100000000,
  monthlyRent: 4500000,
  managementFee: 500000,
  termMonths: 36,
  rentFreeMonths: 1,
  specialClauses: ["간판 디자인 가이드 준수"],
  status: "초안",
  version: 1,
};

export const contractVersionHistory = [
  { version: 1, status: "초안", note: "초기 생성" },
  { version: 2, status: "검토중", note: "임차인 요청 반영" },
];

export const defaultCostModel: CostModel = {
  projectId: "p-001",
  landCost: 2600000000,
  buildCost: 4100000000,
  designCost: 180000000,
  permitCost: 120000000,
  financeCost: 350000000,
  marketingCost: 90000000,
  otherCost: 110000000,
  maintenanceCost: 30000000,
  totalDepositIncome: 1250000000,
  monthlyRentIncome: 42000000,
  vacancyRate: 18,
  occupancyRate: 82,
  rentFreeMonths: 1,
  expectedInterestRate: 4.1,
  targetYield: 6.8,
  capRate: 5.4,
};

export const reports: ReportItem[] = [
  {
    id: "rep1",
    projectId: "p-001",
    type: "건축주 보고서",
    summary: "포지셔닝 및 층별 MD 구조 최종안",
    keySentences: [
      "본 부지는 북청주역 게이트형 생활복합 빌딩으로 포지셔닝하는 것이 적합함",
      "1층 브랜드 생활업종, 2층 메디컬, 3층 교육·웰니스 구조가 유력함",
    ],
  },
  {
    id: "rep2",
    projectId: "p-001",
    type: "내부 전략 리포트",
    summary: "임대전략/마케팅/리스크 관리 중심",
    keySentences: ["외식 중심보다 반복 방문형 상권 구조가 더 안정적임"],
  },
  {
    id: "rep3",
    projectId: "p-001",
    type: "임차인 유치 제안서",
    summary: "입지 장점 및 업종 시너지 제안",
    keySentences: ["메디컬·교육 업종의 장기 안정성이 높음"],
  },
  { id: "rep4", projectId: "p-001", type: "수익성 요약 리포트", summary: "보수/기준/공격 시나리오 비교", keySentences: ["기준형 시나리오 기준 회수기간 11~12년"] },
  { id: "rep5", projectId: "p-001", type: "계약 진행 리포트", summary: "리드 상태와 계약 단계 추적", keySentences: ["계약임박 리드 1건, 조건협의 1건"] },
];

export const alerts: AlertItem[] = [
  { id: "a1", projectId: "p-001", level: "warning", text: "상층부 일반 리테일 구성 시 공실 리스크 증가" },
  { id: "a2", projectId: "p-001", level: "info", text: "2층 메디컬 앵커 유치 시 1층 약국 시너지 예상" },
];
