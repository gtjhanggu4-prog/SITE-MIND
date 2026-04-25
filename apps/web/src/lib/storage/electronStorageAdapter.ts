import {
  loadDesktopContext,
  loadProjectState,
  markBackupNow,
  pushRecentContract,
  pushRecentFile,
  pushRecentReport,
  saveDesktopSettings,
  saveProjectState,
} from "@/src/lib/localPersistence";
import type { DesktopSettings, StorageAdapter } from "./types";

export const electronStorageAdapter: StorageAdapter = {
  loadDesktopContext,
  loadProjectState,
  saveProjectState,
  saveDesktopSettings: async (settings: DesktopSettings) => {
    saveDesktopSettings(settings);
    await window.siteMind?.saveAppSettings({
      savePath: settings.savePath,
      backupPath: settings.backupPath,
      reportPath: settings.reportPath,
      orgName: settings.orgName,
      managerName: settings.managerName,
      autosaveIntervalSec: settings.autosaveIntervalSec,
      reportTone: settings.reportTone,
      contractTemplateName: settings.contractTemplateName,
    });
  },
  pushRecentFile,
  pushRecentReport,
  pushRecentContract,
  markBackupNow: () => {
    markBackupNow();
  },
};
