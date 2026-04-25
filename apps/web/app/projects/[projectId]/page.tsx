import Link from "next/link";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">프로젝트 개요: {projectId}</h1>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Link href={`/projects/${projectId}/zoning`} className="rounded border border-slate-700 p-3">용도지역 1차 스크리닝</Link>
        <Link href={`/projects/${projectId}/category-comparison`} className="rounded border border-slate-700 p-3">업종 비교 분석</Link>
        <Link href={`/projects/${projectId}/tenant-validation`} className="rounded border border-slate-700 p-3">입점 검증</Link>
        <Link href={`/projects/${projectId}/pricing`} className="rounded border border-slate-700 p-3">보증금/월세 추천</Link>
        <Link href={`/projects/${projectId}/crm`} className="rounded border border-slate-700 p-3">CRM 리드 요약</Link>
        <Link href={`/projects/${projectId}/reports`} className="rounded border border-slate-700 p-3">리포트 요약</Link>
      </div>
    </div>
  );
}
