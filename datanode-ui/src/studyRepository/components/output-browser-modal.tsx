
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
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
  path: string
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

interface OutputBrowserModalProps {
  study: Study | null
  open: boolean
  onClose: () => void
}

const MOCK_OUTPUT_VERSIONS: OutputVersion[] = [
  {
    id: "run-003",
    label: "Run #3",
    timestamp: "2024-01-15 14:32:01",
    files: [
      {
        name: "output",
        path: "/output",
        type: "folder",
        children: [
          {
            name: "cohorts",
            path: "/output/cohorts",
            type: "folder",
            children: [
              { name: "cohort_summary.csv", path: "/output/cohorts/cohort_summary.csv", type: "table", size: "245 KB" },
              { name: "cohort_counts.csv", path: "/output/cohorts/cohort_counts.csv", type: "table", size: "12 KB" },
              { name: "cohort_attrition.csv", path: "/output/cohorts/cohort_attrition.csv", type: "table", size: "8 KB" },
            ],
          },
          {
            name: "analysis",
            path: "/output/analysis",
            type: "folder",
            children: [
              { name: "incidence_rates.csv", path: "/output/analysis/incidence_rates.csv", type: "table", size: "128 KB" },
              { name: "baseline_characteristics.xlsx", path: "/output/analysis/baseline_characteristics.xlsx", type: "table", size: "512 KB" },
              { name: "outcome_model.rds", path: "/output/analysis/outcome_model.rds", type: "file", size: "2.1 MB" },
              { name: "propensity_scores.csv", path: "/output/analysis/propensity_scores.csv", type: "table", size: "1.8 MB" },
            ],
          },
          {
            name: "figures",
            path: "/output/figures",
            type: "folder",
            children: [
              { name: "kaplan_meier_plot.png", path: "/output/figures/kaplan_meier_plot.png", type: "plot", size: "89 KB" },
              { name: "forest_plot.png", path: "/output/figures/forest_plot.png", type: "plot", size: "156 KB" },
              { name: "hazard_ratio_plot.png", path: "/output/figures/hazard_ratio_plot.png", type: "plot", size: "134 KB" },
              { name: "calibration_plot.png", path: "/output/figures/calibration_plot.png", type: "plot", size: "98 KB" },
            ],
          },
          { name: "analysis_report.html", path: "/output/analysis_report.html", type: "html", size: "1.2 MB" },
          { name: "diagnostics.html", path: "/output/diagnostics.html", type: "html", size: "856 KB" },
          { name: "log.txt", path: "/output/log.txt", type: "file", size: "45 KB" },
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
        path: "/output",
        type: "folder",
        children: [
          {
            name: "cohorts",
            path: "/output/cohorts",
            type: "folder",
            children: [
              { name: "cohort_summary.csv", path: "/output/cohorts/cohort_summary.csv", type: "table", size: "198 KB" },
            ],
          },
          {
            name: "analysis",
            path: "/output/analysis",
            type: "folder",
            children: [
              { name: "incidence_rates.csv", path: "/output/analysis/incidence_rates.csv", type: "table", size: "95 KB" },
              { name: "baseline_characteristics.xlsx", path: "/output/analysis/baseline_characteristics.xlsx", type: "table", size: "384 KB" },
            ],
          },
          {
            name: "figures",
            path: "/output/figures",
            type: "folder",
            children: [
              { name: "kaplan_meier_plot.png", path: "/output/figures/kaplan_meier_plot.png", type: "plot", size: "78 KB" },
              { name: "forest_plot.png", path: "/output/figures/forest_plot.png", type: "plot", size: "142 KB" },
            ],
          },
          { name: "analysis_report.html", path: "/output/analysis_report.html", type: "html", size: "980 KB" },
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
        path: "/output",
        type: "folder",
        children: [
          {
            name: "cohorts",
            path: "/output/cohorts",
            type: "folder",
            children: [
              { name: "cohort_summary.csv", path: "/output/cohorts/cohort_summary.csv", type: "table", size: "156 KB" },
            ],
          },
          {
            name: "analysis",
            path: "/output/analysis",
            type: "folder",
            children: [
              { name: "incidence_rates.csv", path: "/output/analysis/incidence_rates.csv", type: "table", size: "72 KB" },
            ],
          },
          { name: "analysis_report.html", path: "/output/analysis_report.html", type: "html", size: "720 KB" },
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
  onSelectFile: (path: string) => void
  expandedFolders: Set<string>
  onToggleFolder: (path: string) => void
}) {
  const isFolder = file.type === "folder"
  const isExpanded = expandedFolders.has(file.path)
  const isSelected = selectedFile === file.path

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-secondary/70 ${
          isSelected ? "bg-primary/10" : ""
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            onToggleFolder(file.path)
          } else {
            onSelectFile(file.path)
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
              key={child.path}
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

export function OutputBrowserModal({ study, open, onClose }: OutputBrowserModalProps) {
  const [selectedVersion, setSelectedVersion] = useState(MOCK_OUTPUT_VERSIONS[0].id)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["/output", "/output/cohorts", "/output/analysis", "/output/figures"])
  )

  const currentVersion = MOCK_OUTPUT_VERSIONS.find((v) => v.id === selectedVersion)

  const handleToggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const countFiles = (files: OutputFile[]): number => {
    let count = 0
    for (const file of files) {
      if (file.type !== "folder") {
        count++
      }
      if (file.children) {
        count += countFiles(file.children)
      }
    }
    return count
  }

  const totalFiles = currentVersion ? countFiles(currentVersion.files) : 0

  if (!study) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary-dark">
            Browse Outputs - {study.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Version selector and Download All */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Output version:</span>
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="h-9 w-[200px] border-border">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_OUTPUT_VERSIONS.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {version.timestamp}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>

          {/* File Explorer */}
          <div className="rounded-md border border-border bg-background">
            <div className="border-b border-border bg-secondary/50 px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                {currentVersion?.label} - {totalFiles} files
              </span>
            </div>
            <div className="h-[400px] overflow-auto p-2">
              {currentVersion?.files.map((file) => (
                <FileTreeNode
                  key={file.path}
                  file={file}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  expandedFolders={expandedFolders}
                  onToggleFolder={handleToggleFolder}
                />
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {currentVersion?.timestamp}
            </span>
            <span>
              {selectedFile ? `Selected: ${selectedFile}` : "Click a file to select"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
