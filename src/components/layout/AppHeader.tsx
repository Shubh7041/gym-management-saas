import { Bell, ChevronDown, Menu } from "lucide-react";

import { useAppStore } from "@/stores/app.store";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export default function AppHeader({
  onMenuClick,
}: AppHeaderProps) {
  const currentTenant = useAppStore(
    (state) => state.currentTenant,
  );

  const branches = useAppStore(
    (state) => state.branches,
  );

  const selectedBranchId = useAppStore(
    (state) => state.selectedBranchId,
  );

  const selectedBranch = branches.find(
    (branch) => branch.id === selectedBranchId,
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {currentTenant?.name ?? "Gym Management"}
          </p>

          <div className="flex items-center gap-1.5">
            <p className="truncate text-xs text-slate-500">
              {selectedBranch?.name ?? "Admin Panel"}
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Branch indicator */}
        {selectedBranch && (
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 sm:flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="max-w-32 truncate">
              {selectedBranch.name}
            </span>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {/* Notifications */}
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
        </button>

        {/* User */}
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            S
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-32 truncate text-sm font-medium text-slate-900">
              Shubham
            </p>

            <p className="text-xs text-slate-500">
              Gym Owner
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}