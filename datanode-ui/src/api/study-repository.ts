/*
 * Copyright 2023, 2025 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

import { api } from "./";

export type StudyPackageDTO = {
  id: number;
  name: string;
  version: string;
  script: string;
  running: boolean;
  /** True when the study Docker container is running (image loaded and container up). */
  loaded: boolean;
  hasResults: boolean;
  /** True when the study's Docker image is present locally. */
  imageInstalled?: boolean;
};

export type StudyRepositorySettingsDTO = {
  catalogAddress: string | null;
  catalogUsername: string | null;
  catalogToken: string | null;
};

export function getStudyPackages(): Promise<StudyPackageDTO[]> {
  return api.get("/study-repository/packages");
}

export function getStudyPackage(id: number): Promise<StudyPackageDTO> {
  return api.get(`/study-repository/packages/${id}`);
}

export function installStudyPackage(
  name: string,
  version?: string
): Promise<StudyPackageDTO> {
  return api.post("/study-repository/packages", { name, version: version || "latest" });
}

export function updateStudyPackageScript(
  id: number,
  script: string
): Promise<StudyPackageDTO> {
  return api.patch(`/study-repository/packages/${id}/script`, { script });
}

export function deleteStudyPackage(id: number): Promise<void> {
  return api.delete(`/study-repository/packages/${id}`);
}

/** Pull the study image from the registry (docker pull). Use when image is not installed locally. */
export function refreshStudyPackage(id: number): Promise<StudyPackageDTO> {
  return api.post(`/study-repository/packages/${id}/refresh`);
}

export function getStudyRepositorySettings(): Promise<StudyRepositorySettingsDTO> {
  return api.get("/study-repository/settings");
}

/** Study environment variables (injected into study containers; use Sys.getenv() in codeToRun.R) */
export type StudyEnvironmentVariableDTO = {
  id: number;
  name: string;
  value?: string;
};

export function getStudyEnvVars(): Promise<StudyEnvironmentVariableDTO[]> {
  return api.get("/study-repository/env-vars");
}

export function getStudyEnvVar(id: number): Promise<StudyEnvironmentVariableDTO> {
  return api.get(`/study-repository/env-vars/${id}`);
}

export function createStudyEnvVar(name: string, value: string): Promise<StudyEnvironmentVariableDTO> {
  return api.post("/study-repository/env-vars", { name, value });
}

export function updateStudyEnvVar(id: number, value: string): Promise<StudyEnvironmentVariableDTO> {
  return api.put(`/study-repository/env-vars/${id}`, { value });
}

export function deleteStudyEnvVar(id: number): Promise<void> {
  return api.delete(`/study-repository/env-vars/${id}`);
}

export function saveStudyRepositorySettings(
  catalogAddress: string,
  catalogUsername: string,
  catalogToken: string
): Promise<void> {
  return api.post("/study-repository/settings", {
    catalogAddress: catalogAddress || null,
    catalogUsername: catalogUsername || null,
    catalogToken: catalogToken || null,
  });
}

export type ContainerSummary = {
  id: string;
  image: string;
  status: string;
};

export type ConnectionCheckResult = {
  success: boolean;
  message: string;
  /** Repository names from the registry catalog when connection test succeeds. */
  repositories?: string[];
  /** Containers from the Docker host (when Docker login succeeded). */
  containers?: ContainerSummary[];
  /** Local image names (repo:tag) from the Docker host for this registry. */
  localImages?: string[];
};

export function checkStudyRepositoryConnection(
  catalogAddress: string,
  catalogToken: string,
  catalogUsername?: string
): Promise<ConnectionCheckResult> {
  return api.post("/study-repository/settings/check-connection", {
    catalogAddress: catalogAddress || null,
    catalogToken: catalogToken || null,
    catalogUsername: catalogUsername || null,
  });
}

export function startStudyRun(packageId: number): Promise<{ id: number }> {
  return api.post(`/study-repository/packages/${packageId}/runs`);
}

