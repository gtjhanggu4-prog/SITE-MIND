import { ManualAdjustmentPanel } from "@/components/ManualAdjustmentPanel";
import { ReliabilityBadge } from "@/components/ReliabilityBadge";
import { UnsuitableCard } from "@/components/UnsuitableCard";

export default function TenantValidationPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">입점 검증</h2>
      <ReliabilityBadge score={72.8} warning />
      <div className="rounded border border-slate-700 p-4">검증 점수: 68.4 (중립)</div>
      <UnsuitableCard />
      <ManualAdjustmentPanel />
    </div>
  );
}
