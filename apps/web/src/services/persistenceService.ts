import { storageService } from "@/src/lib/storage/storageService";
import type { DesktopSettings, PersistedProjectState, RecentProjectItem } from "@/src/lib/storage/types";

export const persistenceService = {
  loadDesktopContext: storageService.loadDesktopContext,
  loadProjectState: storageService.loadProjectState,
  saveProjectState: (projectId: string, state: PersistedProjectState) => {
    storageService.saveProjectState(projectId, state);
    const context = storageService.loadDesktopContext();
    const project = context.recentProjects.find((item) => item.id === projectId);
    if (project && typeof window !== "undefined" && window.siteMind?.saveRecentProject) {
      void window.siteMind.saveRecentProject({
        projectId: project.id,
        projectName: project.name,
        location: project.location,
        summary: project.summary,
        lastOpenedAt: project.lastOpenedAt,
        localPath: context.settings.savePath,
      });
    }
  },
  saveDesktopSettings: async (settings: DesktopSettings) => {
    await storageService.saveDesktopSettings(settings);
  },
  pushRecentFile: storageService.pushRecentFile,
  pushRecentReport: storageService.pushRecentReport,
  pushRecentContract: storageService.pushRecentContract,
  markBackupNow: () => {
    storageService.markBackupNow();
  },
  loadElectronRecentProjects: async (): Promise<RecentProjectItem[]> => {
    if (typeof window === "undefined" || !window.siteMind?.getRecentProjects) return [];
    const rows = await window.siteMind.getRecentProjects();
    return rows.map((item) => ({
      id: item.projectId,
      name: item.projectName,
      location: item.location,
      summary: item.summary,
      lastOpenedAt: item.lastOpenedAt,
      localPath: item.localPath,
    }));
  },
};