/** Start study container and return codeToRun.R content + version for the editor. */
export function startStudyContainer(
  packageId: number
): Promise<{ script: string; version: number }> {
  return api.post(`/study-repository/packages/${packageId}/start`);
}

/** Get DB-backed codeToRun.R (content + version). Seeds from image if needed. */
export function getCodeToRun(packageId: number): Promise<{ content: string; version: number }> {
  return api.get(`/study-repository/packages/${packageId}/codeToRun`);
}

/** Update codeToRun.R with optimistic concurrency. Returns { content, version } or 409 on conflict. */
export function putCodeToRun(
  packageId: number,
  body: { content: string; version: number }
): Promise<{ content: string; version: number }> {
  return api.put(`/study-repository/packages/${packageId}/codeToRun`, body);
}

/** Stop study container. */
export function stopStudyContainer(packageId: number): Promise<void> {
  return api.post(`/study-repository/packages/${packageId}/stop`);
}

/** Shiny results viewer status and URL. */
export type ShinyStatusDTO = { running: boolean; url: string };

export function getShinyStatus(packageId: number): Promise<ShinyStatusDTO> {
  return api.get(`/study-repository/packages/${packageId}/shiny/status`);
}

/** Start Shiny results viewer in container; if already running returns URL. */
export function startShiny(packageId: number): Promise<{ url: string; running: boolean }> {
  return api.post(`/study-repository/packages/${packageId}/shiny/start`);
}

/** Stop Shiny results viewer in container. */
export function stopShiny(packageId: number): Promise<void> {
  return api.post(`/study-repository/packages/${packageId}/shiny/stop`);
}

/** R console output from Shiny app in container (for debugging). */
export function getShinyLogs(packageId: number): Promise<string> {
  return api.get(`/study-repository/packages/${packageId}/shiny/logs`, {
    responseType: "text",
  }).then((r) => (typeof r === "string" ? r : ""));
}

/** Execute the R script in the study container; returns run id, status, and logs. */
export function executeStudyScript(
  packageId: number,
  script: string
): Promise<{ runId: number; status: string; logs: string }> {
  return api.post(`/study-repository/packages/${packageId}/execute`, { script });
}

/** One directory entry from inside the running study container. */
export type ContainerFileEntry = { name: string; type: "DIR" | "FILE" }

/** List directory contents inside the running study container (path under /code). */
export function listContainerFiles(
  packageId: number,
  path: string = "/code"
): Promise<ContainerFileEntry[]> {
  return api.get(`/study-repository/packages/${packageId}/container-files`, {
    params: { path },
  });
}

export type RepositoryTagsDTO = {
  repo: string;
  tags: string[];
};

/**
 * Get tags for a single study (Docker repo) from the configured registry.
 * Used to populate study versions. Example repo: "myteam/myimage".
 */
export function getStudyRepositoryTags(
  repo: string,
  n: number = 100
): Promise<RepositoryTagsDTO> {
  return api.get("/study-repository/tags", { params: { repo, n } });
}

/** Study run summary for Browse Outputs. */
export type StudyRunDTO = {
  id: number;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  resultPath: string | null;
  fileCount: number;
};

/** List runs for a study package (newest first). */
export function getStudyRuns(packageId: number): Promise<StudyRunDTO[]> {
  return api.get(`/study-repository/packages/${packageId}/runs`);
}

/** Result file entry (export folder contents saved after run). */
export type StudyRunResultFileDTO = { filePath: string; size: number };

/** List result files for a run (paths relative to export folder). */
export function getStudyRunResultFiles(
  packageId: number,
  runId: number
): Promise<StudyRunResultFileDTO[]> {
  return api.get(`/study-repository/packages/${packageId}/runs/${runId}/result-files`);
}

/** Download a single result file. Returns blob for save/open. */
export function downloadResultFile(
  packageId: number,
  runId: number,
  filePath: string
): Promise<Blob> {
  return api.get(
    `/study-repository/packages/${packageId}/runs/${runId}/result-files/download`,
    { params: { path: filePath }, responseType: "blob" }
  );
}
