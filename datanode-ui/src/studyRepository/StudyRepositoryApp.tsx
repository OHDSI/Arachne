/*
 * Copyright 2023, 2025 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { StudyRepository } from "./components/study-repository";
import { SettingsPage } from "./components/settings-page";
import { StudyRunView } from "./components/study-run-view";
import { OutputBrowserModal } from "./components/output-browser-modal";
import type { Study } from "./types";
import {
  getStudyPackages,
  getStudyRepositorySettings,
  installStudyPackage,
  updateStudyPackageScript,
  deleteStudyPackage,
  saveStudyRepositorySettings,
  startStudyRun,
  type StudyPackageDTO,
} from "../api/study-repository";

function groupPackagesByName(packages: StudyPackageDTO[]): Map<string, StudyPackageDTO[]> {
  const map = new Map<string, StudyPackageDTO[]>();
  for (const pkg of packages) {
    const list = map.get(pkg.name) || [];
    list.push(pkg);
    map.set(pkg.name, list);
  }
  return map;
}

function packagesToStudies(
  packages: StudyPackageDTO[],
  selectedVersionByName: Record<string, string>
): Study[] {
  const byName = groupPackagesByName(packages);
  const studies: Study[] = [];
  for (const [name, pkgs] of byName) {
    const sorted = [...pkgs].sort((a, b) => b.id - a.id);
    const selectedVersion =
      selectedVersionByName[name] ?? sorted[0]?.version ?? "";
    const current = sorted.find((p) => p.version === selectedVersion) ?? sorted[0];
    if (!current) continue;
    studies.push({
      id: String(current.id),
      name: current.name,
      version: current.version,
      installedVersions: sorted.map((p) => p.version),
      isRunning: current.running,
      hasResults: current.hasResults,
      script: current.script ?? "",
    });
  }
  return studies.sort((a, b) => a.name.localeCompare(b.name));
}

export function StudyRepositoryApp() {
  const [currentView, setCurrentView] = useState<"repository" | "settings" | "run">("repository");
  const [catalogAddress, setCatalogAddress] = useState("");
  const [catalogUsername, setCatalogUsername] = useState("");
  const [catalogToken, setCatalogToken] = useState("");
  const [packages, setPackages] = useState<StudyPackageDTO[]>([]);
  const [selectedVersionByName, setSelectedVersionByName] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStudyId, setActiveStudyId] = useState<string | null>(null);
  const [browseStudyId, setBrowseStudyId] = useState<string | null>(null);
  const [catalogRepos, setCatalogRepos] = useState<string[]>([]);

  const studies = useMemo(
    () => packagesToStudies(packages, selectedVersionByName),
    [packages, selectedVersionByName]
  );
  const activeStudy = studies.find((s) => s.id === activeStudyId);
  const browseStudy = studies.find((s) => s.id === browseStudyId) ?? null;

  const fetchPackages = useCallback(async () => {
    try {
      const data = await getStudyPackages();
      setPackages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load studies");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getStudyRepositorySettings();
      setCatalogAddress(data?.catalogAddress ?? "");
      setCatalogUsername(data?.catalogUsername ?? "");
      setCatalogToken(data?.catalogToken ?? "");
    } catch {
      setCatalogAddress("");
      setCatalogUsername("");
      setCatalogToken("");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPackages();
    fetchSettings();
  }, [fetchPackages, fetchSettings]);

  const handleNavigate = (view: "repository" | "settings") => {
    setCurrentView(view);
    setActiveStudyId(null);
  };

  const handleInstallStudy = async (name: string) => {
    try {
      await installStudyPackage(name);
      await fetchPackages();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to install study");
    }
  };

  const handleSelectVersion = (name: string, version: string) => {
    setSelectedVersionByName((prev) => ({ ...prev, [name]: version }));
  };

  const handleUpdateStudy = async (id: string) => {
    // No-op for "update from catalog" until catalog integration exists; could refetch packages
    await fetchPackages();
  };

  const handleDeleteStudy = async (id: string) => {
    try {
      await deleteStudyPackage(Number(id));
      await fetchPackages();
      if (activeStudyId === id) {
        setActiveStudyId(null);
        setCurrentView("repository");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete study");
    }
  };

  const handleRunStudy = (id: string) => {
    setActiveStudyId(id);
    setCurrentView("run");
  };

  const handleViewResults = (id: string) => {
    // Results viewer URL (e.g. R Shiny or static server); configure as needed
    window.open(`http://localhost:3838/results/${id}`, "_blank");
  };

  const handleBrowseOutputs = (id: string) => {
    setBrowseStudyId(id);
  };

  const handleSaveScript = async (script: string) => {
    if (!activeStudyId) return;
    try {
      await updateStudyPackageScript(Number(activeStudyId), script);
      await fetchPackages();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save script");
    }
  };

  const handleRunStudyExecute = async () => {
    if (!activeStudyId) return;
    try {
      await startStudyRun(Number(activeStudyId));
      await fetchPackages();
      setActiveStudyId(null);
      setCurrentView("repository");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start run");
    }
  };

  const handleShutdownStudy = async (id: string) => {
    // Backend could add stop endpoint; for now just refetch
    await fetchPackages();
  };

  const handleBackToRepository = () => {
    setActiveStudyId(null);
    setCurrentView("repository");
  };

  const handleSaveSettings = async (address: string, username: string, token: string) => {
    try {
      await saveStudyRepositorySettings(address, username, token);
      setCatalogAddress(address);
      setCatalogUsername(username);
      setCatalogToken(token);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    }
  };

  const getBreadcrumbs = () => {
    switch (currentView) {
      case "repository":
        return ["Study Repository"];
      case "settings":
        return ["Settings"];
      case "run":
        return ["Study Repository", activeStudy?.name ?? "Run Study"];
      default:
        return [];
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading study repository...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeView={currentView === "run" ? "repository" : currentView}
        onViewChange={handleNavigate}
      />
      <div className="flex flex-1 flex-col ml-[70px]">
        <Header breadcrumbs={getBreadcrumbs()} />
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 text-sm">
            {error}
          </div>
        )}
        <main className="flex-1 overflow-auto" style={{ minHeight: "calc(100vh - 50px)" }}>
          {currentView === "repository" && (
            <StudyRepository
              studies={studies}
              catalogRepos={catalogRepos}
              onInstall={handleInstallStudy}
              onUpdate={handleUpdateStudy}
              onRun={handleRunStudy}
              onViewResults={handleViewResults}
              onBrowseOutputs={handleBrowseOutputs}
              onShutdown={handleShutdownStudy}
              onDelete={handleDeleteStudy}
              onSelectVersion={handleSelectVersion}
            />
          )}
          {currentView === "settings" && (
            <SettingsPage
              catalogAddress={catalogAddress}
              catalogUsername={catalogUsername}
              catalogToken={catalogToken}
              onSave={handleSaveSettings}
            />
          )}
          {currentView === "run" && activeStudy && (
            <StudyRunView
              study={activeStudy}
              onBack={handleBackToRepository}
              onSaveScript={handleSaveScript}
              onRunStudy={handleRunStudyExecute}
            />
          )}
        </main>
      </div>

      <OutputBrowserModal
        study={browseStudy}
        open={!!browseStudyId}
        onClose={() => setBrowseStudyId(null)}
      />
    </div>
  );
}
