"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Building2, MapPinned, Store, Target, Megaphone, Users, Wallet, FileText, BarChart3, Settings, Search, Upload, Copy, FileOutput } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SectionTitle } from "@/src/components/site-mind/common/SectionTitle";
import { MetricCard } from "@/src/components/site-mind/common/MetricCard";
import { StatusBadge } from "@/src/components/site-mind/common/StatusBadge";
import { EmptyState } from "@/src/components/site-mind/common/EmptyState";
import { MoneyInput } from "@/src/components/site-mind/common/MoneyInput";
import { SummaryPanel } from "@/src/components/site-mind/common/SummaryPanel";
import { formatMoney, formatPercent } from "@/src/lib/format";
import { formatReportSummary } from "@/src/lib/reportFormatter";
import { useSiteMindState } from "@/src/hooks/useSiteMindState";
import type { Lead } from "@/src/types/site-mind";

const menus = [
  ["dashboard", "대시보드", LayoutDashboard],
  ["project", "프로젝트", Building2],
  ["plan", "개발계획 분석", Upload],
  ["location", "상권·입지 분석", MapPinned],
  ["tenant", "업종 추천/검증", Store],
  ["strategy", "분양·임대 전략", Target],
  ["marketing", "마케팅 실행", Megaphone],
  ["crm", "CRM", Users],
  ["profit", "수익·자산관리", Wallet],
  ["contracts", "계약관리", FileText],
  ["reports", "리포트", BarChart3],
  ["settings", "설정", Settings],
] as const;

