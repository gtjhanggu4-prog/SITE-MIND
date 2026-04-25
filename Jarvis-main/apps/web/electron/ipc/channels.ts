export const IPC_CHANNELS = {
  OPEN_FILE: "siteMind:file:open",
  SAVE_FILE: "siteMind:file:save",
  SELECT_DIRECTORY: "siteMind:directory:select",
  GET_APP_SETTINGS: "siteMind:settings:get",
  SAVE_APP_SETTINGS: "siteMind:settings:save",
  GET_RECENT_PROJECTS: "siteMind:recentProjects:get",
  SAVE_RECENT_PROJECT: "siteMind:recentProjects:save",
  EXPORT_REPORT: "siteMind:export:report",
  EXPORT_CONTRACT: "siteMind:export:contract",
} as const;
