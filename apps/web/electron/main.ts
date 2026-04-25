import { app, BrowserWindow } from "electron";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { registerFileHandlers } from "./ipc/fileHandlers";
import { registerSettingsHandlers } from "./ipc/settingsHandlers";
import { registerExportHandlers } from "./ipc/exportHandlers";

const isDev = process.env.NODE_ENV !== "production";
const rendererUrl = process.env.ELECTRON_RENDERER_URL || "http://localhost:3000";

function getIndexHtmlPath() {
  return path.join(__dirname, "../out/index.html");
}

async function createMainWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1280,
    minHeight: 800,
    title: "SITE MIND",
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    await window.loadURL(rendererUrl);
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  const indexHtmlPath = getIndexHtmlPath();
  if (fs.existsSync(indexHtmlPath)) {
    await window.loadURL(pathToFileURL(indexHtmlPath).toString());
    return;
  }

  await window.loadURL(rendererUrl);
}

app.setName("SITE MIND");

app.whenReady().then(async () => {
  registerFileHandlers();
  registerSettingsHandlers();
  registerExportHandlers();

  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
