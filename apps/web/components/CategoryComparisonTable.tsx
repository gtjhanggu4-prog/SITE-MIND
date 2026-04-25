export function CategoryComparisonTable() {
  return (
    <div className="overflow-x-auto rounded border border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900 text-slate-300">
          <tr>
            <th className="p-2 text-left">업종</th>
            <th className="p-2">밴드</th>
            <th className="p-2">적합도</th>
            <th className="p-2">포화도</th>
            <th className="p-2">기회도</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-800"><td className="p-2">카페</td><td className="p-2 text-emerald-300">추천</td><td className="p-2">82.5</td><td className="p-2">41.3</td><td className="p-2">78.4</td></tr>
          <tr className="border-t border-slate-800"><td className="p-2">디저트</td><td className="p-2 text-rose-300">위험</td><td className="p-2">52.1</td><td className="p-2">88.0</td><td className="p-2">35.2</td></tr>
        </tbody>
      </table>
    </div>
  );
}
