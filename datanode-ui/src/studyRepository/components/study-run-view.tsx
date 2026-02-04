
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
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import type { Study } from "../types"

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
  onRunStudy: () => void
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

const MOCK_LOGS = [
  "Initializing study environment...",
  "Loading configuration from codeToRun.R",
  "Connecting to database...",
  "Connection established successfully",
  "Loading CDM schema: cdm",
  "Validating cohort definitions...",
  "Running analysis 1 of 3: Cohort characterization",
  "  - Processing 10,000 patients",
  "  - Generating baseline characteristics",
  "Running analysis 2 of 3: Incidence rate calculation",
  "  - Computing person-years at risk",
  "  - Calculating incidence rates",
  "Running analysis 3 of 3: Outcome analysis",
  "  - Applying statistical models",
  "  - Generating confidence intervals",
  "Writing results to output folder...",
  "Generating visualizations...",
  "Study completed successfully!",
]

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

export function StudyRunView({ study, onBack, onSaveScript, onRunStudy }: StudyRunViewProps) {
  const [script, setScript] = useState(study.script || DEFAULT_SCRIPT)
  const [phase, setPhase] = useState<RunPhase>("editing")
  const [logs, setLogs] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(MOCK_OUTPUT_VERSIONS[0].id)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["output"]))
  const logEndRef = useRef<HTMLDivElement>(null)

  const resultsUrl = `http://localhost:3838/results/${study.id}`
  const currentVersion = MOCK_OUTPUT_VERSIONS.find((v) => v.id === selectedVersion)

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  const handleSave = () => {
    onSaveScript(script)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRun = () => {
    setPhase("starting")
    setLogs([])

    setTimeout(() => {
      setPhase("running")
      let logIndex = 0

      const interval = setInterval(() => {
        if (logIndex < MOCK_LOGS.length) {
          setLogs((prev) => [...prev, MOCK_LOGS[logIndex]])
          logIndex++
        } else {
          clearInterval(interval)
          setPhase("completed")
          onRunStudy()
        }
      }, 500)
    }, 1500)
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
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
      </div>

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
                disabled={phase === "starting" || phase === "running"}
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
            <div className="rounded-md border border-border bg-secondary/30">
              <div className="border-b border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-muted-foreground">
                codeToRun.R
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="h-[400px] w-full resize-none bg-transparent p-3 font-mono text-sm focus:outline-none"
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
