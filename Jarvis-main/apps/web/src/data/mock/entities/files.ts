import type { DevelopmentPlanFile } from "@/src/types/site-mind";

export const developmentFiles: DevelopmentPlanFile[] = [
  { id: "file1", projectId: "p-001", name: "배치도_v1.pdf", type: "application/pdf", uploadedAt: "2026-04-20 10:10", status: "업로드 완료", category: "개발계획 맵", analysisNote: "유사입지 분석 대기" },
  { id: "file2", projectId: "p-001", name: "층별평면도.dwg", type: "application/acad", uploadedAt: "2026-04-20 11:00", status: "분석 준비중", category: "평면도/PDF", analysisNote: "도면 파싱 진행" },
  { id: "file3", projectId: "p-001", name: "면적표.xlsx", type: "application/xlsx", uploadedAt: "2026-04-20 11:20", status: "분석 대기중", category: "면적표", analysisNote: "면적 검증 대기" },
  { id: "file4", projectId: "p-002", name: "오창_배치도.pdf", type: "application/pdf", uploadedAt: "2026-04-18 09:30", status: "업로드 완료", category: "개발계획 맵", analysisNote: "검토 완료" },
  { id: "file5", projectId: "p-002", name: "오창_참고자료.zip", type: "application/zip", uploadedAt: "2026-04-18 10:00", status: "검토 필요", category: "참고자료", analysisNote: "수동 검토 필요" },
];
