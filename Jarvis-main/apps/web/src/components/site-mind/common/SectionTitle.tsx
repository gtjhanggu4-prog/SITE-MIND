export function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
    </div>
  );
}
