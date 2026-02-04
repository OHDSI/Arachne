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

export function startStudyRun(packageId: number): Promise<{ id: number }> {
  return api.post(`/study-repository/packages/${packageId}/runs`);
}
