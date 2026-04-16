
import { useSelector } from "react-redux"
import { ChevronRight, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"

interface HeaderProps {
  breadcrumbs: string[]
}

export function Header({ breadcrumbs }: HeaderProps) {
  const username = useSelector<any, string | undefined>((state: any) => state.user.data?.username);
  return (
    <header className="flex h-[50px] items-center justify-between bg-header px-6 text-header-foreground">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4 opacity-60" />}
            <span className={index === breadcrumbs.length - 1 ? "font-medium" : "opacity-80"}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-header-foreground hover:bg-header-foreground/10 hover:text-header-foreground"
          >
            <User className="h-4 w-4" />
            <span>{username || "User"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
