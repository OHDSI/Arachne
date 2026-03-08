import { useState, useEffect, useCallback } from "react"
import { Save, CheckCircle2, Loader2, XCircle, Plug, Check, X, Plus, Pencil, Trash2 } from "lucide-react"
import {
  checkStudyRepositoryConnection,
  getStudyEnvVars,
  getStudyEnvVar,
  createStudyEnvVar,
  updateStudyEnvVar,
  deleteStudyEnvVar,
  type StudyEnvironmentVariableDTO,
  type CodeSnippetDTO,
} from "../../api/study-repository"
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
import { CodeSnippetsSection } from "./code-snippets-section"

function getConnectionErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>
    if (e.response && typeof e.response === "object") {
      const res = e.response as Record<string, unknown>
      const data = res?.data as Record<string, unknown> | undefined
      if (data?.message && typeof data.message === "string") return data.message
      if (data?.errorMessage && typeof data.errorMessage === "string") return data.errorMessage
    }
    if (e.message && typeof e.message === "string") return e.message
  }
  return "Failed to connect. Check address, username, and token."
}

interface SettingsPageProps {
  catalogAddress: string
  catalogUsername: string
  catalogToken: string
  onSave: (address: string, username: string, token: string) => void
  snippets: CodeSnippetDTO[]
  onCreateSnippet: (snippet: { name: string; description: string; content: string }) => Promise<void>
  onUpdateSnippet: (id: number, snippet: { name: string; description: string; content: string }) => Promise<void>
  onDeleteSnippet: (id: number) => Promise<void>
}

