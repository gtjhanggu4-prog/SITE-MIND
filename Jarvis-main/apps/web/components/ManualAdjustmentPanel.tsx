export function ManualAdjustmentPanel() {
  return (
    <div className="rounded border border-slate-700 bg-slate-900 p-4">
      <h3 className="mb-2 font-semibold">수동 조정</h3>
      <p className="text-sm text-slate-300">모듈: 가격 추천 / 필드: 월세 / 사유코드 필수</p>
      <button className="mt-3 rounded bg-indigo-600 px-3 py-1 text-sm">조정 요청 생성</button>
    </div>
  );
}
