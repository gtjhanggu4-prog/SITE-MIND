import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS } from "./ipc/channels";
import type { AppSettings, ExportPayload, RecentProjectItem, SiteMindSaveFilePayload } from "./types";

contextBridge.exposeInMainWorld("siteMind", {
  openFile: () => ipcRenderer.invoke(IPC_CHANNELS.OPEN_FILE),
  saveFile: (payload: SiteMindSaveFilePayload) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_FILE, payload),
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIRECTORY),
  getAppSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_APP_SETTINGS),
  saveAppSettings: (settings: AppSettings) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_APP_SETTINGS, settings),
  getRecentProjects: () => ipcRenderer.invoke(IPC_CHANNELS.GET_RECENT_PROJECTS),
  saveRecentProject: (project: RecentProjectItem) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_RECENT_PROJECT, project),
  exportReport: (payload: ExportPayload) => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_REPORT, payload),
  exportContract: (payload: ExportPayload) => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_CONTRACT, payload),
});
