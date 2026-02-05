
import { useState } from "react"
import { Save, CheckCircle2, Loader2, XCircle, Plug, Check, X } from "lucide-react"
import { checkStudyRepositoryConnection } from "../../api/study-repository"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

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
}

export function SettingsPage({ catalogAddress, catalogUsername: initialUsername, catalogToken, onSave }: SettingsPageProps) {
  const [address, setAddress] = useState(catalogAddress)
  const [username, setUsername] = useState(initialUsername ?? "")
  const [token, setToken] = useState(catalogToken)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState("")

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
    </div>
  )
}
