import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}
