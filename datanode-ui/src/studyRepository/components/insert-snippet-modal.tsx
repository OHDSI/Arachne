import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Code2, FileCode } from "lucide-react"
import type { CodeSnippetDTO } from "../../api/study-repository"

interface InsertSnippetModalProps {
  snippets: CodeSnippetDTO[]
  open: boolean
  onClose: () => void
  onInsert: (content: string) => void
}

export function InsertSnippetModal({ snippets, open, onClose, onInsert }: InsertSnippetModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selected = snippets.find((s) => s.id === selectedId) ?? null

  const handleInsert = () => {
    if (selected) {
      onInsert(selected.content)
      setSelectedId(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedId(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary-dark flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Insert Code Snippet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {snippets.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No code snippets saved yet. Create snippets in Settings to use them here.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              {/* Snippet list */}
              <div className="space-y-1 max-h-[400px] overflow-auto rounded-md border border-border bg-background p-2">
                {snippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    onClick={() => setSelectedId(snippet.id)}
                    className={`cursor-pointer rounded-md px-3 py-2.5 transition-colors ${
                      selectedId === snippet.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary/70 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-sm truncate">{snippet.name}</span>
                    </div>
                    {snippet.description && (
                      <p className="text-xs text-muted-foreground mt-1 ml-6 truncate">
                        {snippet.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="rounded-md border border-border bg-secondary/30">
                <div className="border-b border-border bg-secondary/50 px-3 py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {selected ? selected.name : "Select a snippet to preview"}
                  </span>
                </div>
                <div className="h-[340px] overflow-auto p-3">
                  {selected ? (
                    <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">
                      {selected.content}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Click a snippet on the left to preview its code
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-border bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!selected}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
