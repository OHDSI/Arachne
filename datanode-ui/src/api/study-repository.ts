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
  hasResults: boolean;
};

export type StudyRepositorySettingsDTO = {
  catalogAddress: string | null;
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
  return api.post("/study-repository/packages", { name, version: version || "1.0.0" });
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

export function getStudyRepositorySettings(): Promise<StudyRepositorySettingsDTO> {
  return api.get("/study-repository/settings");
}

export function saveStudyRepositorySettings(
  catalogAddress: string,
  catalogToken: string
): Promise<void> {
  return api.post("/study-repository/settings", {
    catalogAddress: catalogAddress || null,
    catalogToken: catalogToken || null,
  });
}

export type ConnectionCheckResult = {
  success: boolean;
  message: string;
  /** Repository names from the registry catalog when connection test succeeds. */
  repositories?: string[];
};

export function checkStudyRepositoryConnection(
  catalogAddress: string,
  catalogToken: string
): Promise<ConnectionCheckResult> {
  return api.post("/study-repository/settings/check-connection", {
    catalogAddress: catalogAddress || null,
    catalogToken: catalogToken || null,
  });
}

export function startStudyRun(packageId: number): Promise<{ id: number }> {
  return api.post(`/study-repository/packages/${packageId}/runs`);
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
