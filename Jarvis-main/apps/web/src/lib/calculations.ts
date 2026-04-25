import type { CostModel, ProfitSummary, RevenueScenario } from "@/src/types/site-mind";

export function calculateProfitSummary(model: CostModel): ProfitSummary {
  const totalCost = model.landCost + model.buildCost + model.designCost + model.permitCost + model.financeCost + model.marketingCost + model.otherCost + model.maintenanceCost;
  const vacancyAdjustedIncome = model.monthlyRentIncome * (model.occupancyRate / 100) * (1 - model.vacancyRate / 100);
  const effectiveMonthlyIncome = Math.max(0, vacancyAdjustedIncome - (model.monthlyRentIncome / 12) * model.rentFreeMonths / 12);
  const annualIncome = effectiveMonthlyIncome * 12;
  const paybackYears = annualIncome > 0 ? (totalCost - model.totalDepositIncome) / annualIncome : 0;
  const breakEvenYears = annualIncome > 0 ? totalCost / annualIncome : 0;
  const estimatedValue = model.capRate > 0 ? (annualIncome / (model.capRate / 100)) : 0;

  const warnings: string[] = [];
  if (model.vacancyRate > 20) warnings.push("공실률이 높아 회수기간이 길어질 수 있습니다.");
  if (model.monthlyRentIncome < 35000000) warnings.push("임대료 가정을 보수적으로 재검토하세요.");
  if (model.totalDepositIncome < totalCost * 0.12) warnings.push("보증금 유입이 회수구조에 미치는 영향이 큽니다.");

  return { totalCost, effectiveMonthlyIncome, annualIncome, paybackYears, breakEvenYears, vacancyAdjustedIncome, estimatedValue, warnings };
}

export function generateScenarios(model: CostModel): RevenueScenario[] {
  const base = calculateProfitSummary(model);
  const scenario = (name: RevenueScenario["scenarioName"], occupancyDelta: number, rentDelta: number): RevenueScenario => {
    const effectiveMonthlyIncome = Math.max(0, base.effectiveMonthlyIncome * (1 + rentDelta) * (1 + occupancyDelta));
    const annualIncome = effectiveMonthlyIncome * 12;
    const paybackYears = annualIncome > 0 ? (base.totalCost - model.totalDepositIncome) / annualIncome : 0;
    const estimatedValue = model.capRate > 0 ? annualIncome / (model.capRate / 100) : 0;
    const warningMessage = occupancyDelta < 0 ? "보수형 가정으로 공실 리스크 반영" : occupancyDelta > 0 ? "공격형 가정으로 수요 낙관 반영" : "기준형 운영 가정";
    return { scenarioName: name, occupancyRate: model.occupancyRate * (1 + occupancyDelta), effectiveMonthlyIncome, annualIncome, paybackYears, estimatedValue, warningMessage };
  };

  return [scenario("보수형", -0.12, -0.08), scenario("기준형", 0, 0), scenario("공격형", 0.08, 0.06)];
}
