export type Study = {
  id: string;
  name: string;
  version: string;
  installedVersions: string[];
  isRunning: boolean;
  hasResults: boolean;
  script: string;
  /** True when the study's Docker image is present locally. */
  imageInstalled?: boolean;
};

export type AppView = "repository" | "settings" | "run";
