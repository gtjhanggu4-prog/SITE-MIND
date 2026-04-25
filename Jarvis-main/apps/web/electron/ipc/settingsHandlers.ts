import { app, ipcMain } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import { IPC_CHANNELS } from "./channels";
import type { AppSettings, RecentProjectItem, SiteMindWriteResult } from "../types";

const SETTINGS_FILE = "settings.json";
const RECENT_PROJECTS_FILE = "recent-projects.json";

const defaultSettings: AppSettings = {
  savePath: "C:/SITE_MIND/workspace",
  backupPath: "C:/SITE_MIND/backup",
  reportPath: "C:/SITE_MIND/reports",
  orgName: "SITE MIND Partners",
  managerName: "담당자",
  autosaveIntervalSec: 60,
  reportTone: "전문적/간결",
  contractTemplateName: "상가 임대차 기본 템플릿",
};

function getUserDataPath(fileName: string) {
  return path.join(app.getPath("userData"), fileName);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, payload: unknown): Promise<SiteMindWriteResult> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
    return { ok: true, path: filePath };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "저장에 실패했습니다." };
  }
}

export function registerSettingsHandlers() {
  ipcMain.handle(IPC_CHANNELS.GET_APP_SETTINGS, async (): Promise<AppSettings> => {
    const settingsPath = getUserDataPath(SETTINGS_FILE);
    const stored = await readJsonFile<Partial<AppSettings>>(settingsPath, {});
    return { ...defaultSettings, ...stored };
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_APP_SETTINGS, async (_event, settings: AppSettings): Promise<SiteMindWriteResult> => {
    const settingsPath = getUserDataPath(SETTINGS_FILE);
    return writeJsonFile(settingsPath, settings);
  });

  ipcMain.handle(IPC_CHANNELS.GET_RECENT_PROJECTS, async (): Promise<RecentProjectItem[]> => {
    const recentPath = getUserDataPath(RECENT_PROJECTS_FILE);
    return readJsonFile<RecentProjectItem[]>(recentPath, []);
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_RECENT_PROJECT, async (_event, payload: RecentProjectItem): Promise<SiteMindWriteResult> => {
    const recentPath = getUserDataPath(RECENT_PROJECTS_FILE);
    const current = await readJsonFile<RecentProjectItem[]>(recentPath, []);
    const merged = [payload, ...current.filter((item) => item.projectId !== payload.projectId)].slice(0, 20);
    return writeJsonFile(recentPath, merged);
  });
}
