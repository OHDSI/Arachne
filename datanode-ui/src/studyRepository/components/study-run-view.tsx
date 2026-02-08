import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  ArrowLeft,
  Save,
  Play,
  Loader2,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  Folder,
  FolderOpen,
  FolderTree,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  ChevronRight,
  ChevronDown,
  Circle,
} from "lucide-react"
import type { Study } from "../types"
import {
  startStudyContainer,
  getCodeToRun,
  putCodeToRun,
  listContainerFiles,
  type ContainerFileEntry,
} from "../../api/study-repository"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

interface OutputFile {
  name: string
  type: "folder" | "table" | "plot" | "html" | "file"
  size?: string
  children?: OutputFile[]
}

interface OutputVersion {
  id: string
  label: string
  timestamp: string
  files: OutputFile[]
}

interface StudyRunViewProps {
  study: Study
  onBack: () => void
  onSaveScript: (script: string) => void
  /** Execute the current script in the study container; returns logs and status. */
  onExecuteStudy: (script: string) => Promise<{ logs: string; status: string }>
}

type RunPhase = "editing" | "starting" | "running" | "completed"

const DEFAULT_SCRIPT = `# codeToRun.R
# Configure your database connection and study parameters

# Database connection settings
connectionDetails <- DatabaseConnector::createConnectionDetails(
  dbms = "postgresql",
  server = "localhost/mydb",
  user = "your_username",
  password = "your_password"
)

# Study configuration
cdmDatabaseSchema <- "cdm"
resultsDatabaseSchema <- "results"
cohortDatabaseSchema <- "cohorts"
cohortTable <- "my_cohort_table"

# Execute study
execute(
  connectionDetails = connectionDetails,
  cdmDatabaseSchema = cdmDatabaseSchema,
  resultsDatabaseSchema = resultsDatabaseSchema,
  cohortDatabaseSchema = cohortDatabaseSchema,
  cohortTable = cohortTable,
  outputFolder = "output"
)
`

const MOCK_OUTPUT_VERSIONS: OutputVersion[] = [
  {
    id: "run-003",
    label: "Run #3",
    timestamp: "2024-01-15 14:32:01",
    files: [
      {
        name: "output",
        type: "folder",
        children: [
          {
            name: "cohorts",
            type: "folder",
            children: [
              { name: "cohort_summary.csv", type: "table", size: "245 KB" },
              { name: "cohort_counts.csv", type: "table", size: "12 KB" },
            ],
          },
          {
            name: "analysis",
            type: "folder",
            children: [
              { name: "incidence_rates.csv", type: "table", size: "128 KB" },
              { name: "baseline_characteristics.xlsx", type: "table", size: "512 KB" },
              { name: "outcome_model.rds", type: "file", size: "2.1 MB" },
            ],
          },
          {
            name: "figures",
            type: "folder",
            children: [
              { name: "kaplan_meier_plot.png", type: "plot", size: "89 KB" },
              { name: "forest_plot.png", type: "plot", size: "156 KB" },
              { name: "hazard_ratio_plot.png", type: "plot", size: "134 KB" },
            ],
          },
          { name: "analysis_report.html", type: "html", size: "1.2 MB" },
          { name: "log.txt", type: "file", size: "45 KB" },
        ],
      },
    ],
  },
  {
    id: "run-002",
    label: "Run #2",
    timestamp: "2024-01-14 09:15:43",
    files: [
      {
        name: "output",
        type: "folder",
        children: [
          {
            name: "cohorts",
            type: "folder",
            children: [
              { name: "cohort_summary.csv", type: "table", size: "198 KB" },
            ],
          },
          {
            name: "analysis",
            type: "folder",
            children: [
              { name: "incidence_rates.csv", type: "table", size: "95 KB" },
              { name: "baseline_characteristics.xlsx", type: "table", size: "384 KB" },
            ],
          },
          {
            name: "figures",
            type: "folder",
            children: [
              { name: "kaplan_meier_plot.png", type: "plot", size: "78 KB" },
              { name: "forest_plot.png", type: "plot", size: "142 KB" },
            ],
          },
          { name: "analysis_report.html", type: "html", size: "980 KB" },
        ],
      },
    ],
  },
  {
    id: "run-001",
    label: "Run #1",
    timestamp: "2024-01-12 16:45:22",
    files: [
      {
        name: "output",
        type: "folder",
        children: [
          {
            name: "cohorts",
            type: "folder",
            children: [
              { name: "cohort_summary.csv", type: "table", size: "156 KB" },
            ],
          },
          {
            name: "analysis",
            type: "folder",
            children: [
              { name: "incidence_rates.csv", type: "table", size: "72 KB" },
            ],
          },
          { name: "analysis_report.html", type: "html", size: "720 KB" },
        ],
      },
    ],
  },
]

