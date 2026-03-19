/*
 * View Results modal: start/stop the Shiny results viewer in the study container,
 * open in new tab, and show R console output for debugging.
 */

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { ExternalLink, Copy, Check, Play, Square, RefreshCw, Loader2 } from "lucide-react"
import type { Study } from "../types"
import {
  getShinyStatus,
  startShiny,
  stopShiny,
  getShinyLogs,
} from "../../api/study-repository"

interface ResultsModalProps {
  study: Study | null
  open: boolean
  onClose: () => void
}

export function ResultsModal({ study, open, onClose }: ResultsModalProps) {
  const [status, setStatus] = useState<{ running: boolean; url: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [logs, setLogs] = useState("")
  const [logsLoading, setLogsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const packageId = study ? Number(study.id) : 0

  const fetchStatus = useCallback(async () => {
    if (!open || !study) return
    setLoading(true)
    setError(null)
    try {
      const data = await getShinyStatus(packageId)
      setStatus({ running: data.running, url: data.url ?? "" })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load status")
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [open, study, packageId])

  const fetchLogs = useCallback(async () => {
    if (!study) return
    setLogsLoading(true)
    try {
      const text = await getShinyLogs(packageId)
      setLogs(typeof text === "string" ? text : "")
    } catch {
      setLogs("")
    } finally {
      setLogsLoading(false)
    }
  }, [study, packageId])

  useEffect(() => {
    if (open && study) fetchStatus()
  }, [open, study, fetchStatus])

  const handleLaunch = async () => {
    if (!study) return
    setLaunching(true)
    setError(null)
    try {
      const data = await startShiny(packageId)
      setStatus({ running: true, url: data.url ?? "" })
      if (data.url) window.open(data.url, "_blank")
      await fetchLogs()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start results viewer")
      await fetchLogs()
    } finally {
      setLaunching(false)
    }
  }

  const handleOpenTab = () => {
    if (status?.url) window.open(status.url, "_blank")
  }

  const handleStop = async () => {
    if (!study) return
    setStopping(true)
    setError(null)
    try {
      await stopShiny(packageId)
      setStatus((prev) => (prev ? { ...prev, running: false } : null))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to stop viewer")
    } finally {
      setStopping(false)
    }
  }

  const handleCopy = () => {
    if (status?.url) {
      navigator.clipboard.writeText(status.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!study) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary-dark">
            View Results - {study.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4 flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="rounded-md bg-destructive/15 text-destructive text-sm p-3">
              {error}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Launch the interactive results viewer (Shiny app) in the study container. It uses the
            latest saved results from the most recent completed run. If the app is already running, open the tab or stop it below.
          </p>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              {status?.url && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 p-3">
                  <code className="flex-1 text-sm text-primary break-all">{status.url}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {status?.running ? (
                  <>
                    <Button
                      onClick={handleOpenTab}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in new tab
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleStop}
                      disabled={stopping}
                      className="border-border text-foreground"
                    >
                      {stopping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Square className="mr-2 h-4 w-4" />}
                      Stop app
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleLaunch}
                    disabled={launching}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {launching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    Launch results viewer
                  </Button>
                )}
              </div>
            </>
          )}

          {/* R console output for debugging */}
          <div className="flex flex-col gap-1 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">R console output</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchLogs}
                disabled={logsLoading || !study}
                className="h-8 text-muted-foreground"
              >
                {logsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                <span className="ml-1">Refresh</span>
              </Button>
            </div>
            <pre className="flex-1 min-h-[120px] max-h-[240px] overflow-auto rounded-md border border-border bg-muted/50 p-3 text-xs font-mono whitespace-pre-wrap break-words">
              {logs || (logsLoading ? "Loading…" : "No output yet. Launch the app and click Refresh.")}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="border-border text-foreground">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
