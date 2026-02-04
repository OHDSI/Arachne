
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Download, FileText, ImageIcon, Table } from "lucide-react"
import type { Study } from "../types"

interface OutputFile {
  name: string
  type: "table" | "plot" | "file"
  size: string
}

interface OutputsModalProps {
  study: Study | null
  open: boolean
  onClose: () => void
}

const MOCK_OUTPUTS: OutputFile[] = [
  { name: "cohort_summary.csv", type: "table", size: "245 KB" },
  { name: "incidence_rates.csv", type: "table", size: "128 KB" },
  { name: "baseline_characteristics.xlsx", type: "table", size: "512 KB" },
  { name: "kaplan_meier_plot.png", type: "plot", size: "89 KB" },
  { name: "forest_plot.png", type: "plot", size: "156 KB" },
  { name: "analysis_report.html", type: "file", size: "1.2 MB" },
]

export function OutputsModal({ study, open, onClose }: OutputsModalProps) {
  const getFileIcon = (type: OutputFile["type"]) => {
    switch (type) {
      case "table":
        return <Table className="h-4 w-4 text-info" />
      case "plot":
        return <ImageIcon className="h-4 w-4 text-success" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (!study) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary-dark">
            Output Files - {study.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="divide-y rounded-md border border-border">
            {MOCK_OUTPUTS.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
