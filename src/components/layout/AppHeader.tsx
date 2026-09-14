import { Bell, Menu } from "lucide-react";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted lg:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-sm font-medium">Gym Management</p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Admin Panel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="hidden items-center gap-2 border-l pl-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            S
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium">Shubham</p>
            <p className="text-xs text-muted-foreground">Gym Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}