/** Single node in the container file tree (Docker image filesystem). */
function ContainerFileTree({
  path,
  pathLabel,
  entriesByPath,
  loadingPath,
  expandedPaths,
  onToggleExpand,
}: {
  path: string
  pathLabel: string
  entriesByPath: Record<string, ContainerFileEntry[]>
  loadingPath: string | null
  expandedPaths: Set<string>
  onToggleExpand: (path: string) => void
}) {
  const isExpanded = expandedPaths.has(path)
  const entries = entriesByPath[path]
  const isLoading = loadingPath === path

  return (
    <div className="py-0.5">
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-secondary/70"
        style={{ paddingLeft: "8px" }}
        onClick={() => onToggleExpand(path)}
      >
        <span className="flex h-4 w-4 items-center justify-center">
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </span>
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 text-[#dcb67a]" />
        ) : (
          <Folder className="h-4 w-4 text-[#dcb67a]" />
        )}
        <span className="flex-1 truncate text-sm font-medium">{pathLabel}</span>
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: "16px" }}>
          {isLoading && (
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading...
            </div>
          )}
          {!isLoading && entries != null && entries.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">Empty</div>
          )}
          {!isLoading &&
            entries != null &&
            entries.map((entry) =>
              entry.type === "DIR" ? (
                <ContainerFileTree
                  key={entry.name}
                  path={path + "/" + entry.name}
                  pathLabel={entry.name}
                  entriesByPath={entriesByPath}
                  loadingPath={loadingPath}
                  expandedPaths={expandedPaths}
                  onToggleExpand={onToggleExpand}
                />
              ) : (
                <div
                  key={entry.name}
                  className="flex cursor-default items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-secondary/50"
                  style={{ paddingLeft: "24px" }}
                >
                  <span className="h-4 w-4" />
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{entry.name}</span>
                </div>
              )
            )}
        </div>
      )}
    </div>
  )
}

function FileIcon({ type, isOpen }: { type: OutputFile["type"]; isOpen?: boolean }) {
  switch (type) {
    case "folder":
      return isOpen ? (
        <FolderOpen className="h-4 w-4 text-[#dcb67a]" />
      ) : (
        <Folder className="h-4 w-4 text-[#dcb67a]" />
      )
    case "table":
      return <FileSpreadsheet className="h-4 w-4 text-[#4caf50]" />
    case "plot":
      return <FileImage className="h-4 w-4 text-[#9c27b0]" />
    case "html":
      return <FileText className="h-4 w-4 text-[#ff5722]" />
    default:
      return <File className="h-4 w-4 text-muted-foreground" />
  }
}

