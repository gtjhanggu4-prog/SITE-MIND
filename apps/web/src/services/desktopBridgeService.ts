export const desktopBridgeService = {
  async openFile() {
    if (typeof window === "undefined" || !window.siteMind?.openFile) return { canceled: true };
    return window.siteMind.openFile();
  },
  async saveFile(payload: { defaultFileName: string; content: string; extension?: string }) {
    if (typeof window === "undefined" || !window.siteMind?.saveFile) return { ok: false, message: "bridge unavailable" };
    return window.siteMind.saveFile(payload);
  },
  async selectDirectory() {
    if (typeof window === "undefined" || !window.siteMind?.selectDirectory) return "";
    return window.siteMind.selectDirectory();
  },
};
