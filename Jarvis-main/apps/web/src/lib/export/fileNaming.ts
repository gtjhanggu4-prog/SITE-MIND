const sanitize = (v: string) => v.replace(/[\\/:*?"<>|\s]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");

const yyyymmdd = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
};

export function buildReportFileName(projectName: string, reportType: string) {
  return `SITE_MIND_건축주보고서_${sanitize(projectName)}_${sanitize(reportType)}_${yyyymmdd()}`;
}

export function buildContractFileName(_projectName: string, floor: string, tenantType: string) {
  return `SITE_MIND_계약초안_${sanitize(floor)}_${sanitize(tenantType)}_${yyyymmdd()}`;
}

export function buildProfitFileName(projectName: string) {
  return `SITE_MIND_수익분석_${sanitize(projectName)}_${yyyymmdd()}`;
}
