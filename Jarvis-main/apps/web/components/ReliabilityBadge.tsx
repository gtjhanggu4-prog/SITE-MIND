export function ReliabilityBadge({ score, warning }: { score: number; warning?: boolean }) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-900 p-3 text-sm">
      <p className="font-semibold">신뢰도 {score.toFixed(1)}</p>
      <p className={warning ? "text-amber-300" : "text-emerald-300"}>
        {warning ? "수동 검토 권장" : "자동 분석 신뢰 가능"}
      </p>
    </div>
  );
}
