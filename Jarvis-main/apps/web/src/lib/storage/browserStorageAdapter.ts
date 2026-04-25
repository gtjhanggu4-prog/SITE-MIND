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
import type { StorageAdapter } from "./types";

export const browserStorageAdapter: StorageAdapter = {
  loadDesktopContext,
  loadProjectState,
  saveProjectState,
  saveDesktopSettings: async (settings) => {
    saveDesktopSettings(settings);
  },
  pushRecentFile,
  pushRecentReport,
  pushRecentContract,
  markBackupNow,
};
