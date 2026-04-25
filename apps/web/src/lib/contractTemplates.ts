import type { ContractDraft, ContractTemplate } from "@/src/types/site-mind";
import { formatMoney } from "@/src/lib/format";

export function buildContractPreview(draft: ContractDraft, template: ContractTemplate): string {
  const clauses = draft.specialClauses.length > 0 ? draft.specialClauses.map((c, i) => `${i + 1}. ${c}`).join("\n") : "특약 없음";

  return template.bodyTemplate
    .replaceAll("{{projectName}}", draft.projectName ?? "SITE MIND 프로젝트")
    .replaceAll("{{tenantType}}", draft.tenantType)
    .replaceAll("{{floorLabel}}", draft.floorLabel)
    .replaceAll("{{deposit}}", formatMoney(draft.deposit))
    .replaceAll("{{monthlyRent}}", formatMoney(draft.monthlyRent))
    .replaceAll("{{managementFee}}", formatMoney(draft.managementFee))
    .replaceAll("{{termMonths}}", String(draft.termMonths))
    .replaceAll("{{rentFreeMonths}}", String(draft.rentFreeMonths))
    .replaceAll("{{specialClauses}}", clauses);
}
