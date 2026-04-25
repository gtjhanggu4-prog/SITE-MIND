export function SummaryPanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
        {lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}
