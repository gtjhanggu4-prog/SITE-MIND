import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="rounded-2xl border-slate-200/80 bg-gradient-to-b from-white to-slate-50/40">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}
