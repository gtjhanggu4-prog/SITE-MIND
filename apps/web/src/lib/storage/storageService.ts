import { browserStorageAdapter } from "./browserStorageAdapter";
import { electronStorageAdapter } from "./electronStorageAdapter";
import type { StorageAdapter } from "./types";

function resolveAdapter(): StorageAdapter {
  if (typeof window !== "undefined" && window.siteMind) {
    return electronStorageAdapter;
  }
  return browserStorageAdapter;
}

export const storageService = {
  loadDesktopContext: () => resolveAdapter().loadDesktopContext(),
  loadProjectState: (projectId: string) => resolveAdapter().loadProjectState(projectId),
  saveProjectState: (projectId: string, payload: Parameters<StorageAdapter["saveProjectState"]>[1]) => resolveAdapter().saveProjectState(projectId, payload),
  saveDesktopSettings: async (settings: Parameters<StorageAdapter["saveDesktopSettings"]>[0]) => resolveAdapter().saveDesktopSettings(settings),
  pushRecentFile: (file: Parameters<StorageAdapter["pushRecentFile"]>[0]) => resolveAdapter().pushRecentFile(file),
  pushRecentReport: (item: Parameters<StorageAdapter["pushRecentReport"]>[0]) => resolveAdapter().pushRecentReport(item),
  pushRecentContract: (item: Parameters<StorageAdapter["pushRecentContract"]>[0]) => resolveAdapter().pushRecentContract(item),
  markBackupNow: () => resolveAdapter().markBackupNow(),
};
