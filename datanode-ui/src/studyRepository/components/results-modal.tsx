
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { ExternalLink, Copy, Check } from "lucide-react"
import type { Study } from "../types"

interface ResultsModalProps {
  study: Study | null
  open: boolean
  onClose: () => void
}

export function ResultsModal({ study, open, onClose }: ResultsModalProps) {
  const [copied, setCopied] = useState(false)

  if (!study) return null

  const resultsUrl = `http://localhost:3838/results/${study.id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(resultsUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary-dark">
            View Results - {study.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            The interactive results viewer (Shiny app) is ready. Use the link below to explore
            your study results in a new tab.
          </p>

          <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 p-3">
            <code className="flex-1 text-sm text-primary break-all">{resultsUrl}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Close
            </Button>
            <Button
              onClick={() => window.open(resultsUrl, "_blank")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in new tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
