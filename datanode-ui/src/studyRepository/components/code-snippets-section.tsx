import { useState } from "react"
import { Plus, Pencil, Trash2, Save, X, Code2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
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
import type { CodeSnippetDTO } from "../../api/study-repository"

interface CodeSnippetsSectionProps {
  snippets: CodeSnippetDTO[]
  onCreateSnippet: (snippet: { name: string; description: string; content: string }) => Promise<void>
  onUpdateSnippet: (id: number, snippet: { name: string; description: string; content: string }) => Promise<void>
  onDeleteSnippet: (id: number) => Promise<void>
}

export function CodeSnippetsSection({
  snippets,
  onCreateSnippet,
  onUpdateSnippet,
  onDeleteSnippet,
}: CodeSnippetsSectionProps) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const startNew = () => {
    setEditingId("new")
    setName("")
    setDescription("")
    setContent("")
    setError(null)
  }

  const startEdit = (snippet: CodeSnippetDTO) => {
    setEditingId(snippet.id)
    setName(snippet.name)
    setDescription(snippet.description ?? "")
    setContent(snippet.content)
    setError(null)
  }

  const cancel = () => {
    setEditingId(null)
    setError(null)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    if (!content.trim()) {
      setError("Code content is required")
      return
    }
    const lineCount = content.split("\n").length
    if (lineCount > 100) {
      setError(`Snippet must be 100 lines or fewer (currently ${lineCount} lines)`)
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (editingId === "new") {
        await onCreateSnippet({ name: name.trim(), description: description.trim(), content })
      } else if (typeof editingId === "number") {
        await onUpdateSnippet(editingId, { name: name.trim(), description: description.trim(), content })
      }
      setEditingId(null)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save snippet"
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId == null) return
    try {
      await onDeleteSnippet(deleteId)
    } catch {
      // handled by parent
    }
    setDeleteId(null)
    if (editingId === deleteId) setEditingId(null)
  }

  return (
    <>
      <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Code Snippets</CardTitle>
              <CardDescription>
                Reusable R code fragments for database connections, CDM setup, and other common tasks.
                Insert them into codeToRun.R when running a study.
              </CardDescription>
            </div>
            <Button
              onClick={startNew}
              disabled={editingId != null}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Snippet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* New / Edit form */}
          {editingId != null && (
            <div className="rounded-md border border-border bg-secondary/20 p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="snippet-name">Name</Label>
                <Input
                  id="snippet-name"
                  placeholder="e.g. PostgreSQL CDM Connection"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={128}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snippet-desc">Description (optional)</Label>
                <Input
                  id="snippet-desc"
                  placeholder="e.g. Connects to the production CDM on Postgres"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={512}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snippet-code">R Code (max 100 lines)</Label>
                <textarea
                  id="snippet-code"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`# Database connection\nconnectionDetails <- DatabaseConnector::createConnectionDetails(\n  dbms = "postgresql",\n  server = "localhost/mydb",\n  user = "user",\n  password = "pass"\n)`}
                  className="w-full h-[200px] resize-none rounded-md border border-border bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  spellCheck={false}
                />
                <p className="text-xs text-muted-foreground">
                  {content.split("\n").length} / 100 lines
                </p>
              </div>
              {error && (
                <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Snippet"}
                </Button>
                <Button variant="outline" onClick={cancel} className="border-border bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* List */}
          {snippets.length === 0 && editingId == null && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No code snippets yet. Click &quot;Add Snippet&quot; to create your first one.
            </div>
          )}
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{snippet.name}</span>
                </div>
                {snippet.description && (
                  <p className="text-xs text-muted-foreground mt-1 ml-6 truncate">{snippet.description}</p>
                )}
                <pre className="text-xs text-muted-foreground mt-2 ml-6 max-h-[60px] overflow-hidden font-mono whitespace-pre-wrap">
                  {snippet.content.slice(0, 200)}{snippet.content.length > 200 ? "..." : ""}
                </pre>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEdit(snippet)}
                  disabled={editingId != null}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(snippet.id)}
                  disabled={editingId != null}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId != null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Code Snippet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{snippets.find((s) => s.id === deleteId)?.name}&quot;?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
