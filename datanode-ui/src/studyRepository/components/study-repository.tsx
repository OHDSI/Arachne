
import { useState } from "react"
import {
  Download,
  RefreshCw,
  Play,
  Eye,
  FolderOpen,
  Square,
  Trash2,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import type { Study } from "../types"

interface StudyRepositoryProps {
  studies: Study[]
  /** Repository names from the catalog (populated when connection test succeeds in Settings). */
  catalogRepos?: string[]
  onInstall: (name: string) => void | Promise<void>
  onUpdate: (id: string) => void | Promise<void>
  onRun: (id: string) => void
  onViewResults: (id: string) => void
  onBrowseOutputs: (id: string) => void
  onShutdown: (id: string) => void
  onDelete: (id: string) => void
  onSelectVersion?: (name: string, version: string) => void
}

export function StudyRepository({
  studies,
  catalogRepos = [],
  onInstall,
  onUpdate,
  onRun,
  onViewResults,
  onBrowseOutputs,
  onShutdown,
  onDelete,
  onSelectVersion,
}: StudyRepositoryProps) {
  const [studyName, setStudyName] = useState("")
  const [isInstalling, setIsInstalling] = useState(false)
  const [updatingIds, setUpdatingIds] = useState<string[]>([])
  const [deleteStudy, setDeleteStudy] = useState<Study | null>(null)
  const [shutdownStudy, setShutdownStudy] = useState<Study | null>(null)

  const handleInstall = async () => {
    if (!studyName.trim()) return
    setIsInstalling(true)
    try {
      await onInstall(studyName.trim())
      setStudyName("")
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUpdate = async (id: string) => {
    setUpdatingIds((prev) => [...prev, id])
    try {
      await onUpdate(id)
    } finally {
      setUpdatingIds((prev) => prev.filter((i) => i !== id))
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Install Section */}
      <Card className="mb-6 shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Install New Study
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Study name (as it appears in the catalog)"
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInstall()}
                list={catalogRepos.length > 0 ? "install-study-repos" : undefined}
                className="w-full"
              />
              {catalogRepos.length > 0 && (
                <datalist id="install-study-repos">
                  {catalogRepos.map((repo) => (
                    <option key={repo} value={repo} />
                  ))}
                </datalist>
              )}
            </div>
            <Button
              onClick={handleInstall}
              disabled={!studyName.trim() || isInstalling}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isInstalling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter the exact study name from your configured catalog to install it locally.
          </p>
        </CardContent>
      </Card>

      {/* Installed Studies List */}
      <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Installed Studies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {studies.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No studies installed yet.</p>
              <p className="text-sm">Use the form above to install a study from your catalog.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_100px_100px_auto] gap-4 px-4 py-3 bg-info/10 text-sm font-medium text-foreground">
                <div>Study Name</div>
                <div>Version</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              {/* Table Rows */}
              {studies.map((study) => (
                <div
                  key={study.id}
                  className="grid grid-cols-[1fr_100px_100px_auto] gap-4 px-4 py-3 items-center hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <span className="font-medium text-foreground">{study.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">linked to catalog</span>
                  </div>
                  <div className="text-sm">
                    {study.installedVersions.length > 1 ? (
                      <Select
                        value={study.version}
                        onValueChange={(v) => onSelectVersion?.(study.name, v)}
                      >
                        <SelectTrigger className="h-7 w-[100px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {study.installedVersions
                            .slice()
                            .reverse()
                            .map((v) => (
                              <SelectItem key={v} value={v} className="text-xs">
                                v{v}
                                {v === study.version && (
                                  <span className="ml-1 text-muted-foreground">(active)</span>
                                )}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-chip/20 text-foreground">
                        v{study.version}
                      </span>
                    )}
                  </div>
                  <div>
                    {study.isRunning ? (
                      <span className="inline-flex items-center gap-1 text-xs text-info">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Running
                      </span>
                    ) : study.hasResults ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <CheckCircle2 className="w-3 h-3" />
                        Results ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Circle className="w-3 h-3" />
                        Idle
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdate(study.id)}
                            disabled={updatingIds.includes(study.id)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${updatingIds.includes(study.id) ? "animate-spin" : ""}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Update</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRun(study.id)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Run this study</TooltipContent>
                      </Tooltip>

                      {study.hasResults && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewResults(study.id)}
                                className="text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View results</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onBrowseOutputs(study.id)}
                                className="text-primary hover:text-primary hover:bg-primary/10"
                              >
                                <FolderOpen className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Browse outputs</TooltipContent>
                          </Tooltip>
                        </>
                      )}

                      {study.isRunning && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShutdownStudy(study)}
                              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                            >
                              <Square className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Shutdown study</TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteStudy(study)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete study</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStudy} onOpenChange={() => setDeleteStudy(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Study</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteStudy?.name}</strong>? This will remove
              the study and all its data from your machine. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteStudy) {
                  onDelete(deleteStudy.id)
                  setDeleteStudy(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Study
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Shutdown Confirmation Dialog */}
      <AlertDialog open={!!shutdownStudy} onOpenChange={() => setShutdownStudy(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Shutdown Study</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to shutdown <strong>{shutdownStudy?.name}</strong>? This will
              stop the study environment. You can restart it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (shutdownStudy) {
                  onShutdown(shutdownStudy.id)
                  setShutdownStudy(null)
                }
              }}
            >
              Shutdown
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
