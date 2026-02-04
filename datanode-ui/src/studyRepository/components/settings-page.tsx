
import { useState } from "react"
import { Save, CheckCircle2, Loader2, XCircle, Plug, Check, X } from "lucide-react"
import { checkStudyRepositoryConnection } from "../../api/study-repository"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface SettingsPageProps {
  catalogAddress: string
  catalogToken: string
  onSave: (address: string, token: string) => void
  /** Called when connection check succeeds and registry returns a list of repository names. */
  onConnectionSuccessWithRepos?: (repos: string[]) => void
}

export function SettingsPage({ catalogAddress, catalogToken, onSave, onConnectionSuccessWithRepos }: SettingsPageProps) {
  const [address, setAddress] = useState(catalogAddress)
  const [token, setToken] = useState(catalogToken)
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState("")

  const handleSave = () => {
    onSave(address, token)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCheckConnection = async () => {
    if (!address) {
      setTestStatus("error")
      setTestMessage("Please enter a catalog address first")
      return
    }

    setTestStatus("testing")
    setTestMessage("")

    try {
      const result = await checkStudyRepositoryConnection(address, token)
      if (result.success) {
        setTestStatus("success")
        setTestMessage(result.message || "Successfully connected to catalog")
        if (result.repositories && result.repositories.length > 0 && onConnectionSuccessWithRepos) {
          onConnectionSuccessWithRepos(result.repositories)
        }
      } else {
        setTestStatus("error")
        setTestMessage(result.message || "Failed to connect. Check address and token.")
      }
    } catch (err: unknown) {
      setTestStatus("error")
      const message = err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Failed to connect. Check address and token."
      setTestMessage(message)
    }

    // Reset after 5 seconds
    setTimeout(() => {
      setTestStatus("idle")
      setTestMessage("")
    }, 5000)
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