function FileTreeNode({
  file,
  depth = 0,
  selectedFile,
  onSelectFile,
  expandedFolders,
  onToggleFolder,
}: {
  file: OutputFile
  depth?: number
  selectedFile: string | null
  onSelectFile: (name: string) => void
  expandedFolders: Set<string>
  onToggleFolder: (name: string) => void
}) {
  const isFolder = file.type === "folder"
  const isExpanded = expandedFolders.has(file.name)
  const isSelected = selectedFile === file.name

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-secondary/70 ${
          isSelected ? "bg-primary/10" : ""
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            onToggleFolder(file.name)
          } else {
            onSelectFile(file.name)
          }
        }}
      >
        {isFolder ? (
          <span className="flex h-4 w-4 items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </span>
        ) : (
          <span className="h-4 w-4" />
        )}
        <FileIcon type={file.type} isOpen={isExpanded} />
        <span className="flex-1 truncate text-sm">{file.name}</span>
        {file.size && (
          <span className="text-xs text-muted-foreground">{file.size}</span>
        )}
        {!isFolder && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Download className="h-3 w-3 text-primary" />
          </Button>
        )}
      </div>
      {isFolder && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeNode
              key={child.name}
              file={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const AUTOSAVE_DELAY_MS = 1500

export function StudyRunView({ study, onBack, onSaveScript, onExecuteStudy }: StudyRunViewProps) {
  const [script, setScript] = useState(study.script || DEFAULT_SCRIPT)
  const [version, setVersion] = useState(0)
  const [scriptLoading, setScriptLoading] = useState(true)
  const [scriptError, setScriptError] = useState<string | null>(null)
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [phase, setPhase] = useState<RunPhase>("editing")
  const [logs, setLogs] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const versionRef = useRef(version)
  versionRef.current = version
  const [selectedVersion, setSelectedVersion] = useState(MOCK_OUTPUT_VERSIONS[0].id)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["output"]))
  const logEndRef = useRef<HTMLDivElement>(null)

  const [fileExplorerOpen, setFileExplorerOpen] = useState(false)
  const [containerEntriesByPath, setContainerEntriesByPath] = useState<Record<string, ContainerFileEntry[]>>({})
  const [containerLoadingPath, setContainerLoadingPath] = useState<string | null>(null)
  const [expandedContainerPaths, setExpandedContainerPaths] = useState<Set<string>>(new Set(["/code"]))

  const resultsUrl = `http://localhost:3838/results/${study.id}`
  const currentVersion = MOCK_OUTPUT_VERSIONS.find((v) => v.id === selectedVersion)

  // When opening the study, start the container and load DB-backed codeToRun.R (content + version)
  useEffect(() => {
    let cancelled = false
    setScriptLoading(true)
    setScriptError(null)
    setConflictMessage(null)
    startStudyContainer(Number(study.id))
      .then((res) => {
        if (!cancelled) {
          setScript(res.script != null ? res.script : "")
          setVersion(typeof (res as { version?: number }).version === "number" ? (res as { version: number }).version : 0)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setScriptError(e instanceof Error ? e.message : "Failed to open study")
        }
      })
      .finally(() => {
        if (!cancelled) setScriptLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [study.id])

  // Debounced autosave: persist to backend and sync to container; handle 409 by refreshing
  useEffect(() => {
    if (scriptLoading) return
    if (autosaveRef.current) clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => {
      autosaveRef.current = null
      const v = versionRef.current
      putCodeToRun(Number(study.id), { content: script, version: v })
        .then((res) => {
          setVersion(res.version)
          setConflictMessage(null)
        })
        .catch((err: { response?: { status: number; data?: { message?: string; version?: number } } }) => {
          if (err?.response?.status === 409) {
            setConflictMessage("Another change was saved. Refreshing...")
            getCodeToRun(Number(study.id)).then((fresh) => {
              setScript(fresh.content)
              setVersion(fresh.version)
              setConflictMessage(null)
            })
          }
        })
    }, AUTOSAVE_DELAY_MS)
    return () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current)
    }
  }, [script, scriptLoading, study.id])

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  // Load container directory when file explorer opens or user expands a folder
  useEffect(() => {
    if (!fileExplorerOpen || scriptLoading || scriptError) return
    const pathsToLoad = Array.from(expandedContainerPaths).filter(
      (p) => !(p in containerEntriesByPath) && p !== containerLoadingPath
    )
    if (pathsToLoad.length === 0) return
    const path = pathsToLoad[0]
    setContainerLoadingPath(path)
    listContainerFiles(Number(study.id), path)
      .then((entries) => {
        setContainerEntriesByPath((prev) => ({ ...prev, [path]: entries }))
      })
      .catch(() => {
        setContainerEntriesByPath((prev) => ({ ...prev, [path]: [] }))
      })
      .finally(() => setContainerLoadingPath(null))
  }, [fileExplorerOpen, expandedContainerPaths, containerEntriesByPath, containerLoadingPath, study.id, scriptLoading, scriptError])

  const handleSave = () => {
    putCodeToRun(Number(study.id), { content: script, version })
      .then((res) => {
        setVersion(res.version)
        onSaveScript(script)
        setSaved(true)
        setConflictMessage(null)
        setTimeout(() => setSaved(false), 2000)
      })
      .catch((err: { response?: { status: number; data?: { version?: number } } }) => {
        if (err?.response?.status === 409) {
          setConflictMessage("Another change was saved. Refreshing...")
          getCodeToRun(Number(study.id)).then((fresh) => {
            setScript(fresh.content)
            setVersion(fresh.version)
            setConflictMessage(null)
          })
        }
      })
  }

  const handleRun = async () => {
    setPhase("starting")
    setLogs([])
    try {
      const result = await onExecuteStudy(script)
      const raw = result.logs ?? ""
      const lines = raw.split("\n")
      setLogs(lines.length > 0 ? lines : [raw || "(no output)"])
      setPhase("completed")
    } catch (e) {
      setLogs([e instanceof Error ? e.message : "Execution failed"])
      setPhase("completed")
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(resultsUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const handleToggleContainerPath = (path: string) => {
    setExpandedContainerPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const containerReady = !scriptLoading && !scriptError

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-primary hover:bg-primary/10 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Repository
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{study.name}</h1>
          <Badge variant="secondary" className="bg-chip text-foreground">
            v{study.version}
          </Badge>
        </div>
        {/* Study status: green = container running, amber = starting, red = error */}
        <div
          className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-sm"
          title={
            scriptLoading
              ? "Study Docker image is starting..."
              : scriptError
                ? "Study container failed to start"
                : "Study Docker image is running and ready"
          }
        >
          {scriptLoading ? (
            <>
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-500" />
              <span className="text-muted-foreground">Starting study environment...</span>
            </>
          ) : scriptError ? (
            <>
              <Circle className="h-3 w-3 shrink-0 fill-destructive text-destructive" />
              <span className="text-destructive">Study environment unavailable</span>
            </>
          ) : (
            <>
              <Circle className="h-3 w-3 shrink-0 fill-green-500 text-green-500" />
              <span className="text-green-700 dark:text-green-400">Study environment ready</span>
            </>
          )}
        </div>
        {containerReady && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFileExplorerOpen(true)}
            className="border-border text-foreground hover:bg-secondary bg-transparent"
            title="View file tree inside the running Docker container"
          >
            <FolderTree className="mr-2 h-4 w-4" />
            File explorer
          </Button>
        )}
      </div>

      <Sheet open={fileExplorerOpen} onOpenChange={setFileExplorerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Container files</SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Files and folders inside the running study image (workdir /code).
          </p>
          <div className="flex-1 overflow-auto mt-4 rounded-md border border-border bg-secondary/30 min-h-0">
            {containerLoadingPath === "/code" ? (
              <div className="flex items-center gap-2 p-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading /code...
              </div>
            ) : (
              <ContainerFileTree
                path="/code"
                pathLabel="code"
                entriesByPath={containerEntriesByPath}
                loadingPath={containerLoadingPath}
                expandedPaths={expandedContainerPaths}
                onToggleExpand={handleToggleContainerPath}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Script Editor */}
        <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-primary-dark">Script Editor</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-success" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleRun}
                disabled={scriptLoading || phase === "starting" || phase === "running"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {phase === "starting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : phase === "running" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run study
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {scriptLoading && (
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting study container and loading codeToRun.R...
              </div>
            )}
            {scriptError && (
              <div className="mb-3 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
                {scriptError}
              </div>
            )}
            {conflictMessage && (
              <div className="mb-3 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                {conflictMessage}
              </div>
            )}
            <div className="rounded-md border border-border bg-secondary/30">
              <div className="border-b border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-muted-foreground">
                codeToRun.R (saved in DB, synced to /workspace in container)
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                disabled={scriptLoading}
                className="h-[400px] w-full resize-none bg-transparent p-3 font-mono text-sm focus:outline-none disabled:opacity-70"
                spellCheck={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Log Viewer */}
        <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary-dark">Run Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-auto rounded-md border border-border bg-[#1e1e1e] p-3 font-mono text-sm text-[#d4d4d4]">
              {phase === "editing" && (
                <span className="text-muted-foreground">
                  Click &quot;Run study&quot; to start execution...
                </span>
              )}
              {phase === "starting" && (
                <div className="flex items-center gap-2 text-info">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting study environment...
                </div>
              )}
              {(phase === "running" || phase === "completed") && (
                <>
                  {logs.map((log, index) => (
                    <div key={index} className="py-0.5">
                      <span className="text-muted-foreground">[{String(index + 1).padStart(2, "0")}]</span>{" "}
                      {log}
                    </div>
                  ))}
                  {phase === "completed" && (
                    <div className="mt-4 flex items-center gap-2 rounded-md bg-success/20 p-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      Run completed without error
                    </div>
                  )}
                  <div ref={logEndRef} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results & Outputs Section - Only show after completion */}
      {phase === "completed" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* View Results */}
          <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary-dark">View Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                The interactive results viewer is ready. Open the link below to explore your study
                results.
              </p>
              <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 p-3">
                <code className="flex-1 text-sm text-primary">{resultsUrl}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => window.open(resultsUrl, "_blank")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in new tab
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Browse Outputs - File Explorer */}
          <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg text-primary-dark">Browse Outputs</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger className="h-8 w-[180px] border-border text-sm">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_OUTPUT_VERSIONS.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        <div className="flex flex-col">
                          <span>{version.label}</span>
                          <span className="text-xs text-muted-foreground">{version.timestamp}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] overflow-auto rounded-md border border-border bg-background">
                {currentVersion?.files.map((file) => (
                  <FileTreeNode
                    key={file.name}
                    file={file}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                    expandedFolders={expandedFolders}
                    onToggleFolder={handleToggleFolder}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {currentVersion?.label} - {currentVersion?.timestamp}
                </span>
                <span>
                  {selectedFile ? `Selected: ${selectedFile}` : "Click a file to select"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
