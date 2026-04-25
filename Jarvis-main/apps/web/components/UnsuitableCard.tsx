export function UnsuitableCard() {
  return (
    <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-4">
      <h3 className="font-semibold text-rose-300">비적합 업종 카드: 디저트 카페</h3>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-200">
        <li>포화 사유: 500m 내 동종 18개</li>
        <li>인구 미스매치: 핵심 소비 연령대 비중 낮음</li>
        <li>대안 업종: 베이커리, 브런치</li>
      </ul>
    </div>
  );
}
