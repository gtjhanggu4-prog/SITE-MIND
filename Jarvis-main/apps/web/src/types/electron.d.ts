export {};

interface SiteMindOpenFileResult {
  canceled: boolean;
  path?: string;
  name?: string;
  extension?: string;
}

interface SiteMindWriteResult {
  ok: boolean;
  path?: string;
  message?: string;
}

interface SiteMindSaveFilePayload {
  defaultFileName: string;
  content: string;
  extension?: string;
}

interface SiteMindAppSettings {
  savePath: string;
  backupPath: string;
  reportPath: string;
  orgName: string;
  managerName: string;
  autosaveIntervalSec: number;
  reportTone: string;
  contractTemplateName: string;
}

interface SiteMindRecentProject {
  projectId: string;
  projectName: string;
  location: string;
  lastOpenedAt: string;
  localPath?: string;
  summary: string;
}

declare global {
  interface Window {
    siteMind?: {
      openFile: () => Promise<SiteMindOpenFileResult>;
      saveFile: (payload: SiteMindSaveFilePayload) => Promise<SiteMindWriteResult>;
      selectDirectory: () => Promise<string>;
      getAppSettings: () => Promise<SiteMindAppSettings>;
      saveAppSettings: (settings: SiteMindAppSettings) => Promise<SiteMindWriteResult>;
      getRecentProjects: () => Promise<SiteMindRecentProject[]>;
      saveRecentProject: (project: SiteMindRecentProject) => Promise<SiteMindWriteResult>;
      exportReport: (payload: { fileName: string; format: string; content: string }) => Promise<SiteMindWriteResult>;
      exportContract: (payload: { fileName: string; format: string; content: string }) => Promise<SiteMindWriteResult>;
    };
  }
}
