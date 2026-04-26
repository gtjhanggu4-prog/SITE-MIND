export function SummaryPanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-slate-100">{title}</p>
      <ul className="list-disc space-y-1.5 pl-4 text-sm text-slate-300">
        {lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}
