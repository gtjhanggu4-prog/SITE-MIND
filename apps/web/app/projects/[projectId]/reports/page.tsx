import { ModeToggle } from "@/components/ModeToggle";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">리포트 요약</h2>
      <ModeToggle />
      <div className="rounded border border-slate-700 p-4 text-sm">
        <p>8개 섹션 구성 완료</p>
        <p>증거 커버리지: 92%</p>
      </div>
    </div>
  );
}
