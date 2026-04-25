import { ipcMain } from "electron";
import { IPC_CHANNELS } from "./channels";
import type { ExportPayload, SiteMindWriteResult } from "../types";
import { showSaveFileDialog } from "./fileHandlers";

function toExtension(format: string): string {
  if (format === "docx") return "md";
  if (format === "xlsx") return "json";
  if (format === "pdf") return "md";
  return format;
}

export function registerExportHandlers() {
  ipcMain.handle(IPC_CHANNELS.EXPORT_REPORT, async (_event, payload: ExportPayload): Promise<SiteMindWriteResult> => {
    return showSaveFileDialog({
      defaultFileName: payload.fileName,
      content: payload.content,
      extension: toExtension(payload.format),
    });
  });

  ipcMain.handle(IPC_CHANNELS.EXPORT_CONTRACT, async (_event, payload: ExportPayload): Promise<SiteMindWriteResult> => {
    return showSaveFileDialog({
      defaultFileName: payload.fileName,
      content: payload.content,
      extension: toExtension(payload.format),
    });
  });
}
