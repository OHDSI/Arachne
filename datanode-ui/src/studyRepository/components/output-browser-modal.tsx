import { useState, useEffect, useCallback } from "react"
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
  Loader2,
} from "lucide-react"
import type { Study } from "../types"
import {
  getStudyRuns,
  getStudyRunResultFiles,
  downloadResultFile,
  type StudyRunDTO,
  type StudyRunResultFileDTO,
} from "../../api/study-repository"

interface OutputFile {
  name: string
  path: string
  type: "folder" | "table" | "plot" | "html" | "file"
  size?: string
  children?: OutputFile[]
}

interface OutputBrowserModalProps {
  study: Study | null
  open: boolean
  onClose: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileTypeFromPath(path: string): "folder" | "table" | "plot" | "html" | "file" {
  const lower = path.toLowerCase()
  if (lower.endsWith(".csv") || lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "table"
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".svg")) return "plot"
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html"
  return "file"
}

/** Build a tree from flat paths (e.g. "log.txt", "cohorts/summary.csv"). Root node is "output" (export folder). */
function buildFileTree(entries: StudyRunResultFileDTO[]): OutputFile[] {
  const root: OutputFile = { name: "output", path: "output", type: "folder", children: [] }
  const pathToNode = new Map<string, OutputFile>()
  pathToNode.set("output", root)

  for (const { filePath, size } of entries) {
    const parts = filePath.split("/").filter(Boolean)
    if (parts.length === 0) continue
    let currentPath = "output"
    for (let i = 0; i < parts.length; i++) {
      const isFile = i === parts.length - 1
      const name = parts[i]
      const fullPath = currentPath + (currentPath ? "/" : "") + name
          if (pathToNode.has(fullPath)) {
        currentPath = fullPath
        continue
      }
      const parent = pathToNode.get(currentPath) ?? root
      if (!parent.children) parent.children = []
      const node: OutputFile = isFile
        ? { name, path: filePath, type: fileTypeFromPath(name), size: formatSize(size), children: undefined }
        : { name, path: fullPath, type: "folder", children: [] }
      if (!isFile) pathToNode.set(fullPath, node)
      parent.children.push(node)
      currentPath = fullPath
    }
  }
  const sortChildren = (node: OutputFile) => {
    if (node.children) {
      node.children.sort((a, b) => (a.type === "folder" ? 0 : 1) - (b.type === "folder" ? 0 : 1))
      node.children.forEach(sortChildren)
    }
  }
  sortChildren(root)
  return [root]
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
  onDownloadFile,
  expandedFolders,
  onToggleFolder,
}: {
  file: OutputFile
  depth?: number
  selectedFile: string | null
  onSelectFile: (path: string) => void
  onDownloadFile: (path: string) => void
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
          if (isFolder) onToggleFolder(file.path)
          else onSelectFile(file.path)
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
              onDownloadFile(file.path)
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
              onDownloadFile={onDownloadFile}
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
  const [runs, setRuns] = useState<StudyRunDTO[]>([])
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [resultFiles, setResultFiles] = useState<StudyRunResultFileDTO[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["output"]))
  const [loadingRuns, setLoadingRuns] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const packageId = study ? Number(study.id) : 0

  useEffect(() => {
    if (!open || !study) return
    setLoadingRuns(true)
    getStudyRuns(packageId)
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setRuns(list)
        setResultFiles([])
        const withFiles = list.filter((r: StudyRunDTO) => (r.fileCount ?? 0) > 0)
        setSelectedRunId(withFiles.length > 0 ? String(withFiles[0].id) : list.length > 0 ? String(list[0].id) : null)
      })
      .catch(() => setRuns([]))
      .finally(() => setLoadingRuns(false))
  }, [open, study?.id, packageId])

  useEffect(() => {
    if (!open || !study || !selectedRunId) {
      setResultFiles([])
      return
    }
    setLoadingFiles(true)
    getStudyRunResultFiles(packageId, Number(selectedRunId))
      .then((data) => setResultFiles(Array.isArray(data) ? data : []))
      .catch(() => setResultFiles([]))
      .finally(() => setLoadingFiles(false))
  }, [open, study?.id, packageId, selectedRunId])

  const currentRun = runs.find((r) => String(r.id) === selectedRunId)
  const fileTree = resultFiles.length > 0 ? buildFileTree(resultFiles) : []

  const handleToggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const formatRunTime = (iso: string | null) => {
    if (!iso) return "—"
    try {
      const d = new Date(iso)
      return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
    } catch {
      return iso
    }
  }

  const handleDownloadFile = useCallback(
    async (filePath: string) => {
      if (!study || !selectedRunId) return
      setDownloading(true)
      try {
        const blob = await downloadResultFile(packageId, Number(selectedRunId), filePath)
        const name = filePath.includes("/") ? filePath.slice(filePath.lastIndexOf("/") + 1) : filePath
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = name
        a.click()
        URL.revokeObjectURL(url)
      } finally {
        setDownloading(false)
      }
    },
    [study, packageId, selectedRunId]
  )

  const handleDownloadAll = useCallback(async () => {
    if (!study || !selectedRunId || resultFiles.length === 0) return
    setDownloading(true)
    try {
      for (const f of resultFiles) {
        try {
          const blob = await downloadResultFile(packageId, Number(selectedRunId), f.filePath)
          const name = f.filePath.includes("/") ? f.filePath.slice(f.filePath.lastIndexOf("/") + 1) : f.filePath
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = name
          a.click()
          URL.revokeObjectURL(url)
        } catch {
          /* skip failed file */
        }
      }
    } finally {
      setDownloading(false)
    }
  }, [study, packageId, selectedRunId, resultFiles])

  const countFiles = (files: OutputFile[]): number => {
    return files.flatMap((f) => (f.type === "folder" && f.children ? countFiles(f.children) : [1])).reduce((a, b) => a + b, 0)
  }
  const totalFiles = fileTree.length > 0 ? countFiles(fileTree) : 0

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
          {/* Run selector and Download All */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Run:</span>
              <Select
                value={selectedRunId ?? ""}
                onValueChange={setSelectedRunId}
                disabled={loadingRuns || runs.length === 0}
              >
                <SelectTrigger className="h-9 w-[220px] border-border">
                  <SelectValue placeholder={loadingRuns ? "Loading runs…" : runs.length === 0 ? "No runs" : "Select run"} />
                </SelectTrigger>
                <SelectContent>
                  {runs.map((run) => (
                    <SelectItem key={run.id} value={String(run.id)}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Run #{run.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRunTime(run.finishedAt ?? run.startedAt)}
                        </span>
                        {(run.fileCount ?? 0) > 0 && (
                          <span className="text-xs text-muted-foreground">({run.fileCount} files)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loadingFiles || resultFiles.length === 0 || downloading}
              onClick={handleDownloadAll}
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download All
            </Button>
          </div>

          {/* File Explorer (export folder contents from DB) */}
          <div className="rounded-md border border-border bg-background">
            <div className="border-b border-border bg-secondary/50 px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                {currentRun ? `Run #${currentRun.id}` : ""} — {loadingFiles ? "Loading…" : `${totalFiles} files`}
              </span>
            </div>
            <div className="h-[400px] overflow-auto p-2">
              {loadingFiles && (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading output files…
                </div>
              )}
              {!loadingFiles && fileTree.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {runs.length === 0
                    ? "No runs yet. Run the study to see outputs here."
                    : resultFiles.length === 0
                      ? "No output files saved for this run."
                      : null}
                </div>
              )}
              {!loadingFiles &&
                fileTree.map((file) => (
                  <FileTreeNode
                    key={file.path}
                    file={file}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                    onDownloadFile={handleDownloadFile}
                    expandedFolders={expandedFolders}
                    onToggleFolder={handleToggleFolder}
                  />
                ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentRun ? formatRunTime(currentRun.finishedAt ?? currentRun.startedAt) : "—"}</span>
            <span>{selectedFile ? `Selected: ${selectedFile}` : "Click a file to select or download"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