export function SettingsPage({
  catalogAddress,
  catalogUsername: initialUsername,
  catalogToken,
  onSave,
  snippets,
  onCreateSnippet,
  onUpdateSnippet,
  onDeleteSnippet,
}: SettingsPageProps) {
  const [address, setAddress] = useState(catalogAddress)
  const [username, setUsername] = useState(initialUsername ?? "")
  const [token, setToken] = useState(catalogToken)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState("")

  // Environment variables (injected into study containers; use Sys.getenv() in codeToRun.R)
  const [envVars, setEnvVars] = useState<StudyEnvironmentVariableDTO[]>([])
  const [envVarsLoading, setEnvVarsLoading] = useState(true)
  const [newEnvName, setNewEnvName] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")
  const [envVarAdding, setEnvVarAdding] = useState(false)
  const [editingEnvId, setEditingEnvId] = useState<number | null>(null)
  const [editingEnvValue, setEditingEnvValue] = useState("")
  const [envVarError, setEnvVarError] = useState("")
  const [deleteEnvId, setDeleteEnvId] = useState<number | null>(null)

  const handleSave = () => {
    if (!username.trim()) {
      setTestStatus("error")
      setTestMessage("Catalog username is required")
      return
    }
    onSave(address, username, token)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCheckConnection = async () => {
    if (!address) {
      setTestStatus("error")
      setTestMessage("Please enter a catalog address first")
      return
    }
    if (!username.trim()) {
      setTestStatus("error")
      setTestMessage("Catalog username is required")
      return
    }

    setTestStatus("testing")
    setTestMessage("")

    try {
      const result = await checkStudyRepositoryConnection(address, token, username || undefined)
      if (result.success) {
        setTestStatus("success")
        setTestMessage(result.message || "Successfully connected to catalog")
      } else {
        setTestStatus("error")
        setTestMessage(result.message || "Failed to connect. Check address and token.")
      }
    } catch (err: unknown) {
      setTestStatus("error")
      const message = getConnectionErrorMessage(err)
      setTestMessage(message)
    }

    setTimeout(() => {
      setTestStatus("idle")
      setTestMessage("")
    }, 8000)
  }

  const fetchEnvVars = useCallback(async () => {
    try {
      const list = await getStudyEnvVars()
      setEnvVars(list)
    } catch {
      setEnvVars([])
    } finally {
      setEnvVarsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEnvVars()
  }, [fetchEnvVars])

  const handleAddEnvVar = async () => {
    const name = newEnvName.trim()
    if (!name) {
      setEnvVarError("Name is required")
      return
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      setEnvVarError("Name must be a valid env var (e.g. MY_VAR, DB_PASSWORD)")
      return
    }
    setEnvVarError("")
    setEnvVarAdding(true)
    try {
      await createStudyEnvVar(name, newEnvValue)
      setNewEnvName("")
      setNewEnvValue("")
      await fetchEnvVars()
    } catch (e: unknown) {
      setEnvVarError(e instanceof Error ? e.message : "Failed to create variable")
    } finally {
      setEnvVarAdding(false)
    }
  }

  const handleStartEditEnvVar = async (id: number) => {
    try {
      const one = await getStudyEnvVar(id)
      setEditingEnvId(id)
      setEditingEnvValue(one.value ?? "")
    } catch {
      setEnvVarError("Failed to load variable")
    }
  }

  const handleSaveEditEnvVar = async () => {
    if (editingEnvId == null) return
    setEnvVarError("")
    try {
      await updateStudyEnvVar(editingEnvId, editingEnvValue)
      setEditingEnvId(null)
      setEditingEnvValue("")
      await fetchEnvVars()
    } catch (e: unknown) {
      setEnvVarError(e instanceof Error ? e.message : "Failed to update variable")
    }
  }

  const handleDeleteEnvVar = async (id: number) => {
    try {
      await deleteStudyEnvVar(id)
      setDeleteEnvId(null)
      await fetchEnvVars()
      if (editingEnvId === id) {
        setEditingEnvId(null)
        setEditingEnvValue("")
      }
    } catch {
      setEnvVarError("Failed to delete variable")
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
        <CardHeader>
          <CardTitle>Study Catalog Settings</CardTitle>
          <CardDescription>
            Configure where your studies come from. This is the source repository for installing
            and updating study packages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="catalog-address">Study catalog address</Label>
            <Input
              id="catalog-address"
              placeholder="e.g. registry.example.com/studies"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              e.g. Docker registry URL or other package repository address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="catalog-token">Catalog token</Label>
            <Input
              id="catalog-token"
              type="password"
              placeholder="Enter your registry access token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Authentication token or password for the Docker registry
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="catalog-username">Catalog username (required)</Label>
            <Input
              id="catalog-username"
              placeholder="e.g. registry name for ACR"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Username for Docker registry login
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCheckConnection}
              disabled={testStatus === "testing"}
              className="border-border bg-transparent"
            >
              {testStatus === "testing" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : testStatus === "success" ? (
                <Check className="w-4 h-4 mr-2 text-green-600" />
              ) : testStatus === "error" ? (
                <X className="w-4 h-4 mr-2 text-red-600" />
              ) : (
                <Plug className="w-4 h-4 mr-2" />
              )}
              Check connection
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved
              </span>
            )}
          </div>

          {testStatus !== "idle" && testStatus !== "testing" && (
            <div className="space-y-2">
              <div
                className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                  testStatus === "success"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                }`}
              >
                {testStatus === "success" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                )}
                {testMessage}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-[0_3px_13px_0_rgba(0,0,0,0.16)]">
        <CardHeader>
          <CardTitle>Study environment variables</CardTitle>
          <CardDescription>
            Variables injected into study Docker containers when they run. Use{" "}
            <code className="rounded bg-muted px-1 text-sm">{"Sys.getenv(\"VAR_NAME\")"}</code> in your codeToRun.R to read
            them. Values are stored encrypted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {envVarsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {envVars.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-secondary/20 px-3 py-2"
                  >
                    <span className="font-mono text-sm font-medium">{ev.name}</span>
                    {editingEnvId === ev.id ? (
                      <>
                        <Input
                          type="password"
                          placeholder="Value"
                          value={editingEnvValue}
                          onChange={(e) => setEditingEnvValue(e.target.value)}
                          className="max-w-xs font-mono"
                        />
                        <Button size="sm" onClick={handleSaveEditEnvVar}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingEnvId(null); setEditingEnvValue(""); }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground">••••••••</span>
                        <Button size="sm" variant="ghost" onClick={() => handleStartEditEnvVar(ev.id)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteEnvId(ev.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-end gap-2 border-t border-border pt-4">
                <div className="space-y-1">
                  <Label htmlFor="new-env-name" className="text-xs">Name</Label>
                  <Input
                    id="new-env-name"
                    placeholder="e.g. DB_PASSWORD"
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    className="font-mono w-40"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-env-value" className="text-xs">Value</Label>
                  <Input
                    id="new-env-value"
                    type="password"
                    placeholder="Value"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    className="font-mono w-48"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleAddEnvVar}
                  disabled={envVarAdding}
                >
                  {envVarAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add variable
                </Button>
              </div>
              {envVarError && (
                <p className="text-sm text-destructive">{envVarError}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteEnvId != null} onOpenChange={(open) => !open && setDeleteEnvId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete environment variable?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the variable from the list. Study containers started after this will not receive it.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteEnvId != null && handleDeleteEnvVar(deleteEnvId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CodeSnippetsSection
        snippets={snippets}
        onCreateSnippet={onCreateSnippet}
        onUpdateSnippet={onUpdateSnippet}
        onDeleteSnippet={onDeleteSnippet}
      />
    </div>
  )
}
