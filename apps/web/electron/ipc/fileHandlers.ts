import { app, dialog, ipcMain } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import { IPC_CHANNELS } from "./channels";
import type { SiteMindOpenFileResult, SiteMindSaveFilePayload, SiteMindWriteResult } from "../types";

function parseFileMeta(filePath: string): SiteMindOpenFileResult {
  return {
    canceled: false,
    path: filePath,
    name: path.basename(filePath),
    extension: path.extname(filePath).replace(".", "").toLowerCase(),
  };
}

export async function showSaveFileDialog(payload: SiteMindSaveFilePayload): Promise<SiteMindWriteResult> {
  try {
    const result = await dialog.showSaveDialog({
      title: "파일 저장",
      defaultPath: payload.defaultFileName,
      filters: payload.extension ? [{ name: payload.extension.toUpperCase(), extensions: [payload.extension] }] : undefined,
    });

    if (result.canceled || !result.filePath) {
      return { ok: false, message: "저장이 취소되었습니다." };
    }

    await fs.writeFile(result.filePath, payload.content, "utf-8");
    return { ok: true, path: result.filePath };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "파일 저장에 실패했습니다." };
  }
}

export function registerFileHandlers() {
  ipcMain.handle(IPC_CHANNELS.OPEN_FILE, async (): Promise<SiteMindOpenFileResult> => {
    const result = await dialog.showOpenDialog({
      title: "파일 열기",
      properties: ["openFile"],
    });

    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    return parseFileMeta(result.filePaths[0]);
  });

  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async (): Promise<string> => {
    const result = await dialog.showOpenDialog({
      title: "저장 폴더 선택",
      defaultPath: app.getPath("documents"),
      properties: ["openDirectory", "createDirectory"],
    });

    return result.canceled ? "" : (result.filePaths[0] ?? "");
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_FILE, async (_event, payload: SiteMindSaveFilePayload): Promise<SiteMindWriteResult> => showSaveFileDialog(payload));
}
