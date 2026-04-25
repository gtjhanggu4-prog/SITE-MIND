import type { Lead, LeadMemo } from "@/src/types/site-mind";

export const leads: (Lead & { projectId: string })[] = [
  { id: "l1", projectId: "p-001", name: "청주메디케어", contact: "010-1111-1111", source: "중개업소", interestedFloor: "2F", interestedType: "내과", status: "조건협의", probability: 82, lastContactDate: "2026-04-20", nextAction: "임대조건 조정안 전달", notes: "주차 확보 여부 문의" },
  { id: "l2", projectId: "p-001", name: "스터디허브", contact: "010-2222-2222", source: "네이버", interestedFloor: "3F", interestedType: "스터디센터", status: "상담중", probability: 61, lastContactDate: "2026-04-21", nextAction: "현장 투어 일정 확정", notes: "면적표 전달" },
  { id: "l3", projectId: "p-002", name: "오창약국", contact: "010-7777-1212", source: "네트워크", interestedFloor: "1F", interestedType: "약국", status: "신규", probability: 55, lastContactDate: "2026-04-22", nextAction: "초기 상담", notes: "계약조건 문의" },
];

export const leadMemos: LeadMemo[] = [
  { id: "lm1", leadId: "l1", createdAt: "2026-04-20", content: "주차 동선 자료 제공" },
  { id: "lm2", leadId: "l2", createdAt: "2026-04-21", content: "면적표 전달" },
];