export function SiteMindMvp() {
  const vm = useSiteMindState();

  if (vm.loading || !vm.project || !vm.costModel || !vm.contractDraft || !vm.positioningSummary || !vm.profitSummary) {
    return <div className="p-8 text-sm text-slate-500">불러오는 중...</div>;
  }

  const onProjectInput = (key: keyof typeof vm.project, value: string | number | boolean) => {
    vm.setProject((prev) => ({ ...prev, [key]: value }));
  };

  const onCostInput = (key: keyof typeof vm.costModel, value: number) => {
    vm.setCostModel((prev) => ({ ...prev, [key]: value }));
  };

  const addLead = () => {
    const newLead: Lead = {
      id: `new-${Date.now()}`,
      name: "신규 리드",
      contact: "010-0000-0000",
      source: "직접입력",
      interestedFloor: "1F",
      interestedType: "카페",
      status: "신규",
      probability: 40,
      lastContactDate: new Date().toISOString().slice(0, 10),
      nextAction: "초기 상담",
      notes: "",
    };
    void vm.addLead(newLead);
  };

  const saveStateLabel = vm.saveState === "saved" ? "저장됨" : vm.saveState === "saving" ? "저장 중" : "저장 필요";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-12">
        <aside className="col-span-12 border-b border-slate-200 bg-white p-4 lg:col-span-2 lg:border-b-0 lg:border-r">
          <h1 className="mb-4 text-lg font-semibold">SITE MIND</h1>
          <div className="grid gap-1">
            {menus.map(([key, label, Icon]) => (
              <button key={key} onClick={() => vm.setActiveMenu(key)} className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm ${vm.activeMenu === key ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="col-span-12 p-4 lg:col-span-10 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <select className="rounded border p-2" value={vm.dataSource} onChange={(e) => vm.setDataSource(e.target.value as "mock" | "supabase")}>
                <option value="mock">mock</option>
                <option value="supabase">supabase</option>
              </select>
              <select className="rounded border p-2" value={vm.selectedProjectId} onChange={(e) => vm.setSelectedProjectId(e.target.value)}>
                <option value="p-001">p-001</option>
                <option value="p-002">p-002</option>
              </select>
              <Button variant="outline" onClick={() => vm.reload()}>불러오기</Button>
              <Button onClick={() => vm.saveCurrentMenu()} disabled={vm.saving}>{vm.saving ? "저장중..." : "현재 화면 저장"}</Button>
              <Badge variant="secondary">source: {vm.repositorySource}</Badge>
              <Badge variant={vm.saveState === "saved" ? "default" : vm.saveState === "saving" ? "secondary" : "outline"}>{saveStateLabel}</Badge>
              <span className="text-[11px] text-slate-500">마지막 저장: {vm.lastSavedAt ? new Date(vm.lastSavedAt).toLocaleString("ko-KR") : "-"}</span>
              {vm.error ? <span className="text-red-500">{vm.error}</span> : null}
            </div>
            <Card className="mb-6 rounded-3xl border-slate-200">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500">프로젝트</p>
                <h2 className="text-2xl font-semibold">{vm.project.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{vm.project.address} / {vm.project.parcelNumber}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-slate-900">{vm.project.positioning}</Badge>
                  <Badge variant="secondary" className="rounded-full">완공 {vm.project.completionDate}</Badge>
                  <Badge variant="outline" className="rounded-full">{vm.project.floorsBelow}B / {vm.project.floorsAbove}F</Badge>
                </div>
              </CardContent>
            </Card>

            {vm.activeMenu === "dashboard" && (
              <div className="space-y-5">
                <SectionTitle title="통합 대시보드" desc="건축주 의사결정을 위한 핵심 지표" />
                <div className="grid gap-3 lg:grid-cols-2">
                  <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">빠른 시작</p><div className="mt-2 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => vm.setActiveMenu("project")}>프로젝트 편집</Button><Button size="sm" variant="outline" onClick={() => vm.setActiveMenu("plan")}>파일 분석</Button><Button size="sm" variant="outline" onClick={() => vm.setActiveMenu("reports")}>리포트 보기</Button></div><p className="mt-2 text-xs text-slate-500">설치형(EXE) 첫 화면에서 최근 작업 이어하기를 고려한 홈 접근 카드</p></CardContent></Card>
                  <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">최근 프로젝트</p><div className="mt-2 space-y-1">{vm.recentProjects.length === 0 ? <p className="text-xs text-slate-500">최근 프로젝트 없음</p> : vm.recentProjects.slice(0, 4).map((p) => <button key={p.id} className="block text-left text-xs text-slate-700 hover:underline" onClick={() => vm.setSelectedProjectId(p.id)}>{p.name} · {new Date(p.lastOpenedAt).toLocaleString("ko-KR")}</button>)}</div></CardContent></Card>
                </div>
                <div className="grid gap-3 lg:grid-cols-3">
                  <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">최근 리포트</p>{vm.recentReports.length === 0 ? <p className="text-xs text-slate-500">없음</p> : vm.recentReports.slice(0, 3).map((r) => <p key={`${r.id}-${r.viewedAt}`} className="text-xs">{r.reportType}</p>)}</CardContent></Card>
                  <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">최근 계약 초안</p>{vm.recentContracts.length === 0 ? <p className="text-xs text-slate-500">없음</p> : vm.recentContracts.slice(0, 3).map((c) => <p key={`${c.id}-${c.viewedAt}`} className="text-xs">{c.contractType}</p>)}</CardContent></Card>
                  <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">데스크톱 앱 상태</p><p className="text-xs text-slate-500">Electron 연결: {vm.isElectronConnected ? "연결됨" : "브라우저 모드"}</p><p className="text-xs text-slate-500">로컬 저장 경로: {vm.settings.savePath}</p><p className="text-xs text-slate-500">마지막 자동저장: {vm.lastSavedAt ? new Date(vm.lastSavedAt).toLocaleString("ko-KR") : "-"}</p><p className="text-xs text-slate-500">마지막 백업: {vm.lastBackupAt ? new Date(vm.lastBackupAt).toLocaleString("ko-KR") : "-"}</p><Button size="sm" className="mt-2" variant="outline" onClick={() => vm.runBackup()}>지금 백업 기록</Button></CardContent></Card>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="예상 공실률" value={formatPercent(vm.projectSummary.vacancyRate)} sub="초기 안정화 기준" />
                  <MetricCard label="권장 핵심 업종" value={vm.projectSummary.coreCategories} sub="반복 방문형" />
                  <MetricCard label="유사 입지 타입" value={vm.projectSummary.similarType} sub="전국 비교" />
                  <MetricCard label="업로드 파일 수" value={`${vm.projectSummary.uploadedFiles}개`} sub="분석 준비도" />
                  <MetricCard label="총 사업비" value={formatMoney(vm.profitSummary.totalCost)} sub="입력값 기반" />
                  <MetricCard label="실효 월 임대수입" value={formatMoney(vm.profitSummary.effectiveMonthlyIncome)} sub="공실/렌트프리 반영" />
                  <MetricCard label="회수기간" value={`${vm.profitSummary.paybackYears.toFixed(1)}년`} sub="단순 추정" />
                  <MetricCard label="자산가치(캡레이트)" value={formatMoney(vm.profitSummary.estimatedValue)} sub="기준형" />
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <SummaryPanel title="핵심 리스크 Top 4" lines={vm.tenantRisks.slice(0, 4).map((r) => r.text)} />
                  <SummaryPanel title="추천 업종 Top 5" lines={vm.filteredTenants.slice(0, 5).map((t) => `${t.floorLabel} ${t.category} (${t.score})`)} />
                  <SummaryPanel title="권장 실행안 요약" lines={[vm.marketingPlan.summary, `추천 우선순위: ${vm.marketingPlan.recommendedOrder.join(" → ")}`, `계약 상태: ${vm.contractDraft.status}`, `리드 현황: ${vm.leads.length}건`]} />
                </div>
                {vm.alerts.map((a) => <div key={a.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm">{a.text}</div>)}
              </div>
            )}

            {vm.activeMenu === "project" && (
              <div className="space-y-4">
                <SectionTitle title="프로젝트 관리" desc="입력 즉시 상태 반영" />
                <div className="grid gap-3 md:grid-cols-2">
                  {([
                    ["name", "프로젝트명"], ["address", "주소"], ["parcelNumber", "필지번호"], ["assetType", "자산 유형"], ["completionDate", "완공 예정일"],
                    ["positioning", "포지셔닝"], ["stationName", "역명"], ["parkingMemo", "주차 메모"], ["notes", "자유 메모"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="text-sm">{label}<Input value={String(vm.project[key])} onChange={(e) => onProjectInput(key, e.target.value)} /></label>
                  ))}
                  <label className="text-sm">지상층 수<Input type="number" value={vm.project.floorsAbove} onChange={(e) => onProjectInput("floorsAbove", Number(e.target.value))} /></label>
                  <label className="text-sm">지하층 수<Input type="number" value={vm.project.floorsBelow} onChange={(e) => onProjectInput("floorsBelow", Number(e.target.value))} /></label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => vm.saveCurrentMenu()} disabled={vm.saving}>저장</Button>
                  <Button variant="outline" onClick={() => vm.resetProject()}>리셋</Button>
                </div>
                {vm.projectDirty ? <p className="text-xs text-amber-600">저장되지 않은 변경사항이 있습니다.</p> : <p className="text-xs text-emerald-600">저장된 상태입니다.</p>}
                {vm.projectValidation.length > 0 ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-600">{vm.projectValidation.join(" / ")}</div>
                ) : null}
              </div>
            )}

            {vm.activeMenu === "plan" && (
              <div className="space-y-4">
                <SectionTitle title="개발계획 분석" desc="업로드/상태관리 중심" />
                <div className="flex gap-2">
                  {(["전체", "개발계획 맵", "평면도/PDF", "면적표", "참고자료"] as const).map((f) => (
                    <Button key={f} variant={vm.fileFilter === f ? "default" : "outline"} onClick={() => vm.setFileFilter(f)}>{f}</Button>
                  ))}
                </div>
                <Button onClick={() => vm.addFile({ id: `file-${Date.now()}`, projectId: vm.project.id, name: "새파일.pdf", type: "application/pdf", uploadedAt: new Date().toLocaleString("ko-KR"), status: "분석 대기중", category: "참고자료" })}>파일 추가(Mock)</Button>
                <p className="text-xs text-slate-500">현재 필터 파일 {vm.filteredFiles.length}개 / 전체 {vm.files.length}개</p>
                <div className="grid gap-3">
                  {vm.filteredFiles.length === 0 ? <EmptyState message="조건에 맞는 파일이 없습니다." /> : vm.filteredFiles.map((f) => (
                    <Card key={f.id} className={`rounded-2xl ${vm.selectedFileId === f.id ? "border-slate-900" : ""}`} onClick={() => vm.setSelectedFileId(f.id)}><CardContent className="flex items-center justify-between p-4"><div><p className="font-medium">{f.name}</p><p className="text-xs text-slate-500">{f.category} · {f.uploadedAt}</p></div><div className="flex items-center gap-2"><StatusBadge status={f.status} /><Button variant="outline" onClick={() => vm.removeFile(f.id)}>삭제</Button></div></CardContent></Card>
                  ))}
                </div>
                <SummaryPanel title="분석 상태" lines={[`선택 파일: ${vm.selectedFile?.name ?? "없음"}`, "전국 유사 입지 분석 상태: 준비중", "도면 해석 상태: 준비중", "상권 진화 타임라인: 준비중"]} />
                <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">최근 열람 파일</p>{vm.recentFiles.length === 0 ? <p className="text-xs text-slate-500">최근 열람 기록 없음</p> : <div className="mt-2 space-y-1">{vm.recentFiles.slice(0, 5).map((f) => <p key={`${f.id}-${f.openedAt}`} className="text-xs">{f.fileName} · {new Date(f.openedAt).toLocaleString("ko-KR")}</p>)}</div>}</CardContent></Card>
              </div>
            )}

            {vm.activeMenu === "location" && (
              <div className="space-y-4">
                <SectionTitle title="상권·입지 분석" desc="유사 입지 및 수요 구조" />
                <Card className="rounded-2xl"><CardContent className="p-4"><p className="font-semibold">{vm.positioningSummary.headline}</p><p className="text-sm text-slate-600">{vm.positioningSummary.objectiveConclusion}</p><p className="mt-2 text-sm">{vm.positioningSummary.demandInterpretation}</p></CardContent></Card>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(vm.positioningSummary.suitability).map(([k, v]) => <Card key={k} className="rounded-2xl"><CardContent className="p-4"><p className="text-sm">{k}</p><Progress value={v} /><p className="mt-1 text-sm">{v}점</p></CardContent></Card>)}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Card className="rounded-2xl"><CardContent className="p-4 text-sm">반복 방문형 시장 여부: <b>{vm.positioningSummary.repeatVisitMarket ? "예" : "아니오"}</b></CardContent></Card>
                  <Card className="rounded-2xl"><CardContent className="p-4 text-sm">핵심 리스크: {vm.tenantRisks.slice(0, 2).map((r) => r.text).join(" / ")}</CardContent></Card>
                </div>
                <div className="grid gap-3">{vm.similarLocations.map((s) => <Card key={s.id} className="rounded-2xl"><CardContent className="p-4"><p className="font-medium">{s.name} ({s.typeLabel})</p><p className="text-sm text-slate-600">유사도 {s.similarityScore}% · {s.summary}</p></CardContent></Card>)}</div>
              </div>
            )}

            {vm.activeMenu === "tenant" && (
              <div className="space-y-4">
                <SectionTitle title="업종 추천/검증" desc="층별 추천·중립·위험 분류" />
                <div className="rounded-2xl border border-slate-200 p-3">
                  <Search className="mr-2 inline h-4 w-4" /><Input value={vm.tenantQuery} onChange={(e) => vm.setTenantQuery(e.target.value)} placeholder="층/업종/태그 검색" className="inline w-[90%]" />
                </div>
                <div className="grid gap-3">{vm.filteredTenants.length === 0 ? <EmptyState message="추천 결과가 없습니다." /> : vm.filteredTenants.map((t) => <Card key={t.id} className="rounded-2xl"><CardContent className="p-4"><div className="flex items-center justify-between"><p className="font-medium">{t.floorLabel} · {t.category}</p><Badge variant={t.recommendationType === "추천" ? "default" : t.recommendationType === "중립" ? "secondary" : "outline"}>{t.recommendationType}</Badge></div><p className="text-sm text-slate-600">규모 {t.size} · 점수 {t.score} · {t.tag}</p><p className="mt-1 text-sm">{t.rationale}</p></CardContent></Card>)}</div>
                <div className="grid gap-3 md:grid-cols-2">{vm.floorPlans.map((f) => <Card key={f.id} className="rounded-2xl"><CardContent className="p-4 text-sm"><p className="font-semibold">{f.floorLabel} {f.role}</p><p>추천: {f.recommendedTypes?.join(", ") || "-"}</p><p>중립: {f.neutralTypes?.join(", ") || "-"}</p><p>위험: {f.riskyTypes?.join(", ") || "-"}</p><p className="text-xs text-slate-500">리스크 메모: {f.riskNote}</p></CardContent></Card>)}</div>
                <SummaryPanel title="객관적 최종안" lines={vm.floorPlans.map((f) => `${f.floorLabel} ${f.role}`).slice(0, 5)} />
              </div>
            )}

            {vm.activeMenu === "strategy" && (
              <div className="space-y-4">
                <SectionTitle title="분양·임대 전략" desc="전략 선택 시 문구 변경" />
                <div className="grid gap-3 md:grid-cols-3">{Object.entries(vm.strategyCards).map(([title, item]) => <Card key={title} className={`rounded-2xl ${vm.selectedStrategy === title ? "border-slate-900" : ""}`}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm"><p>{item.summary}</p><p className="mt-2 text-slate-500">리스크: {item.risk}</p><p className="mt-1 text-xs text-slate-500">가격 방향: {item.pricingDirection}</p><Button className="mt-3" variant={vm.selectedStrategy === title ? "default" : "outline"} onClick={() => vm.setSelectedStrategy(title as "빠른 소진형" | "기준형" | "수익 극대화형")}>선택</Button></CardContent></Card>)}</div>
                <SummaryPanel title="전략 요약" lines={[`선택 전략: ${vm.selectedStrategy}`, vm.strategyCards[vm.selectedStrategy].summary, vm.strategyCards[vm.selectedStrategy].pricingDirection]} />
              </div>
            )}

            {vm.activeMenu === "marketing" && (
              <div className="space-y-4">
                <SectionTitle title="마케팅 실행" desc="입력 → 추천 조합 → 실행 우선순위" />
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="text-sm">총 예산(만원)<Input type="number" value={vm.marketingPlan.budget} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, budget: Number(e.target.value) }))} /></label>
                  <label className="text-sm">목표<select className="w-full rounded border p-2" value={vm.marketingPlan.objective} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, objective: e.target.value as typeof prev.objective }))}><option>문의 확보</option><option>방문예약</option><option>임차인 유치</option><option>분양 인지도</option></select></label>
                  <label className="text-sm">기간(주)<Input type="number" value={vm.marketingPlan.periodWeeks} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, periodWeeks: Number(e.target.value) }))} /></label>
                  <label className="text-sm">전략 메모<Input value={vm.marketingPlan.memo} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, memo: e.target.value }))} /></label>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{vm.marketingPlan.channels.map((c) => <Card key={c.id} className="rounded-2xl"><CardContent className="p-4"><p className="font-medium">{c.name}</p><p className="text-sm text-slate-600">적합도 {c.fit} · 예산강도 {c.budgetIntensity}</p><p className="text-sm">목표: {c.goal}</p><p className="text-xs text-slate-500">{c.description}</p></CardContent></Card>)}</div>
                <SummaryPanel title="권장 실행안 요약" lines={[`추천 조합: ${vm.marketingPlan.recommendedOrder.join(" + ")}`, `비추천 조합: ${vm.marketingPlan.avoidedChannels.join(", ")}`, `우선 실행: ${vm.marketingPlan.recommendedOrder[0] ?? "-"}`]} />
              </div>
            )}

            {vm.activeMenu === "crm" && (
              <div className="space-y-4">
                <SectionTitle title="CRM" desc="리드 상태 변경/검색/추가" />
                <div className="flex gap-2"><Input value={vm.leadSearch} onChange={(e) => vm.setLeadSearch(e.target.value)} placeholder="리드 검색" /><select className="rounded border p-2" value={vm.leadFilter} onChange={(e) => vm.setLeadFilter(e.target.value)}><option>전체</option><option>신규</option><option>상담중</option><option>방문예정</option><option>조건협의</option><option>계약임박</option><option>종료</option></select><Button onClick={addLead}>새 리드 추가</Button></div>
                <div className="grid gap-3">{vm.filteredLeads.length === 0 ? <EmptyState message="조건에 맞는 리드가 없습니다." /> : vm.filteredLeads.map((lead) => <Card key={lead.id} className="rounded-2xl"><CardContent className="p-4"><div className="flex items-center justify-between"><p className="font-medium">{lead.name}</p><select className="rounded border p-1 text-sm" value={lead.status} onChange={(e) => vm.updateLeadStatus(lead.id, e.target.value as Lead["status"])}><option>신규</option><option>상담중</option><option>방문예정</option><option>조건협의</option><option>계약임박</option><option>종료</option></select></div><p className="text-sm text-slate-600">{lead.interestedFloor} / {lead.interestedType} · 가능성 {lead.probability}%</p><p className="text-sm">다음 액션: {lead.nextAction}</p><p className="text-xs text-slate-500">메모: {lead.notes}</p></CardContent></Card>)}</div>
              </div>
            )}

            {vm.activeMenu === "profit" && (
              <div className="space-y-4">
                <SectionTitle title="수익·자산관리" desc="입력값에 따라 시나리오 자동 계산" />
                <div className="grid gap-3 md:grid-cols-4">
                  {(["landCost","buildCost","designCost","permitCost","financeCost","marketingCost","otherCost","maintenanceCost","totalDepositIncome","monthlyRentIncome","vacancyRate","occupancyRate","rentFreeMonths","expectedInterestRate","targetYield","capRate"] as const).map((k) => (
                    <label key={k} className="text-xs">{k}<MoneyInput value={vm.costModel[k]} onChange={(v) => onCostInput(k, v)} /></label>
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCard label="총 사업비" value={formatMoney(vm.profitSummary.totalCost)} />
                  <MetricCard label="실효 월 임대수입" value={formatMoney(vm.profitSummary.effectiveMonthlyIncome)} />
                  <MetricCard label="연 임대수입" value={formatMoney(vm.profitSummary.annualIncome)} />
                  <MetricCard label="단순 회수기간" value={`${vm.profitSummary.paybackYears.toFixed(1)}년`} />
                  <MetricCard label="손익분기점" value={`${vm.profitSummary.breakEvenYears.toFixed(1)}년`} />
                  <MetricCard label="자산가치 추정" value={formatMoney(vm.profitSummary.estimatedValue)} />
                </div>
                <div className="grid gap-3 md:grid-cols-3">{vm.revenueScenarios.map((s) => <Card key={s.scenarioName} className="rounded-2xl"><CardContent className="p-4"><p className="font-medium">{s.scenarioName}</p><p className="text-sm">가동률 {formatPercent(s.occupancyRate)}</p><p className="text-sm">월 수입 {formatMoney(s.effectiveMonthlyIncome)}</p><p className="text-xs text-slate-500">{s.warningMessage}</p></CardContent></Card>)}</div>
                {vm.profitSummary.warnings.map((w) => <div key={w} className="rounded border border-amber-200 bg-amber-50 p-2 text-sm">{w}</div>)}
              </div>
            )}

            {vm.activeMenu === "contracts" && (
              <div className="space-y-4">
                <SectionTitle title="계약관리" desc="문자열 템플릿 기반 계약서 초안" />
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="text-sm">계약 유형<select className="w-full rounded border p-2" value={vm.contractDraft.contractType} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, contractType: e.target.value as typeof prev.contractType }))}><option>상가 임대차계약서</option><option>입점의향서</option><option>제안협약서</option><option>마케팅 대행 계약서</option></select></label>
                  <label className="text-sm">업종<Input value={vm.contractDraft.tenantType} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, tenantType: e.target.value }))} /></label>
                  <label className="text-sm">층<Input value={vm.contractDraft.floorLabel} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, floorLabel: e.target.value }))} /></label>
                  <label className="text-sm">상태<select className="w-full rounded border p-2" value={vm.contractDraft.status} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))}><option>초안</option><option>검토중</option><option>수정중</option><option>완료</option></select></label>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="text-sm">보증금<MoneyInput value={vm.contractDraft.deposit} onChange={(v) => vm.setContractDraft((prev) => ({ ...prev, deposit: v }))} /></label>
                  <label className="text-sm">월세<MoneyInput value={vm.contractDraft.monthlyRent} onChange={(v) => vm.setContractDraft((prev) => ({ ...prev, monthlyRent: v }))} /></label>
                  <label className="text-sm">관리비<MoneyInput value={vm.contractDraft.managementFee} onChange={(v) => vm.setContractDraft((prev) => ({ ...prev, managementFee: v }))} /></label>
                  <label className="text-sm">계약기간(월)<Input type="number" value={vm.contractDraft.termMonths} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, termMonths: Number(e.target.value) }))} /></label>
                </div>
                <label className="text-sm">특약(줄바꿈으로 다중 입력)<textarea className="mt-1 w-full rounded border p-2 text-sm" rows={3} value={vm.contractDraft.specialClauses.join("\n")} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, specialClauses: e.target.value.split("\n").map((row) => row.trim()).filter(Boolean) }))} /></label>
                <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="mb-2 text-sm font-semibold">계약 초안 미리보기 (v{vm.contractDraft.version})</p><pre className="whitespace-pre-wrap break-words text-xs text-slate-700">{vm.contractPreview}</pre><div className="mt-2 flex gap-2"><Button variant="outline" onClick={() => vm.runExport("contract", "copy")}><Copy className="mr-1 h-4 w-4" />복사하기</Button><Button variant="outline" onClick={() => vm.runExport("contract", "pdf")}><FileOutput className="mr-1 h-4 w-4" />PDF로 저장</Button><Button variant="outline" onClick={() => vm.runExport("contract", "docx")}><FileOutput className="mr-1 h-4 w-4" />DOCX로 저장</Button><StatusBadge status={vm.contractDraft.status} /></div><p className="mt-2 text-xs text-slate-500">업종별 특약: {vm.template.recommendedClauses.join(", ")}</p></div>
              </div>
            )}

            {vm.activeMenu === "reports" && (
              <div className="space-y-4">
                <SectionTitle title="리포트" desc="리포트 선택/요약/핵심문장" />
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{vm.reports.map((r) => <Card key={r.id} className={`rounded-2xl ${vm.selectedReportId === r.id ? "border-slate-900" : ""}`}><CardContent className="p-4"><p className="font-medium">{r.type}</p><p className="text-sm text-slate-600">{r.summary}</p><Button className="mt-2" variant="outline" onClick={() => vm.setSelectedReportId(r.id)}>선택</Button></CardContent></Card>)}</div>
                <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">요약 미리보기</p><pre className="whitespace-pre-wrap break-words text-sm">{formatReportSummary(vm.project, vm.selectedReport, { profitSummary: vm.profitSummary, leadCount: vm.leads.length, topTenant: vm.filteredTenants[0]?.category, contractDraft: vm.contractDraft })}</pre><div className="mt-2 space-y-1">{vm.selectedReport.keySentences.map((k) => <div key={k} className="rounded bg-slate-100 p-2 text-sm">{k}</div>)}</div><div className="mt-2 flex gap-2"><Button variant="outline" onClick={() => vm.runExport("report", "copy")}><Copy className="mr-1 h-4 w-4" />복사하기</Button><Button variant="outline" onClick={() => vm.runExport("report", "pdf")}><FileOutput className="mr-1 h-4 w-4" />PDF로 저장</Button><Button variant="outline" onClick={() => vm.runExport("report", "docx")}><FileOutput className="mr-1 h-4 w-4" />DOCX로 저장</Button><Button variant="outline" onClick={() => vm.runExport("report", "xlsx")}><FileOutput className="mr-1 h-4 w-4" />엑셀로 저장</Button></div></CardContent></Card>
                <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm font-semibold">출력 미리보기 상태</p><p className="text-xs text-slate-600">{vm.exportMessage || "출력 버튼을 누르면 준비 데이터가 생성됩니다."}</p><div className="mt-2 flex gap-2"><Button variant="outline" onClick={() => vm.runExport("profit", "xlsx")}>수익성 요약표 엑셀로 저장</Button><Button variant="outline" onClick={() => vm.runExport("crm", "xlsx")}>CRM 리스트 엑셀로 저장</Button></div></CardContent></Card>
              </div>
            )}

            {vm.activeMenu === "settings" && (
              <div className="space-y-4">
                <SectionTitle title="설정" desc="기본 운영 파라미터" />
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">리포트 문체<Input value={vm.settings.reportTone} onChange={(e) => vm.setSettings((prev) => ({ ...prev, reportTone: e.target.value }))} /></label>
                  <label className="text-sm">통화/단위<Input value={vm.settings.currency} onChange={(e) => vm.setSettings((prev) => ({ ...prev, currency: e.target.value }))} /></label>
                  <label className="text-sm">기본 수익 가정값<Input type="number" value={vm.settings.defaultYield} onChange={(e) => vm.setSettings((prev) => ({ ...prev, defaultYield: Number(e.target.value) }))} /></label>
                  <label className="text-sm">계약서 기본 문구<Input value={vm.settings.defaultClause} onChange={(e) => vm.setSettings((prev) => ({ ...prev, defaultClause: e.target.value }))} /></label>
                  <label className="text-sm">기본 저장 경로<div className="flex gap-2"><Input value={vm.settings.savePath} onChange={(e) => vm.setSettings((prev) => ({ ...prev, savePath: e.target.value }))} /><Button type="button" variant="outline" onClick={async () => { const dir = await vm.chooseDirectory(); if (dir) vm.setSettings((prev) => ({ ...prev, savePath: dir })); }}>선택</Button></div></label>
                  <label className="text-sm">자동 백업 경로<div className="flex gap-2"><Input value={vm.settings.backupPath} onChange={(e) => vm.setSettings((prev) => ({ ...prev, backupPath: e.target.value }))} /><Button type="button" variant="outline" onClick={async () => { const dir = await vm.chooseDirectory(); if (dir) vm.setSettings((prev) => ({ ...prev, backupPath: dir })); }}>선택</Button></div></label>
                  <label className="text-sm">기본 보고서 저장 경로<div className="flex gap-2"><Input value={vm.settings.reportPath} onChange={(e) => vm.setSettings((prev) => ({ ...prev, reportPath: e.target.value }))} /><Button type="button" variant="outline" onClick={async () => { const dir = await vm.chooseDirectory(); if (dir) vm.setSettings((prev) => ({ ...prev, reportPath: dir })); }}>선택</Button></div></label>
                  <label className="text-sm">조직명<Input value={vm.settings.orgName} onChange={(e) => vm.setSettings((prev) => ({ ...prev, orgName: e.target.value }))} /></label>
                  <label className="text-sm">담당자명<Input value={vm.settings.managerName} onChange={(e) => vm.setSettings((prev) => ({ ...prev, managerName: e.target.value }))} /></label>
                  <label className="text-sm">기본 로고 경로<Input value={vm.settings.logoPath} onChange={(e) => vm.setSettings((prev) => ({ ...prev, logoPath: e.target.value }))} /></label>
                  <label className="text-sm">기본 계약서 템플릿명<Input value={vm.settings.contractTemplateName} onChange={(e) => vm.setSettings((prev) => ({ ...prev, contractTemplateName: e.target.value }))} /></label>
                  <label className="text-sm">기본 템플릿<Input value={vm.settings.templatePreset} onChange={(e) => vm.setSettings((prev) => ({ ...prev, templatePreset: e.target.value }))} /></label>
                  <label className="text-sm">자동저장 간격(초)<Input type="number" min={1} value={vm.settings.autosaveIntervalSec} onChange={(e) => vm.setSettings((prev) => ({ ...prev, autosaveIntervalSec: Number(e.target.value) || 1 }))} /></label>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">Electron 연결 상태: {vm.isElectronConnected ? "연결됨" : "브라우저 모드 (저장/폴더선택 제한)"}</div>
                <div className="flex gap-2">
                  <Button onClick={() => void vm.saveSettings()} disabled={!vm.isElectronConnected}>설정 저장</Button>
                  <Button variant="outline" onClick={() => vm.resetSettings()}>설정 초기화</Button>
                </div>
                <p className="text-xs text-slate-500">브라우저 실행에서는 localStorage로 동작하며 Electron에서만 userData/settings.json으로 저장됩니다.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
