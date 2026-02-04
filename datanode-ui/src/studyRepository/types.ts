export type Study = {
  id: string;
  name: string;
  version: string;
  installedVersions: string[];
  isRunning: boolean;
  hasResults: boolean;
  script: string;
};

export type AppView = "repository" | "settings" | "run";
