export function JobStatusCard() {
  return (
    <div className="rounded border border-slate-700 p-4 text-sm">
      <p className="font-semibold">분석 작업 상태</p>
      <p>job_01KOMOS0001</p>
      <p className="text-amber-300">running (57%)</p>
      <p className="text-slate-400">partial 데이터 표시 중</p>
    </div>
  );
}
