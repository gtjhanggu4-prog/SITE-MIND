export interface SiteMindOpenFileResult {
  canceled: boolean;
  path?: string;
  name?: string;
  extension?: string;
}

export interface SiteMindSaveFilePayload {
  defaultFileName: string;
  content: string;
  extension?: string;
}

export interface SiteMindWriteResult {
  ok: boolean;
  path?: string;
  message?: string;
}

export interface AppSettings {
  savePath: string;
  backupPath: string;
  reportPath: string;
  orgName: string;
  managerName: string;
  autosaveIntervalSec: number;
  reportTone: string;
  contractTemplateName: string;
}

export interface RecentProjectItem {
  projectId: string;
  projectName: string;
  location: string;
  lastOpenedAt: string;
  localPath?: string;
  summary: string;
}

export interface ExportPayload {
  fileName: string;
  format: string;
  content: string;
}
