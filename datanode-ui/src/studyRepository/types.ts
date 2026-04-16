export type Study = {
  id: string;
  name: string;
  version: string;
  installedVersions: string[];
  isRunning: boolean;
  /** True when the study Docker container is running (loaded). */
  isLoaded: boolean;
  hasResults: boolean;
  /** True when the study's Docker image is present locally. */
  imageInstalled?: boolean;
  /** DOWNLOADING, READY, FAILED */
  status?: string;
  /** Error message when status is FAILED */
  statusMessage?: string;
};

export type AppView = "repository" | "settings" | "run";
