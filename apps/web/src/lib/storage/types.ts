import type { ContractDraft, CostModel, Lead, Project, ProjectFile, ReportItem } from "@/src/types/site-mind";

export interface PersistedProjectState {
  project: Project;
  files: ProjectFile[];
  leads: Lead[];
  costModel: CostModel;
  contractDraft: ContractDraft;
  reports: ReportItem[];
  selectedReportId: string;
  lastSavedAt: string;
}

export interface RecentProjectItem {
  id: string;
  name: string;
  location: string;
  summary: string;
  lastOpenedAt: string;
  localPath?: string;
}

export interface RecentFileItem {
  id: string;
  projectId: string;
  fileName: string;
  openedAt: string;
}

export interface RecentReportItem {
  id: string;
  projectId: string;
  reportType: string;
  viewedAt: string;
}

export interface RecentContractItem {
  id: string;
  projectId: string;
  contractType: string;
  viewedAt: string;
}

export interface DesktopSettings {
  reportTone: string;
  currency: string;
  defaultYield: number;
  defaultClause: string;
  savePath: string;
  backupPath: string;
  reportPath: string;
  orgName: string;
  managerName: string;
  logoPath: string;
  contractTemplateName: string;
  templatePreset: string;
  autosaveIntervalSec: number;
}

export interface DesktopContext {
  lastProjectId: string;
  recentProjects: RecentProjectItem[];
  recentFiles: RecentFileItem[];
  recentReports: RecentReportItem[];
  recentContracts: RecentContractItem[];
  settings: DesktopSettings;
  lastBackupAt: string;
}

export interface StorageAdapter {
  loadDesktopContext(): DesktopContext;
  loadProjectState(projectId: string): PersistedProjectState | null;
  saveProjectState(projectId: string, payload: PersistedProjectState): void;
  saveDesktopSettings(settings: DesktopSettings): Promise<void>;
  pushRecentFile(file: RecentFileItem): void;
  pushRecentReport(item: RecentReportItem): void;
  pushRecentContract(item: RecentContractItem): void;
  markBackupNow(): void;
}
