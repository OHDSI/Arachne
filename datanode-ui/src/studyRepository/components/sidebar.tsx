
import { Library, Settings, User } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

interface SidebarProps {
  activeView: "repository" | "settings"
  onViewChange: (view: "repository" | "settings") => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[70px] flex-col items-center bg-card py-4 shadow-md">
        {/* Logo */}
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Library className="h-5 w-5" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onViewChange("repository")}
                className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                  activeView === "repository"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
                aria-label="Study Repository"
              >
                <Library className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Study Repository</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onViewChange("settings")}
                className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                  activeView === "settings"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </nav>

        {/* Bottom section */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                aria-label="User Profile"
              >
                <User className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-[10px] text-muted-foreground">Arachne</span>
        </div>
      </aside>
    </TooltipProvider>
  )
}
