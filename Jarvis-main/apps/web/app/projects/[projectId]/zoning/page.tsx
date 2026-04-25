import { ModeToggle } from "@/components/ModeToggle";

export default function ZoningPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">용도지역 1차 스크리닝</h2>
      <ModeToggle />
      <div className="rounded border border-slate-700 p-4">
        <p>결과: caution</p>
        <p>운영자 메시지: 주차 산정 기준 추가 검토</p>
      </div>
    </div>
  );
}
