"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Building2, MapPinned, Store, Target, Megaphone, Users, Wallet, FileText, BarChart3, Settings, Search, Upload, Copy, FileOutput, ArrowUpRight, TriangleAlert, ShieldCheck } from "lucide-react";
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
  const projectStatus = vm.project.completionDate >= new Date().toISOString().slice(0, 10) ? "개발 진행중" : "운영 단계";
  const highRiskCount = vm.tenantRisks.filter((risk) => risk.severity === "high").length;
  const riskRatio = Math.min(100, Math.round((highRiskCount / Math.max(1, vm.tenantRisks.length)) * 100));
  const locationFit = Math.round((vm.similarLocations[0]?.similarityScore ?? 80) * 0.96);
  const tenantFit = Math.round((vm.filteredTenants.slice(0, 5).reduce((sum, t) => sum + t.score, 0) || 420) / 5);
  const dataConfidence = Math.min(98, 64 + vm.files.length * 6 + vm.reports.length * 3);
  const operatorReadiness = Math.min(97, 60 + vm.leads.length * 3 + vm.recentProjects.length * 2);
  const kpis = [
    { label: "입지 적합도", value: `${locationFit}점`, status: locationFit >= 85 ? "강함" : "보강", trend: "up", insight: "유사 입지/수요 흐름 기준 상위권" },
    { label: "업종 적합도", value: `${tenantFit}점`, status: tenantFit >= 85 ? "정렬됨" : "재검토", trend: tenantFit >= 85 ? "up" : "warn", insight: "추천 업종 평균 점수 기반" },
    { label: "공실 리스크", value: `${riskRatio}%`, status: riskRatio >= 45 ? "주의" : "안정", trend: riskRatio >= 45 ? "warn" : "stable", insight: "고위험 업종 비중 및 상층부 리스크 반영" },
    { label: "예상 월 임대수익", value: formatMoney(vm.profitSummary.effectiveMonthlyIncome), status: "예측", trend: "up", insight: "공실·렌트프리 반영 실효 값" },
    { label: "데이터 신뢰도", value: `${dataConfidence}%`, status: dataConfidence >= 80 ? "높음" : "축적중", trend: dataConfidence >= 80 ? "stable" : "warn", insight: "파일/리포트/계약 데이터 충실도" },
    { label: "직접 운영 가능도", value: `${operatorReadiness}%`, status: operatorReadiness >= 80 ? "준비됨" : "점검", trend: operatorReadiness >= 80 ? "stable" : "warn", insight: "리드/최근 운영 이력 기준" },
  ] as const;

  const trendIcon = {
    up: <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />,
    warn: <TriangleAlert className="h-3.5 w-3.5 text-amber-300" />,
    stable: <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />,
  } as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1680px] grid-cols-12 gap-4 px-3 py-4 lg:px-6 lg:py-6">
        <aside className="col-span-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur lg:sticky lg:top-6 lg:col-span-3 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto xl:col-span-2">
          <div className="mb-4 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">SITE MIND</p>
            <h1 className="mt-2 text-lg font-semibold">건축주 직접 운영형 AI 분양 운영체제</h1>
          </div>
          <div className="grid gap-1.5">
            {menus.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => vm.setActiveMenu(key)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${vm.activeMenu === key ? "bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-400/40" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 xl:col-span-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs shadow-xl">
              <select className="rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-slate-100" value={vm.dataSource} onChange={(e) => vm.setDataSource(e.target.value as "mock" | "supabase")}>
                <option value="mock">mock</option>
                <option value="supabase">supabase</option>
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 text-slate-100" value={vm.selectedProjectId} onChange={(e) => vm.setSelectedProjectId(e.target.value)}>
                <option value="p-001">p-001</option>
                <option value="p-002">p-002</option>
              </select>
              <Button variant="outline" onClick={() => vm.reload()}>불러오기</Button>
              <Button onClick={() => vm.saveCurrentMenu()} disabled={vm.saving}>{vm.saving ? "저장중..." : "현재 화면 저장"}</Button>
              <Badge variant="secondary">source: {vm.repositorySource}</Badge>
              <Badge variant={vm.saveState === "saved" ? "default" : vm.saveState === "saving" ? "secondary" : "outline"}>{saveStateLabel}</Badge>
              <span className="text-[11px] text-slate-400">마지막 저장: {vm.lastSavedAt ? new Date(vm.lastSavedAt).toLocaleString("ko-KR") : "-"}</span>
              {vm.error ? <span className="text-red-300">{vm.error}</span> : null}
            </div>
            <Card className="mb-6 overflow-hidden rounded-3xl border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-2xl">
              <CardContent className="p-6">
                <p className="text-sm text-cyan-200">Executive Hero</p>
                <h2 className="text-3xl font-semibold tracking-tight">{vm.project.name}</h2>
                <p className="mt-1 text-sm text-slate-300">{vm.project.address} / {vm.project.parcelNumber}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-white/15 text-white">{vm.project.positioning}</Badge>
                  <Badge variant="secondary" className="rounded-full bg-white/20 text-white">완공 예정 {vm.project.completionDate}</Badge>
                  <Badge variant="outline" className="rounded-full border-white/40 bg-white/10 text-white">{vm.project.floorsBelow}B / {vm.project.floorsAbove}F</Badge>
                  <Badge variant="outline" className="rounded-full border-cyan-300/40 bg-cyan-500/10 text-cyan-100">{vm.contractDraft.status}</Badge>
                </div>
                <p className="mt-4 text-sm text-slate-200">핵심 판단: <span className="font-medium text-white">{vm.positioningSummary.objectiveConclusion}</span></p>
                <p className="mt-1 text-xs text-slate-400">건축주 직접 운영형 AI 분양 운영체제 · 운영 판단 데이터 통합 콘솔</p>
              </CardContent>
            </Card>

            {vm.activeMenu === "dashboard" && (
              <div className="space-y-5 pb-6">
                <SectionTitle title="Executive Command Center" desc="건축주 의사결정을 위한 핵심 지표 및 실행 패널" />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {kpis.map((kpi) => (
                    <Card key={kpi.label} className="border-slate-800 bg-slate-900/75 text-slate-100 shadow-lg">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{kpi.label}</p>
                          <span>{trendIcon[kpi.trend]}</span>
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-slate-700 text-slate-100">{kpi.status}</Badge>
                          <p className="text-xs text-slate-400">{kpi.insight}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-4">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Strategy Snapshot</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <SummaryPanel title="권장 업종 Top 5" lines={vm.filteredTenants.slice(0, 5).map((t) => `${t.floorLabel} ${t.category} (${t.score})`)} />
                        <SummaryPanel title="주의 업종 Top 5" lines={vm.tenantRisks.slice(0, 5).map((r) => r.text)} />
                        <SummaryPanel title="핵심 고객군" lines={["메디컬 반복 방문 고객", "교육·학부모 목적 방문층", "생활밀착형 고정수요", `현재 리드 ${vm.leads.length}건`]} />
                        <SummaryPanel title="다음 액션 3개" lines={["층별 임대조건 미세조정", "2층 메디컬 앵커 협상 가속", "보고서 패키지 생성 후 건축주 공유"]} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Quick Action Bar</p>
                      <div className="mt-3 grid gap-2">
                        <Button onClick={() => vm.setActiveMenu("project")}>프로젝트 편집</Button>
                        <Button onClick={() => vm.setActiveMenu("plan")} variant="outline">개발계획도 업로드</Button>
                        <Button onClick={() => vm.setActiveMenu("tenant")} variant="outline">업종 검증</Button>
                        <Button onClick={() => vm.setActiveMenu("marketing")} variant="outline">마케팅 계획 생성</Button>
                        <Button onClick={() => vm.setActiveMenu("contracts")} variant="outline">계약 초안 생성</Button>
                        <Button onClick={() => vm.setActiveMenu("reports")} variant="outline">건축주 보고서 생성</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">운영 상태</p>
                      <p className="mt-2 text-xs text-slate-300">Electron 연결: {vm.isElectronConnected ? "연결됨" : "브라우저 모드"}</p>
                      <p className="text-xs text-slate-300">로컬 저장 경로: {vm.settings.savePath}</p>
                      <p className="text-xs text-slate-400">최근 프로젝트 {vm.recentProjects.length}개 · 리포트 {vm.recentReports.length}개 · 계약 {vm.recentContracts.length}개</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">유사 입지 분석 요약</p><p className="mt-2 text-sm text-slate-300">{vm.similarLocations[0]?.name} ({vm.similarLocations[0]?.typeLabel}) · 유사도 {vm.similarLocations[0]?.similarityScore}%</p><p className="text-xs text-slate-400">{vm.positioningSummary.demandInterpretation}</p></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">층별 MD 요약</p><p className="mt-2 text-sm text-slate-300">{vm.floorPlans.slice(0, 4).map((f) => `${f.floorLabel}:${f.role}`).join(" · ")}</p><p className="text-xs text-slate-400">핵심 업종 {vm.projectSummary.coreCategories}</p></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">마케팅 실행 요약</p><p className="mt-2 text-sm text-slate-300">{vm.marketingPlan.summary}</p><p className="text-xs text-slate-400">우선순위: {vm.marketingPlan.recommendedOrder.join(" → ")}</p></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">CRM 파이프라인 요약</p><p className="mt-2 text-sm text-slate-300">전체 리드 {vm.leads.length}건 / 계약임박 {vm.leads.filter((lead) => lead.status === "계약임박").length}건</p><p className="text-xs text-slate-400">상담중 {vm.leads.filter((lead) => lead.status === "상담중").length}건 · 조건협의 {vm.leads.filter((lead) => lead.status === "조건협의").length}건</p></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">계약 진행 요약</p><p className="mt-2 text-sm text-slate-300">현재 계약: {vm.contractDraft.contractType}</p><p className="text-xs text-slate-400">상태 {vm.contractDraft.status} · v{vm.contractDraft.version} · 주요 특약 {vm.contractDraft.specialClauses.length}개</p></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">수익/공실 시뮬레이션 요약</p><p className="mt-2 text-sm text-slate-300">실효 월 임대수익 {formatMoney(vm.profitSummary.effectiveMonthlyIncome)}</p><p className="text-xs text-slate-400">공실률 {formatPercent(vm.projectSummary.vacancyRate)} · 회수기간 {vm.profitSummary.paybackYears.toFixed(1)}년 · 자산가치 {formatMoney(vm.profitSummary.estimatedValue)}</p></CardContent></Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">AI 인사이트 / 리스크 패널</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li>• {vm.positioningSummary.objectiveConclusion}</li>
                        <li>• 공실 리스크는 {riskRatio}% 수준으로 {riskRatio >= 45 ? "주의 대응" : "안정 운영"}이 필요합니다.</li>
                        <li>• 데이터 신뢰도 {dataConfidence}%: 파일/리포트가 누적될수록 의사결정 신뢰도가 상승합니다.</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-600/40 bg-amber-500/10 text-amber-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold">경고/알림</p>
                      <div className="mt-2 space-y-2">
                        {vm.alerts.map((a) => <div key={a.id} className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-2 text-sm">{a.text}</div>)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {vm.activeMenu === "project" && (
              <div className="space-y-5 pb-6">
                <SectionTitle title="Deal Memo · Asset Profile" desc="프로젝트 기본정보, 개발 가설, 투자 판단 가정을 한눈에 정리" />

                <Card className="border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-100">
                  <CardContent className="p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Asset Header</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{vm.project.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{vm.project.address} · 필지 {vm.project.parcelNumber}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="bg-slate-700 text-slate-100">{vm.project.assetType}</Badge>
                      <Badge variant="outline" className="border-cyan-300/40 bg-cyan-500/10 text-cyan-100">완공 예정 {vm.project.completionDate}</Badge>
                      <Badge variant="outline" className="border-white/30 bg-white/10 text-slate-100">{projectStatus}</Badge>
                      <Badge variant={vm.saveState === "saved" ? "secondary" : vm.saveState === "saving" ? "outline" : "default"}>{saveStateLabel}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">포지셔닝: <span className="font-medium text-white">{vm.project.positioning}</span></p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Asset Facts Grid</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm"><p className="text-slate-400">층수</p><p className="font-semibold text-white">{vm.project.floorsBelow}B / {vm.project.floorsAbove}F</p></div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm"><p className="text-slate-400">전용면적</p><p className="font-semibold text-white">{vm.project.privateAreaPy}평</p></div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm"><p className="text-slate-400">공용면적</p><p className="font-semibold text-white">{vm.project.commonAreaPy}평</p></div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm"><p className="text-slate-400">연면적</p><p className="font-semibold text-white">{vm.project.grossAreaPy}평</p></div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm md:col-span-2"><p className="text-slate-400">주차 메모</p><p className="font-medium text-slate-200">{vm.project.parkingMemo || "-"}</p></div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm"><p className="text-slate-400">역세권 여부</p><p className="font-semibold text-white">{vm.project.nearStation ? `예 (${vm.project.stationName})` : "아니오"}</p></div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm"><p className="text-slate-400">산업배후 여부</p><p className="font-semibold text-white">{vm.project.industrialDemand ? "있음" : "없음"}</p></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Development Thesis</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li>• 방향성: {vm.positioningSummary.objectiveConclusion}</li>
                        <li>• 유사 입지: {vm.similarLocations[0]?.name ?? "-"} ({vm.similarLocations[0]?.typeLabel ?? "-"})</li>
                        <li>• 핵심 상권 가설: {vm.positioningSummary.demandInterpretation}</li>
                        <li>• 객관 검증 필요: 상층부 업종 흡수 속도, 공실 전환 민감도</li>
                        <li>• 사용자 가정 기반: 초기 6개월 임차 유치 속도, 앵커 계약 리드타임</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">Editable Project Form</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge className="bg-slate-700 text-slate-100">필수값: 프로젝트명, 주소, 지상층</Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">선택값: 메모/역명/포지셔닝</Badge>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {([
                        ["name", "프로젝트명 *"], ["address", "주소 *"], ["parcelNumber", "필지번호"], ["assetType", "자산 유형"], ["completionDate", "완공 예정일"],
                        ["positioning", "포지셔닝"], ["stationName", "역명"], ["parkingMemo", "주차 메모"], ["notes", "건축주 메모"],
                      ] as const).map(([key, label]) => (
                        <label key={key} className="text-sm text-slate-200">{label}<Input value={String(vm.project[key])} onChange={(e) => onProjectInput(key, e.target.value)} /></label>
                      ))}
                      <label className="text-sm text-slate-200">지상층 수 *<Input type="number" value={vm.project.floorsAbove} onChange={(e) => onProjectInput("floorsAbove", Number(e.target.value))} /></label>
                      <label className="text-sm text-slate-200">지하층 수<Input type="number" value={vm.project.floorsBelow} onChange={(e) => onProjectInput("floorsBelow", Number(e.target.value))} /></label>
                      <label className="text-sm text-slate-200">전용면적(평)<Input type="number" value={vm.project.privateAreaPy} onChange={(e) => onProjectInput("privateAreaPy", Number(e.target.value))} /></label>
                      <label className="text-sm text-slate-200">공용면적(평)<Input type="number" value={vm.project.commonAreaPy} onChange={(e) => onProjectInput("commonAreaPy", Number(e.target.value))} /></label>
                      <label className="text-sm text-slate-200">연면적(평)<Input type="number" value={vm.project.grossAreaPy} onChange={(e) => onProjectInput("grossAreaPy", Number(e.target.value))} /></label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button onClick={() => vm.saveCurrentMenu()} disabled={vm.saving}>{vm.saving ? "저장중..." : "저장"}</Button>
                      <Button variant="outline" onClick={() => vm.resetProject()}>초기화</Button>
                      <Badge variant="secondary">최근 저장: {vm.lastSavedAt ? new Date(vm.lastSavedAt).toLocaleString("ko-KR") : "-"}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Decision Notes</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li>• 건축주 메모: {vm.project.notes || "기입 전"}</li>
                        <li>• 내부 검토 메모: 공실 흡수 구간과 임차인 전환 동선을 병행 점검</li>
                        <li>• AI 판단 메모: {vm.positioningSummary.objectiveConclusion}</li>
                        <li>• 다음 검토 항목: 임대료 민감도, 앵커 계약 리스크, 마케팅 집행 타이밍</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Validation & Save State</p>
                      {vm.projectDirty ? <p className="mt-2 text-xs text-amber-300">저장되지 않은 변경사항이 있습니다.</p> : <p className="mt-2 text-xs text-emerald-300">저장된 상태입니다.</p>}
                      {vm.projectValidation.length > 0 ? (
                        <div className="mt-3 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">{vm.projectValidation.join(" / ")}</div>
                      ) : (
                        <div className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">필수값 검증 통과. 저장 가능 상태입니다.</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {vm.activeMenu === "plan" && (
              <div className="space-y-5">
                <SectionTitle title="개발계획 분석 · GIS Intelligence Console" desc="업로드 → 유사 입지 엔진 → 상권 진화 예측 → 입지 리스크 판단" />
                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Upload Intelligence Panel</p>
                        <Button onClick={() => vm.addFile({ id: `file-${Date.now()}`, projectId: vm.project.id, name: "새파일.pdf", type: "application/pdf", uploadedAt: new Date().toLocaleString("ko-KR"), status: "분석 대기중", category: "참고자료" })}>파일 추가(Mock)</Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(["전체", "개발계획 맵", "평면도/PDF", "면적표", "참고자료"] as const).map((f) => (
                          <Button key={f} variant={vm.fileFilter === f ? "default" : "outline"} onClick={() => vm.setFileFilter(f)}>{f}</Button>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {(["개발계획 맵", "평면도/PDF", "면적표", "참고자료"] as const).map((category) => {
                          const items = vm.files.filter((file) => file.category === category);
                          const inReview = items.filter((file) => file.status !== "업로드 완료").length;
                          return (
                            <div key={category} className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm">
                              <p className="font-medium text-white">{category}</p>
                              <p className="text-xs text-slate-300">업로드 {items.length}건 · 분석 대기 {inReview}건</p>
                              <p className="text-xs text-slate-400">검토 필요: {inReview > 0 ? "예" : "아니오"}</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Confidence & Data Quality</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li>• 데이터 출처 수: 파일 {vm.files.length} + 리포트 {vm.reports.length}</li>
                        <li>• 최신성: 최근 업로드 {vm.files[0]?.uploadedAt ?? "데이터 없음"}</li>
                        <li>• 관측/추정 비율: 68 / 32 (placeholder)</li>
                        <li>• 신뢰도 점수: {Math.min(98, 62 + vm.files.length * 5)}%</li>
                        <li>• 추가 검증: 도면-면적표 정합성, 유입동선 실측 데이터</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Map / Plan Placeholder Panel</p>
                        <Badge variant="outline" className="border-cyan-400/40 text-cyan-200">GIS/API 연결 예정</Badge>
                      </div>
                      <div className="mt-3 grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-slate-600 bg-slate-800/40 text-center">
                        <div>
                          <p className="text-sm text-slate-200">지도/개발계획도 렌더 영역 Placeholder</p>
                          <p className="text-xs text-slate-400">반경 분석 · 도면 해석 · 유입 동선 레이어 예정</p>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 md:grid-cols-3 text-xs text-slate-300">
                        <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-2">반경 분석 placeholder</div>
                        <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-2">도면 해석 placeholder</div>
                        <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-2">유입 동선 placeholder</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Market Evolution Timeline</p>
                      <div className="mt-3 space-y-2 text-sm">
                        {["현재", "완공 시점", "1년 후", "3년 후", "안정화 시점"].map((phase, i) => (
                          <div key={phase} className="rounded-xl border border-slate-700 bg-slate-800/70 p-2">
                            <p className="font-medium text-white">{phase}</p>
                            <p className="text-xs text-slate-300">{["초기 수요 탐색", "앵커 업종 입점 구간", "반복 방문 업종 확장", "임대료 재평가 국면", "상권 고정 수요 안정화"][i]}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold text-white">Similar Location Engine</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {[
                        { name: "평택 고덕국제신도시형", base: vm.similarLocations[0], reason: "산업배후+역세권 동시 성장", industry: "매우 높음", transit: "높음", housing: "중간", pattern: "메디컬-교육 순차형", bench: "초기 앵커 선점", risk: "상층 공실 장기화" },
                        { name: "동탄2 외곽 역세권형", base: vm.similarLocations[1], reason: "주거확장 + 목적방문 상권", industry: "중간", transit: "높음", housing: "높음", pattern: "생활서비스 확장형", bench: "가족형 서비스 비중", risk: "외식 과잉 경쟁" },
                        { name: "세종 나성동 생활복합형", base: vm.similarLocations[2], reason: "행정/주거 혼합 수요", industry: "중간", transit: "중간", housing: "높음", pattern: "평일-주말 혼합형", bench: "교육·웰니스 결합", risk: "초기 유동 인구 편차" },
                      ].map((candidate) => (
                        <div key={candidate.name} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 text-sm">
                          <p className="font-semibold text-white">{candidate.name}</p>
                          <p className="text-xs text-cyan-200">유사도 {candidate.base?.similarityScore ?? 80}% · {candidate.reason}</p>
                          <p className="mt-2 text-xs text-slate-300">산업배후 {candidate.industry} · 역세권 {candidate.transit} · 주거확장 {candidate.housing}</p>
                          <p className="text-xs text-slate-300">초기 형성 패턴: {candidate.pattern}</p>
                          <p className="text-xs text-slate-300">벤치마킹: {candidate.bench}</p>
                          <p className="text-xs text-amber-300">실패 리스크: {candidate.risk}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {vm.activeMenu === "location" && (
              <div className="space-y-4">
                <SectionTitle title="상권·입지 분석 Intelligence" desc="입지 적합도와 리스크를 기관형 리서치 포맷으로 판단" />
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="font-semibold text-white">{vm.positioningSummary.headline}</p><p className="text-sm text-slate-300">{vm.positioningSummary.objectiveConclusion}</p><p className="mt-2 text-sm text-slate-300">{vm.positioningSummary.demandInterpretation}</p></CardContent></Card>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(vm.positioningSummary.suitability).map(([k, v]) => <Card key={k} className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-4"><p className="text-sm text-slate-300">{k}</p><Progress value={v} /><p className="mt-1 text-sm text-white">{v}점</p></CardContent></Card>)}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-4 text-sm">반복 방문형 시장 여부: <b className="text-cyan-200">{vm.positioningSummary.repeatVisitMarket ? "예" : "아니오"}</b></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-4 text-sm">핵심 리스크: {vm.tenantRisks.slice(0, 2).map((r) => r.text).join(" / ")}</CardContent></Card>
                </div>
              </div>
            )}

            {vm.activeMenu === "tenant" && (
              <div className="space-y-4">
                <SectionTitle title="Tenant Validation Command Center" desc="추천 리스트를 넘어 ‘입점 가능성 검증 엔진’으로 판단" />
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold text-white">Tenant Strategy Header</p>
                    <p className="mt-2 text-sm text-slate-300">건물 포지셔닝: {vm.project.positioning}</p>
                    <p className="text-sm text-slate-300">권장 MD 방향: {vm.projectSummary.coreCategories} · 반복 방문형 {vm.positioningSummary.repeatVisitMarket ? "적합" : "재검토"}</p>
                    <p className="text-xs text-slate-400">객관 최종안: 층별 추천 스코어 기반 / 가정 기반 시나리오: 전략별 임대 속도 가정</p>
                  </CardContent>
                </Card>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
                  <Search className="mr-2 inline h-4 w-4 text-slate-400" /><Input value={vm.tenantQuery} onChange={(e) => vm.setTenantQuery(e.target.value)} placeholder="층/업종/태그 검색" className="inline w-[90%]" />
                </div>
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold text-white">Floor-by-Floor MD Board</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {vm.floorPlans.map((f) => <Card key={f.id} className="border-slate-700 bg-slate-800/70"><CardContent className="p-4 text-sm"><p className="font-semibold text-white">{f.floorLabel} · {f.role}</p><p className="text-slate-300">면적 {f.areaPy}평 · 적합도 {f.score}점 · 권장 규모 {f.sizeMix}</p><p className="text-slate-300">추천: {f.recommendedTypes?.join(", ") || "-"}</p><p className="text-slate-400">중립: {f.neutralTypes?.join(", ") || "-"}</p><p className="text-amber-300">위험: {f.riskyTypes?.join(", ") || "-"}</p><p className="text-xs text-slate-400">추천 이유: {f.rationale}</p><p className="text-xs text-slate-400">계약/설비 유의: {f.riskNote}</p></CardContent></Card>)}
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Recommendation Matrix</p>
                      <div className="mt-3 overflow-auto">
                        <table className="w-full text-xs">
                          <thead className="text-slate-400"><tr><th className="px-2 py-2 text-left">업종</th><th className="px-2 py-2 text-left">권장층</th><th className="px-2 py-2 text-left">규모</th><th className="px-2 py-2 text-left">적합도</th><th className="px-2 py-2 text-left">수익성</th><th className="px-2 py-2 text-left">리스크</th><th className="px-2 py-2 text-left">신뢰도</th><th className="px-2 py-2 text-left">다음 액션</th></tr></thead>
                          <tbody>{vm.filteredTenants.slice(0, 8).map((t) => <tr key={t.id} className="border-t border-slate-700"><td className="px-2 py-2">{t.category}</td><td className="px-2 py-2">{t.floorLabel}</td><td className="px-2 py-2">{t.size}</td><td className="px-2 py-2">{t.score}</td><td className="px-2 py-2">{t.score > 85 ? "높음" : "중간"}</td><td className="px-2 py-2">{t.recommendationType === "위험" ? "높음" : t.recommendationType === "중립" ? "중간" : "낮음"}</td><td className="px-2 py-2">{Math.min(95, t.score + 5)}%</td><td className="px-2 py-2">{t.recommendationType === "추천" ? "협상 시작" : "조건 재검토"}</td></tr>)}</tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-white">Tenant Validation Engine</p>
                      <ul className="mt-3 space-y-2 text-xs text-slate-300">
                        <li>대형 키즈카페: 객관 검증 필요 · 대안 교육형 키즈시설</li>
                        <li>대형 피부과: 메디컬 클러스터/소득/경쟁도 검증 필요</li>
                        <li>고급 헬스장: 주차/평일 수요/면적 효율 검증 필요</li>
                      </ul>
                      <p className="mt-3 text-xs text-slate-400">평가 항목: 적합도 · 경쟁도 · 수요 · 리스크 · 대체 업종 · 장기 생존성 · 법규/용도</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {vm.tenantRisks.slice(0, 3).map((risk) => <Card key={risk.id} className="border-slate-700 bg-slate-800/70 text-slate-100"><CardContent className="p-4 text-sm"><p className="font-semibold text-amber-200">Risk Explanation</p><p className="mt-1">{risk.text}</p><p className="mt-1 text-xs text-slate-400">가능 조건: 앵커 업종 연계 + 임대조건 최적화</p><p className="text-xs text-slate-400">대안: 중형 메디컬/교육형 전환</p><p className="text-xs text-slate-400">추가 검증: 유동인구 시간대/주차 회전율</p></CardContent></Card>)}
                </div>
              </div>
            )}

            {vm.activeMenu === "strategy" && (
              <div className="space-y-4">
                <SectionTitle title="가격/공실/호실 전략 시뮬레이션 콘솔" desc="전략 시나리오 비교 기반 임대 의사결정" />
                <div className="grid gap-3 md:grid-cols-4">{[...Object.entries(vm.strategyCards), ["혼합형", { summary: "층별 유연 전략 혼합", risk: "운영 복잡도 증가", pricingDirection: "층별 탄력 가격" }]].map(([title, item]) => <Card key={title} className={`border-slate-800 bg-slate-900/75 text-slate-100 ${vm.selectedStrategy === title ? "ring-1 ring-cyan-300/40" : ""}`}><CardHeader><CardTitle className="text-white">{title}</CardTitle></CardHeader><CardContent className="text-sm"><p className="text-slate-300">{item.summary}</p><p className="mt-2 text-slate-400">리스크: {item.risk}</p><p className="mt-1 text-xs text-slate-400">권장 임대가 방향: {item.pricingDirection}</p><p className="mt-1 text-xs text-slate-400">예상 공실 영향: {title === "빠른 소진형" ? "단기 하락" : title === "수익 극대화형" ? "초기 상승" : "중립"}</p><Button className="mt-3" variant={vm.selectedStrategy === title ? "default" : "outline"} onClick={() => title !== "혼합형" && vm.setSelectedStrategy(title as "빠른 소진형" | "기준형" | "수익 극대화형")}>선택</Button></CardContent></Card>)}</div>
                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Floor Pricing Strategy</p><div className="mt-3 grid gap-2 md:grid-cols-2">{vm.floorPlans.map((floor) => <div key={floor.id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-xs"><p className="font-medium text-white">{floor.floorLabel}</p><p>가격 전략: {floor.floorLabel.includes("1") ? "집객형 프리미엄" : "안정형"}</p><p>보증금 방향: {floor.score > 85 ? "상향" : "유지"}</p><p>월세 방향: {floor.score > 90 ? "상향" : "탄력"}</p><p>임대 난이도: {floor.score > 85 ? "중간" : "높음"}</p><p>협상 카드: 렌트프리 {floor.score > 85 ? "최소화" : "1~2개월"}</p></div>)}</div></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Decision Summary</p><p className="mt-2 text-sm text-slate-300">지금 선택: {vm.selectedStrategy}</p><p className="text-xs text-slate-400">피해야 할 전략: 초기 외식 집중형</p><p className="text-xs text-slate-400">다음 액션: 층별 가격밴드 승인 → 핵심 리드 조건 제시</p></CardContent></Card>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard label="공실률 변화" value={formatPercent(vm.projectSummary.vacancyRate)} sub="Vacancy Sensitivity" />
                  <MetricCard label="월수익 변화" value={formatMoney(vm.profitSummary.effectiveMonthlyIncome)} sub="전략별 시뮬레이션" />
                  <MetricCard label="회수기간 변화" value={`${vm.profitSummary.paybackYears.toFixed(1)}년`} sub={vm.projectSummary.vacancyRate > 20 ? "경고: 공실률 관리 필요" : "안정"} />
                </div>
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5 text-sm"><p className="font-semibold text-white">Commission Comparison</p><p className="mt-1 text-slate-300">분양대행 수수료 예상: 매출의 4~6% (placeholder)</p><p className="text-slate-300">직접 운영 비교: 초기 인력비 증가 vs 데이터 자산 축적</p><p className="text-slate-400 text-xs">SITE MIND 도입 효과 placeholder: 의사결정 속도 + 리드 품질 개선</p></CardContent></Card>
              </div>
            )}

            {vm.activeMenu === "marketing" && (
              <div className="space-y-4">
                <SectionTitle title="마케팅 실행 디렉토리" desc="예산 기반 실행 우선순위 + 채널 운영 파이프라인" />
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Budget Planner</p><div className="mt-3 grid gap-3 md:grid-cols-4"><label className="text-sm text-slate-300">총 예산(만원)<Input type="number" value={vm.marketingPlan.budget} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, budget: Number(e.target.value) }))} /></label><label className="text-sm text-slate-300">목표<select className="w-full rounded-xl border border-slate-600 bg-slate-800 p-2 text-slate-100" value={vm.marketingPlan.objective} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, objective: e.target.value as typeof prev.objective }))}><option>문의 확보</option><option>방문예약</option><option>임차인 유치</option><option>분양 인지도</option></select></label><label className="text-sm text-slate-300">기간(주)<Input type="number" value={vm.marketingPlan.periodWeeks} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, periodWeeks: Number(e.target.value) }))} /></label><label className="text-sm text-slate-300">전략 메모<Input value={vm.marketingPlan.memo} onChange={(e) => vm.setMarketingPlan((prev) => ({ ...prev, memo: e.target.value }))} /></label></div><p className="mt-2 text-xs text-slate-400">추천 조합: {vm.marketingPlan.recommendedOrder.join(" + ")}</p></CardContent></Card>
                <div className="grid gap-4 xl:grid-cols-3">{vm.marketingPlan.channels.map((c) => <Card key={c.id} className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-4"><p className="font-medium text-white">{c.name}</p><p className="text-sm text-slate-300">적합도 {c.fit} · 예상 비용 {Math.round(vm.marketingPlan.budget / 8)}만원 · 예상 리드 {Math.round(c.fit / 4)}건</p><p className="text-xs text-slate-300">강점: {c.description}</p><p className="text-xs text-slate-400">약점: 예산 강도 {c.budgetIntensity}</p><p className="text-xs text-slate-400">추천 여부: {vm.marketingPlan.recommendedOrder.includes(c.name) ? "추천" : "보류"}</p></CardContent></Card>)}</div>
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Execution Directory</p><div className="mt-3 overflow-auto"><table className="w-full text-xs"><thead className="text-slate-400"><tr><th className="px-2 py-2 text-left">이름</th><th className="px-2 py-2 text-left">유형</th><th className="px-2 py-2 text-left">연락처/mock</th><th className="px-2 py-2 text-left">URL/mock</th><th className="px-2 py-2 text-left">분야</th><th className="px-2 py-2 text-left">단가</th><th className="px-2 py-2 text-left">우선순위</th><th className="px-2 py-2 text-left">상태</th><th className="px-2 py-2 text-left">메모</th></tr></thead><tbody>{[{n:"고덕부동산네트워크",t:"인근 부동산",c:"010-1111-2222",u:"local/mock",f:"임차인유치",p:"80만원",r:"상",s:"연락 예정",m:"메디컬 리드 강함"},{n:"청주로컬인플루언서A",t:"지역 인플루언서",c:"010-3333-4444",u:"insta/mock",f:"방문예약",p:"120만원",r:"중",s:"미연락",m:"주거 커뮤니티 영향"},{n:"도시상권광고랩",t:"광고대행사",c:"02-555-7777",u:"agency/mock",f:"퍼포먼스",p:"300만원",r:"중",s:"협의중",m:"검색광고 전문"},{n:"지역프랜차이즈BD",t:"프랜차이즈 본사",c:"010-8888-9999",u:"fr/mock",f:"입점유치",p:"성과형",r:"상",s:"연락 완료",m:"약국/카페 후보"}].map((row)=> <tr key={row.n} className="border-t border-slate-700"><td className="px-2 py-2">{row.n}</td><td className="px-2 py-2">{row.t}</td><td className="px-2 py-2">{row.c}</td><td className="px-2 py-2">{row.u}</td><td className="px-2 py-2">{row.f}</td><td className="px-2 py-2">{row.p}</td><td className="px-2 py-2">{row.r}</td><td className="px-2 py-2">{row.s}</td><td className="px-2 py-2">{row.m}</td></tr>)}</tbody></table></div><p className="mt-2 text-xs text-slate-400">Action Pipeline: 미연락 → 연락 예정 → 연락 완료 → 협의중 → 제외</p></CardContent></Card>
                <SummaryPanel title="건축주 요약 카드" lines={[`이번 예산 현실안: ${vm.marketingPlan.recommendedOrder[0] ?? "-"}`, `비추천 채널: ${vm.marketingPlan.avoidedChannels.join(", ")}`, "우선 연락 대상: 인근 부동산 네트워크", "이번 주 액션: 핵심 채널 3곳 컨택 및 결과 기록"]} />
              </div>
            )}

            {vm.activeMenu === "crm" && (
              <div className="space-y-4">
                <SectionTitle title="Field Sales CRM Console" desc="업종 검증/관심층/계약 가능성이 연결된 영업 파이프라인" />
                <div className="grid gap-3 md:grid-cols-6">{["신규","상담중","방문예정","조건협의","계약임박","종료"].map((status)=> <Card key={status} className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-3 text-center"><p className="text-xs text-slate-400">{status}</p><p className="text-lg font-semibold text-white">{vm.leads.filter((lead)=>lead.status===status).length}</p></CardContent></Card>)}</div>
                <div className="flex gap-2"><Input value={vm.leadSearch} onChange={(e) => vm.setLeadSearch(e.target.value)} placeholder="리드 검색" /><select className="rounded-xl border border-slate-600 bg-slate-800 p-2 text-slate-100" value={vm.leadFilter} onChange={(e) => vm.setLeadFilter(e.target.value)}><option>전체</option><option>신규</option><option>상담중</option><option>방문예정</option><option>조건협의</option><option>계약임박</option><option>종료</option></select><Button onClick={addLead}>새 리드 추가</Button></div>
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Lead Table / Board</p><div className="mt-3 overflow-auto"><table className="w-full text-xs"><thead className="text-slate-400"><tr><th className="px-2 py-2 text-left">고객명</th><th className="px-2 py-2 text-left">연락처</th><th className="px-2 py-2 text-left">희망 업종</th><th className="px-2 py-2 text-left">관심 층</th><th className="px-2 py-2 text-left">상태</th><th className="px-2 py-2 text-left">가능성</th><th className="px-2 py-2 text-left">마지막 연락</th><th className="px-2 py-2 text-left">다음 액션</th><th className="px-2 py-2 text-left">담당자</th></tr></thead><tbody>{vm.filteredLeads.map((lead)=><tr key={lead.id} className="border-t border-slate-700"><td className="px-2 py-2">{lead.name}</td><td className="px-2 py-2">{lead.contact}</td><td className="px-2 py-2">{lead.interestedType}</td><td className="px-2 py-2">{lead.interestedFloor}</td><td className="px-2 py-2"><select className="rounded border border-slate-600 bg-slate-800 p-1 text-xs" value={lead.status} onChange={(e)=>vm.updateLeadStatus(lead.id,e.target.value as Lead["status"])}><option>신규</option><option>상담중</option><option>방문예정</option><option>조건협의</option><option>계약임박</option><option>종료</option></select></td><td className="px-2 py-2">{lead.probability}%</td><td className="px-2 py-2">{lead.lastContactDate}</td><td className="px-2 py-2">{lead.nextAction}</td><td className="px-2 py-2">SITE MIND</td></tr>)}</tbody></table></div></CardContent></Card>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Lead Detail Panel</p>{vm.filteredLeads[0] ? <div className="mt-2 text-sm text-slate-300"><p>상담 메모: {vm.filteredLeads[0].notes || "메모 없음"}</p><p>업종 검증 결과: {vm.filteredLeads[0].interestedType}는 {vm.filteredLeads[0].probability > 70 ? "적합 가능성 높음" : "검증 필요"}</p><p>권장 대안 업종: 교육/웰니스 복합형</p><p>제안 임대 조건: 보증금 {formatMoney(vm.contractDraft.deposit)} / 월세 {formatMoney(vm.contractDraft.monthlyRent)}</p><div className="mt-2 flex gap-2"><Button onClick={() => vm.setActiveMenu("contracts")}>계약 초안 생성</Button><Button variant="outline" onClick={() => vm.setActiveMenu("reports")}>리포트 생성</Button></div></div> : <EmptyState message="리드가 없습니다." />}</CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Follow-up Intelligence</p><ul className="mt-2 space-y-1 text-xs text-slate-300"><li>오래 방치된 리드: {vm.leads.filter((lead)=>lead.status==="신규").length}건</li><li>계약 가능성 높은 리드: {vm.leads.filter((lead)=>lead.probability>=80).length}건</li><li>가격 이슈 리드: 조건협의 {vm.leads.filter((lead)=>lead.status==="조건협의").length}건</li><li>업종 부적합 리드: 검증 필요 {vm.leads.filter((lead)=>lead.probability<50).length}건</li></ul></CardContent></Card>
                </div>
              </div>
            )}

            {vm.activeMenu === "profit" && (
              <div className="space-y-4">
                <SectionTitle title="수익·자산관리 Simulation Console" desc="Cost/Revenue/공실/가치가 연결된 투자 판단 화면" />
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Cost Stack</p><div className="mt-3 grid gap-2 md:grid-cols-2">{(["landCost","buildCost","designCost","permitCost","financeCost","marketingCost","otherCost","maintenanceCost"] as const).map((k) => (<label key={k} className="text-xs text-slate-300">{k}<MoneyInput value={vm.costModel[k]} onChange={(v) => onCostInput(k, v)} /></label>))}</div></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Revenue Stack</p><div className="mt-3 grid gap-2 md:grid-cols-2">{(["totalDepositIncome","monthlyRentIncome","vacancyRate","occupancyRate","rentFreeMonths","expectedInterestRate","targetYield","capRate"] as const).map((k) => (<label key={k} className="text-xs text-slate-300">{k}<MoneyInput value={vm.costModel[k]} onChange={(v) => onCostInput(k, v)} /></label>))}</div></CardContent></Card>
                </div>
                <div className="grid gap-3 md:grid-cols-3">{vm.revenueScenarios.map((s) => <Card key={s.scenarioName} className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-4"><p className="font-medium text-white">{s.scenarioName}</p><p className="text-sm text-slate-300">실효 월수입 {formatMoney(s.effectiveMonthlyIncome)}</p><p className="text-sm text-slate-300">연수입 {formatMoney(s.annualIncome)}</p><p className="text-sm text-slate-300">회수기간 {s.paybackYears.toFixed(1)}년</p><p className="text-sm text-slate-300">예상 자산가치 {formatMoney(s.estimatedValue)}</p><p className="text-xs text-amber-300">{s.warningMessage}</p></CardContent></Card>)}</div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Asset Value Panel</p><p className="text-sm text-slate-300">캡레이트 기반 가치: {formatMoney(vm.profitSummary.estimatedValue)}</p><p className="text-sm text-slate-300">공실 반영 가치: {formatMoney(vm.profitSummary.estimatedValue * (1 - vm.projectSummary.vacancyRate / 100))}</p><p className="text-sm text-slate-300">안정화 후 가치(placeholder): {formatMoney(vm.profitSummary.estimatedValue * 1.12)}</p><p className="text-xs text-slate-400">매각 시뮬레이션 placeholder 포함</p></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Warning System</p>{vm.profitSummary.warnings.map((w) => <div key={w} className="mt-2 rounded border border-amber-300/30 bg-amber-500/10 p-2 text-sm text-amber-100">{w}</div>)}<p className="mt-2 text-xs text-slate-400">공실률·회수기간·임대료 가정·이자부담 자동 경고</p></CardContent></Card>
                </div>
              </div>
            )}

            {vm.activeMenu === "contracts" && (
              <div className="space-y-4">
                <SectionTitle title="Contract Risk Management Workspace" desc="업종 검증과 특약 인텔리전스를 연결한 계약 자동화" />
                <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Contract Workspace</p><div className="mt-3 grid gap-3 md:grid-cols-4">
                  <label className="text-sm">계약 유형<select className="w-full rounded border p-2" value={vm.contractDraft.contractType} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, contractType: e.target.value as typeof prev.contractType }))}><option>상가 임대차계약서</option><option>입점의향서</option><option>제안협약서</option><option>마케팅 대행 계약서</option></select></label>
                  <label className="text-sm">업종<Input value={vm.contractDraft.tenantType} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, tenantType: e.target.value }))} /></label>
                  <label className="text-sm">층<Input value={vm.contractDraft.floorLabel} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, floorLabel: e.target.value }))} /></label>
                  <label className="text-sm">상태<select className="w-full rounded border p-2" value={vm.contractDraft.status} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))}><option>초안</option><option>검토중</option><option>수정중</option><option>완료</option></select></label>
                </div><div className="mt-3 grid gap-3 md:grid-cols-4">
                  <label className="text-sm">보증금<MoneyInput value={vm.contractDraft.deposit} onChange={(v) => vm.setContractDraft((prev) => ({ ...prev, deposit: v }))} /></label>
                  <label className="text-sm">월세<MoneyInput value={vm.contractDraft.monthlyRent} onChange={(v) => vm.setContractDraft((prev) => ({ ...prev, monthlyRent: v }))} /></label>
                  <label className="text-sm">관리비<MoneyInput value={vm.contractDraft.managementFee} onChange={(v) => vm.setContractDraft((prev) => ({ ...prev, managementFee: v }))} /></label>
                  <label className="text-sm">계약기간(월)<Input type="number" value={vm.contractDraft.termMonths} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, termMonths: Number(e.target.value) }))} /></label>
                </div><label className="mt-3 block text-sm">특약(줄바꿈으로 다중 입력)<textarea className="mt-1 w-full rounded border p-2 text-sm text-slate-900" rows={3} value={vm.contractDraft.specialClauses.join("\n")} onChange={(e) => vm.setContractDraft((prev) => ({ ...prev, specialClauses: e.target.value.split("\n").map((row) => row.trim()).filter(Boolean) }))} /></label></CardContent></Card>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Clause Intelligence</p><ul className="mt-2 space-y-1 text-xs text-slate-300"><li>음식점: 냄새/덕트/배수/민원</li><li>병원·약국: 인허가/간판/독점조건</li><li>학원: 소음/학생동선/운영시간</li><li>운동시설: 소음/진동/샤워 급배수</li><li>프랜차이즈: 본사 승인/브랜드 변경</li></ul></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Version History</p><p className="text-xs text-slate-300">초안 → 검토중 → 수정중 → 완료</p><p className="text-xs text-slate-400">현재 버전 v{vm.contractDraft.version} · 상태 {vm.contractDraft.status}</p></CardContent></Card>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4"><p className="mb-2 text-sm font-semibold text-white">Contract Preview (v{vm.contractDraft.version})</p><pre className="whitespace-pre-wrap break-words text-xs text-slate-300">{vm.contractPreview}</pre><p className="mt-2 text-xs text-amber-200">법무 검토 필요: 업종/특약/인허가 조항 확인</p><div className="mt-2 flex gap-2"><Button variant="outline" onClick={() => vm.runExport("contract", "copy")}><Copy className="mr-1 h-4 w-4" />복사하기</Button><Button variant="outline" onClick={() => vm.runExport("contract", "pdf")}><FileOutput className="mr-1 h-4 w-4" />PDF</Button><Button variant="outline" onClick={() => vm.runExport("contract", "docx")}><FileOutput className="mr-1 h-4 w-4" />DOCX</Button><StatusBadge status={vm.contractDraft.status} /></div></div>
              </div>
            )}

            {vm.activeMenu === "reports" && (
              <div className="space-y-4">
                <SectionTitle title="Report Studio" desc="건축주/내부/임차인용 보고서 생성 스튜디오" />
                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Report Type Selector</p><div className="mt-2 space-y-2">{vm.reports.map((r) => <button key={r.id} className={`w-full rounded-xl border p-2 text-left text-sm ${vm.selectedReportId === r.id ? "border-cyan-300/40 bg-cyan-500/10" : "border-slate-700 bg-slate-800/70"}`} onClick={() => vm.setSelectedReportId(r.id)}>{r.type}</button>)}</div></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100 xl:col-span-2"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Report Preview</p><div className="mt-2 rounded-xl border border-slate-700 bg-slate-950 p-4"><p className="text-base font-semibold text-white">{vm.selectedReport.type}</p><p className="text-sm text-slate-300">{vm.selectedReport.summary}</p><pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-300">{formatReportSummary(vm.project, vm.selectedReport, { profitSummary: vm.profitSummary, leadCount: vm.leads.length, topTenant: vm.filteredTenants[0]?.category, contractDraft: vm.contractDraft })}</pre><div className="mt-2 space-y-1">{vm.selectedReport.keySentences.map((k) => <div key={k} className="rounded bg-slate-800 p-2 text-sm text-slate-200">{k}</div>)}</div></div></CardContent></Card>
                </div>
                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Tone / Audience Option</p><div className="mt-2 grid gap-2 text-xs"><button className="rounded-lg border border-slate-700 bg-slate-800/70 p-2 text-left">내부용</button><button className="rounded-lg border border-slate-700 bg-slate-800/70 p-2 text-left">고객용</button><button className="rounded-lg border border-slate-700 bg-slate-800/70 p-2 text-left">투자자용</button><button className="rounded-lg border border-slate-700 bg-slate-800/70 p-2 text-left">임차인용</button></div></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Export Actions</p><div className="mt-2 flex flex-wrap gap-2"><Button variant="outline" onClick={() => vm.runExport("report", "copy")}>복사</Button><Button variant="outline" onClick={() => vm.runExport("report", "pdf")}>PDF</Button><Button variant="outline" onClick={() => vm.runExport("report", "docx")}>DOCX</Button><Button variant="outline" onClick={() => vm.runExport("report", "xlsx")}>HTML/XLSX</Button><Button variant="outline" onClick={() => vm.runExport("report", "pdf")}>인쇄</Button></div></CardContent></Card>
                  <Card className="border-slate-800 bg-slate-900/75 text-slate-100"><CardContent className="p-5"><p className="text-sm font-semibold text-white">Report Intelligence</p><ul className="mt-2 space-y-1 text-xs text-slate-300"><li>누락 데이터: 실거래 비교치, 유동인구 실측</li><li>보강 필요: 상층부 수요 근거</li><li>리포트 신뢰도: {Math.min(97, 65 + vm.reports.length * 4)}%</li><li>검토 필요 문구: 과도한 임대료 가정 여부</li></ul><p className="mt-2 text-xs text-slate-400">{vm.exportMessage || "출력 버튼을 누르면 준비 데이터가 생성됩니다."}</p></CardContent></Card>
                </div>
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
