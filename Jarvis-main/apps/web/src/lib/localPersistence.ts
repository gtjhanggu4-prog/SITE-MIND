import type { DesktopContext, DesktopSettings, PersistedProjectState, RecentContractItem, RecentFileItem, RecentProjectItem, RecentReportItem } from "@/src/lib/storage/types";

const APP_KEY = "site_mind_desktop_state_v2";

interface AppState {
  projects: Record<string, PersistedProjectState>;
  lastProjectId: string;
  recentProjects: RecentProjectItem[];
  recentFiles: RecentFileItem[];
  recentReports: RecentReportItem[];
  recentContracts: RecentContractItem[];
  settings: DesktopSettings;
  lastBackupAt: string;
}

export const defaultDesktopSettings: DesktopSettings = {
  reportTone: "전문적/간결",
  currency: "KRW",
  defaultYield: 6.8,
  defaultClause: "간판 디자인 가이드 준수",
  savePath: "C:/SITE_MIND/workspace",
  backupPath: "C:/SITE_MIND/backup",
  reportPath: "C:/SITE_MIND/reports",
  orgName: "SITE MIND Partners",
  managerName: "담당자",
  logoPath: "C:/SITE_MIND/assets/logo.png",
  contractTemplateName: "상가 임대차 기본 템플릿",
  templatePreset: "기본 템플릿 v1",
  autosaveIntervalSec: 1,
};

function fallbackState(): AppState {
  return {
    projects: {},
    lastProjectId: "p-001",
    recentProjects: [],
    recentFiles: [],
    recentReports: [],
    recentContracts: [],
    settings: defaultDesktopSettings,
    lastBackupAt: "",
  };
}

function readState(): AppState {
  if (typeof window === "undefined") return fallbackState();
  const raw = window.localStorage.getItem(APP_KEY);
  if (!raw) return fallbackState();
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...fallbackState(),
      ...parsed,
      settings: { ...defaultDesktopSettings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return fallbackState();
  }
}

function writeState(next: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APP_KEY, JSON.stringify(next));
}

export function loadProjectState(projectId: string): PersistedProjectState | null {
  return readState().projects[projectId] ?? null;
}

export function saveProjectState(projectId: string, payload: PersistedProjectState) {
  const current = readState();
  current.projects[projectId] = payload;
  current.lastProjectId = projectId;
  current.recentProjects = [
    { id: projectId, name: payload.project.name, location: payload.project.address, summary: payload.project.positioning, lastOpenedAt: new Date().toISOString() },
    ...current.recentProjects.filter((p) => p.id !== projectId),
  ].slice(0, 10);
  writeState(current);
}

export function loadDesktopContext(): DesktopContext {
  const current = readState();
  return {
    lastProjectId: current.lastProjectId,
    recentProjects: current.recentProjects,
    recentFiles: current.recentFiles,
    recentReports: current.recentReports,
    recentContracts: current.recentContracts,
    settings: current.settings,
    lastBackupAt: current.lastBackupAt,
  };
}

export function saveDesktopSettings(settings: DesktopSettings) {
  const current = readState();
  current.settings = settings;
  writeState(current);
}

export function pushRecentFile(file: RecentFileItem) {
  const current = readState();
  current.recentFiles = [file, ...current.recentFiles.filter((f) => f.id !== file.id)].slice(0, 20);
  writeState(current);
}

export function pushRecentReport(item: RecentReportItem) {
  const current = readState();
  current.recentReports = [item, ...current.recentReports.filter((r) => r.id !== item.id)].slice(0, 20);
  writeState(current);
}

export function pushRecentContract(item: RecentContractItem) {
  const current = readState();
  current.recentContracts = [item, ...current.recentContracts.filter((r) => r.id !== item.id)].slice(0, 20);
  writeState(current);
}

export function markBackupNow() {
  const current = readState();
  current.lastBackupAt = new Date().toISOString();
  writeState(current);
}
