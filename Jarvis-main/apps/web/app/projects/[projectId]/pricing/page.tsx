import { ReliabilityBadge } from "@/components/ReliabilityBadge";

export default function PricingPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">보증금/월세 추천</h2>
      <ReliabilityBadge score={71.0} />
      <div className="rounded border border-slate-700 p-4 text-sm">
        <p>유닛 U-101: 보증금 1억 / 월세 450만원 (범위 420~480만원)</p>
      </div>
    </div>
  );
}
